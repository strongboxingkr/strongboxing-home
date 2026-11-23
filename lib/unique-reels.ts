export function uniqueReels<Reel extends { video_url: string }>(reels: Reel[]): Reel[] {
  const seen = new Set<string>();

  return reels.filter(({ video_url }) => {
    if (seen.has(video_url)) return false;
    seen.add(video_url);
    return true;
  });
}
