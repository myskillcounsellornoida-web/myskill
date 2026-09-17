"use client";

import { useState } from "react";
import {
  BACKGROUND_OPTIONS,
  CUSTOM_SECTIONS_KEY,
  LAYOUT_OPTIONS,
  MAX_CUSTOM_SECTIONS,
  MAX_ITEMS_PER_SECTION,
  emptySection,
  newId,
  parseCustomSections,
  sectionKey,
  type CustomItem,
  type CustomSection,
} from "@/lib/customSections";
import { layoutKey, resolveLayout, type PreviewPage } from "@/lib/siteContent";
import ImageUploadButton from "./ImageUploadButton";
import ColorField from "./ColorField";

interface Props {
  page: PreviewPage;
  draft: Record<string, string>;
  setValue: (key: string, value: string) => void;
  onReveal: (id: string) => void;
  notify: (text: string, type: "success" | "error" | "info") => void;
}

const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export default function SectionBuilder({ page, draft, setValue, onReveal, notify }: Props) {
  const all = parseCustomSections(draft[CUSTOM_SECTIONS_KEY]);
  const mine = all.filter((s) => s.page === page);
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const saveAll = (next: CustomSection[]) =>
    setValue(CUSTOM_SECTIONS_KEY, next.length ? JSON.stringify(next) : "");

  const update = (id: string, patch: Partial<CustomSection>) =>
    saveAll(all.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSection = () => {
    if (all.length >= MAX_CUSTOM_SECTIONS) {
      notify(`You can create up to ${MAX_CUSTOM_SECTIONS} sections.`, "error");
      return;
    }
    const section = emptySection(page);
    saveAll([...all, section]);
    // Put the new section at the end of this page's order so it is visible.
    const key = layoutKey(page);
    const ids = [...mine.map((s) => sectionKey(s.id)), sectionKey(section.id)];
    setValue(key, JSON.stringify(resolveLayout(draft[key], page, ids)));
    setOpenId(section.id);
    setPanelOpen(true);
    notify("Section created — add your content below.", "success");
  };

  const removeSection = (section: CustomSection) => {
    if (!confirm(`Delete the section “${section.label}” and its ${section.items.length} item(s)?`)) return;
    saveAll(all.filter((s) => s.id !== section.id));
    const key = layoutKey(page);
    const keep = mine.filter((s) => s.id !== section.id).map((s) => sectionKey(s.id));
    const layout = resolveLayout(draft[key], page, keep).filter((s) => s.id !== sectionKey(section.id));
    setValue(key, JSON.stringify(layout));
    notify("Section deleted.", "info");
  };

  const duplicate = (section: CustomSection) => {
    const copy: CustomSection = {
      ...section,
      id: newId(),
      label: `${section.label} (copy)`,
      items: section.items.map((i) => ({ ...i, id: newId() })),
    };
    saveAll([...all, copy]);
    const key = layoutKey(page);
    const ids = [...mine.map((s) => sectionKey(s.id)), sectionKey(copy.id)];
    setValue(key, JSON.stringify(resolveLayout(draft[key], page, ids)));
    setOpenId(copy.id);
  };

  const setItems = (section: CustomSection, items: CustomItem[]) => update(section.id, { items });

  const addItem = (section: CustomSection) => {
    if (section.items.length >= MAX_ITEMS_PER_SECTION) {
      notify(`A section can hold up to ${MAX_ITEMS_PER_SECTION} items.`, "error");
      return;
    }
    setItems(section, [...section.items, { id: newId(), title: "", text: "" }]);
  };

  return (
    <div className={`cms-group ${panelOpen ? "is-open" : ""}`}>
      <button className="cms-group-head" onClick={() => setPanelOpen((o) => !o)} aria-expanded={panelOpen}>
        <span><i className="fas fa-shapes cms-panel-icon" /> Your Sections</span>
        <span className="cms-group-meta">
          <span className="cms-count">{mine.length}</span>
          <i className="fas fa-chevron-down" />
        </span>
      </button>

      {panelOpen && (
        <div className="cms-group-body">
          <p className="cms-panel-hint">
            Build your own section, choose how it looks, then add as many items as you like.
            New sections appear in <strong>Page Sections</strong>, where you can drag them anywhere on the page.
          </p>
          <button type="button" className="cms-btn-primary cms-add-section" onClick={addSection}>
            <i className="fas fa-plus" /> New section on this page
          </button>

          {mine.length === 0 && <p className="cms-empty">No custom sections on this page yet.</p>}

          {mine.map((section) => {
            const open = openId === section.id;
            const idx = all.findIndex((s) => s.id === section.id);
            return (
              <div key={section.id} className={`cs-editor ${open ? "is-open" : ""}`}>
                <div className="cs-editor-head">
                  <button type="button" className="cs-editor-title" onClick={() => setOpenId(open ? null : section.id)}>
                    <i className={`fas fa-chevron-${open ? "down" : "right"}`} />
                    <span>{section.label}</span>
                    <small>{LAYOUT_OPTIONS.find((l) => l.value === section.layout)?.label} · {section.items.length} item{section.items.length === 1 ? "" : "s"}</small>
                  </button>
                  <button type="button" className="cms-icon-btn" title="Show in preview" onClick={() => onReveal(sectionKey(section.id))}><i className="fas fa-eye" /></button>
                  <button type="button" className="cms-icon-btn" title="Duplicate" onClick={() => duplicate(section)}><i className="fas fa-copy" /></button>
                  <button type="button" className="cms-icon-btn is-danger" title="Delete section" onClick={() => removeSection(section)}><i className="fas fa-trash" /></button>
                </div>

                {open && (
                  <div className="cs-editor-body">
                    <label className="cs-label">Small label (also its name in Page Sections)</label>
                    <input className="cs-input" placeholder="e.g. Why choose us" value={section.label ?? ""} maxLength={60} onChange={(e) => update(section.id, { label: e.target.value })} />

                    <label className="cs-label">Heading</label>
                    <input className="cs-input" placeholder="Section heading" value={section.title ?? ""} maxLength={200} onChange={(e) => update(section.id, { title: e.target.value })} />

                    <label className="cs-label">Description</label>
                    <textarea className="cs-input" rows={2} placeholder="One or two lines under the heading" value={section.description ?? ""} maxLength={600} onChange={(e) => update(section.id, { description: e.target.value })} />

                    <label className="cs-label">Layout</label>
                    <div className="cs-layout-picker">
                      {LAYOUT_OPTIONS.map((l) => (
                        <button
                          key={l.value}
                          type="button"
                          title={l.hint}
                          className={section.layout === l.value ? "is-active" : ""}
                          onClick={() => update(section.id, { layout: l.value })}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <p className="cs-hint">{LAYOUT_OPTIONS.find((l) => l.value === section.layout)?.hint}</p>

                    <div className="cs-options-row">
                      <div>
                        <label className="cs-label">Columns</label>
                        <div className="cs-seg">
                          {[2, 3, 4].map((c) => (
                            <button key={c} type="button" className={section.columns === c ? "is-active" : ""} onClick={() => update(section.id, { columns: c as 2 | 3 | 4 })}>{c}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="cs-label">Alignment</label>
                        <div className="cs-seg">
                          <button type="button" className={section.align === "center" ? "is-active" : ""} onClick={() => update(section.id, { align: "center" })}>Center</button>
                          <button type="button" className={section.align === "left" ? "is-active" : ""} onClick={() => update(section.id, { align: "left" })}>Left</button>
                        </div>
                      </div>
                    </div>

                    <label className="cs-label">Background</label>
                    <div className="cs-seg is-wrap">
                      {BACKGROUND_OPTIONS.map((b) => (
                        <button key={b.value} type="button" className={section.background === b.value ? "is-active" : ""} onClick={() => update(section.id, { background: b.value })}>{b.label}</button>
                      ))}
                    </div>

                    <div className="cs-colors">
                      <ColorField label="Heading colour" value={section.titleColor ?? ""} onChange={(v) => update(section.id, { titleColor: v || undefined })} />
                      <ColorField label="Text colour" value={section.textColor ?? ""} onChange={(v) => update(section.id, { textColor: v || undefined })} />
                      <ColorField label="Accent colour" value={section.accentColor ?? ""} onChange={(v) => update(section.id, { accentColor: v || undefined })} />
                    </div>

                    <div className="cs-items-head">
                      <span>Content items ({section.items.length})</span>
                      <button type="button" className="cms-btn-primary" onClick={() => addItem(section)}><i className="fas fa-plus" /> Add item</button>
                    </div>

                    {section.items.length === 0 && <p className="cms-empty">Nothing in this section yet.</p>}

                    {section.items.map((item, i) => (
                      <div key={item.id} className="cs-item">
                        <div className="cs-item-head">
                          <strong>{item.title || `Item ${i + 1}`}</strong>
                          <div className="cs-item-actions">
                            <button type="button" className="cms-icon-btn" aria-label="Move up" disabled={i === 0} onClick={() => setItems(section, move(section.items, i, i - 1))}><i className="fas fa-arrow-up" /></button>
                            <button type="button" className="cms-icon-btn" aria-label="Move down" disabled={i === section.items.length - 1} onClick={() => setItems(section, move(section.items, i, i + 1))}><i className="fas fa-arrow-down" /></button>
                            <button type="button" className="cms-icon-btn is-danger" aria-label="Remove item" onClick={() => setItems(section, section.items.filter((x) => x.id !== item.id))}><i className="fas fa-trash" /></button>
                          </div>
                        </div>
                        <input
                          className="cs-input"
                          placeholder={section.layout === "stats" ? "Number, e.g. 500+" : "Title"}
                          value={item.title ?? ""}
                          maxLength={160}
                          onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, title: e.target.value } : x)))}
                        />
                        <textarea
                          className="cs-input"
                          rows={2}
                          placeholder={section.layout === "stats" ? "Label under the number" : "Description"}
                          value={item.text ?? ""}
                          maxLength={1200}
                          onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, text: e.target.value } : x)))}
                        />
                        {(section.layout === "cards" || section.layout === "gallery" || section.layout === "list") && (
                          <div className="cs-item-image">
                            <div className="cms-image-thumb" style={item.image ? { backgroundImage: `url("${item.image.replace(/["\\\n\r]/g, "")}")` } : undefined} />
                            <div className="cms-image-controls">
                              <input
                                className="cs-input"
                                placeholder="Image URL or /images/…"
                                value={item.image ?? ""}
                                onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, image: e.target.value } : x)))}
                              />
                              <ImageUploadButton
                                onUploadSuccess={(url) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, image: url } : x)))}
                                onError={(msg) => notify(msg, "error")}
                              />
                            </div>
                          </div>
                        )}
                        {(section.layout === "features" || section.layout === "cards" || section.layout === "list") && (
                          <input
                            className="cs-input"
                            placeholder="Icon class, e.g. fas fa-graduation-cap"
                            value={item.icon ?? ""}
                            onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, icon: e.target.value } : x)))}
                          />
                        )}
                        {section.layout !== "stats" && section.layout !== "gallery" && (
                          <div className="cs-item-link">
                            <input
                              className="cs-input"
                              placeholder="Link (optional) — /contact or https://…"
                              value={item.link ?? ""}
                              onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, link: e.target.value } : x)))}
                            />
                            <input
                              className="cs-input"
                              placeholder="Button text"
                              value={item.linkLabel ?? ""}
                              maxLength={60}
                              onChange={(e) => setItems(section, section.items.map((x) => (x.id === item.id ? { ...x, linkLabel: e.target.value } : x)))}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <button type="button" className="cms-link-btn" onClick={() => { update(section.id, { items: [...section.items] }); setOpenId(null); }}>
                      <i className="fas fa-check" /> Done editing this section
                    </button>
                    <p className="cs-hint">Section {idx + 1} of {all.length} across the whole site.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
