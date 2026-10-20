const KEY = "0ca12c5865e14736b7700c566d498e83";
const HOST = "strongboxing.kr";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/** 새 URL(들)을 Bing IndexNow에 즉시 통보 */
export async function pingIndexNow(urls: string | string[]) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
  } catch (e) {
    console.error("[IndexNow] 핑 실패:", e);
  }
}
