import { db } from "@/lib/db";
import type { AdminCheck, Draft, DraftBody, DraftImage, DupReportItem, LinkReportItem, RelatedLink, RunLogLine } from "./types";

// ── 초안 ─────────────────────────────────────────────────────────

export type DraftInput = {
  title: string;
  slug: string;
  description: string;
  keyword: string;
  body: DraftBody;
  content_html: string;
  images: DraftImage[];
  checks: AdminCheck[];
  related: RelatedLink[];
  link_report: LinkReportItem[];
  dup_report: DupReportItem[];
};

function parse<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v !== "string") return v as T;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function rowToDraft(r: any): Draft {
  return {
    id: r.id,
    topic_id: r.topic_id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    keyword: r.keyword,
    body: parse<DraftBody>(r.body_json, { summary: "", sections: [], faq: [], cta: { text: "", linkLabel: "", href: "/reservation" } }),
    content_html: r.content_html,
    images: parse<DraftImage[]>(r.images_json, []),
    checks: parse<AdminCheck[]>(r.checks_json, []),
    related: parse<RelatedLink[]>(r.related_json, []),
    link_report: parse<LinkReportItem[]>(r.link_report_json, []),
    dup_report: parse<DupReportItem[]>(r.dup_report_json, []),
    status: r.status,
    published_post_id: r.published_post_id,
    model: r.model,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function getDraft(id: number): Promise<Draft | null> {
  const [rows]: any = await db.query(`SELECT * FROM blog_auto_drafts WHERE id = ?`, [id]);
  return rows[0] ? rowToDraft(rows[0]) : null;
}

function draftValues(d: DraftInput) {
  return [
    d.title,
    d.slug,
    d.description,
    d.keyword,
    JSON.stringify(d.body),
    d.content_html,
    JSON.stringify(d.images),
    JSON.stringify(d.checks),
    JSON.stringify(d.related),
    JSON.stringify(d.link_report),
    JSON.stringify(d.dup_report),
  ];
}

/**
 * 주제당 1행(UNIQUE topic_id). 재시도·재생성하면 같은 행을 덮어써서 초안이 중복 저장되지 않음.
 * 이미 발행된 초안은 덮어쓰지 않음.
 */
export async function insertDraftRow(topicId: number, d: DraftInput, model: string): Promise<number> {
  const [res]: any = await db.query(
    `INSERT INTO blog_auto_drafts
       (topic_id, title, slug, description, keyword, body_json, content_html, images_json, checks_json,
        related_json, link_report_json, dup_report_json, status, model)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)
     ON DUPLICATE KEY UPDATE
       id = LAST_INSERT_ID(id),
       title = IF(status = 'published', title, VALUES(title)),
       slug = IF(status = 'published', slug, VALUES(slug)),
       description = IF(status = 'published', description, VALUES(description)),
       keyword = IF(status = 'published', keyword, VALUES(keyword)),
       body_json = IF(status = 'published', body_json, VALUES(body_json)),
       content_html = IF(status = 'published', content_html, VALUES(content_html)),
       images_json = IF(status = 'published', images_json, VALUES(images_json)),
       checks_json = IF(status = 'published', checks_json, VALUES(checks_json)),
       related_json = IF(status = 'published', related_json, VALUES(related_json)),
       link_report_json = IF(status = 'published', link_report_json, VALUES(link_report_json)),
       dup_report_json = IF(status = 'published', dup_report_json, VALUES(dup_report_json)),
       model = IF(status = 'published', model, VALUES(model)),
       status = IF(status = 'published', status, 'draft')`,
    [topicId, ...draftValues(d), model]
  );
  return res.insertId;
}

export async function updateDraft(id: number, patch: Partial<DraftInput>) {
  const map: Record<string, [string, (v: any) => unknown]> = {
    title: ["title", (v) => v],
    slug: ["slug", (v) => v],
    description: ["description", (v) => v],
    keyword: ["keyword", (v) => v],
    body: ["body_json", (v) => JSON.stringify(v)],
    content_html: ["content_html", (v) => v],
    images: ["images_json", (v) => JSON.stringify(v)],
    checks: ["checks_json", (v) => JSON.stringify(v)],
    related: ["related_json", (v) => JSON.stringify(v)],
    link_report: ["link_report_json", (v) => JSON.stringify(v)],
    dup_report: ["dup_report_json", (v) => JSON.stringify(v)],
  };
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || !map[k]) continue;
    sets.push(`${map[k][0]} = ?`);
    vals.push(map[k][1](v));
  }
  if (sets.length === 0) return;
  await db.query(`UPDATE blog_auto_drafts SET ${sets.join(", ")} WHERE id = ?`, [...vals, id]);
}

/** homepage_posts 와 다른 초안에 없는 slug 로 보정 */
export async function uniqueSlug(base: string, ownTopicId?: number): Promise<string> {
  const clean =
    base
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || `boxing-guide-${Date.now()}`;
  for (let i = 0; i < 50; i++) {
    const s = i === 0 ? clean : `${clean}-${i + 1}`;
    const [p]: any = await db.query(`SELECT id FROM homepage_posts WHERE slug = ? LIMIT 1`, [s]);
    if (p.length) continue;
    const [d]: any = await db.query(
      `SELECT id FROM blog_auto_drafts WHERE slug = ? AND topic_id <> ? LIMIT 1`,
      [s, ownTopicId ?? 0]
    );
    if (d.length) continue;
    return s;
  }
  return `${clean}-${Date.now()}`;
}

// ── 실행 기록 ────────────────────────────────────────────────────

export class RunLogger {
  lines: RunLogLine[] = [];
  constructor(public runId: number) {}

  private async push(level: RunLogLine["level"], msg: string) {
    this.lines.push({ at: new Date().toISOString(), level, msg });
    await db.query(`UPDATE blog_auto_runs SET log_json = ? WHERE id = ?`, [JSON.stringify(this.lines), this.runId]);
  }
  info(msg: string) {
    return this.push("info", msg);
  }
  warn(msg: string) {
    return this.push("warn", msg);
  }
  error(msg: string) {
    return this.push("error", msg);
  }
}

export async function createRun(trigger: string, topicId: number | null, draftId: number | null = null) {
  const [res]: any = await db.query(
    `INSERT INTO blog_auto_runs (trigger_type, topic_id, draft_id, status, log_json) VALUES (?, ?, ?, 'running', '[]')`,
    [trigger, topicId, draftId]
  );
  return res.insertId as number;
}

export async function finishRun(
  runId: number,
  status: "success" | "failed" | "skipped",
  fields: { error?: string; topicId?: number | null; draftId?: number | null; attempts?: number; usage?: unknown } = {}
) {
  await db.query(
    `UPDATE blog_auto_runs
       SET status = ?, error = ?, topic_id = COALESCE(?, topic_id), draft_id = COALESCE(?, draft_id),
           attempts = COALESCE(?, attempts), usage_json = COALESCE(?, usage_json), finished_at = NOW()
     WHERE id = ?`,
    [
      status,
      fields.error ?? null,
      fields.topicId ?? null,
      fields.draftId ?? null,
      fields.attempts ?? null,
      fields.usage ? JSON.stringify(fields.usage) : null,
      runId,
    ]
  );
}

/** 서버 재시작 등으로 끝나지 못한 실행을 실패 처리 (15분 경과) */
export async function expireStaleRuns() {
  await db.query(
    `UPDATE blog_auto_runs SET status = 'failed', error = '실행이 중간에 중단되었습니다 (서버 재시작 등)', finished_at = NOW()
     WHERE status = 'running' AND started_at < NOW() - INTERVAL 15 MINUTE`
  );
  await db.query(
    `UPDATE blog_topics SET status = '실패', memo = CONCAT(COALESCE(memo, ''), '\n[자동] 작성 중 중단됨')
     WHERE status = '작성중' AND updated_at < NOW() - INTERVAL 15 MINUTE`
  );
}

export async function hasRunningRun(): Promise<boolean> {
  const [rows]: any = await db.query(
    `SELECT id FROM blog_auto_runs WHERE status = 'running' AND trigger_type <> 'image' LIMIT 1`
  );
  return rows.length > 0;
}

// ── 설정 ─────────────────────────────────────────────────────────

export async function getSetting(k: string): Promise<string> {
  const [rows]: any = await db.query(`SELECT v FROM blog_auto_settings WHERE k = ?`, [k]);
  return rows[0]?.v ?? "";
}

export async function setSetting(k: string, v: string) {
  await db.query(`INSERT INTO blog_auto_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)`, [k, v]);
}
