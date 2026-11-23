"use client";

import { useEffect, useState } from "react";

type SelectionMap = Record<string, string | string[]>;

interface CategoryGroup {
  key: string;
  label: string;
  mode: "single" | "multi";
  options: string[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "target",
    label: "대상",
    mode: "multi",
    options: ["남성","여성","초보자","직장인","대학생","고등학생","중학생","초등학생","키즈","가족","커플","시니어","선수반"],
  },
  {
    key: "training",
    label: "운동 종류",
    mode: "multi",
    options: ["복싱기초","기본자세","자세연습","원투","잽","스트레이트","훅","어퍼컷","콤비네이션","풋워크","스텝","미트훈련","샌드백","스파링","체력운동","코어운동","인터벌","PT","그룹수업","자유운동","기술훈련","실전훈련"],
  },
  {
    key: "contentType",
    label: "콘텐츠 유형",
    mode: "multi",
    options: ["수업","훈련","회원영상","코치시범","운동모습","분위기","시설","이벤트","후기","릴스","쇼츠","Before & After"],
  },
  {
    key: "difficulty",
    label: "난이도",
    mode: "single",
    options: ["초급","중급","상급"],
  },
  {
    key: "purpose",
    label: "운동 목적",
    mode: "multi",
    options: ["다이어트","체력증진","스트레스해소","체형교정","건강관리","취미","선수준비","호신","자신감"],
  },
  {
    key: "timeSlot",
    label: "시간대",
    mode: "single",
    options: ["오전","오후","저녁","주말"],
  },
];

const DEFAULT_SELECTIONS: SelectionMap = {
  target: [], training: [], contentType: [], difficulty: "", purpose: [], timeSlot: "",
};

const TRAINING_TITLE: Record<string, { text: string; emoji: string }> = {
  복싱기초: { text: "복싱 기본기", emoji: "🥊" },
  기본자세: { text: "복싱 가드와 기본 자세", emoji: "🥊" },
  자세연습: { text: "자세 하나씩 다듬기", emoji: "🥊" },
  원투: { text: "잽부터 원투까지", emoji: "🥊" },
  잽: { text: "잽 타이밍 연습", emoji: "🎯" },
  스트레이트: { text: "스트레이트 연습", emoji: "🎯" },
  훅: { text: "훅 연습", emoji: "🥊" },
  어퍼컷: { text: "어퍼컷 연습", emoji: "🥊" },
  풋워크: { text: "복싱 풋워크 연습", emoji: "👟" },
  스텝: { text: "복싱 스텝", emoji: "👟" },
  미트훈련: { text: "미트 훈련", emoji: "🎯" },
  샌드백: { text: "샌드백 훈련", emoji: "🥊" },
  스파링: { text: "스파링 훈련", emoji: "🥊" },
  체력운동: { text: "복싱 체력 운동", emoji: "⚡" },
  코어운동: { text: "코어 운동", emoji: "⚡" },
  인터벌: { text: "인터벌 운동", emoji: "⚡" },
};

function buildTitle(branchName: string, sel: SelectionMap): string {
  const [target] = sel.target as string[];
  const [training] = sel.training as string[];
  const [contentType] = sel.contentType as string[];
  const scene = TRAINING_TITLE[training] ?? { text: training || contentType || "복싱 훈련", emoji: contentType === "시설" ? "📍" : "" };
  const lead = target === "직장인" ? "퇴근 후" : target === "초보자" ? "처음 배우는" : target;
  const caption = [lead, scene.text, scene.emoji].filter(Boolean).join(" ");
  return `${caption} | 스트롱복싱 ${branchName}`;
}

function buildAriaLabel(branchName: string, sel: SelectionMap): string {
  const branchShort = branchName.replace("점", "");
  const targets = sel.target as string[];
  const trainings = sel.training as string[];
  const contentTypes = sel.contentType as string[];
  const purposes = sel.purpose as string[];
  const difficulty = sel.difficulty as string;
  const parts: string[] = [`스트롱복싱 ${branchShort}점`];
  if (targets.length) parts.push(targets.join(" "));
  if (purposes.length) parts.push(purposes[0]);
  if (difficulty) parts.push(difficulty);
  if (trainings.length) parts.push(trainings.slice(0, 2).join(" "));
  if (contentTypes.length) parts.push(contentTypes[0]);
  parts.push("영상");
  return parts.filter(Boolean).join(" ");
}

function buildKeywords(branchName: string, sel: SelectionMap): string[] {
  const branchShort = branchName.replace("점", "");
  const targets = sel.target as string[];
  const trainings = sel.training as string[];
  const kws: string[] = [`${branchShort} 복싱`, `${branchShort}동 복싱`];
  targets.forEach((t) => { if (t) kws.push(`${t} 복싱`); });
  trainings.forEach((tr) => { if (tr) kws.push(tr); });
  kws.push("복싱 초보", `스트롱복싱 ${branchShort}점`);
  return [...new Set(kws)].filter(Boolean);
}

const BRANCH_FOLDERS: Record<string, string> = {
  철산점: "cheolsan", 목동점: "mokdong", 신정점: "sinjeong", 개봉점: "gaebong", 영등포점: "yeongdeungpo",
};

export default function ReelsPage() {
  const [branchName, setBranchName] = useState("철산점");
  const [title, setTitle] = useState("");
  const [ariaLabel, setAriaLabel] = useState("");
  const [selections, setSelections] = useState<SelectionMap>(DEFAULT_SELECTIONS);
  const [videoUrl, setVideoUrl] = useState("");
  const [reels, setReels] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const selectedVideoUrl = videoFileName ? `/videos/${BRANCH_FOLDERS[branchName]}/${encodeURIComponent(videoFileName)}` : "";
  const playerUrl = previewUrl || videoUrl || selectedVideoUrl;

  useEffect(() => {
    loadReels();
    loadVideoFiles(branchName);
  }, []);

  useEffect(() => {
    if (!pendingVideo) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(pendingVideo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingVideo]);

  async function loadReels() {
    const res = await fetch("/api/reels");
    const data = await res.json();
    if (data.ok) setReels(data.reels);
  }

  async function deleteReel(id: number) {
    if (!confirm("삭제할까요?")) return;

    await fetch("/api/reels", {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    loadReels();
    }

    async function muteReel(reel: any) {
      if (!confirm("이 영상을 무음 파일로 만들까요?")) return;

      const res = await fetch("/api/reels-mute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reel.id,
          video_url: reel.video_url,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "음소거 실패");
        return;
      }

      alert("무음 영상으로 변경 완료!");
      loadReels();
    }

  async function loadVideoFiles(branch: string) {
    const res = await fetch(`/api/reels-files?branch=${encodeURIComponent(branch)}`);
    const data = await res.json();

    if (data.ok) {
        setVideoFiles(data.files);
    }
  }

  async function uploadVideo(file: File): Promise<string | undefined> {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/reels-upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 413) {
        alert("파일이 너무 큽니다. 500MB 이하 영상만 업로드 가능합니다.");
        return;
      }

      if (!res.ok && res.headers.get("content-type")?.includes("text/html")) {
        alert(`업로드 실패 (HTTP ${res.status}). 서버 설정을 확인해주세요.`);
        return;
      }

      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "영상 업로드 실패");
        return;
      }

      return data.url;
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
      console.error("영상 업로드 오류:", err);
    } finally {
      setUploading(false);
    }
  }

  async function saveReel() {
    if (saving || uploading) return;
    let finalVideoUrl = videoUrl || selectedVideoUrl;
    if (!title.trim() || (!finalVideoUrl && !pendingVideo)) {
      alert("제목과 영상을 선택해 주세요.");
      return;
    }

    const action = editingId ? "수정 내용을 저장할까요?" : "이 영상을 홈페이지에 등록할까요?";
    if (!confirm(`${action}

지점: ${branchName}
제목: ${title.trim()}
영상: ${pendingVideo?.name || videoFileName || finalVideoUrl.split("/").pop()}`)) return;

    setSaving(true);
    try {
      if (pendingVideo) {
        const uploadedUrl = await uploadVideo(pendingVideo);
        if (!uploadedUrl) return;
        finalVideoUrl = uploadedUrl;
        setVideoUrl(uploadedUrl);
        setPendingVideo(null);
      }
      const res = await fetch("/api/reels", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          is_muted: isMuted ? 1 : 0,
          branch_name: branchName,
          title: title.trim(),
          aria_label: ariaLabel.trim() || title.trim(),
          video_url: finalVideoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { alert(data.message || "저장 실패"); return; }
      alert("저장 완료!");
      setEditingId(null);
      setIsMuted(false);
      setTitle("");
      setAriaLabel("");
      setSelections(DEFAULT_SELECTIONS);
      setVideoUrl("");
      setVideoFileName("");
      void loadReels();
    } catch (error) {
      console.error("클립 저장 오류:", error);
      alert("저장 중 문제가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-16 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-500">
          ← 관리자 메인으로
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
        STRONG CLIP
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
        STRONG CLIP
        </h1>

        <p className="mb-10 text-zinc-500">
        홈페이지 메인 영상 관리
        </p>

        <section className="space-y-5 rounded-[30px] border border-zinc-200 bg-white p-6">
          <select
            value={branchName}
            onChange={(e) => {
                setBranchName(e.target.value);
                loadVideoFiles(e.target.value);
                setPendingVideo(null);
                setVideoFileName("");
                setVideoUrl("");
            }}
            className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          {/* SEO 자동생성 — 태그(Chip) 선택 방식 */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-4">
            <p className="text-sm font-bold text-blue-700">선택한 태그로 클립 제목 만들기</p>
            {CATEGORY_GROUPS.map((cat) => (
              <div key={cat.key}>
                <p className="mb-2 text-xs font-bold text-blue-600">
                  {cat.label}
                  <span className="ml-1 font-normal text-blue-400">
                    {cat.mode === "multi" ? "복수 선택" : "단일 선택"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.options.map((opt) => {
                    const current = selections[cat.key];
                    const isSelected =
                      cat.mode === "multi"
                        ? (current as string[]).includes(opt)
                        : current === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setSelections((prev) => {
                            if (cat.mode === "single") {
                              return { ...prev, [cat.key]: prev[cat.key] === opt ? "" : opt };
                            }
                            const arr = prev[cat.key] as string[];
                            return {
                              ...prev,
                              [cat.key]: arr.includes(opt)
                                ? arr.filter((v) => v !== opt)
                                : [...arr, opt],
                            };
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-zinc-200 bg-white text-zinc-500 hover:border-blue-300"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {Object.values(selections).some((v) =>
              Array.isArray(v) ? v.length > 0 : v !== ""
            ) && (
              <div className="rounded-xl border border-blue-200 bg-white p-3 space-y-1.5">
                <p className="text-xs font-bold text-blue-700">자동 생성 미리보기</p>
                <p className="text-xs text-zinc-500">
                  <span className="font-bold text-zinc-700">title: </span>
                  {buildTitle(branchName, selections)}
                </p>
                <p className="text-xs text-zinc-500">
                  <span className="font-bold text-zinc-700">aria-label: </span>
                  {buildAriaLabel(branchName, selections)}
                </p>
                <p className="text-xs text-zinc-500">
                  <span className="font-bold text-zinc-700">keywords: </span>
                  {buildKeywords(branchName, selections).join(", ")}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setTitle(buildTitle(branchName, selections));
                setAriaLabel(buildAriaLabel(branchName, selections));
              }}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-black text-white"
            >
              추천 제목과 영상 설명 적용
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-700">
              제목 (title 속성) <span className="font-normal text-zinc-400">— 표시용 + video title=""</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 철산점 복싱PT 수업현장"
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-700">
              aria-label <span className="font-normal text-zinc-400">— 스크린리더용 설명</span>
              {!ariaLabel.trim() && <span className="ml-2 text-red-400 text-xs">필수</span>}
            </label>
            <input
              value={ariaLabel}
              onChange={(e) => setAriaLabel(e.target.value)}
              placeholder="예: 스트롱복싱 철산점 복싱PT 수업현장 영상"
              className={`w-full rounded-2xl border bg-white p-4 outline-none ${!ariaLabel.trim() ? "border-red-200" : "border-zinc-200"}`}
            />
          </div>

          <input
            type="file"
            accept="video/*"
            disabled={saving || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPendingVideo(file);
                setVideoFileName("");
                setVideoUrl("");
              }
              e.target.value = "";
            }}
            className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
          />

          <select
            value={videoFileName}
            onChange={(e) => {
                setVideoFileName(e.target.value);
                setPendingVideo(null);
                setVideoUrl("");
            }}
            className="w-full rounded-2xl border border-zinc-200 bg-white p-4"
            >
            <option value="">서버에 넣어둔 영상 선택</option>
            {videoFiles.map((file) => (
                <option key={file} value={file}>
                {file}
                </option>
            ))}
            </select>

            <p className="text-sm text-zinc-500">
            선택한 지점의 public/videos 폴더에 있는 영상 목록입니다.
            </p>

            <label className="flex items-center gap-3 text-sm font-bold text-zinc-700">
              <input
                type="checkbox"
                checked={isMuted}
                onChange={(e) => setIsMuted(e.target.checked)}
              />
              홈페이지에서 음소거 재생
            </label>

          {uploading && (
            <p className="font-bold text-[#FC5230]">영상 업로드 중...</p>
          )}

          {pendingVideo && <p className="text-sm text-zinc-600">선택한 영상: {pendingVideo.name}. 제목과 영상을 확인한 뒤 등록을 누르면 업로드됩니다.</p>}
          {playerUrl && (
            <video src={playerUrl} controls playsInline className="max-h-[400px] w-full rounded-2xl" />
          )}

          <button
            onClick={saveReel}
            disabled={saving || uploading}
            className="w-full rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black disabled:opacity-50"
          >
            {saving ? "저장 중..." : editingId ? "수정 저장" : "홈페이지에 추가"}
          </button>
        </section>

        <section className="mt-14">
          <h2 className="mb-5 text-3xl font-black">등록된 영상</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {(() => {
              const counters: Record<string, number> = {};
              const reelsWithNo = [...reels].reverse().map((reel) => {
                counters[reel.branch_name] = (counters[reel.branch_name] || 0) + 1;
                return { ...reel, branchNo: counters[reel.branch_name] };
              }).reverse();
              return reelsWithNo.map((reel) => (
              <div
                key={reel.id}
                className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
              >
                <video src={reel.video_url} controls className="w-full" />

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-[#FC5230]">{reel.branch_name}</p>
                    <span className="rounded border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[11px] font-black tracking-widest text-zinc-400">
                      #{String(reel.branchNo).padStart(3, "0")}
                    </span>
                  </div>
                  <p className="mt-1 font-bold">{reel.title}</p>

                  <button
                    onClick={() => {
                      setEditingId(reel.id);
                      setBranchName(reel.branch_name);
                      setTitle(reel.title);
                      setAriaLabel(reel.aria_label || "");
                      setSelections(DEFAULT_SELECTIONS);
                      setPendingVideo(null);
                      setVideoUrl(reel.video_url);
                      setVideoFileName("");
                      setIsMuted(reel.is_muted === 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-4 rounded-full border border-zinc-200 px-4 py-2 text-sm font-black text-zinc-900"
                  >
                    수정
                  </button>
                  
                  <button
                    onClick={() => deleteReel(reel.id)}
                    className="mt-4 rounded-full border border-red-500 px-4 py-2 text-sm font-black text-red-400"
                  >
                    홈페이지 노출 삭제
                  </button>

                  <button
                    onClick={() => muteReel(reel)}
                    className="mt-4 rounded-full border border-[#FC5230] px-4 py-2 text-sm font-black text-[#FC5230]"
                  >
                    무음 파일 만들기
                  </button>

                </div>
              </div>
              ));
            })()}
          </div>
        </section>
      </div>
    </main>
  );
}