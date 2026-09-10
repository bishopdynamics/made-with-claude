/** Returns the validated 11-character YouTube video ID, or undefined when the URL is not a supported YouTube watch/short link. */
export function youtubeVideoId(url: string | undefined): string | undefined {
  if (url === undefined) return undefined;
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      parsed.port
    )
      return undefined;

    let id: string | undefined;
    if (
      ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(
        parsed.hostname,
      )
    ) {
      const values = parsed.searchParams.getAll('v');
      if (parsed.pathname !== '/watch' || values.length !== 1) return undefined;
      id = values[0];
    } else if (parsed.hostname === 'youtu.be') {
      id = parsed.pathname.slice(1);
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

/** Builds the privacy-enhanced embed URL for a validated ID with the fixed minimal-player options. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&playsinline=1&controls=1&disablekb=0&fs=1&rel=0&iv_load_policy=3&color=white`;
}

/** Canonical watch page for the fallback link. */
export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
