"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { parseVideoList, parseVideoUrl, VIDEOS_KEY, type ParsedVideo } from "@/lib/videos";
import { useCms } from "./CmsProvider";
import { SectionHeading, fadeUp, stagger } from "./Sections";

type Item = { url: string; title?: string; video: ParsedVideo };

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
  const items: Item[] = parseVideoList(content[VIDEOS_KEY])
    .map((v) => ({ ...v, video: parseVideoUrl(v.url)! }));

  if (items.length === 0) return null;

  const wide = items.filter((i) => i.video.platform === "youtube" && !i.video.vertical);
  const tall = items.filter((i) => !(i.video.platform === "youtube" && !i.video.vertical));

  const card = (item: Item) => (
    <motion.figure key={item.url} variants={fadeUp} className="video-card">
      {item.video.platform === "youtube" ? <YouTubeCard item={item} /> : <InstagramCard item={item} />}
      <figcaption>
        <i className={item.video.platform === "youtube" ? "fab fa-youtube" : "fab fa-instagram"} />
        <span>{item.title || (item.video.platform === "youtube" ? "Watch on YouTube" : "View on Instagram")}</span>
        <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label="Open original">
          <i className="fas fa-external-link-alt" />
        </a>
      </figcaption>
    </motion.figure>
  );

  return (
    <section className={`section ${className}`}>
      <div className="container">
        <SectionHeading label="videos_section_label" title="videos_section_title" desc="videos_section_desc" />
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
