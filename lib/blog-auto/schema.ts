import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { normalizeTopic } from "./similarity";
import { SEED_TOPICS, buildSeedDraft } from "./seed";
import { insertDraftRow } from "./repo";
import { findOverlaps } from "./pipeline";

let ensured: Promise<void> | null = null;

/** blog_auto_* 테이블 생성 + 기본 주제 등록 + 첫 초안 1회 등록. 프로세스당 1번만 실행 */
export function ensureSchema(): Promise<void> {
  if (!ensured) {
    ensured = doEnsure().catch((e) => {
      ensured = null; // 실패 시 다음 요청에서 재시도
      throw e;
    });
  }
  return ensured;
}

async function doEnsure() {
  const sql = await readFile(path.join(process.cwd(), "database", "blog_auto_schema.sql"), "utf8");
  const statements = sql
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => /^CREATE TABLE/i.test(s));

  for (const s of statements) await db.query(s);

  // 기본 주제 — norm_key UNIQUE 이므로 이미 있으면 무시
  for (const t of SEED_TOPICS) {
    await db.query(
      `INSERT IGNORE INTO blog_topics (title, norm_key, keyword, audience, priority) VALUES (?, ?, ?, ?, ?)`,
      [t.title, normalizeTopic(t.title), t.keyword, t.audience, t.priority]
    );
  }

  await seedFirstDraftOnce();
}

/** 첫 결과물('복싱 처음 배우면 어떤 것부터 할까?') 초안을 한 번만 등록. 관리자가 폐기해도 다시 만들지 않음 */
async function seedFirstDraftOnce() {
  const [flag]: any = await db.query(`SELECT v FROM blog_auto_settings WHERE k = 'seed_first_draft'`);
  if (flag.length > 0) return;

  const first = SEED_TOPICS[0];
  const [topics]: any = await db.query(`SELECT * FROM blog_topics WHERE norm_key = ?`, [
    normalizeTopic(first.title),
  ]);
  const topic = topics[0];

  if (topic && topic.status === "미작성") {
    const [existing]: any = await db.query(`SELECT id FROM blog_auto_drafts WHERE topic_id = ?`, [topic.id]);
    if (existing.length === 0) {
      const draft = await buildSeedDraft(topic.id);
      draft.dup_report = await findOverlaps(topic);
      let draftId: number;
      try {
        draftId = await insertDraftRow(topic.id, draft, "manual-seed");
      } catch (e: any) {
        if (e?.code === "ER_DUP_ENTRY") return; // 다른 프로세스가 먼저 등록
        throw e;
      }
      await db.query(`UPDATE blog_topics SET status = '초안', draft_id = ? WHERE id = ?`, [draftId, topic.id]);
    }
  }

  await db.query(`INSERT IGNORE INTO blog_auto_settings (k, v) VALUES ('seed_first_draft', 'done')`);
}
