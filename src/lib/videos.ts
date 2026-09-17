// Admin-managed video list: the admin only pastes an Instagram or YouTube link.
// Embeds are always rebuilt from the parsed ID, never from the raw URL.

export const VIDEOS_KEY = "videos";
export const MAX_VIDEOS = 30;

export interface VideoEntry {
  url: string;
  title?: string;
}

export interface ParsedVideo {
  platform: "youtube" | "instagram";
  id: string;
  embedUrl: string;
  thumbnail?: string;
  vertical: boolean;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const IG_CODE = /^[A-Za-z0-9_-]{5,40}$/;

export function parseVideoUrl(raw: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    let id: string | null = null;
    let vertical = false;
    if (host === "youtu.be") id = parts[0] ?? null;
    else if (parts[0] === "watch") id = url.searchParams.get("v");
    else if (parts[0] === "shorts") { id = parts[1] ?? null; vertical = true; }
    else if (parts[0] === "embed" || parts[0] === "live" || parts[0] === "v") id = parts[1] ?? null;
    if (!id || !YT_ID.test(id)) return null;
    return {
      platform: "youtube",
      id,
      vertical,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (host === "instagram.com") {
    // /p/CODE, /reel/CODE, /reels/CODE, /tv/CODE, optionally prefixed by /username/
    const idx = parts.findIndex((p) => ["p", "reel", "reels", "tv"].includes(p));
    const code = idx >= 0 ? parts[idx + 1] : undefined;
    if (!code || !IG_CODE.test(code)) return null;
    const kind = parts[idx] === "p" ? "p" : parts[idx] === "tv" ? "tv" : "reel";
    return {
      platform: "instagram",
      id: code,
      vertical: true,
      embedUrl: `https://www.instagram.com/${kind}/${code}/embed/`,
    };
  }

  return null;
}

/** Parses the stored JSON, dropping anything that isn't a supported link. */
export function parseVideoList(raw: string | undefined): VideoEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((v): v is VideoEntry => !!v && typeof v.url === "string" && !!parseVideoUrl(v.url))
      .slice(0, MAX_VIDEOS)
      .map((v) => ({ url: v.url.trim(), title: typeof v.title === "string" ? v.title.slice(0, 160) : "" }));
  } catch {
    return [];
  }
}
