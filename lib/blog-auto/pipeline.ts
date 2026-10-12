import { db } from "@/lib/db";
import { generatePost, textModel } from "./generate";
import { generateIllustration, imageModel } from "./images";
import { relatedCandidates, toRelatedLinks, validateLinks } from "./links";
import { renderContent, replaceFigure } from "./render";
import { RunLogger, finishRun, getDraft, getSetting, insertDraftRow, uniqueSlug, updateDraft } from "./repo";
import { DUP_BLOCK, DUP_WARN, postSimilarity, similarity } from "./similarity";
import type { DraftImage, DupReportItem, ImageRole, Topic } from "./types";

const LOCK_NAME = "strongboxing_blog_auto_run";

/** 검토 대기 초안이 이만큼 쌓이면 예약 실행은 건너뜀 (관리자가 못 따라오는 상황 방지) */
export const MAX_PENDING_DRAFTS = 4;

/** 주제 선택: 지정 주제 또는 우선순위가 가장 높은 미작성 주제 */
async function pickTopic(topicId?: number, force = false): Promise<Topic | null> {
  if (topicId) {
    const [rows]: any = await db.query(`SELECT * FROM blog_topics WHERE id = ?`, [topicId]);
    const t = rows[0];
    if (!t) return null;
    if (!force && !["미작성", "실패"].includes(t.status)) return null;
    return t;
  }
  const [rows]: any = await db.query(
    `SELECT * FROM blog_topics WHERE status = '미작성' ORDER BY priority ASC, id ASC LIMIT 1`
  );
  return rows[0] ?? null;
}

/** 기존 발행 글·다른 초안과 겹치는지 확인 */
export async function findOverlaps(topic: Topic): Promise<DupReportItem[]> {
  const q = `${topic.title} ${topic.keyword}`;
  const out: DupReportItem[] = [];
  const [posts]: any = await db.query(`SELECT id, title, description FROM homepage_posts ORDER BY created_at DESC LIMIT 500`);
  for (const p of posts) {
    const score = Math.max(postSimilarity(topic.title, p.title, p.description), similarity(q, p.title));
    if (score >= DUP_WARN) out.push({ source: "post", id: p.id, title: p.title, score: +score.toFixed(2) });
  }
  const [drafts]: any = await db.query(
    `SELECT id, title FROM blog_auto_drafts WHERE topic_id <> ? AND status <> 'discarded'`,
    [topic.id]
  );
  for (const d of drafts) {
    const score = similarity(topic.title, d.title);
    if (score >= DUP_WARN) out.push({ source: "draft", id: d.id, title: d.title, score: +score.toFixed(2) });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 10);
}

export type RunOptions = { trigger: "manual" | "schedule" | "regenerate"; topicId?: number; force?: boolean };

/**
 * 초안 1개 생성. 동시에 하나만 실행되도록 MySQL 네임드 락을 잡는다.
 * 실패해도 주제는 '실패' 상태로 남아 다음 실행에서 다시 시도되고, 초안은 주제당 1행이라 중복되지 않는다.
 */
export async function executeRun(runId: number, opts: RunOptions) {
  const log = new RunLogger(runId);
  const conn = await db.getConnection();
  let topic: Topic | null = null;
  let locked = false;

  try {
    const [[lock]]: any = await conn.query(`SELECT GET_LOCK(?, 0) AS ok`, [LOCK_NAME]);
    if (lock?.ok !== 1) {
      await log.warn("다른 생성 작업이 실행 중이라 건너뜁니다.");
      await finishRun(runId, "skipped", { error: "이미 실행 중" });
      return;
    }
    locked = true;

    if (opts.trigger === "schedule") {
      const [[c]]: any = await db.query(`SELECT COUNT(*) AS n FROM blog_auto_drafts WHERE status = 'draft'`);
      if (c.n >= MAX_PENDING_DRAFTS) {
        await log.warn(`검토 대기 초안이 ${c.n}개라 예약 실행을 건너뜁니다. (기준 ${MAX_PENDING_DRAFTS}개)`);
        await finishRun(runId, "skipped", { error: "검토 대기 초안 과다" });
        return;
      }
    }

    topic = await pickTopic(opts.topicId, opts.force);
    if (!topic) {
      await log.warn(opts.topicId ? "선택한 주제를 지금 작성할 수 없습니다(상태 확인)." : "미작성 주제가 없습니다. 주제를 추가해 주세요.");
      await finishRun(runId, "skipped", { error: "작성할 주제 없음" });
      return;
    }

    // 발행된 초안은 다시 만들지 않음
    const [existing]: any = await db.query(`SELECT id, status FROM blog_auto_drafts WHERE topic_id = ?`, [topic.id]);
    if (existing[0]?.status === "published") {
      await log.warn("이미 발행된 주제입니다.");
      await finishRun(runId, "skipped", { topicId: topic.id, error: "이미 발행됨" });
      return;
    }

    const [claim]: any = await db.query(
      `UPDATE blog_topics SET status = '작성중' WHERE id = ? AND status <> '발행'`,
      [topic.id]
    );
    if (claim.affectedRows !== 1) throw new Error("주제 상태를 변경하지 못했습니다.");
    await log.info(`주제 선택: "${topic.title}" (키워드: ${topic.keyword})`);

    // 1) 중복 확인
    const overlaps = await findOverlaps(topic);
    const blocking = overlaps.filter((o) => o.score >= DUP_BLOCK);
    if (blocking.length && !opts.force) {
      const list = blocking.map((b) => `"${b.title}"(${b.score})`).join(", ");
      await db.query(`UPDATE blog_topics SET status = '보류', memo = ? WHERE id = ?`, [
        `[자동 보류] 기존 글과 내용이 겹칠 가능성: ${list}. 주제를 바꾸거나 '이 주제로 생성(강제)'을 사용하세요.`,
        topic.id,
      ]);
      await log.warn(`기존 글과 겹쳐 보류 처리: ${list}`);
      await finishRun(runId, "skipped", { topicId: topic.id, error: "중복 가능성으로 보류" });
      return;
    }
    if (overlaps.length) await log.info(`비슷한 글 ${overlaps.length}개 확인 → 겹치지 않게 작성하도록 전달`);

    // 2) 확인된 운영 정보·관련 글 후보
    const facts = await getSetting("verified_facts");
    await log.info(facts.trim() ? "확인된 운영 정보를 사용합니다." : "확인된 운영 정보가 비어 있어 일반 정보만 작성합니다.");
    const cands = await relatedCandidates(topic.title, topic.keyword);

    // 3) 글 생성
    const g = await generatePost(
      { topic, facts, similar: overlaps.map((o) => ({ title: o.title })), related: cands },
      (level, msg) => (level === "warn" ? log.warn(msg) : log.info(msg))
    );
    const slug = await uniqueSlug(g.slug, topic.id);
    const related = toRelatedLinks(cands, g.relatedSlugs);
    await log.info(`초안 작성 완료: "${g.title}" / 섹션 ${g.body.sections.length}개, FAQ ${g.body.faq.length}개, 이미지 ${g.images.length}장 구성`);

    // 4) 본문 렌더링 + 링크 확인 → 저장 (이미지는 우선 자리표시)
    let content = renderContent(g.body, g.images, related);
    const draftId = await insertDraftRow(
      topic.id,
      {
        title: g.title,
        slug,
        description: g.description,
        keyword: topic.keyword,
        body: g.body,
        content_html: content,
        images: g.images,
        checks: g.checks,
        related,
        link_report: await validateLinks(content, slug),
        dup_report: overlaps,
      },
      textModel()
    );
    await db.query(`UPDATE blog_topics SET status = '초안', draft_id = ?, memo = NULL WHERE id = ?`, [draftId, topic.id]);
    await log.info(`초안 저장 (#${draftId}). 확인 사항 ${g.checks.length}개`);

    // 5) 이미지 — 도구가 연결된 경우에만 생성. 실패해도 글 초안은 유지
    let generated = 0;
    if (imageModel()) {
      const images: DraftImage[] = [...g.images];
      for (let i = 0; i < images.length; i++) {
        try {
          await log.info(`이미지 생성: ${images[i].role} (${images[i].filename})`);
          images[i] = await generateIllustration(images[i], slug);
          generated++;
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          images[i] = { ...images[i], status: "failed", error: msg.slice(0, 200) };
          await log.warn(`이미지 생성 실패(${images[i].role}): ${msg}`);
        }
        content = replaceFigure(content, images[i]);
      }
      await updateDraft(draftId, { images, content_html: content, link_report: await validateLinks(content, slug) });
    } else {
      await log.info("이미지 생성 도구가 연결되지 않아 생성 프롬프트와 삽입 위치를 초안에 남겼습니다.");
    }

    await finishRun(runId, "success", {
      topicId: topic.id,
      draftId,
      attempts: g.attempts,
      usage: { model: textModel(), ...g.usage, images: generated, imageModel: imageModel() },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await log.error(msg).catch(() => {});
    if (topic) {
      await db
        .query(`UPDATE blog_topics SET status = '실패', memo = ? WHERE id = ? AND status = '작성중'`, [
          `[자동] 생성 실패: ${msg.slice(0, 300)} — 다음 실행 때 다시 시도합니다.`,
          topic.id,
        ])
        .catch(() => {});
    }
    await finishRun(runId, "failed", { error: msg.slice(0, 1000), topicId: topic?.id ?? null }).catch(() => {});
  } finally {
    if (locked) await conn.query(`SELECT RELEASE_LOCK(?)`, [LOCK_NAME]).catch(() => {});
    conn.release();
  }
}

/** 초안의 이미지 1장 (재)생성 */
export async function executeImageRun(runId: number, draftId: number, role: ImageRole) {
  const log = new RunLogger(runId);
  try {
    const draft = await getDraft(draftId);
    if (!draft) throw new Error("초안을 찾을 수 없습니다.");
    const idx = draft.images.findIndex((i) => i.role === role);
    if (idx < 0) throw new Error("이미지 항목이 없습니다.");
    await log.info(`이미지 생성: ${role} (${draft.images[idx].filename})`);

    const images = [...draft.images];
    try {
      images[idx] = await generateIllustration(images[idx], draft.slug);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      images[idx] = { ...images[idx], status: "failed", error: msg.slice(0, 200) };
      await updateDraft(draftId, { images, content_html: replaceFigure(draft.content_html, images[idx]) });
      throw e;
    }
    await updateDraft(draftId, { images, content_html: replaceFigure(draft.content_html, images[idx]) });
    await log.info("이미지 저장 완료");

    // 발행된 글이고 cover 이미지면 thumbnail 동기화
    if (role === "cover" && draft.status === "published" && draft.published_post_id) {
      const newUrl = images[idx].url;
      if (newUrl) {
        const { db } = await import("@/lib/db");
        await db.query(`UPDATE homepage_posts SET thumbnail = ? WHERE id = ?`, [newUrl, draft.published_post_id]);
        await log.info("블로그 썸네일 동기화 완료");
      }
    }

    await finishRun(runId, "success", { draftId, usage: { images: 1, imageModel: imageModel() } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await log.error(msg).catch(() => {});
    await finishRun(runId, "failed", { draftId, error: msg.slice(0, 1000) }).catch(() => {});
  }
}
