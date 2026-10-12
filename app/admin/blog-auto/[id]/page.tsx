"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import RichTextEditor, { RichTextEditorHandle } from "@/app/components/RichTextEditor";
import { hasFigure, renderFigure } from "@/lib/blog-auto/render";
import type { AdminCheck, Draft, DraftImage } from "@/lib/blog-auto/types";

type Readiness = { blockers: string[]; warnings: string[] };

const card = "rounded-[28px] border border-zinc-200 bg-white p-6";
const btn = "rounded-full px-5 py-2.5 text-sm font-black transition disabled:opacity-40";
const input = "w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-[#FC5230]";

const CHECK_LABEL: Record<AdminCheck["status"], string> = {
  open: "확인 필요",
  confirmed: "확인 완료",
  dismissed: "본문 반영 안 함",
};

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  return res.json().catch(() => ({ ok: false, message: `응답 오류 (${res.status})` }));
}

function kb(bytes?: number) {
  return bytes ? `${Math.round(bytes / 1024)}KB` : "";
}

export default function DraftEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [imageModel, setImageModel] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [checks, setChecks] = useState<AdminCheck[]>([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const editorRef = useRef<RichTextEditorHandle>(null);

  const apply = useCallback((d: Draft, r: Readiness) => {
    setDraft(d);
    setReadiness(r);
    setTitle(d.title);
    setSlug(d.slug);
    setDescription(d.description);
    setContent(d.content_html);
    setChecks(d.checks);
    editorRef.current?.setContent(d.content_html);
    setDirty(false);
  }, []);

  const load = useCallback(async () => {
    const [r, s] = await Promise.all([api(`/api/blog-auto/drafts/${id}`), api("/api/blog-auto/settings")]);
    if (!r.ok) return alert(r.message);
    apply(r.draft, r.readiness);
    setImageModel(s.status?.imageModel ?? null);
  }, [id, apply]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(): Promise<boolean> {
    setBusy("save");
    const r = await api(`/api/blog-auto/drafts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, slug, description, content_html: content, checks }),
    });
    setBusy(null);
    if (!r.ok) {
      alert(r.message);
      return false;
    }
    apply(r.draft, r.readiness);
    return true;
  }

  async function saveIfDirty() {
    return dirty ? save() : true;
  }

  async function waitRun(runId: number) {
    for (let i = 0; i < 100; i++) {
      await new Promise((res) => setTimeout(res, 3000));
      const r = await api(`/api/blog-auto/runs?id=${runId}`);
      const run = r.runs?.[0];
      if (run && run.status !== "running") {
        if (run.status === "failed") alert(`이미지 생성 실패: ${run.error}`);
        return;
      }
    }
  }

  async function generateImage(img: DraftImage) {
    if (!(await saveIfDirty())) return;
    setBusy(`img-${img.role}`);
    const r = await api(`/api/blog-auto/drafts/${id}/images`, { method: "POST", body: JSON.stringify({ role: img.role }) });
    if (!r.ok) {
      setBusy(null);
      return alert(r.message);
    }
    await waitRun(r.runId);
    setBusy(null);
    load();
  }

  async function uploadPhoto(img: DraftImage, file: File) {
    if (!(await saveIfDirty())) return;
    setBusy(`img-${img.role}`);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("role", img.role);
    const res = await fetch(`/api/blog-auto/drafts/${id}/images`, { method: "POST", body: fd });
    const r = await res.json().catch(() => ({ ok: false, message: "업로드 실패" }));
    setBusy(null);
    if (!r.ok) return alert(r.message);
    load();
  }

  async function patchImage(img: DraftImage, patch: Partial<DraftImage>) {
    if (!(await saveIfDirty())) return;
    const r = await api(`/api/blog-auto/drafts/${id}/images`, { method: "PATCH", body: JSON.stringify({ role: img.role, ...patch }) });
    if (!r.ok) return alert(r.message);
    load();
  }

  function insertImageAtCursor(img: DraftImage) {
    editorRef.current?.insertHtml(renderFigure(img));
  }

  async function publish() {
    if (!(await saveIfDirty())) return;
    const r0 = await api(`/api/blog-auto/drafts/${id}`);
    const rd: Readiness = r0.readiness;
    if (rd.blockers.length) {
      setReadiness(rd);
      return alert(`발행 전에 해결할 항목이 있습니다.\n\n- ${rd.blockers.join("\n- ")}`);
    }
    const warn = rd.warnings.length ? `\n\n참고:\n- ${rd.warnings.join("\n- ")}` : "";
    if (!confirm(`이 글을 블로그에 공개합니다.\n주소: https://strongboxing.kr/blog/${slug}\n분류: 복싱정보 · 사이트맵·블로그 목록에 바로 포함됩니다.${warn}\n\n발행할까요?`)) return;
    setBusy("publish");
    const r = await api(`/api/blog-auto/drafts/${id}/publish`, { method: "POST" });
    setBusy(null);
    if (!r.ok) return alert(`${r.message}${r.blockers ? `\n- ${r.blockers.join("\n- ")}` : ""}`);
    setPublished(r.slug);
    load();
  }

  async function discard() {
    if (!confirm("초안을 폐기할까요? 주제는 '보류'로 바뀌고 자동 실행에서 제외됩니다.")) return;
    const r = await api(`/api/blog-auto/drafts/${id}`, { method: "DELETE" });
    if (!r.ok) return alert(r.message);
    location.href = "/admin/blog-auto";
  }

  if (!draft) {
    return <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-500">불러오는 중...</main>;
  }

  const isPublished = draft.status === "published";
  const locked = draft.status === "discarded"; // 폐기된 글만 잠금 (발행 후에도 수정 허용)
  const imgLocked = draft.status === "discarded";

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <a href="/admin/blog-auto" className="inline-block text-zinc-500">← 자동화 목록으로</a>
        <div>
          <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">DRAFT #{draft.id}</p>
          <h1 className="text-4xl font-black tracking-[-0.05em]">초안 검토</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {isPublished ? "발행된 초안입니다. 공개 글 수정은 기존 블로그 관리(/admin)에서 할 수 있습니다." : draft.status === "discarded" ? "폐기된 초안입니다." : "수정 → 저장 → 미리보기로 확인한 뒤 발행하세요."}
            {draft.model && <span className="text-zinc-400"> · 작성: {draft.model === "manual-seed" ? "첫 결과물(수동 작성)" : draft.model}</span>}
          </p>
        </div>

        {published && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
            발행 완료 · <a href={`/blog/${published}`} target="_blank" className="underline">/blog/{published}</a>
          </div>
        )}

        {/* 발행 준비 상태 */}
        {readiness && !isPublished && (
          <section className={card}>
            <h2 className="mb-3 text-xl font-black">발행 준비</h2>
            {readiness.blockers.length === 0 ? (
              <p className="text-sm font-bold text-green-600">발행할 수 있습니다.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                {readiness.blockers.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
            {readiness.warnings.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-700">
                {readiness.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </section>
        )}

        {/* 기본 정보 */}
        <section className={`${card} space-y-4`}>
          <div>
            <label className="mb-1 flex justify-between text-sm font-bold">페이지 제목 <span className="font-normal text-zinc-400">{title.length}자 (55자 이내 권장)</span></label>
            <input disabled={locked} className={input} value={title} onChange={(e) => { setTitle(e.target.value); setDirty(true); }} />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-sm font-bold">메타 설명 <span className="font-normal text-zinc-400">{description.length}자 (80자 이내)</span></label>
            <textarea disabled={locked} rows={2} className={input} value={description} onChange={(e) => { setDescription(e.target.value); setDirty(true); }} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">고유 URL</label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">strongboxing.kr/blog/</span>
              <input disabled={locked} className={input} value={slug} onChange={(e) => { setSlug(e.target.value); setDirty(true); }} />
            </div>
          </div>
          <p className="text-xs text-zinc-400">분류: 복싱정보 · 지점: 전체(스트롱복싱) · 핵심 키워드: {draft.keyword}</p>
        </section>

        {/* 관리자 확인 사항 */}
        <section className={card}>
          <h2 className="mb-1 text-xl font-black">관리자 확인 사항</h2>
          <p className="mb-4 text-sm text-zinc-500">자동으로 확인할 수 없는 사실입니다. 모두 &apos;확인 완료&apos; 또는 &apos;본문 반영 안 함&apos;으로 바꿔야 발행할 수 있습니다.</p>
          {checks.length === 0 && <p className="text-sm text-zinc-400">없음</p>}
          <ul className="space-y-3">
            {checks.map((c, i) => (
              <li key={c.id} className={`rounded-2xl border p-4 ${c.status === "open" ? "border-amber-200 bg-amber-50" : "border-zinc-200"}`}>
                <p className="mb-2 text-sm">{c.text}</p>
                <div className="flex flex-col gap-2 md:flex-row">
                  <select
                    disabled={locked}
                    value={c.status}
                    onChange={(e) => {
                      const next = [...checks];
                      next[i] = { ...c, status: e.target.value as AdminCheck["status"] };
                      setChecks(next);
                      setDirty(true);
                    }}
                    className="rounded-xl border border-zinc-200 bg-white p-2 text-sm"
                  >
                    {Object.entries(CHECK_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <input
                    disabled={locked}
                    placeholder="메모 (확인 내용, 본문 수정 여부 등)"
                    value={c.note ?? ""}
                    onChange={(e) => {
                      const next = [...checks];
                      next[i] = { ...c, note: e.target.value };
                      setChecks(next);
                      setDirty(true);
                    }}
                    className={input}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 이미지 */}
        <section className={card}>
          <h2 className="mb-1 text-xl font-black">이미지</h2>
          <p className="mb-4 text-sm text-zinc-500">
            실제 수업·시설 사진이 있으면 사진을 올려 주세요. 생성 이미지는 &apos;일러스트&apos; 캡션과 ILLUSTRATION 표기가 붙습니다.
            기술 자세처럼 정확성이 필요한 이미지는 코치 검수 체크 전까지 발행 본문에서 빠집니다.
          </p>
          <div className="space-y-4">
            {draft.images.map((img) => {
              const inContent = hasFigure(content, img.role);
              return (
                <div key={img.role} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-white">{img.role === "cover" ? "대표 이미지" : `본문 ${img.role.slice(-1)}`}</span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1">{img.kind === "photo" ? "실제 사진" : "일러스트"}</span>
                    <span className={`rounded-full px-2.5 py-1 ${img.status === "ready" ? "bg-green-100 text-green-700" : img.status === "failed" ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-500"}`}>
                      {img.status === "ready" ? `준비됨 ${img.width}×${img.height} ${kb(img.bytes)}` : img.status === "failed" ? "실패" : "프롬프트만 있음"}
                    </span>
                    {img.needsCoachReview && (
                      <span className={`rounded-full px-2.5 py-1 ${img.coachApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {img.coachApproved ? "코치 검수 완료" : "코치 검수 필요"}
                      </span>
                    )}
                    {!inContent && <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-500">본문에 없음</span>}
                    <span className="text-zinc-400">{img.filename}</span>
                  </div>

                  {img.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.alt} className="mb-3 max-h-56 rounded-xl border border-zinc-200" />
                  )}
                  {img.error && <p className="mb-2 text-xs text-red-600">{img.error}</p>}

                  <div className="grid gap-2 md:grid-cols-2">
                    <input disabled={locked} className={input} defaultValue={img.alt} placeholder="대체 텍스트 (필수)" onBlur={(e) => e.target.value !== img.alt && patchImage(img, { alt: e.target.value })} />
                    <input disabled={locked} className={input} defaultValue={img.caption} placeholder="캡션 (선택)" onBlur={(e) => e.target.value !== img.caption && patchImage(img, { caption: e.target.value })} />
                  </div>
                  <textarea disabled={locked} rows={2} className={`${input} mt-2 text-xs text-zinc-500`} defaultValue={img.prompt} placeholder="생성 프롬프트" onBlur={(e) => e.target.value !== img.prompt && patchImage(img, { prompt: e.target.value })} />

                  {!imgLocked && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        disabled={!!busy || !imageModel}
                        title={imageModel ? "" : "이미지 생성 도구가 연결되어 있지 않습니다"}
                        onClick={() => generateImage(img)}
                        className={`${btn} bg-[#FC5230]/10 text-[#FC5230]`}
                      >
                        {busy === `img-${img.role}` ? "처리 중..." : img.url ? "일러스트 다시 생성" : "일러스트 생성"}
                      </button>
                      <label className={`${btn} cursor-pointer border border-zinc-200`}>
                        실제 사진 올리기
                        <input type="file" accept="image/*" className="hidden" disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(img, f); e.target.value = ""; }} />
                      </label>
                      {img.needsCoachReview && (
                        <label className="flex items-center gap-1.5 text-sm font-bold">
                          <input type="checkbox" checked={img.coachApproved} disabled={img.status !== "ready"} onChange={(e) => patchImage(img, { coachApproved: e.target.checked })} />
                          코치 검수 완료
                        </label>
                      )}
                      {!inContent && (
                        <button onClick={() => insertImageAtCursor(img)} className={`${btn} border border-zinc-200`}>커서 위치에 넣기</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 본문 */}
        <section className={card}>
          <h2 className="mb-1 text-xl font-black">본문</h2>
          <p className="mb-4 text-sm text-zinc-500">점선 상자는 미리보기용 이미지 자리이며 발행할 때 자동으로 빠집니다.</p>
          <div className={locked ? "pointer-events-none opacity-70" : ""}>
            <RichTextEditor ref={editorRef} value={content} onChange={(html) => { setContent(html); setDirty(true); }} />
          </div>
        </section>

        {/* 링크·중복 */}
        <section className={card}>
          <h2 className="mb-3 text-xl font-black">링크 확인</h2>
          <ul className="space-y-1 text-sm">
            {draft.link_report.map((l) => (
              <li key={l.href} className={l.ok ? "text-zinc-600" : "font-bold text-red-600"}>
                {l.ok ? "✓" : "✕"} {l.href} {l.reason && <span className="text-zinc-400">— {l.reason}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-400">저장할 때마다 다시 확인합니다. 블로그 글은 발행 여부, 지점·예약 페이지는 실제 경로 존재 여부를 봅니다.</p>

          <h2 className="mb-3 mt-6 text-xl font-black">비슷한 기존 글</h2>
          {draft.dup_report.length === 0 ? (
            <p className="text-sm text-zinc-500">겹치는 글이 없습니다.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {draft.dup_report.map((d) => (
                <li key={`${d.source}-${d.id}`} className="text-zinc-600">
                  {d.source === "post" ? "발행 글" : "초안"} · {d.title} <span className="text-zinc-400">(유사도 {d.score})</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 액션 */}
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-2 rounded-full border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          {!locked && (
            <button onClick={save} disabled={!!busy || !dirty} className={`${btn} bg-zinc-900 text-white`}>
              {busy === "save" ? "저장 중..." : dirty ? "저장" : "저장됨"}
            </button>
          )}
          <button
            onClick={async () => { if (await saveIfDirty()) window.open(`/admin/blog-auto/${id}/preview`, "_blank"); }}
            className={`${btn} border border-zinc-200`}
          >
            미리보기
          </button>
          {!locked && (
            <>
              <button onClick={publish} disabled={!!busy} className={`${btn} bg-[#FC5230] text-white`}>
                {busy === "publish" ? "발행 중..." : "발행"}
              </button>
              <button onClick={discard} disabled={!!busy} className={`${btn} ml-auto text-zinc-400`}>폐기</button>
            </>
          )}
          {isPublished && (
            <>
              <button
                disabled={!!busy}
                onClick={async () => {
                  setBusy("sync");
                  const r = await api(`/api/blog-auto/drafts/${id}/sync`, { method: "POST" });
                  setBusy(null);
                  if (!r.ok) return alert(r.message);
                  alert("블로그에 동기화됐습니다.");
                }}
                className={`${btn} border border-green-600 text-green-600`}
              >
                {busy === "sync" ? "동기화 중..." : "블로그에 동기화"}
              </button>
              <a href={`/blog/${draft.slug}`} target="_blank" className={`${btn} bg-green-600 text-white`}>공개 글 보기</a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
