"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SUCCESS_STORY_VIDEOS, parseVideoList, parseVideoUrl, VIDEOS_KEY, type ParsedVideo } from "@/lib/videos";
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

/** Self-hosted clip. Always a fixed 9:16 box with the picture cropped to
 *  fill it, so every success-story card is identical regardless of the
 *  source video's own dimensions (square, landscape or portrait phone). */
function FileCard({ item }: { item: Item }) {
  return (
    <div className="video-frame is-file">
      <video src={item.video.embedUrl} poster={item.video.thumbnail} controls playsInline preload="metadata" />
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

function VideoCard({ item }: { item: Item }) {
  return (
    <motion.figure variants={fadeUp} className="video-card">
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
}

/**
 * Two independent blocks, always in this order:
 * 1. Success Stories — the fixed self-hosted testimonial clips, uniform size.
 * 2. Videos & Reels — YouTube/Instagram links the admin pastes into the
 *    Videos panel, with their own category tabs.
 */
export default function VideoGallery({ className = "" }: { className?: string }) {
  const { content } = useCms();

  const successStories: Item[] = SUCCESS_STORY_VIDEOS
    .map((v) => ({ ...v, video: parseVideoUrl(v.url) }))
    .filter((v): v is Item => !!v.video);

  const adminVideos: Item[] = parseVideoList(content[VIDEOS_KEY])
    .map((v) => ({ ...v, video: parseVideoUrl(v.url) }))
    .filter((v): v is Item => !!v.video && v.video.platform !== "file");

  const categories = orderedCategories(parseCategories(content[VIDEO_CATEGORIES_KEY]), adminVideos.map((v) => v.category));
  const [active, setActive] = useState<string | null>(null);

  if (successStories.length === 0 && adminVideos.length === 0) return null;

  const shownAdminVideos = active ? adminVideos.filter((v) => v.category === active) : adminVideos;
  const isWide = (i: Item) => i.video.platform === "youtube" && !i.video.vertical;
  const wide = shownAdminVideos.filter(isWide);
  const tall = shownAdminVideos.filter((i) => !isWide(i));

  return (
    <section className={`section ${className}`}>
      <div className="container">
        {successStories.length > 0 && (
          <div className={adminVideos.length > 0 ? "video-block" : undefined}>
            <SectionHeading label="video_stories_label" title="video_stories_title" desc="video_stories_desc" />
            <motion.div className="video-grid is-stories" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              {successStories.map((item) => <VideoCard key={item.url} item={item} />)}
            </motion.div>
          </div>
        )}

        {adminVideos.length > 0 && (
          <div className={successStories.length > 0 ? "video-block" : undefined}>
            <SectionHeading label="videos_section_label" title="videos_section_title" desc="videos_section_desc" />
            <CategoryTabs categories={categories} active={active} onChange={setActive} counts={adminVideos.map((v) => v.category)} />
            {wide.length > 0 && (
              <motion.div className="video-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                {wide.map((item) => <VideoCard key={item.url} item={item} />)}
              </motion.div>
            )}
            {tall.length > 0 && (
              <motion.div className="video-grid is-tall" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                {tall.map((item) => <VideoCard key={item.url} item={item} />)}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
