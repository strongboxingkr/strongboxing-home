"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FACT_FIELDS,
  FACT_LABEL,
  type BlogRef,
  type Branch,
  type BranchSlug,
  type DraftRecord,
  type KeywordLookup,
  type ScoredKeyword,
} from "@/lib/naver-planner/types";

type Env = { searchAd: boolean; blogSearch: boolean; openai: boolean };
type Lookup = Omit<KeywordLookup, "rows"> & { rows: ScoredKeyword[] };
type DraftItem = Pick<DraftRecord, "id" | "branch_slug" | "keyword" | "angle" | "first_title" | "created_at">;

const card = "rounded-[28px] border border-zinc-200 bg-white p-6";
const btn = "rounded-full px-5 py-2.5 text-sm font-black transition disabled:opacity-40";
const input = "w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-[#FC5230]";
const primary = `${btn} bg-[#FC5230] text-white`;
const ghost = `${btn} border border-zinc-300 bg-white text-zinc-700`;

function kst(iso: string | null | undefined) {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
}

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const json = await res.json().catch(() => ({ ok: false, message: `HTTP ${res.status}` }));
  if (!json.ok) throw new Error(json.message || "요청 실패");
  return json;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function CopyBtn({ text, label = "복사" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`${btn} shrink-0 border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700`}
      onClick={async () => {
        await copy(text);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? "복사됨" : label}
    </button>
  );
}

function FactBadge({ branch, f }: { branch: Branch; f: (typeof FACT_FIELDS)[number] }) {
  const v = String(branch[f] ?? "").trim();
  if (!v) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-600">입력 필요</span>;
  if (!branch.verified?.[f]) return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700">확인 필요</span>;
  return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-black text-green-700">확인됨</span>;
}

function bodyText(d: DraftRecord) {
  let n = 0;
  return d.result.blocks
    .map((b) => (b.kind === "photo" ? `[사진 ${++n}] ${b.text}` : b.kind === "heading" ? `\n${b.text}` : b.text))
    .join("\n\n")
    .trim();
}

function fullText(d: DraftRecord) {
  return [bodyText(d), d.result.cta, d.infoBlock, d.result.hashtags.map((h) => `#${h}`).join(" ")].join("\n\n");
}

export default function NaverPlannerPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [env, setEnv] = useState<Env | null>(null);
  const [angles, setAngles] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [slug, setSlug] = useState<BranchSlug>("gaebong");
  const [error, setError] = useState("");

  // 지점 정보
  const [form, setForm] = useState<Branch | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // 키워드
  const [hintsText, setHintsText] = useState("");
  const [includeCombos, setIncludeCombos] = useState(true);
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [history, setHistory] = useState<{ id: number; hints: string; fetched_at: string }[]>([]);
  const [filter, setFilter] = useState<"rec" | "region" | "all">("rec");
  const [looking, setLooking] = useState(false);
  const [mainKw, setMainKw] = useState("");
  const [subKws, setSubKws] = useState<string[]>([]);

  // 블로그 검색
  const [query, setQuery] = useState("");
  const [refs, setRefs] = useState<BlogRef[]>([]);
  const [refsAt, setRefsAt] = useState("");
  const [refOn, setRefOn] = useState<Record<string, boolean>>({});
  const [searching, setSearching] = useState(false);

  // 초안
  const [angle, setAngle] = useState("");
  const [memo, setMemo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);

  const branch = branches.find((b) => b.slug === slug) ?? null;
  const nameOf = (s: string) => branches.find((b) => b.slug === s)?.name ?? s;

  const loadDrafts = useCallback(async () => {
    const j = await api<{ drafts: DraftItem[] }>("/api/naver-planner/drafts");
    setDrafts(j.drafts);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const j = await api("/api/naver-planner/branches");
        setBranches(j.branches);
        setEnv(j.env);
        setAngles(j.angles);
        setAngle(j.angles[0] ?? "");
        setModel(j.model);
        await loadDrafts();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [loadDrafts]);

  // 지점 바꾸면 단계별 상태 초기화
  useEffect(() => {
    if (!branch) return;
    setForm(branch);
    setEditing(false);
    setHintsText(
      branch.region_terms
        .split(",")
        .map((s) => s.replace(/\s+/g, ""))
        .filter(Boolean)
        .slice(0, 5)
        .map((r) => `${r}복싱`)
        .join(", ")
    );
    setLookup(null);
    setMainKw("");
    setSubKws([]);
    setRefs([]);
    setQuery("");
    setDraft(null);
    api(`/api/naver-planner/keywords?branch=${slug}`)
      .then((j) => setHistory(j.history))
      .catch(() => setHistory([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, branches.length]);

  async function saveBranch() {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const j = await api("/api/naver-planner/branches", { method: "PUT", body: JSON.stringify(form) });
      setBranches((bs) => bs.map((b) => (b.slug === j.branch.slug ? j.branch : b)));
      setForm(j.branch);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function runLookup() {
    setLooking(true);
    setError("");
    try {
      const hints = hintsText.split(",").map((s) => s.trim()).filter(Boolean);
      const j = await api("/api/naver-planner/keywords", {
        method: "POST",
        body: JSON.stringify({ branch: slug, hints, includeCombos }),
      });
      setLookup(j.lookup);
      setMainKw("");
      setSubKws([]);
      const h = await api(`/api/naver-planner/keywords?branch=${slug}`);
      setHistory(h.history);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLooking(false);
    }
  }

  async function loadLookup(id: number) {
    setError("");
    try {
      const j = await api(`/api/naver-planner/keywords?id=${id}`);
      setLookup(j.lookup);
      setMainKw("");
      setSubKws([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function pickMain(k: string) {
    setMainKw(k);
    setSubKws((s) => s.filter((x) => x !== k));
    setQuery(k);
  }

  async function searchBlogs() {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    try {
      const j = await api(`/api/naver-planner/blog-search?query=${encodeURIComponent(query.trim())}`);
      setRefs(j.items);
      setRefsAt(j.fetched_at);
      setRefOn(Object.fromEntries(j.items.map((r: BlogRef) => [r.link, true])));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSearching(false);
    }
  }

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const j = await api("/api/naver-planner/drafts", {
        method: "POST",
        body: JSON.stringify({
          branch: slug,
          keyword: mainKw,
          subKeywords: subKws,
          angle,
          memo,
          references: refs.filter((r) => refOn[r.link]),
          lookupId: lookup?.id,
        }),
      });
      setDraft(j.draft);
      await loadDrafts();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
    }
  }

  async function openDraft(id: number) {
    try {
      const j = await api(`/api/naver-planner/drafts?id=${id}`);
      setDraft(j.draft);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function removeDraft(id: number) {
    if (!confirm("이 초안을 삭제할까요?")) return;
    await api(`/api/naver-planner/drafts?id=${id}`, { method: "DELETE" });
    if (draft?.id === id) setDraft(null);
    await loadDrafts();
  }

  const rows = useMemo(() => {
    if (!lookup) return [];
    if (filter === "rec") return lookup.rows.filter((r) => r.recommended);
    if (filter === "region") return lookup.rows.filter((r) => r.regionMatch);
    return lookup.rows;
  }, [lookup, filter]);

  const missing = branch ? FACT_FIELDS.filter((f) => !String(branch[f] ?? "").trim() || !branch.verified?.[f]) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <a href="/admin" className="mb-6 inline-block text-sm font-black text-zinc-500">
        ← 관리자 메인
      </a>
      <p className="mb-2 text-sm font-black tracking-[0.3em] text-[#FC5230]">NAVER BLOG PLANNER</p>
      <h1 className="mb-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">지점 블로그 작성 도우미</h1>
      <p className="mb-6 text-sm text-zinc-500">
        키워드 검색량 조회 → 키워드 추천 → 블로그 검색 결과 참고 → 초안 작성. 자동 발행은 하지 않습니다. 검토 후 복사해서 사용하세요.
      </p>

      {env && (
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-black">
          {[
            ["검색광고 API", env.searchAd],
            ["블로그 검색 API", env.blogSearch],
            [`OpenAI (${model})`, env.openai],
          ].map(([label, ok]) => (
            <span key={String(label)} className={`rounded-full px-3 py-1 ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {label} {ok ? "설정됨" : "환경변수 없음"}
            </span>
          ))}
        </div>
      )}

      {error && <div className="mb-6 whitespace-pre-wrap rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</div>}

      {/* 1. 지점 선택 */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-4 text-xl font-black">1. 지점 선택</h2>
        <div className="mb-5 flex flex-wrap gap-2">
          {branches.map((b) => (
            <button key={b.slug} onClick={() => setSlug(b.slug)} className={b.slug === slug ? primary : ghost}>
              {b.name}
            </button>
          ))}
        </div>

        {branch && form && !editing && (
          <div className="space-y-2 text-sm">
            {FACT_FIELDS.map((f) => (
              <div key={f} className="flex flex-wrap items-center gap-2">
                <span className="w-20 shrink-0 font-black text-zinc-500">{FACT_LABEL[f]}</span>
                <FactBadge branch={branch} f={f} />
                <span className="break-all text-zinc-700">{branch[f] || "—"}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <span className="w-20 shrink-0 font-black text-zinc-500">지역어</span>
              <span>{branch.region_terms || "—"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="w-20 shrink-0 font-black text-zinc-500">지점 특징</span>
              <span className="whitespace-pre-wrap">{branch.local_notes || <span className="text-red-600">입력 필요 — 비어 있으면 시설·분위기 묘사 없이 작성됩니다</span>}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="w-20 shrink-0 font-black text-zinc-500">주제 방향</span>
              <span className="whitespace-pre-wrap">{branch.angle_notes || "—"}</span>
            </div>
            {missing.length > 0 && (
              <p className="pt-2 text-xs text-zinc-500">
                “확인됨”이 아닌 항목({missing.map((f) => FACT_LABEL[f]).join(", ")})은 초안에 구체 값이 들어가지 않고 [입력 필요]/[확인 필요]로 표시됩니다.
              </p>
            )}
            <button className={`${ghost} mt-3`} onClick={() => setEditing(true)}>
              지점 정보 수정
            </button>
          </div>
        )}

        {form && editing && (
          <div className="space-y-4">
            {FACT_FIELDS.map((f) => (
              <div key={f}>
                <div className="mb-1 flex items-center gap-3">
                  <label className="text-sm font-black">{FACT_LABEL[f]}</label>
                  <label className="flex items-center gap-1 text-xs font-bold text-zinc-600">
                    <input
                      type="checkbox"
                      checked={!!form.verified?.[f]}
                      onChange={(e) => setForm({ ...form, verified: { ...form.verified, [f]: e.target.checked } })}
                    />
                    확인됨
                  </label>
                </div>
                {f === "price" ? (
                  <textarea
                    className={input}
                    rows={3}
                    value={form.price}
                    placeholder="예: 1개월 ○○원 / 3개월 ○○원 (확인된 금액만)"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                ) : (
                  <input className={input} value={String(form[f] ?? "")} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                )}
              </div>
            ))}
            <div>
              <label className="mb-1 block text-sm font-black">지역어 (쉼표 구분, 키워드 조회에 사용)</label>
              <input className={input} value={form.region_terms} onChange={(e) => setForm({ ...form, region_terms: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-black">지점 특징 (직접 확인한 사실만: 위치·주차·시설·장비·코치 구성 등)</label>
              <textarea className={input} rows={4} value={form.local_notes} onChange={(e) => setForm({ ...form, local_notes: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-black">이 지점 글의 주제 방향 (다른 지점과 겹치지 않게)</label>
              <textarea className={input} rows={2} value={form.angle_notes} onChange={(e) => setForm({ ...form, angle_notes: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button className={primary} disabled={saving} onClick={saveBranch}>
                {saving ? "저장 중…" : "저장"}
              </button>
              <button
                className={ghost}
                onClick={() => {
                  setForm(branch);
                  setEditing(false);
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2~3. 키워드 */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-1 text-xl font-black">2. 연관 키워드 · 월간 검색량 (네이버 검색광고 API)</h2>
        <p className="mb-4 text-xs text-zinc-500">
          검색량은 API가 준 값 그대로 표시합니다. “&lt; 10”은 API가 10 미만이라고만 알려준 값입니다. 조회에 실패한 값은 표시하지 않습니다.
        </p>
        <label className="mb-1 block text-sm font-black">힌트 키워드 (쉼표 구분, 공백은 자동 제거, 최대 10개)</label>
        <input className={`${input} mb-2`} value={hintsText} onChange={(e) => setHintsText(e.target.value)} />
        <label className="mb-4 flex items-center gap-2 text-sm font-bold text-zinc-600">
          <input type="checkbox" checked={includeCombos} onChange={(e) => setIncludeCombos(e.target.checked)} />
          지역어+복싱+목적어 조합(체험·가격·초보·여자 등 최대 10개)도 직접 조회
        </label>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button className={primary} disabled={looking || !env?.searchAd} onClick={runLookup}>
            {looking ? "조회 중…" : "검색량 조회"}
          </button>
          {history.length > 0 && (
            <select className="rounded-full border border-zinc-300 px-4 py-2 text-sm" value="" onChange={(e) => e.target.value && loadLookup(Number(e.target.value))}>
              <option value="">이전 조회 불러오기</option>
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {kst(h.fetched_at)} · {h.hints.slice(0, 40)}
                </option>
              ))}
            </select>
          )}
        </div>

        {lookup && (
          <>
            <div className="mb-3 rounded-2xl bg-zinc-50 p-3 text-sm">
              <b>조회일시:</b> {kst(lookup.fetched_at)} (네이버 검색광고 API, 최근 30일 기준 월간 조회수)
              {lookup.errors.length > 0 && <div className="mt-2 whitespace-pre-wrap text-red-600">일부 조회 실패: {lookup.errors.join("\n")}</div>}
              {lookup.notReturned.length > 0 && (
                <div className="mt-2 text-zinc-500">API가 검색량을 주지 않은 조합 (값 없음): {lookup.notReturned.join(", ")}</div>
              )}
            </div>

            <h3 className="mb-2 mt-5 text-lg font-black">3. 방문·체험·등록 가능성 기준 추천</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {(
                [
                  ["rec", `추천 (${lookup.rows.filter((r) => r.recommended).length})`],
                  ["region", `지역 포함 (${lookup.rows.filter((r) => r.regionMatch).length})`],
                  ["all", `전체 (${lookup.rows.length})`],
                ] as const
              ).map(([k, label]) => (
                <button key={k} className={filter === k ? `${btn} bg-zinc-900 text-white` : ghost} onClick={() => setFilter(k)}>
                  {label}
                </button>
              ))}
            </div>
            <p className="mb-3 text-xs text-zinc-500">핵심 키워드 1개를 고르고, 보조 키워드는 여러 개 체크할 수 있습니다. 추천 점수는 규칙 기반이며 이유를 함께 표시합니다.</p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-zinc-500">
                    <th className="p-2">핵심</th>
                    <th className="p-2">보조</th>
                    <th className="p-2">키워드</th>
                    <th className="p-2 text-right">PC</th>
                    <th className="p-2 text-right">모바일</th>
                    <th className="p-2">경쟁</th>
                    <th className="p-2 text-right">점수</th>
                    <th className="p-2">이유</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.keyword} className={`border-b align-top ${mainKw === r.keyword ? "bg-orange-50" : ""}`}>
                      <td className="p-2">
                        <input type="radio" name="main" checked={mainKw === r.keyword} onChange={() => pickMain(r.keyword)} />
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          disabled={mainKw === r.keyword}
                          checked={subKws.includes(r.keyword)}
                          onChange={(e) => setSubKws((s) => (e.target.checked ? [...s, r.keyword] : s.filter((x) => x !== r.keyword)))}
                        />
                      </td>
                      <td className="p-2 font-black">
                        {r.keyword}
                        {r.source === "direct" && <span className="ml-1 rounded bg-sky-100 px-1.5 text-[10px] text-sky-700">직접조회</span>}
                        {r.recommended && <span className="ml-1 rounded bg-orange-100 px-1.5 text-[10px] text-[#FC5230]">추천</span>}
                      </td>
                      <td className="p-2 text-right tabular-nums">{r.pc.raw}</td>
                      <td className="p-2 text-right tabular-nums">{r.mobile.raw}</td>
                      <td className="p-2">{r.compIdx || "-"}</td>
                      <td className="p-2 text-right tabular-nums">{r.score}</td>
                      <td className="p-2 text-xs text-zinc-600">
                        <ul className="list-disc pl-4">
                          {r.reasons.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-zinc-500">
                        해당 조건의 키워드가 없습니다. 필터를 바꾸거나 힌트 키워드를 바꿔 다시 조회하세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* 4. 블로그 검색 */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-1 text-xl font-black">4. 네이버 블로그 검색 결과 참고</h2>
        <p className="mb-4 text-xs text-zinc-500">
          검색 API가 주는 제목·요약(일부 문장)·링크만 확인합니다. 블로그 본문 전체는 가져오거나 분석하지 않습니다. 초안에는 체크한 결과만 “겹치지 않게” 참고로 전달됩니다.
        </p>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input className={input} value={query} placeholder="핵심 키워드를 고르면 자동 입력됩니다" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchBlogs()} />
          <button className={`${primary} shrink-0`} disabled={searching || !env?.blogSearch || !query.trim()} onClick={searchBlogs}>
            {searching ? "검색 중…" : "블로그 검색"}
          </button>
        </div>
        {refs.length > 0 && (
          <>
            <p className="mb-2 text-xs text-zinc-500">
              조회: {kst(refsAt)} · “{query}” 관련도순 {refs.length}건
            </p>
            <ul className="space-y-3">
              {refs.map((r) => (
                <li key={r.link} className="flex gap-3 rounded-2xl border border-zinc-100 p-3">
                  <input type="checkbox" className="mt-1" checked={!!refOn[r.link]} onChange={(e) => setRefOn({ ...refOn, [r.link]: e.target.checked })} />
                  <div className="min-w-0">
                    <a href={r.link} target="_blank" rel="noreferrer" className="font-black text-zinc-900 underline-offset-2 hover:underline">
                      {r.title}
                    </a>
                    <p className="mt-1 text-sm text-zinc-600">{r.description}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {r.bloggername} · {r.postdate}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* 5. 초안 */}
      <section className={`${card} mb-6`}>
        <h2 className="mb-4 text-xl font-black">5. 초안 작성</h2>
        <div className="mb-3 text-sm">
          <b>핵심 키워드:</b> {mainKw || <span className="text-red-600">2단계 표에서 선택하세요</span>}
          {subKws.length > 0 && (
            <>
              {" "}
              · <b>보조:</b> {subKws.join(", ")}
            </>
          )}
        </div>
        <label className="mb-1 block text-sm font-black">주제 각도</label>
        <select className={`${input} mb-1`} value={angle} onChange={(e) => setAngle(e.target.value)}>
          {angles.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <p className="mb-3 text-xs text-zinc-500">
          이 지점의 주제 방향: {branch?.angle_notes || "—"} · 최근 같은 지점·다른 지점 초안과 주제가 겹치지 않도록 자동으로 비교합니다.
        </p>
        <label className="mb-1 block text-sm font-black">운영자 메모 (이번 글에 쓸 실제 사실, 찍어 둔 사진 등)</label>
        <textarea
          className={`${input} mb-4`}
          rows={3}
          value={memo}
          placeholder="예: 이번 주 샌드백 교체함 / 퇴근 시간대 사진 5장 있음 (회원 후기·성과는 쓰지 마세요)"
          onChange={(e) => setMemo(e.target.value)}
        />
        <button className={primary} disabled={generating || !mainKw || !env?.openai} onClick={generate}>
          {generating ? "작성 중… (30초~1분)" : `${branch?.name ?? ""} 초안 만들기`}
        </button>
      </section>

      {draft && (
        <section className={`${card} mb-6 border-[#FC5230]/40`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-black">
              초안 #{draft.id} · {nameOf(draft.branch_slug)}
            </h2>
            <CopyBtn text={fullText(draft)} label="본문+안내+태그 전체 복사" />
          </div>
          <p className="mb-4 text-xs text-zinc-500">
            {kst(draft.created_at)} 작성 · {draft.model} · 주제: {draft.angle} · 자동 발행되지 않습니다.
          </p>

          {draft.warnings.length > 0 && (
            <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              <b>검토 필요</b>
              <ul className="mt-1 list-disc pl-5">
                {draft.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="mb-2 font-black">사용 키워드 검색량</h3>
          <ul className="mb-5 text-sm">
            {draft.keywords.map((k) => (
              <li key={k.keyword}>
                {k.keyword} — PC {k.pc} / 모바일 {k.mobile}
                <span className="text-xs text-zinc-500"> ({k.fetched_at ? `조회일 ${kst(k.fetched_at)}` : "검색량 조회 기록 없음"})</span>
              </li>
            ))}
          </ul>

          <h3 className="mb-2 font-black">제목 후보</h3>
          <ul className="mb-5 space-y-2">
            {draft.result.titles.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-2xl bg-zinc-50 p-3 text-sm font-bold">
                <span>
                  {i + 1}. {t}
                </span>
                <CopyBtn text={t} />
              </li>
            ))}
          </ul>

          <h3 className="mb-1 font-black">이 글의 주제</h3>
          <p className="mb-5 text-sm text-zinc-700">{draft.result.angle_summary}</p>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">본문 (사진 위치 포함)</h3>
            <CopyBtn text={bodyText(draft)} label="본문 복사" />
          </div>
          <div className="mb-5 space-y-3 rounded-2xl border border-zinc-100 p-4 text-[15px] leading-7">
            {(() => {
              let n = 0;
              return draft.result.blocks.map((b, i) =>
                b.kind === "photo" ? (
                  <div key={i} className="rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 p-3 text-sm">
                    <b className="text-sky-700">📷 사진 {++n}</b> {b.text}
                    {b.photo_tip && <div className="mt-1 text-xs text-sky-700">촬영 팁: {b.photo_tip}</div>}
                  </div>
                ) : b.kind === "heading" ? (
                  <h4 key={i} className="pt-2 text-lg font-black">
                    {b.text}
                  </h4>
                ) : (
                  <p key={i} className="whitespace-pre-wrap">
                    {b.text}
                  </p>
                )
              );
            })()}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">상담·예약 안내</h3>
            <CopyBtn text={`${draft.result.cta}\n\n${draft.infoBlock}`} />
          </div>
          <div className="mb-5 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm">
            {draft.result.cta}
            {"\n\n"}
            {draft.infoBlock}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-black">해시태그</h3>
            <CopyBtn text={draft.result.hashtags.map((h) => `#${h}`).join(" ")} />
          </div>
          <p className="mb-5 text-sm text-zinc-700">{draft.result.hashtags.map((h) => `#${h}`).join(" ")}</p>

          <h3 className="mb-1 font-black">검색 결과 참고 메모</h3>
          <p className="mb-2 text-sm text-zinc-700">{draft.result.reference_note}</p>
          {draft.references.length > 0 && (
            <details className="text-xs text-zinc-500">
              <summary className="cursor-pointer">참고한 검색 결과 {draft.references.length}건 (제목·요약만)</summary>
              <ul className="mt-2 space-y-1">
                {draft.references.map((r) => (
                  <li key={r.link}>
                    <a href={r.link} target="_blank" rel="noreferrer" className="underline">
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}

      <section className={card}>
        <h2 className="mb-4 text-xl font-black">최근 초안 (전 지점)</h2>
        {drafts.length === 0 ? (
          <p className="text-sm text-zinc-500">아직 없습니다.</p>
        ) : (
          <ul className="divide-y text-sm">
            {drafts.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <button className="min-w-0 text-left" onClick={() => openDraft(d.id)}>
                  <span className="mr-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-black">{nameOf(d.branch_slug)}</span>
                  <b>{d.first_title}</b>
                  <span className="ml-2 text-xs text-zinc-500">
                    {d.keyword} · {d.angle} · {kst(d.created_at)}
                  </span>
                </button>
                <button className="text-xs font-bold text-red-500" onClick={() => removeDraft(d.id)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
