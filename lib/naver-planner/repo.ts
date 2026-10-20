import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import {
  BRANCH_SLUGS,
  type BlogRef,
  type Branch,
  type BranchSlug,
  type DraftRecord,
  type DraftResult,
  type KeywordLookup,
  type KeywordRow,
} from "./types";

// 처음 등록되는 값. 주소·운영시간·전화·예약 링크는 홈페이지 지점 페이지 표기값이며
// "확인됨"이 꺼진 상태로 들어감 → 관리자가 확인 후 체크해야 초안에 사용됨. 가격은 비워 둠.
const SEED: Omit<Branch, "verified">[] = [
  {
    slug: "gaebong",
    name: "개봉점",
    address: "서울시 구로구 개봉동 166-5번지 유원빌딩 지하 1층",
    hours: "월-금 13:00~23:00",
    price: "",
    booking_url: "https://m.booking.naver.com/booking/13/bizes/1440071",
    phone: "02-2060-1279",
    region_terms: "개봉동, 개봉역, 개봉, 고척동, 구로",
    local_notes: "",
    angle_notes: "퇴근 후 운동, 복싱을 처음 시작할 때 첫 방문 흐름",
  },
  {
    slug: "sinjeong",
    name: "신정점",
    address: "서울시 양천구 신정동 1021-7 태화상가 2층",
    hours: "월-금 10:00~24:00 (14:00~15:00 휴게), 토 10:00~16:00",
    price: "",
    booking_url: "https://booking.naver.com/booking/13/bizes/1367177",
    phone: "02-2647-3373",
    region_terms: "신정동, 신정네거리, 양천구, 신정",
    local_notes: "",
    angle_notes: "오전·낮 시간 운동, 토요일 운동",
  },
  {
    slug: "mokdong",
    name: "목동점",
    address: "서울시 양천구 목동 909-6 우방빌딩 4층",
    hours: "월-금 14:00~24:00, 토 11:00~16:00",
    price: "",
    booking_url: "https://booking.naver.com/booking/13/bizes/1510638",
    phone: "02-2643-5971",
    region_terms: "목동, 오목교, 목동역, 양천구",
    local_notes: "",
    angle_notes: "다이어트 목적 복싱, 늦은 시간 운동",
  },
  {
    slug: "cheolsan",
    name: "철산점",
    address: "경기도 광명시 철산동 56-14 3층",
    hours: "월-금 14:00~23:00, 토·일 14:00~18:00, 공휴일 휴무",
    price: "",
    booking_url: "https://booking.naver.com/booking/12/bizes/1673598",
    phone: "02-2066-0406",
    region_terms: "철산, 철산역, 철산동, 광명",
    local_notes: "",
    angle_notes: "주말 운동, 광명 지역 복싱 입문",
  },
];

let ensured: Promise<void> | null = null;

/** nbp_* 테이블 생성 + 4개 지점 기본값 등록. 프로세스당 1번 */
export function ensureSchema(): Promise<void> {
  if (!ensured) {
    ensured = doEnsure().catch((e) => {
      ensured = null;
      throw e;
    });
  }
  return ensured;
}

async function doEnsure() {
  const sql = await readFile(path.join(process.cwd(), "database", "naver_planner_schema.sql"), "utf8");
  const statements = sql
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => /^CREATE TABLE/i.test(s));
  for (const s of statements) await db.query(s);

  for (const b of SEED) {
    await db.query(
      `INSERT IGNORE INTO nbp_branches
        (slug, name, address, hours, price, booking_url, phone, region_terms, local_notes, angle_notes, verified_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '{}')`,
      [b.slug, b.name, b.address, b.hours, b.price, b.booking_url, b.phone, b.region_terms, b.local_notes, b.angle_notes]
    );
  }
}

export function isBranchSlug(v: unknown): v is BranchSlug {
  return typeof v === "string" && (BRANCH_SLUGS as readonly string[]).includes(v);
}

function parse<T>(v: unknown, fallback: T): T {
  try {
    return v ? (JSON.parse(String(v)) as T) : fallback;
  } catch {
    return fallback;
  }
}

function toIso(v: unknown): string {
  return v instanceof Date ? v.toISOString() : String(v ?? "");
}

function toBranch(r: any): Branch {
  return {
    slug: r.slug,
    name: r.name,
    address: r.address ?? "",
    hours: r.hours ?? "",
    price: r.price ?? "",
    booking_url: r.booking_url ?? "",
    phone: r.phone ?? "",
    region_terms: r.region_terms ?? "",
    local_notes: r.local_notes ?? "",
    angle_notes: r.angle_notes ?? "",
    verified: parse(r.verified_json, {}),
    updated_at: toIso(r.updated_at),
  };
}

export async function listBranches(): Promise<Branch[]> {
  const [rows]: any = await db.query(`SELECT * FROM nbp_branches`);
  const order = BRANCH_SLUGS as readonly string[];
  return (rows as any[]).map(toBranch).sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export async function getBranch(slug: BranchSlug): Promise<Branch | null> {
  const [rows]: any = await db.query(`SELECT * FROM nbp_branches WHERE slug = ? LIMIT 1`, [slug]);
  return rows[0] ? toBranch(rows[0]) : null;
}

export async function updateBranch(b: Branch) {
  await db.query(
    `UPDATE nbp_branches
        SET address = ?, hours = ?, price = ?, booking_url = ?, phone = ?,
            region_terms = ?, local_notes = ?, angle_notes = ?, verified_json = ?
      WHERE slug = ?`,
    [
      b.address,
      b.hours,
      b.price,
      b.booking_url,
      b.phone,
      b.region_terms,
      b.local_notes,
      b.angle_notes,
      JSON.stringify(b.verified ?? {}),
      b.slug,
    ]
  );
}

export async function insertLookup(
  slug: BranchSlug,
  hints: string,
  data: { rows: KeywordRow[]; notReturned: string[]; errors: string[] }
): Promise<KeywordLookup> {
  const [res]: any = await db.query(
    `INSERT INTO nbp_keyword_lookups (branch_slug, hints, result_json) VALUES (?, ?, ?)`,
    [slug, hints.slice(0, 500), JSON.stringify(data)]
  );
  const lookup = await getLookup(res.insertId);
  if (!lookup) throw new Error("조회 기록 저장 실패");
  return lookup;
}

function toLookup(r: any): KeywordLookup {
  const data = parse(r.result_json, { rows: [], notReturned: [], errors: [] });
  return { id: r.id, branch_slug: r.branch_slug, hints: r.hints, fetched_at: toIso(r.fetched_at), ...data };
}

export async function getLookup(id: number): Promise<KeywordLookup | null> {
  const [rows]: any = await db.query(`SELECT * FROM nbp_keyword_lookups WHERE id = ?`, [id]);
  return rows[0] ? toLookup(rows[0]) : null;
}

export async function listLookups(slug: BranchSlug, limit = 10) {
  const [rows]: any = await db.query(
    `SELECT id, branch_slug, hints, fetched_at FROM nbp_keyword_lookups WHERE branch_slug = ? ORDER BY id DESC LIMIT ?`,
    [slug, limit]
  );
  return (rows as any[]).map((r) => ({ id: r.id, hints: r.hints, fetched_at: toIso(r.fetched_at) }));
}

export async function insertDraft(d: {
  branch_slug: BranchSlug;
  keyword: string;
  sub_keywords: string;
  angle: string;
  result: DraftResult & { infoBlock: string };
  references: BlogRef[];
  keywords: DraftRecord["keywords"];
  warnings: string[];
  model: string;
}): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO nbp_drafts
      (branch_slug, keyword, sub_keywords, angle, first_title, result_json, references_json, keyword_json, warnings_json, model)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.branch_slug,
      d.keyword.slice(0, 100),
      d.sub_keywords.slice(0, 500),
      d.angle.slice(0, 200),
      (d.result.titles[0] ?? "").slice(0, 200),
      JSON.stringify(d.result),
      JSON.stringify(d.references),
      JSON.stringify(d.keywords),
      JSON.stringify(d.warnings),
      d.model,
    ]
  );
  return res.insertId;
}

function toDraft(r: any): DraftRecord {
  const result = parse<DraftResult & { infoBlock?: string }>(r.result_json, {
    titles: [],
    angle_summary: "",
    blocks: [],
    cta: "",
    hashtags: [],
    reference_note: "",
  });
  return {
    id: r.id,
    branch_slug: r.branch_slug,
    keyword: r.keyword,
    sub_keywords: r.sub_keywords,
    angle: r.angle,
    first_title: r.first_title,
    result,
    infoBlock: result.infoBlock ?? "",
    references: parse(r.references_json, []),
    keywords: parse(r.keyword_json, []),
    warnings: parse(r.warnings_json, []),
    model: r.model,
    created_at: toIso(r.created_at),
  };
}

export async function getDraft(id: number): Promise<DraftRecord | null> {
  const [rows]: any = await db.query(`SELECT * FROM nbp_drafts WHERE id = ?`, [id]);
  return rows[0] ? toDraft(rows[0]) : null;
}

/** 전 지점 최근 초안 (중복 방지 비교용 + 목록 표시용) */
export async function listDrafts(limit = 30): Promise<DraftRecord[]> {
  const [rows]: any = await db.query(`SELECT * FROM nbp_drafts ORDER BY id DESC LIMIT ?`, [limit]);
  return (rows as any[]).map(toDraft);
}

export async function deleteDraft(id: number) {
  await db.query(`DELETE FROM nbp_drafts WHERE id = ?`, [id]);
}
