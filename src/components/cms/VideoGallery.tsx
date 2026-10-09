"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DEFAULT_VIDEOS, parseVideoList, parseVideoUrl, VIDEOS_KEY, type ParsedVideo } from "@/lib/videos";
import { VIDEO_CATEGORIES_KEY, orderedCategories, parseCategories } from "@/lib/categories";
import { useCms } from "./CmsProvider";
import CategoryTabs from "./CategoryTabs";
import { SectionHeading, fadeUp, stagger } from "./Sections";

type Item = { url: string; title?: string; category?: string; video: ParsedVideo };

const PLATFORM_ICON: Record<ParsedVideo["platform"], string> = {
  youtube: "fab fa-youtube",
  instagram: "fab fa-instagram",
  file: "fas fa-circle-play",
};

const PLATFORM_FALLBACK: Record<ParsedVideo["platform"], string> = {
  youtube: "Watch on YouTube",
  instagram: "View on Instagram",
  file: "Student review",
};

function YouTubeCard({ item }: { item: Item }) {
  const [playing, setPlaying] = useState(false);
  const title = item.title || "YouTube video";
  return (
    <div className={`video-frame ${item.video.vertical ? "is-vertical" : ""}`}>
      {playing ? (
        <iframe
          src={item.video.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-poster" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail */}
          <img src={item.video.thumbnail} alt="" loading="lazy" />
          <span className="video-play"><i className="fas fa-play" /></span>
        </button>
      )}
    </div>
  );
}

/** Self-hosted clip. The real aspect ratio is only known once metadata
 *  arrives, so the card starts vertical and corrects itself — that way a
 *  landscape review can't letterbox and a portrait one can't tower. */
function FileCard({ item }: { item: Item }) {
  const [ratio, setRatio] = useState<string | null>(null);
  return (
    <div className="video-frame is-file" style={ratio ? { aspectRatio: ratio } : undefined}>
      <video
        src={item.video.embedUrl}
        poster={item.video.thumbnail}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (v.videoWidth && v.videoHeight) setRatio(`${v.videoWidth} / ${v.videoHeight}`);
        }}
      />
    </div>
  );
}

function InstagramCard({ item }: { item: Item }) {
  return (
    <div className="video-frame is-instagram">
      <iframe src={item.video.embedUrl} title={item.title || "Instagram post"} loading="lazy" scrolling="no" allowFullScreen />
    </div>
  );
}

/** Instagram / YouTube links pasted by the admin, rendered as embeds. */
export default function VideoGallery({ className = "" }: { className?: string }) {
  const { content } = useCms();
  const all: Item[] = parseVideoList(content[VIDEOS_KEY] || DEFAULT_VIDEOS)
    .map((v) => ({ ...v, video: parseVideoUrl(v.url)! }));
  const categories = orderedCategories(parseCategories(content[VIDEO_CATEGORIES_KEY]), all.map((v) => v.category));
  const [active, setActive] = useState<string | null>(null);

  if (all.length === 0) return null;

  const items = active ? all.filter((v) => v.category === active) : all;
  const isWide = (i: Item) => i.video.platform === "youtube" && !i.video.vertical;
  const wide = items.filter(isWide);
  const tall = items.filter((i) => !isWide(i));

  const card = (item: Item) => (
    <motion.figure key={item.url} variants={fadeUp} className="video-card">
      {item.video.platform === "youtube" ? <YouTubeCard item={item} />
        : item.video.platform === "file" ? <FileCard item={item} />
        : <InstagramCard item={item} />}
      <figcaption>
        <i className={PLATFORM_ICON[item.video.platform]} />
        <span>{item.title || PLATFORM_FALLBACK[item.video.platform]}</span>
        {item.video.platform !== "file" && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open original">
            <i className="fas fa-external-link-alt" />
          </a>
        )}
      </figcaption>
    </motion.figure>
  );

  return (
    <section className={`section ${className}`}>
      <div className="container">
        <SectionHeading label="videos_section_label" title="videos_section_title" desc="videos_section_desc" />
        <CategoryTabs categories={categories} active={active} onChange={setActive} counts={all.map((v) => v.category)} />
        {wide.length > 0 && (
          <motion.div className="video-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {wide.map(card)}
          </motion.div>
        )}
        {tall.length > 0 && (
          <motion.div className="video-grid is-tall" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {tall.map(card)}
          </motion.div>
        )}
      </div>
    </section>
  );
}
