"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TopicRow = {
  id: number;
  title: string;
  keyword: string;
  audience: string;
  status: string;
  priority: number;
  memo: string | null;
  draft_id: number | null;
  draft_status: string | null;
  draft_slug: string | null;
};

type DraftRow = {
  id: number;
  topic_title: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "discarded";
  openChecks: number;
  brokenLinks: number;
  images: { role: string; status: string; needsCoachReview: boolean; coachApproved: boolean }[];
  model: string | null;
  updated_at: string;
};

type RunRow = {
  id: number;
  trigger_type: string;
  topic_title?: string | null;
  draft_id: number | null;
  status: "running" | "success" | "failed" | "skipped";
  attempts: number;
  error: string | null;
  log: { at: string; level: string; msg: string }[];
  usage: any;
  started_at: string;
  finished_at: string | null;
};

type Status = {
  openaiConfigured: boolean;
  textModel: string;
  imageModel: string | null;
  imageQuality: string;
  cronEnabled: boolean;
  pendingDrafts: number;
  maxPendingDrafts: number;
};

const card = "rounded-[28px] border border-zinc-200 bg-white p-6";
const btn = "rounded-full px-5 py-2.5 text-sm font-black transition disabled:opacity-40";
const input = "w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-[#FC5230]";

const STATUS_COLOR: Record<string, string> = {
  미작성: "bg-zinc-100 text-zinc-600",
  작성중: "bg-amber-100 text-amber-700",
  초안: "bg-sky-100 text-sky-700",
  발행: "bg-green-100 text-green-700",
  보류: "bg-zinc-200 text-zinc-500",
  실패: "bg-red-100 text-red-600",
  running: "bg-amber-100 text-amber-700",
  success: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  skipped: "bg-zinc-100 text-zinc-500",
  draft: "bg-sky-100 text-sky-700",
  published: "bg-green-100 text-green-700",
  discarded: "bg-zinc-200 text-zinc-500",
};

const DRAFT_LABEL: Record<string, string> = { draft: "검토 대기", published: "발행됨", discarded: "폐기" };
const TRIGGER_LABEL: Record<string, string> = { manual: "버튼", schedule: "예약", regenerate: "재생성", image: "이미지" };

function Badge({ s, label }: { s: string; label?: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-black ${STATUS_COLOR[s] ?? "bg-zinc-100"}`}>{label ?? s}</span>;
}

async function api(url: string, init?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  return res.json().catch(() => ({ ok: false, message: `응답 오류 (${res.status})` }));
}

export default function BlogAutoPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [facts, setFacts] = useState("");
  const [factsSaved, setFactsSaved] = useState(true);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [error, setError] = useState("");
  const [activeRun, setActiveRun] = useState<RunRow | null>(null);
  const [openRun, setOpenRun] = useState<number | null>(null);
  const [newTopic, setNewTopic] = useState({ title: "", keyword: "", audience: "", priority: "100" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const factsSavedRef = useRef(true);
  useEffect(() => {
    factsSavedRef.current = factsSaved;
  }, [factsSaved]);


  const loadAll = useCallback(async () => {
    const [s, t, d, r] = await Promise.all([
      api("/api/blog-auto/settings"),
      api("/api/blog-auto/topics"),
      api("/api/blog-auto/drafts"),
      api("/api/blog-auto/runs"),
    ]);
    if (!s.ok) {
      setError(s.message || "불러오기 실패");
      return;
    }
    setError("");
    setStatus(s.status);
    setFacts((prev) => (factsSavedRef.current ? s.verifiedFacts : prev));
    if (t.ok) setTopics(t.topics);
    if (d.ok) setDrafts(d.drafts);
    if (r.ok) {
      setRuns(r.runs);
      const running = r.runs.find((x: RunRow) => x.status === "running");
      if (running) watchRun(running.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAll();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadAll]);

  function watchRun(runId: number) {
    if (pollRef.current) clearInterval(pollRef.current);
    const tick = async () => {
      const r = await api(`/api/blog-auto/runs?id=${runId}`);
      const run: RunRow | undefined = r.runs?.[0];
      if (!run) return;
      setActiveRun(run);
      if (run.status !== "running") {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        loadAll();
      }
    };
    tick();
    pollRef.current = setInterval(tick, 3000);
  }

  async function startRun(opts: { topicId?: number; force?: boolean } = {}) {
    if (opts.force && !confirm("이 주제의 초안을 새로 생성합니다. 기존 초안(수정 내용 포함)은 덮어씁니다. 계속할까요?")) return;
    const r = await api("/api/blog-auto/run", { method: "POST", body: JSON.stringify(opts) });
    if (!r.ok) return alert(r.message);
    watchRun(r.runId);
  }

  async function saveFacts() {
    const r = await api("/api/blog-auto/settings", { method: "PUT", body: JSON.stringify({ verifiedFacts: facts }) });
    if (!r.ok) return alert(r.message);
    setFactsSaved(true);
  }

  async function addTopic(force = false) {
    const r = await api("/api/blog-auto/topics", { method: "POST", body: JSON.stringify({ ...newTopic, force }) });
    if (r.needConfirm) {
      const list = r.similar.map((s: any) => `- ${s.title} (${s.source === "post" ? "발행 글" : "주제"}, 유사도 ${s.score.toFixed(2)})`).join("\n");
      if (confirm(`비슷한 주제·글이 있습니다.\n${list}\n\n그래도 등록할까요?`)) return addTopic(true);
      return;
    }
    if (!r.ok) return alert(r.message);
    setNewTopic({ title: "", keyword: "", audience: "", priority: "100" });
    loadAll();
  }

  async function updateTopic(id: number, patch: Partial<TopicRow>) {
    const r = await api("/api/blog-auto/topics", { method: "PUT", body: JSON.stringify({ id, ...patch }) });
    if (!r.ok) return alert(r.message);
    loadAll();
  }

  async function deleteTopic(id: number) {
    if (!confirm("주제를 삭제할까요?")) return;
    const r = await api("/api/blog-auto/topics", { method: "DELETE", body: JSON.stringify({ id }) });
    if (!r.ok) return alert(r.message);
    loadAll();
  }

  const running = activeRun?.status === "running";

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <a href="/admin" className="inline-block text-zinc-500">← 관리자 메인으로</a>
        <div>
          <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">BLOG AUTO</p>
          <h1 className="mb-3 text-5xl font-black tracking-[-0.06em]">복싱 정보 글 자동화</h1>
          <p className="text-zinc-500">
            주제를 골라 초안을 만들고, 검토한 뒤 직접 발행합니다. 초안은 발행 전까지 블로그·사이트맵에 나오지 않습니다.
          </p>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}

        {/* 연결 상태 + 실행 */}
        <section className={card}>
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5 text-sm">
              <p className="font-black">연결 상태</p>
              <p>
                글 생성 · {status?.openaiConfigured ? <b className="text-green-600">OpenAI 연결됨</b> : <b className="text-red-500">OPENAI_API_KEY 없음</b>}
                <span className="text-zinc-400"> ({status?.textModel})</span>
              </p>
              <p>
                이미지 생성 ·{" "}
                {status?.imageModel ? (
                  <b className="text-green-600">{status.imageModel} ({status.imageQuality})</b>
                ) : (
                  <b className="text-zinc-500">꺼짐 — 생성 프롬프트와 삽입 위치만 초안에 남김</b>
                )}
              </p>
              <p>
                예약 실행 · {status?.cronEnabled ? <b className="text-green-600">사용 가능</b> : <b className="text-zinc-500">꺼짐 (BLOG_AUTO_CRON_SECRET 미설정)</b>}
              </p>
              <p className="text-zinc-500">
                검토 대기 초안 {status?.pendingDrafts ?? 0}개 · 예약 실행은 {status?.maxPendingDrafts ?? 4}개 이상 쌓이면 건너뜀
              </p>
            </div>
            <button
              onClick={() => startRun()}
              disabled={running || !status?.openaiConfigured}
              className={`${btn} bg-[#FC5230] px-8 py-4 text-base text-white`}
            >
              {running ? "생성 중..." : "초안 1개 생성"}
            </button>
          </div>

          {activeRun && (
            <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2">
                <Badge s={activeRun.status} />
                <span className="font-bold">실행 #{activeRun.id}</span>
                {activeRun.draft_id && activeRun.status !== "running" && (
                  <a href={`/admin/blog-auto/${activeRun.draft_id}`} className="font-black text-[#FC5230] underline">초안 열기</a>
                )}
              </div>
              <ul className="space-y-1">
                {activeRun.log.map((l, i) => (
                  <li key={i} className={l.level === "error" ? "text-red-600" : l.level === "warn" ? "text-amber-700" : "text-zinc-600"}>
                    {new Date(l.at).toLocaleTimeString("ko-KR")} · {l.msg}
                  </li>
                ))}
              </ul>
              {activeRun.error && <p className="mt-2 font-bold text-red-600">{activeRun.error}</p>}
            </div>
          )}
        </section>

        {/* 초안 */}
        <section className={card}>
          <h2 className="mb-4 text-2xl font-black">초안</h2>
          {drafts.length === 0 ? (
            <p className="text-sm text-zinc-500">아직 초안이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {drafts.map((d) => {
                const imgReady = d.images.filter((i) => i.status === "ready").length;
                const coach = d.images.filter((i) => i.needsCoachReview && !i.coachApproved).length;
                return (
                  <li key={d.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge s={d.status} label={DRAFT_LABEL[d.status]} />
                        {d.status === "draft" && d.openChecks > 0 && (
                          <span className="text-xs font-bold text-amber-700">확인 사항 {d.openChecks}</span>
                        )}
                        {d.status === "draft" && d.brokenLinks > 0 && <span className="text-xs font-bold text-red-600">링크 오류 {d.brokenLinks}</span>}
                        <span className="text-xs text-zinc-400">
                          이미지 {imgReady}/{d.images.length}
                          {coach ? ` · 코치 검수 대기 ${coach}` : ""}
                        </span>
                      </div>
                      <p className="truncate font-bold">{d.title}</p>
                      <p className="text-xs text-zinc-400">/blog/{d.slug} · {new Date(d.updated_at).toLocaleString("ko-KR")}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <a href={`/admin/blog-auto/${d.id}/preview`} target="_blank" className={`${btn} border border-zinc-200`}>미리보기</a>
                      {d.status === "published" ? (
                        <a href={`/blog/${d.slug}`} target="_blank" className={`${btn} bg-green-600 text-white`}>공개 글</a>
                      ) : (
                        <a href={`/admin/blog-auto/${d.id}`} className={`${btn} bg-zinc-900 text-white`}>검토·수정</a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* 주제 */}
        <section className={card}>
          <h2 className="mb-1 text-2xl font-black">주제 목록</h2>
          <p className="mb-5 text-sm text-zinc-500">
            &apos;초안 1개 생성&apos;은 우선순위가 가장 높은(숫자가 작은) 미작성 주제를 고릅니다. 지역명만 바꾼 주제는 등록되지 않습니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-zinc-400">
                <tr>
                  <th className="py-2 pr-2">순서</th>
                  <th className="py-2 pr-2">제목 / 독자</th>
                  <th className="py-2 pr-2">핵심 키워드</th>
                  <th className="py-2 pr-2">상태</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {topics.map((t) => (
                  <tr key={t.id} className="align-top">
                    <td className="py-3 pr-2">
                      <input
                        defaultValue={t.priority}
                        onBlur={(e) => Number(e.target.value) !== t.priority && updateTopic(t.id, { priority: Number(e.target.value) })}
                        className="w-14 rounded-lg border border-zinc-200 p-1.5 text-center"
                      />
                    </td>
                    <td className="py-3 pr-2">
                      <p className="font-bold">{t.title}</p>
                      <p className="text-xs text-zinc-400">{t.audience}</p>
                      {t.memo && <p className="mt-1 whitespace-pre-line text-xs text-amber-700">{t.memo.trim()}</p>}
                    </td>
                    <td className="py-3 pr-2 text-zinc-600">{t.keyword}</td>
                    <td className="py-3 pr-2">
                      <Badge s={t.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {(t.status === "미작성" || t.status === "실패") && (
                          <button disabled={running} onClick={() => startRun({ topicId: t.id })} className={`${btn} bg-[#FC5230]/10 text-[#FC5230]`}>
                            이 주제로 생성
                          </button>
                        )}
                        {(t.status === "초안" || t.status === "보류") && (
                          <button disabled={running} onClick={() => startRun({ topicId: t.id, force: true })} className={`${btn} border border-zinc-200`}>
                            다시 생성
                          </button>
                        )}
                        {t.status === "보류" && (
                          <button onClick={() => updateTopic(t.id, { status: "미작성", memo: null })} className={`${btn} border border-zinc-200`}>
                            미작성으로
                          </button>
                        )}
                        {t.status === "미작성" && (
                          <button onClick={() => updateTopic(t.id, { status: "보류" })} className={`${btn} border border-zinc-200`}>
                            보류
                          </button>
                        )}
                        {t.draft_id && (
                          <a href={`/admin/blog-auto/${t.draft_id}`} className={`${btn} border border-zinc-200`}>초안</a>
                        )}
                        {!t.draft_id && t.status !== "작성중" && (
                          <button onClick={() => deleteTopic(t.id)} className={`${btn} text-zinc-400`}>삭제</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-2 rounded-2xl bg-zinc-50 p-4 md:grid-cols-[2fr_1.2fr_1.5fr_70px_auto]">
            <input className={input} placeholder="제목 (예: 복싱 줄넘기 처음 할 때)" value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} />
            <input className={input} placeholder="핵심 키워드" value={newTopic.keyword} onChange={(e) => setNewTopic({ ...newTopic, keyword: e.target.value })} />
            <input className={input} placeholder="독자" value={newTopic.audience} onChange={(e) => setNewTopic({ ...newTopic, audience: e.target.value })} />
            <input className={input} placeholder="순서" value={newTopic.priority} onChange={(e) => setNewTopic({ ...newTopic, priority: e.target.value })} />
            <button onClick={() => addTopic()} className={`${btn} bg-zinc-900 text-white`}>주제 추가</button>
          </div>
        </section>

        {/* 확인된 운영 정보 */}
        <section className={card}>
          <h2 className="mb-1 text-2xl font-black">확인된 운영 정보</h2>
          <p className="mb-4 text-sm text-zinc-500">
            여기에 적은 내용만 글에서 &apos;스트롱복싱에서는&apos;으로 씁니다. 수업 방식·가격·운영시간·코치 자격·단증 심사처럼 확인된 사실만 한 줄씩 적어 주세요.
            비어 있으면 일반 정보만 쓰고, 확인이 필요한 내용은 초안의 관리자 확인 사항으로 남깁니다.
          </p>
          <textarea
            value={facts}
            onChange={(e) => {
              setFacts(e.target.value);
              setFactsSaved(false);
            }}
            rows={7}
            placeholder={"예)\n- 첫 수업은 코치가 기본자세를 개별로 잡아 준다\n- 글러브·핸드랩 대여 가능 (전 지점)\n- 스파링은 희망자만 진행"}
            className={`${input} font-mono`}
          />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={saveFacts} disabled={factsSaved} className={`${btn} bg-zinc-900 text-white`}>저장</button>
            {!factsSaved && <span className="text-xs font-bold text-amber-700">저장되지 않은 변경</span>}
          </div>
        </section>

        {/* 실행 기록 */}
        <section className={card}>
          <h2 className="mb-4 text-2xl font-black">실행 기록</h2>
          {runs.length === 0 ? (
            <p className="text-sm text-zinc-500">실행 기록이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 text-sm">
              {runs.map((r) => (
                <li key={r.id} className="py-3">
                  <button onClick={() => setOpenRun(openRun === r.id ? null : r.id)} className="flex w-full flex-wrap items-center gap-2 text-left">
                    <Badge s={r.status} />
                    <span className="font-bold">#{r.id}</span>
                    <span className="text-zinc-500">{TRIGGER_LABEL[r.trigger_type] ?? r.trigger_type}</span>
                    <span className="truncate">{r.topic_title ?? ""}</span>
                    <span className="ml-auto text-xs text-zinc-400">{new Date(r.started_at).toLocaleString("ko-KR")}</span>
                  </button>
                  {r.error && <p className="mt-1 text-xs font-bold text-red-600">{r.error}</p>}
                  {openRun === r.id && (
                    <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-xs">
                      {r.log.map((l, i) => (
                        <p key={i} className={l.level === "error" ? "text-red-600" : l.level === "warn" ? "text-amber-700" : "text-zinc-600"}>
                          {new Date(l.at).toLocaleTimeString("ko-KR")} · {l.msg}
                        </p>
                      ))}
                      {r.usage && (
                        <p className="mt-2 text-zinc-400">
                          사용량: {r.usage.model ?? ""} 입력 {r.usage.input_tokens ?? 0} / 출력 {r.usage.output_tokens ?? 0} 토큰
                          {r.usage.images ? ` · 이미지 ${r.usage.images}장` : ""}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 예약 실행 안내 */}
        <section className={`${card} text-sm leading-7 text-zinc-600`}>
          <h2 className="mb-2 text-2xl font-black text-zinc-900">주 2회 예약 실행</h2>
          <p>
            서버 환경변수에 <code className="rounded bg-zinc-100 px-1">BLOG_AUTO_CRON_SECRET</code>을 설정하면 아래 주소로 초안을 만들 수 있습니다.
            예약 실행은 초안까지만 만들고 발행하지 않습니다.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-xs text-zinc-100">
{`# 서버 crontab 예시 — 월·목 오전 9시 (KST)
0 9 * * 1,4 curl -s -X POST -H "Authorization: Bearer $BLOG_AUTO_CRON_SECRET" https://strongboxing.kr/api/blog-auto/cron`}
          </pre>
        </section>
      </div>
    </main>
  );
}
