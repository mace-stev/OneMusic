import { FilteredYoutubeSong, UpdatedFilteredYoutubeSong } from "../types/youtube";


export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractArtistAndSongTitle(
  title: string,
  videoOwnerChannelTitle: string = "",
  description: string = ""
): { artist: string; songTitle: string } {
  // helper to strip a trailing "Lyrics"
  const sanitize = (s: string) => s.replace(/\b[Ll]yrics$/i, "").trim();

  // 0) clean out [brackets], (parentheses), and split off anything after " | "
  const cleaned = title
    .replace(/\[.*?\]|\(.*?\)/g, "")
    .split("|")[0]
    .trim();

  const containsMeta = (t: string) =>
    /\b(lyrics?|cover|theme|soundtrack|OST|version)\b/i.test(t);

  const isLikelyName = (t: string) => {
    const ws = t.split(/\s+/);
    return (
      ws.length >= 1 &&
      ws.length <= 5 &&
      ws.every(w => /^[A-Z][a-zA-Z'’&.,]+$/.test(w))
    );
  };

  // 1) Description metadata: explicit Song: / Artist:
  const sLine = description.match(/^\s*Song:\s*(.+)$/im);
  const aLine = description.match(/^\s*Artist:\s*(.+)$/im);
  if (sLine && aLine) {
    return { songTitle: sanitize(sLine[1]), artist: aLine[1].trim() };
  }

  // 2) D-E-A-F style: multiple single-letter segments
  const dashSegs = cleaned.split("-");
  if (dashSegs.length > 2 && dashSegs.every(seg => /^[A-Za-z]$/.test(seg))) {
    return { artist: videoOwnerChannelTitle, songTitle: sanitize(cleaned) };
  }

  // 3) "Artist: Title" inside the title itself
  const ci = cleaned.indexOf(":");
  if (ci > 0) {
    const L = cleaned.slice(0, ci).trim();
    const R = cleaned.slice(ci + 1).trim();
    if (isLikelyName(L) && R && !containsMeta(L)) {
      return { artist: L, songTitle: sanitize(R) };
    }
  }

  // 4) "Title · Artist" bullet style in description
  const bulletRe = new RegExp(`^${escapeRegExp(cleaned)}\\s*[·•]\\s*(.+)$`, "i");
  for (const line of description.split("\n").map(l => l.trim())) {
    const m = line.match(bulletRe);
    if (m?.[1]) {
      return { artist: m[1].trim(), songTitle: sanitize(cleaned) };
    }
  }

  // 5) DASH logic
  const lastDash = Math.max(
    cleaned.lastIndexOf(" - "),
    cleaned.lastIndexOf(" – "),
    cleaned.lastIndexOf("-")
  );
  if (lastDash !== -1) {
    const left = cleaned.slice(0, lastDash).trim();
    const right = cleaned.slice(lastDash + 1).trim();

    // 5a) inline "X by Y" in right-hand side, **only if Y has ≥2 words**
    const im = right.match(/(.+?) by ([^\/]+)/i);
    if (im) {
      const titleCandidate = im[1].trim();
      const artistCandidate = im[2].trim();
      if (
        isLikelyName(artistCandidate) &&
        artistCandidate.split(/\s+/).length > 1
      ) {
        return { artist: artistCandidate, songTitle: sanitize(titleCandidate) };
      }
    }

    // 5b) "left by right" somewhere in description
    const byRe = new RegExp(
      `\\b${escapeRegExp(left)} by ${escapeRegExp(right)}\\b`,
      "i"
    );
    if (byRe.test(description)) {
      return { artist: right, songTitle: sanitize(left) };
    }

    // 5c) your original dash-swap heuristic
    const likelyTitle = (t: string) => t.length > 20 || containsMeta(t);
    const swap = (likelyTitle(left) && isLikelyName(right)) || containsMeta(left);
    return swap
      ? { artist: right, songTitle: sanitize(left) }
      : { artist: left, songTitle: sanitize(right) };
  }

  // 6) Standalone name line in description
  for (const line of description.split("\n").map(l => l.trim())) {
    if (isLikelyName(line) && !containsMeta(line) && line !== cleaned) {
      if (
        /^[IVXLCDM0-9]+$/i.test(line) ||
        line.split(/\s+/).every(w => /^[A-Z]+$/.test(w))
      ) {
        continue;
      }
      return { artist: line, songTitle: sanitize(cleaned) };
    }
  }

  // 7) Fallback → channel name minus trailing " - Topic"
  const fallback = (videoOwnerChannelTitle || "")
    .replace(/\s*-\s*Topic$/i, "")
    .trim();
  return { artist: fallback, songTitle: sanitize(cleaned) };
}

export default function processYoutubeSongs(songs: FilteredYoutubeSong[]): UpdatedFilteredYoutubeSong[] {
  return songs.map(song => {
    const { artist, songTitle } = extractArtistAndSongTitle(
      song.title,
      song.videoOwnerChannelTitle,
      song.description
    );
    return { ...song, songArtist: artist, songTitle };
  });
}
