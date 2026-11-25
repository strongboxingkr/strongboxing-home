const browserCompatibleClips: Record<string, string> = {
  "1792734714940-철산.mp4": "cheolsan-stance",
  "1792734651591-목동.mp4": "mokdong-boxing",
  "1792734611702-신정.mp4": "sinjeong-mitts",
  "1792734539180-KakaoTalk_20261023_144423353.mp4": "gaebong-after-work",
  "1784013918027-_talkv_wz1F4S05Pi_oONWVTTeLitP2FSb5QLB51_talkv_high.mp4": "gaebong-junior-stance",
};

export function browserCompatibleClip(src: string | undefined) {
  if (!src?.startsWith("/reels/")) return src;
  const name = browserCompatibleClips[src.slice("/reels/".length)];
  return name ? `/videos/compatible/${name}.mp4` : src;
}
