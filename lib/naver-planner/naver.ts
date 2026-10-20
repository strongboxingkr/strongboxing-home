import crypto from "crypto";
import type { BlogRef, KeywordRow, Volume } from "./types";

// 키는 서버 환경변수에서만 읽음. 응답·로그·화면에 키 값을 내보내지 않음.

export function envStatus() {
  return {
    searchAd: !!(process.env.NAVER_SEARCHAD_API_KEY && process.env.NAVER_SEARCHAD_SECRET_KEY && process.env.NAVER_SEARCHAD_CUSTOMER_ID),
    blogSearch: !!(process.env.NAVER_SEARCH_CLIENT_ID && process.env.NAVER_SEARCH_CLIENT_SECRET),
    openai: !!process.env.OPENAI_API_KEY,
  };
}

/* ---------------- 검색광고 API: 키워드 도구 ---------------- */

const SEARCHAD_BASE = "https://api.searchad.naver.com";

function searchAdHeaders(method: string, uri: string) {
  const apiKey = process.env.NAVER_SEARCHAD_API_KEY;
  const secret = process.env.NAVER_SEARCHAD_SECRET_KEY;
  const customer = process.env.NAVER_SEARCHAD_CUSTOMER_ID;
  if (!apiKey || !secret || !customer) throw new Error("검색광고 API 환경변수가 설정되지 않았습니다.");
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(`${timestamp}.${method}.${uri}`).digest("base64");
  return {
    "X-Timestamp": timestamp,
    "X-API-KEY": apiKey,
    "X-Customer": customer,
    "X-Signature": signature,
  };
}

function toVolume(v: unknown): Volume {
  if (typeof v === "number") return { raw: String(v), num: v };
  const s = String(v ?? "").trim();
  const n = Number(s);
  return Number.isFinite(n) && s !== "" ? { raw: s, num: n } : { raw: s || "-", num: null };
}

/** 힌트는 공백 없이 최대 5개. API가 공백 포함 키워드를 거절함 */
export function normalizeHint(k: string) {
  return k.replace(/\s+/g, "").trim();
}

export async function keywordTool(hints: string[]): Promise<KeywordRow[]> {
  const list = [...new Set(hints.map(normalizeHint).filter(Boolean))].slice(0, 5);
  if (!list.length) return [];
  const uri = "/keywordstool";
  const qs = new URLSearchParams({ hintKeywords: list.join(","), showDetail: "1" });
  const res = await fetch(`${SEARCHAD_BASE}${uri}?${qs}`, {
    headers: searchAdHeaders("GET", uri),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text.slice(0, 200);
    try {
      const j = JSON.parse(text);
      msg = j.title || j.message || msg;
    } catch {}
    throw new Error(`검색광고 API ${res.status}: ${msg}`);
  }
  const json = JSON.parse(text);
  return (json.keywordList ?? []).map((k: any) => ({
    keyword: String(k.relKeyword),
    pc: toVolume(k.monthlyPcQcCnt),
    mobile: toVolume(k.monthlyMobileQcCnt),
    compIdx: String(k.compIdx ?? ""),
    source: "related" as const,
  }));
}

/* ---------------- 검색 API: 블로그 ---------------- */

function decodeEntities(s: string) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export async function blogSearch(query: string, display = 10): Promise<BlogRef[]> {
  const id = process.env.NAVER_SEARCH_CLIENT_ID;
  const secret = process.env.NAVER_SEARCH_CLIENT_SECRET;
  if (!id || !secret) throw new Error("네이버 검색 API 환경변수가 설정되지 않았습니다.");
  const qs = new URLSearchParams({ query, display: String(display), sort: "sim" });
  const res = await fetch(`https://openapi.naver.com/v1/search/blog.json?${qs}`, {
    headers: { "X-Naver-Client-Id": id, "X-Naver-Client-Secret": secret },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text.slice(0, 200);
    try {
      msg = JSON.parse(text).errorMessage || msg;
    } catch {}
    throw new Error(`네이버 검색 API ${res.status}: ${msg}`);
  }
  const json = JSON.parse(text);
  return (json.items ?? []).map((i: any) => ({
    title: decodeEntities(String(i.title ?? "")),
    description: decodeEntities(String(i.description ?? "")),
    link: String(i.link ?? ""),
    bloggername: decodeEntities(String(i.bloggername ?? "")),
    postdate: String(i.postdate ?? ""),
  }));
}
