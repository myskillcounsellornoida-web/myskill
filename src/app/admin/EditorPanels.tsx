"use client";

import { useState } from "react";
import { PAGE_SECTIONS, layoutKey, resolveLayout, type PreviewPage, type SectionState } from "@/lib/siteContent";
import { MAX_VIDEOS, VIDEOS_KEY, parseVideoList, parseVideoUrl, type VideoEntry } from "@/lib/videos";
import { MAX_CATEGORIES, VIDEO_CATEGORIES_KEY, parseCategories } from "@/lib/categories";

interface PanelProps {
  draft: Record<string, string>;
  setValue: (key: string, value: string) => void;
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function PanelShell({ icon, title, badge, children, defaultOpen = false }: {
  icon: string;
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`cms-group ${open ? "is-open" : ""}`}>
      <button className="cms-group-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span><i className={`fas ${icon} cms-panel-icon`} /> {title}</span>
        <span className="cms-group-meta">
          {badge && <span className="cms-count">{badge}</span>}
          <i className="fas fa-chevron-down" />
        </span>
      </button>
      {open && <div className="cms-group-body">{children}</div>}
    </div>
  );
}

/* ---------------- Page sections: reorder + show/hide ---------------- */
export function LayoutPanel({ page, draft, setValue, onReveal, extra = [] }: PanelProps & {
  page: PreviewPage;
  onReveal: (id: string) => void;
  /** Sections created by the admin, so they can be ordered alongside the built-in ones. */
  extra?: { id: string; label: string }[];
}) {
  const key = layoutKey(page);
  const layout = resolveLayout(draft[key], page, extra.map((e) => e.id));
  const labels: Record<string, string> = {
    ...Object.fromEntries(PAGE_SECTIONS[page].map((d) => [d.id, d.label])),
    ...Object.fromEntries(extra.map((e) => [e.id, e.label])),
  };
  const isCustom = (id: string) => extra.some((e) => e.id === id);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const save = (next: SectionState[]) => setValue(key, JSON.stringify(next));
  const hiddenCount = layout.filter((s) => s.hidden).length;

  return (
    <PanelShell icon="fa-layer-group" title="Page Sections (order & visibility)" badge={hiddenCount ? `${hiddenCount} hidden` : undefined} defaultOpen>
      <p className="cms-panel-hint">Drag <i className="fas fa-grip-vertical" /> to reorder. The top banner always stays first.</p>
      <ol className="cms-layout-list">
        {layout.map((s, i) => (
          <li
            key={s.id}
            draggable
            onDragStart={(e) => { setDragIndex(i); e.dataTransfer.effectAllowed = "move"; }}
            onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
            onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null) save(move(layout, dragIndex, i));
              setDragIndex(null);
              setOverIndex(null);
            }}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
            className={`${s.hidden ? "is-hidden" : ""} ${dragIndex === i ? "is-dragging" : ""} ${overIndex === i && dragIndex !== i ? "is-over" : ""}`}
          >
            <span className="cms-drag" aria-hidden="true"><i className="fas fa-grip-vertical" /></span>
            <button type="button" className="cms-layout-name" onClick={() => onReveal(s.id)} title="Show in preview">
              {labels[s.id]}
              {isCustom(s.id) && <span className="cms-tag-yours">yours</span>}
            </button>
            <button type="button" className="cms-icon-btn" aria-label="Move up" disabled={i === 0} onClick={() => save(move(layout, i, i - 1))}>
              <i className="fas fa-arrow-up" />
            </button>
            <button type="button" className="cms-icon-btn" aria-label="Move down" disabled={i === layout.length - 1} onClick={() => save(move(layout, i, i + 1))}>
              <i className="fas fa-arrow-down" />
            </button>
            <button
              type="button"
              className={`cms-icon-btn ${s.hidden ? "is-off" : ""}`}
              aria-label={s.hidden ? "Show section" : "Hide section"}
              title={s.hidden ? "Hidden — click to show" : "Visible — click to hide"}
              onClick={() => save(layout.map((x) => (x.id === s.id ? { ...x, hidden: !x.hidden } : x)))}
            >
              <i className={`fas ${s.hidden ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </li>
        ))}
      </ol>
      {draft[key] && (
        <button type="button" className="cms-link-btn" onClick={() => setValue(key, "")}>
          <i className="fas fa-undo" /> Reset to default order
        </button>
      )}
    </PanelShell>
  );
}

/* ---------------- Videos: admin only pastes links ---------------- */
export function VideosPanel({ draft, setValue, page }: PanelProps & { page: PreviewPage }) {
  const videos = parseVideoList(draft[VIDEOS_KEY]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const save = (next: VideoEntry[]) => setValue(VIDEOS_KEY, next.length ? JSON.stringify(next) : "");

  // Category order is stored separately so renaming or reordering never touches the videos.
  const categories = parseCategories(draft[VIDEO_CATEGORIES_KEY]);
  const usedCategories = [...new Set(videos.map((v) => v.category).filter(Boolean) as string[])];
  const allCategories = [...categories, ...usedCategories.filter((c) => !categories.includes(c))];
  const saveCategories = (next: string[]) => setValue(VIDEO_CATEGORIES_KEY, next.length ? JSON.stringify(next) : "");
  const rememberCategory = (name: string) => {
    const clean = name.trim();
    if (clean && !allCategories.includes(clean) && allCategories.length < MAX_CATEGORIES) {
      saveCategories([...allCategories, clean]);
    }
  };
  const setVideoCategory = (index: number, name: string) => {
    rememberCategory(name);
    save(videos.map((v, j) => (j === index ? { ...v, category: name.trim() || undefined } : v)));
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      setError("That doesn't look like a YouTube or Instagram video/post link.");
      return;
    }
    if (videos.some((v) => parseVideoUrl(v.url)?.id === parsed.id)) {
      setError("This video is already in the list.");
      return;
    }
    if (videos.length >= MAX_VIDEOS) {
      setError(`You can add up to ${MAX_VIDEOS} videos.`);
      return;
    }
    rememberCategory(category);
    save([...videos, { url: url.trim(), title: title.trim(), category: category.trim() || undefined }]);
    setUrl("");
    setTitle("");
    setError(null);
  };

  const shownOn = page === "/" ? "the Home page" : page === "/blog" ? "the Blog page" : "the Testimonials page";
  const layout = resolveLayout(draft[layoutKey(page)], page);
  const hiddenHere = layout.find((x) => x.id === "videos")?.hidden;
  const showHere = () =>
    setValue(layoutKey(page), JSON.stringify(layout.map((x) => (x.id === "videos" ? { ...x, hidden: false } : x))));

  return (
    <PanelShell icon="fa-play-circle" title="Videos (YouTube & Instagram)" badge={String(videos.length)} defaultOpen={page !== "/"}>
      <p className="cms-panel-hint">
        Paste a link — the video player is created automatically. The same list appears on every page where the
        <strong> Videos</strong> section is visible (currently editing {shownOn}).
      </p>
      {hiddenHere && (
        <div className="cms-video-warning">
          <i className="fas fa-eye-slash" /> The Videos section is hidden on this page.
          <button type="button" className="cms-link-btn" onClick={showHere}>Show it</button>
        </div>
      )}
      <form className="cms-video-add" onSubmit={add}>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(null); }}
          placeholder="https://www.youtube.com/watch?v=…  or  https://www.instagram.com/reel/…"
          aria-label="Video link"
          required
        />
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" aria-label="Video title" maxLength={160} />
        <input
          type="text"
          list="video-category-options"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional) — type a new one to create it"
          aria-label="Video category"
          maxLength={40}
        />
        <datalist id="video-category-options">
          {allCategories.map((c) => <option key={c} value={c} />)}
        </datalist>
        <button type="submit" className="cms-btn-primary"><i className="fas fa-plus" /> Add video</button>
        {url && !error && (
          <span className={`cms-video-detect ${parseVideoUrl(url) ? "is-ok" : ""}`}>
            {parseVideoUrl(url)
              ? <><i className={`fab ${parseVideoUrl(url)!.platform === "youtube" ? "fa-youtube" : "fa-instagram"}`} /> {parseVideoUrl(url)!.platform === "youtube" ? "YouTube" : "Instagram"} link detected</>
              : "Waiting for a YouTube or Instagram link…"}
          </span>
        )}
        {error && <span className="cms-video-error">{error}</span>}
      </form>

      {allCategories.length > 0 && (
        <div className="cms-cat-order">
          <span className="cms-cat-order-title">Category order (tabs on the website)</span>
          <ul>
            {allCategories.map((c, i) => (
              <li key={c}>
                <span>{c}</span>
                <small>{videos.filter((v) => v.category === c).length}</small>
                <button type="button" className="cms-icon-btn" aria-label={`Move ${c} up`} disabled={i === 0} onClick={() => saveCategories(move(allCategories, i, i - 1))}><i className="fas fa-arrow-up" /></button>
                <button type="button" className="cms-icon-btn" aria-label={`Move ${c} down`} disabled={i === allCategories.length - 1} onClick={() => saveCategories(move(allCategories, i, i + 1))}><i className="fas fa-arrow-down" /></button>
                <button
                  type="button"
                  className="cms-icon-btn is-danger"
                  aria-label={`Delete ${c}`}
                  title="Delete category (videos are kept)"
                  onClick={() => {
                    saveCategories(allCategories.filter((x) => x !== c));
                    save(videos.map((v) => (v.category === c ? { ...v, category: undefined } : v)));
                  }}
                ><i className="fas fa-trash" /></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {videos.length === 0 ? (
        <p className="cms-empty">No videos yet. The Videos section stays hidden on the site until you add one.</p>
      ) : (
        <ul className="cms-video-list">
          {videos.map((v, i) => {
            const parsed = parseVideoUrl(v.url)!;
            return (
              <li key={v.url}>
                <div className={`cms-video-thumb is-${parsed.platform}`} style={parsed.thumbnail ? { backgroundImage: `url("${parsed.thumbnail}")` } : undefined}>
                  <i className={`fab ${parsed.platform === "youtube" ? "fa-youtube" : "fa-instagram"}`} />
                </div>
                <div className="cms-video-meta">
                  <input
                    type="text"
                    value={v.title ?? ""}
                    placeholder="Add a title…"
                    maxLength={160}
                    aria-label="Video title"
                    onChange={(e) => save(videos.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  />
                  <input
                    type="text"
                    list="video-category-options"
                    className="cms-video-cat"
                    value={v.category ?? ""}
                    placeholder="No category"
                    maxLength={40}
                    aria-label="Video category"
                    onChange={(e) => setVideoCategory(i, e.target.value)}
                  />
                  <a href={v.url} target="_blank" rel="noopener noreferrer">{v.url}</a>
                </div>
                <div className="cms-video-actions">
                  <button type="button" className="cms-icon-btn" aria-label="Move up" disabled={i === 0} onClick={() => save(move(videos, i, i - 1))}><i className="fas fa-arrow-up" /></button>
                  <button type="button" className="cms-icon-btn" aria-label="Move down" disabled={i === videos.length - 1} onClick={() => save(move(videos, i, i + 1))}><i className="fas fa-arrow-down" /></button>
                  <button type="button" className="cms-icon-btn is-danger" aria-label="Remove video" onClick={() => save(videos.filter((_, j) => j !== i))}><i className="fas fa-trash" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PanelShell>
  );
}
