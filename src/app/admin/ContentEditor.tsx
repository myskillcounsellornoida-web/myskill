"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CONTENT_GROUPS,
  DEFAULT_CONTENT,
  PREVIEW_PAGES,
  THEME_FIELDS,
  colorKey,
  type ContentField,
  type PreviewPage,
} from "@/lib/siteContent";
import { CMS_MSG, isValidColor } from "@/components/cms/CmsProvider";
import { updateSiteContentBatch } from "./actions";
import ImageUploadButton from "./ImageUploadButton";

type Device = "desktop" | "tablet" | "mobile";
// Preview renders at the real device width and is scaled down to fit the pane.
const DEVICE_WIDTH: Record<Device, number> = { desktop: 1366, tablet: 820, mobile: 390 };
const EXTRA_SWATCHES = ["#FFFFFF", "#1C1C1C", "#F0C987", "#2563EB", "#16A34A"];

interface Props {
  initialContent: Record<string, string>;
  notify: (text: string, type: "success" | "error" | "info") => void;
}

export default function ContentEditor({ initialContent, notify }: Props) {
  const [saved, setSaved] = useState<Record<string, string>>(initialContent);
  const [draft, setDraft] = useState<Record<string, string>>(initialContent);
  const [page, setPage] = useState<PreviewPage>("/");
  const [device, setDevice] = useState<Device>("desktop");
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(["hero"]));
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setStage({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const dirtyKeys = useMemo(() => {
    const keys = new Set([...Object.keys(saved), ...Object.keys(draft)]);
    return [...keys].filter((k) => (saved[k] ?? "") !== (draft[k] ?? ""));
  }, [saved, draft]);
  const isDirty = dirtyKeys.length > 0;

  // ── Preview messaging ────────────────────────────────────────────────
  const postToPreview = useCallback((message: object) => {
    const win = iframeRef.current?.contentWindow;
    if (win) win.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    postToPreview({ type: CMS_MSG.update, content: draft });
  }, [draft, postToPreview]);

  const revealField = useCallback((key: string) => {
    const group = CONTENT_GROUPS.find((g) => g.fields.some((f) => f.key === key));
    if (!group) return;
    setQuery("");
    setOpenGroups((prev) => new Set(prev).add(group.id));
    setActiveKey(key);
    requestAnimationFrame(() => {
      const el = document.getElementById(`cms-field-${key}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === CMS_MSG.ready) {
        setPreviewLoading(false);
        postToPreview({ type: CMS_MSG.update, content: draftRef.current });
      } else if (event.data?.type === CMS_MSG.select && typeof event.data.key === "string") {
        revealField(event.data.key);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postToPreview, revealField]);

  // ── Editing ──────────────────────────────────────────────────────────
  const setValue = useCallback((key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const focusField = (key: string) => {
    setActiveKey(key);
    postToPreview({ type: CMS_MSG.focus, key });
  };

  const discard = () => {
    if (!confirm(`Discard ${dirtyKeys.length} unpublished change(s)?`)) return;
    setDraft(saved);
  };

  const publish = useCallback(async () => {
    if (!isDirty || publishing) return;
    setPublishing(true);
    const changes = Object.fromEntries(dirtyKeys.map((k) => [k, draft[k] ?? ""]));
    const res = await updateSiteContentBatch(changes);
    setPublishing(false);
    if (res.success) {
      const next = { ...draft };
      for (const k of dirtyKeys) if (!next[k]) delete next[k];
      setSaved(next);
      setDraft(next);
      notify(`Published ${res.data} change${res.data === 1 ? "" : "s"} to the live website.`, "success");
    } else {
      notify(`Publish failed: ${res.error}`, "error");
    }
  }, [dirtyKeys, draft, isDirty, notify, publishing]);

  // Ctrl/Cmd+S publishes; warn before leaving with unpublished edits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        publish();
      }
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty, publish]);

  const changePage = (next: PreviewPage) => {
    if (next === page) return;
    setPreviewLoading(true);
    setPage(next);
  };

  // ── Derived lists ────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const visibleGroups = q
    ? CONTENT_GROUPS.map((g) => ({
        ...g,
        fields: g.fields.filter((f) =>
          // Image paths are noise for search, so only their labels are matched.
          [f.label, f.key, f.kind === "image" ? "" : draft[f.key] ?? f.default].some((s) => s.toLowerCase().includes(q))
        ),
      })).filter((g) => g.fields.length > 0)
    : CONTENT_GROUPS.filter((g) => g.page === page);

  const frameWidth = DEVICE_WIDTH[device];
  const scale = stage.width ? Math.min(1, (stage.width - 24) / frameWidth) : 1;

  const palette = [
    ...THEME_FIELDS.map((f) => (isValidColor(draft[f.key]) ? draft[f.key] : f.default)),
    ...EXTRA_SWATCHES,
  ];

  const groupDirtyCount = (fields: ContentField[]) =>
    fields.filter((f) => dirtyKeys.includes(f.key) || dirtyKeys.includes(colorKey(f.key))).length;

  return (
    <div className="cms-editor">
      {/* TOOLBAR */}
      <div className="cms-toolbar">
        <div className="cms-page-tabs" role="tablist" aria-label="Preview page">
          {PREVIEW_PAGES.map((p) => (
            <button key={p.path} role="tab" aria-selected={page === p.path} className={page === p.path ? "is-active" : ""} onClick={() => changePage(p.path)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="cms-toolbar-right">
          <div className="cms-device-toggle" aria-label="Preview size">
            {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
              <button key={d} title={d} aria-pressed={device === d} className={device === d ? "is-active" : ""} onClick={() => setDevice(d)}>
                <i className={`fas ${d === "desktop" ? "fa-desktop" : d === "tablet" ? "fa-tablet-alt" : "fa-mobile-alt"}`} />
              </button>
            ))}
          </div>
          <span className={`cms-status ${isDirty ? "is-dirty" : ""}`}>
            {isDirty ? `${dirtyKeys.length} unpublished change${dirtyKeys.length === 1 ? "" : "s"}` : "All changes published"}
          </span>
          <button className="cms-btn-ghost" onClick={discard} disabled={!isDirty || publishing}>Discard</button>
          <button className="cms-btn-primary" onClick={publish} disabled={!isDirty || publishing} title="Ctrl/⌘ + S">
            {publishing ? <><i className="fas fa-spinner fa-spin" /> Publishing…</> : <><i className="fas fa-cloud-upload-alt" /> Publish</>}
          </button>
        </div>
      </div>

      <div className="cms-body">
        {/* FIELDS PANE */}
        <aside className="cms-fields">
          <div className="cms-search">
            <i className="fas fa-search" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all text on the website…" />
            {query && <button aria-label="Clear search" onClick={() => setQuery("")}><i className="fas fa-times" /></button>}
          </div>
          <p className="cms-hint">
            <i className="fas fa-mouse-pointer" /> Tip: click any text in the preview to jump to its field. Changes appear instantly and go live when you press <strong>Publish</strong>.
          </p>

          {/* THEME COLOURS */}
          <div className={`cms-group ${themeOpen ? "is-open" : ""}`}>
            <button className="cms-group-head" onClick={() => setThemeOpen((o) => !o)} aria-expanded={themeOpen}>
              <span><i className="fas fa-palette" /> Brand Colours (whole site)</span>
              <i className="fas fa-chevron-down" />
            </button>
            {themeOpen && (
              <div className="cms-group-body">
                {THEME_FIELDS.map((f) => {
                  const value = isValidColor(draft[f.key]) ? draft[f.key] : f.default;
                  return (
                    <div key={f.key} className={`cms-theme-row ${dirtyKeys.includes(f.key) ? "is-dirty" : ""}`}>
                      <label className="cms-swatch-input" style={{ background: value }}>
                        <input type="color" value={value.length === 7 ? value : "#000000"} onChange={(e) => setValue(f.key, e.target.value.toUpperCase())} aria-label={f.label} />
                      </label>
                      <div className="cms-theme-label">
                        <span>{f.label}</span>
                        <code>{value}</code>
                      </div>
                      {draft[f.key] && (
                        <button className="cms-icon-btn" title="Reset to default" onClick={() => setValue(f.key, "")}>
                          <i className="fas fa-undo" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {visibleGroups.length === 0 && <p className="cms-empty">No fields match “{query}”.</p>}

          {visibleGroups.map((group) => {
            const open = q ? true : openGroups.has(group.id);
            const dirtyCount = groupDirtyCount(group.fields);
            return (
              <div key={group.id} className={`cms-group ${open ? "is-open" : ""}`}>
                <button
                  className="cms-group-head"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenGroups((prev) => {
                      const next = new Set(prev);
                      if (next.has(group.id)) next.delete(group.id);
                      else next.add(group.id);
                      return next;
                    })
                  }
                >
                  <span>
                    {group.title}
                    {q && <small className="cms-group-page">{PREVIEW_PAGES.find((p) => p.path === group.page)?.label}</small>}
                  </span>
                  <span className="cms-group-meta">
                    {dirtyCount > 0 && <span className="cms-dot" title={`${dirtyCount} unpublished`}>{dirtyCount}</span>}
                    <i className="fas fa-chevron-down" />
                  </span>
                </button>
                {open && (
                  <div className="cms-group-body">
                    {group.fields.map((field) => (
                      <FieldEditor
                        key={field.key}
                        field={field}
                        value={draft[field.key]}
                        colorValue={draft[colorKey(field.key)] ?? ""}
                        palette={palette}
                        active={activeKey === field.key}
                        dirty={dirtyKeys.includes(field.key) || dirtyKeys.includes(colorKey(field.key))}
                        onChange={setValue}
                        onFocus={() => {
                          if (q && group.page !== page) changePage(group.page);
                          focusField(field.key);
                        }}
                        onUploadError={(msg) => notify(msg, "error")}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* PREVIEW PANE */}
        <div className="cms-preview">
          <div className="cms-preview-bar">
            <span className="cms-preview-dots"><i /><i /><i /></span>
            <span className="cms-preview-url">myskillcounsellor.com{page === "/" ? "" : page}</span>
            <a href={page} target="_blank" rel="noopener noreferrer" title="Open published page in a new tab">
              <i className="fas fa-external-link-alt" />
            </a>
          </div>
          <div className="cms-preview-stage" ref={stageRef}>
            <div className="cms-preview-slot" style={{ width: frameWidth * scale, height: stage.height }}>
              <div
                className="cms-preview-frame"
                style={{ width: frameWidth, height: stage.height / scale, transform: `scale(${scale})` }}
              >
                {previewLoading && <div className="cms-preview-loading"><i className="fas fa-spinner fa-spin" /> Loading preview…</div>}
                <iframe ref={iframeRef} key={page} src={page} title="Live website preview" onLoad={() => setPreviewLoading(false)} />
              </div>
            </div>
            <span className="cms-preview-scale">{frameWidth}px · {Math.round(scale * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  colorValue,
  palette,
  active,
  dirty,
  onChange,
  onFocus,
  onUploadError,
}: {
  field: ContentField;
  value: string | undefined;
  colorValue: string;
  palette: string[];
  active: boolean;
  dirty: boolean;
  onChange: (key: string, value: string) => void;
  onFocus: () => void;
  onUploadError: (msg: string) => void;
}) {
  const kind = field.kind ?? "text";
  // An emptied field (value === "") falls back to the default on the site.
  const shown = value ?? field.default;
  const effective = value || field.default;
  const isCustom = value !== undefined && value !== DEFAULT_CONTENT[field.key];
  const ck = colorKey(field.key);
  const [pickerOpen, setPickerOpen] = useState(false);

  const inputProps = {
    value: shown,
    onFocus,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field.key, e.target.value),
    placeholder: field.default,
    "aria-label": field.label,
  };

  return (
    <div id={`cms-field-${field.key}`} className={`cms-field ${active ? "is-active" : ""} ${dirty ? "is-dirty" : ""}`}>
      <div className="cms-field-head">
        <label>{field.label}</label>
        <div className="cms-field-actions">
          {kind === "text" && (
            <button
              type="button"
              className={`cms-color-chip ${colorValue ? "has-color" : ""}`}
              style={colorValue ? { background: colorValue } : undefined}
              title={colorValue ? `Text colour ${colorValue}` : "Set text colour"}
              onClick={() => { setPickerOpen((o) => !o); onFocus(); }}
              aria-expanded={pickerOpen}
            >
              {!colorValue && <i className="fas fa-font" />}
            </button>
          )}
          {isCustom && (
            <button type="button" className="cms-icon-btn" title="Reset to default text" onClick={() => onChange(field.key, "")}>
              <i className="fas fa-undo" />
            </button>
          )}
        </div>
      </div>

      {kind === "text" && pickerOpen && (
        <div className="cms-color-picker">
          <button type="button" className={`cms-swatch is-auto ${!colorValue ? "is-selected" : ""}`} onClick={() => onChange(ck, "")} title="Default colour">
            Auto
          </button>
          {palette.map((c, i) => (
            <button
              key={`${c}-${i}`}
              type="button"
              className={`cms-swatch ${colorValue.toUpperCase() === c.toUpperCase() ? "is-selected" : ""}`}
              style={{ background: c }}
              title={c}
              aria-label={`Use colour ${c}`}
              onClick={() => onChange(ck, c.toUpperCase())}
            />
          ))}
          <label className="cms-swatch is-custom" title="Custom colour">
            <i className="fas fa-eye-dropper" />
            <input type="color" value={colorValue.length === 7 ? colorValue : "#1C2B2D"} onChange={(e) => onChange(ck, e.target.value.toUpperCase())} />
          </label>
        </div>
      )}

      {kind === "image" ? (
        <div className="cms-image-field">
          <div className="cms-image-thumb" style={{ backgroundImage: `url("${effective.replace(/["\\\n\r]/g, "")}")` }} />
          <div className="cms-image-controls">
            <input type="text" {...inputProps} />
            <ImageUploadButton onUploadSuccess={(url) => { onChange(field.key, url); onFocus(); }} onError={onUploadError} />
          </div>
        </div>
      ) : field.multiline ? (
        <textarea rows={Math.min(8, Math.max(3, Math.ceil(effective.length / 55)))} {...inputProps} />
      ) : (
        <input type={kind === "url" ? "url" : "text"} {...inputProps} />
      )}
    </div>
  );
}
