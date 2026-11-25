const browserCompatibleClips: Record<string, string> = {
  "/reels/1783403514405-_talkv_wz02SrRVnB_kpSaJla2eY69vFgpE2M0t1_talkv_high.mp4": "reel-1783403514405",
  "/reels/1784008508663-_talkv_wz23j8Scdr_6NLQdXGBGx98x47lKpLx0k_talkv_high.mp4": "reel-1784008508663",
  "/reels/1784013918027-_talkv_wz1F4S05Pi_oONWVTTeLitP2FSb5QLB51_talkv_high.mp4": "gaebong-junior-stance",
  "/reels/1792734539180-KakaoTalk_20261023_144423353.mp4": "gaebong-after-work",
  "/reels/1792734611702-신정.mp4": "sinjeong-mitts",
  "/reels/1792734651591-목동.mp4": "mokdong-boxing",
  "/reels/1792734714940-철산.mp4": "cheolsan-stance",
  "/videos/cheolsan/006.MOV": "cheolsan-006",
  "/videos/gaebong/002.mp4": "gaebong-002",
  "/videos/gaebong/004.mov": "gaebong-004",
  "/videos/mokdong/006.mp4": "mokdong-006",
  "/videos/mokdong/012.mov": "mokdong-012",
  "/videos/sinjeong/001.mp4": "sinjeong-001",
  "/videos/sinjeong/002.mp4": "sinjeong-002",
  "/videos/sinjeong/004.mov": "sinjeong-004",
  "/videos/sinjeong/009.mp4": "sinjeong-009",
  "/videos/sinjeong/013.MP4": "sinjeong-013",
};

export function browserCompatibleClip(src: string) {
  const name = browserCompatibleClips[src];
  return name ? `/videos/compatible/${name}.mp4` : src;
}
