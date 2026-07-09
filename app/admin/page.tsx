"use client";

import { useEffect, useRef, useState } from "react";
import RichTextEditor, { RichTextEditorHandle } from "@/app/components/RichTextEditor";
import MosaicEditor from "@/app/components/MosaicEditor";

function generateAlt(branch: string, target: string, training: string, contentType: string) {
  const branchShort = branch.replace("점", "");
  return [`스트롱복싱 ${branchShort}점`, target, training, contentType].filter(Boolean).join(" ");
}

function makeSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\w가-힣-]/g, "");
}

export default function AdminPage() {
  const [keyword, setKeyword] = useState("");
  const [postNo, setPostNo] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [branchName, setBranchName] = useState("철산점");
  const [category, setCategory] = useState("소식");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [popupStart, setPopupStart] = useState("");
  const [popupEnd, setPopupEnd] = useState("");

  const [layoutMode, setLayoutMode] = useState<"1열" | "2열" | "3열">("1열");
  const [pendingImages, setPendingImages] = useState<Array<{url: string; alt: string}>>([]);
  const [altTarget, setAltTarget] = useState("");
  const [altTraining, setAltTraining] = useState("");
  const [altContentType, setAltContentType] = useState("");
  const [aiImages, setAiImages] = useState<string[]>([]); // AI 글 생성용 (레이아웃 무관하게 누적)

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingFromImages, setGeneratingFromImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Mosaic editor queue
  const [mosaicQueue, setMosaicQueue] = useState<File[]>([]);

  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<RichTextEditorHandle>(null);
  const slugManuallyEdited = useRef(false);

  const slugSuggestions = [
    "mokdong-boxing-gym-intro",
    "strongboxing-mokdong-intro",
    "mokdong-boxing-first-visit",
    "mokdong-boxing-diet",
    "mokdong-women-boxing",
    "mokdong-boxing-class",
    "mokdong-boxing-workout",
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();

    if (data.ok) {
      setPosts(data.posts);
    }
  }

  const [uploadingAiImages, setUploadingAiImages] = useState(false);

  async function handleAiImageUpload(files: File[]) {
    setUploadingAiImages(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "blog");
        formData.append("branch", branchName);
        formData.append("category", category);
        formData.append("postNo", postNo);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.ok) uploaded.push(data.url);
      }
      setAiImages((prev) => [...prev, ...uploaded]);
    } catch {
      alert("업로드 실패");
    } finally {
      setUploadingAiImages(false);
    }
  }

  async function handleGenerateFromImages() {
    if (aiImages.length === 0) {
      alert("사진을 먼저 업로드해줘. (사진 삽입 섹션에서 업로드하면 돼)");
      return;
    }

    if (aiImages.length > 15) {
      if (!confirm(`사진이 ${aiImages.length}장이에요. 10장 이하 권장인데 계속 시도할까요?\n(실패하면 사진을 줄이고 다시 시도해줘요)`)) return;
    }

    setGeneratingFromImages(true);

    let res: Response;
    try {
      res = await fetch("/api/generate-post-from-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls: aiImages, branch_name: branchName }),
      });
    } catch (e: any) {
      setGeneratingFromImages(false);
      alert(`네트워크 오류: ${e?.message || e}`);
      return;
    }

    setGeneratingFromImages(false);

    const data = await res.json().catch(() => ({ ok: false, message: "응답 파싱 실패" }));
    if (!res.ok || !data.ok) {
      alert(data.message || "AI 생성 실패 ㅠ");
      return;
    }

    setTitle(data.post.title);
    setSlug(data.post.slug || makeSlug(data.post.title));
    setDescription(data.post.description);
    setContent(data.post.content);
    editorRef.current?.setContent(data.post.content || "");
    alert("사진 기반 AI 글 생성 완료! 사진은 직접 본문에 삽입해줘 🙂");
  }

  async function handleGenerate() {
    if (!keyword) {
      alert("키워드를 입력해줘.");
      return;
    }

    setGenerating(true);

    const res = await fetch("/api/generate-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword,
        branch_name: branchName,
      }),
    });

    setGenerating(false);

    if (!res.ok) {
      alert("AI 생성 실패 ㅠ");
      return;
    }

    const data = await res.json();

    setTitle(data.post.title);
    setSlug(data.post.slug || makeSlug(data.post.title));
    setDescription(data.post.description);
    setContent(data.post.content);
    editorRef.current?.setContent(data.post.content || "");
  }

  async function handleThumbnailUpload(file: File) {
    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "blog");
      formData.append("branch", branchName);
      formData.append("category", category);
      formData.append("postNo", postNo);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.ok) { alert(data.message || "썸네일 업로드 실패"); return; }
      setThumbnail(data.url);
    } catch { alert("썸네일 업로드 실패"); }
    finally { setUploadingThumb(false); }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "blog");
      formData.append("branch", branchName);
      formData.append("category", category);
      formData.append("postNo", postNo);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "이미지 업로드 실패 ㅠ");
        return;
      }

      if (layoutMode === "1열") {
        const autoAlt = generateAlt(branchName, altTarget, altTraining, altContentType);
        const finalAlt = prompt("이미지 alt 텍스트 (SEO용, 수정 가능)", autoAlt) ?? autoAlt;
        const imageHtml = `<img src="${data.url}" alt="${finalAlt}" style="width:100%;border-radius:16px;margin:12px 0" />`;
        editorRef.current?.insertHtml(imageHtml);
        alert("이미지가 본문에 추가됐어!");
      } else {
        const autoAlt = generateAlt(branchName, altTarget, altTraining, altContentType);
        setPendingImages((prev) => [...prev, {url: data.url, alt: autoAlt}]);
      }
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 실패 ㅠ");
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoUpload(file: File) {
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "blog");
      formData.append("branch", branchName);
      formData.append("category", category);
      formData.append("postNo", postNo);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.message || "영상 업로드 실패 ㅠ");
        return;
      }

      const videoTitle = prompt("영상 제목을 입력하세요 (선택 사항)", file.name.replace(/\.[^.]+$/, ""));
      const autoAlt = generateAlt(branchName, altTarget, altTraining, altContentType || "운동영상");
      const videoAlt = prompt("영상 aria-label (SEO용, 수정 가능)", autoAlt) ?? autoAlt;
      const titleHtml = videoTitle?.trim()
        ? `<p style="text-align:center;font-size:14px;color:#666;margin:4px 0 12px">${videoTitle.trim()}</p>`
        : "";
      const videoHtml = `<div style="margin:12px 0"><video src="${data.url}" controls aria-label="${videoAlt}" style="width:100%;border-radius:16px;display:block"></video>${titleHtml}</div>`;
      editorRef.current?.insertHtml(videoHtml);
      alert("영상이 본문에 추가됐어!");
    } catch {
      alert("영상 업로드 실패 ㅠ");
    } finally {
      setUploadingVideo(false);
    }
  }

  function insertGallery() {
    if (pendingImages.length === 0) {
      alert("사진을 먼저 업로드해줘.");
      return;
    }
    const cols = layoutMode === "2열" ? 2 : 3;
    const imgs = pendingImages
      .map((img) => `<img src="${img.url}" alt="${img.alt}" />`)
      .join("\n");
    const gallery = `<div class="gallery-grid gallery-${cols}col">${imgs}</div>`;
    editorRef.current?.insertHtml(gallery);
    setPendingImages([]);
    alert(`${layoutMode} 갤러리가 본문에 추가됐어!`);
  }

  async function handleSave() {
    if (!title || !slug || !content) {
      alert("제목, slug, 본문은 꼭 입력해야 해.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/posts", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      id: editingId,
      title,
      slug,
      branch_name: branchName,
      category,
      description,
      content,
      thumbnail: thumbnail || null,
      popup_start: popupStart || null,
      popup_end: popupEnd || null,
    }),
    });

    setSaving(false);

    if (!res.ok) {
      alert("저장 실패 ㅠ slug가 중복일 수도 있어.");
      return;
    }

    alert(editingId ? "수정 완료!" : "저장 완료!");

    setEditingId(null);
    setKeyword("");
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setThumbnail("");
    setPopupStart("");
    setPopupEnd("");
    slugManuallyEdited.current = false;

    loadPosts();
  }

  function handleEdit(post: any) {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setDescription(post.description || "");
    setContent(post.content || "");
    setBranchName(post.branch_name || "철산점");
    setCategory(post.category || "소식");
    setThumbnail(post.thumbnail || "");
    setPopupStart(post.popup_start ? post.popup_start.slice(0, 10) : "");
    setPopupEnd(post.popup_end ? post.popup_end.slice(0, 10) : "");
    slugManuallyEdited.current = true; // 수정 모드: 기존 slug 유지
    editorRef.current?.setContent(post.content || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제할까요?")) return;

    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "삭제 실패");
      return;
    }

    alert("삭제 완료!");

    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setSlug("");
      setDescription("");
      setContent("");
    }

    loadPosts();
  }

  return (
    <>
    <main className="min-h-screen bg-[#F5F7FA] text-zinc-900 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="mb-8 inline-block text-zinc-500">
          ← 메인으로
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
          BLOG
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          {editingId ? "블로그 수정" : "블로그 작성"}
        </h1>

        <p className="mb-10 text-zinc-500">
          AI 생성 · 직접 작성 · 사진 첨부
        </p>

        <div className="mb-10 flex flex-wrap gap-3">

          <a
            href="/admin/consultations"
            className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-6 py-3 font-black text-[#38BDF8]"
          >
            CONSULTATIONS
          </a>

          <a
            href="/admin/naver-blog"
            className="rounded-full border border-[#FC5230]/30 bg-[#FC5230]/10 px-6 py-3 font-black text-[#FC5230]"
          >
            NAVER BLOG
          </a>

          <a
            href="/admin/reels"
            className="rounded-full border border-[#FC5230]/30 bg-[#FC5230]/10 px-6 py-3 font-black text-[#FC5230]"
          >
            STRONG CLIP
          </a>

          <a
            href="/admin/replies"
            className="rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-6 py-3 font-black text-[#2DD4BF]"
          >
            CRM REPLIES
          </a>

          <a 
            href="/admin/branch-info"
            className="rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-6 py-3 font-black text-[#60A5FA]"
            >
            BRANCH INFO
          </a>

          <a 
            href="/admin/accounts"
            className="rounded-full border border-[#C084FC]/30 bg-[#C084FC]/10 px-6 py-3 font-black text-[#C084FC]"
          >
            ACCOUNT INFO
          </a>

          <a 
            href="/admin/marketing"
            className="rounded-full border border-[#FACC15]/30 bg-[#FACC15]/10 px-6 py-3 font-black text-[#FACC15]"
          >
            MARKETING
          </a>

          <a
            href="/admin/ads"
            className="rounded-full border border-[#FB7185]/30 bg-[#FB7185]/10 px-6 py-3 font-black text-[#FB7185]"
          >
            ADS LIBRARY
          </a>

          <a
            href="/admin/naver-reviews"
            className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-6 py-3 font-black text-[#22C55E]"
          >
            NAVER REVIEWS
          </a>

          <a
            href="/admin/review-replies"
            className="rounded-full border border-[#A78BFA]/30 bg-[#A78BFA]/10 px-6 py-3 font-black text-[#A78BFA]"
          >
            REVIEW REPLIES
          </a>

        </div>
        
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#FC5230]/30 bg-white p-5">
            <label className="mb-2 block font-bold">AI 키워드</label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
                placeholder="예: 철산 복싱 다이어트"
              />

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-2xl bg-[#FC5230] px-6 py-4 font-black disabled:opacity-50"
              >
                {generating ? "생성 중..." : "AI 글 생성"}
              </button>
            </div>
          </div>

          {/* ── AI 사진 글 생성 전용 섹션 ── */}
          <div className="rounded-[28px] border border-violet-200 bg-violet-50 p-5 space-y-4">
            <div>
              <label className="block font-bold text-violet-800">📸 사진 보고 AI 글 쓰기</label>
              <p className="mt-1 text-sm text-violet-500">사진 여러 장 올리면 AI가 직접 보고 글을 써줘요. <strong>10장 이하 권장</strong> (너무 많으면 실패할 수 있어요)</p>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingAiImages}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) handleAiImageUpload(files);
                e.target.value = "";
              }}
              className="w-full rounded-2xl border border-violet-200 bg-white p-4 disabled:opacity-50"
            />

            {uploadingAiImages && (
              <p className="text-sm font-bold text-violet-600">업로드 중...</p>
            )}

            {aiImages.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-violet-700">{aiImages.length}장 준비됨</p>
                <div className="grid grid-cols-4 gap-2">
                  {aiImages.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} className="w-full aspect-square rounded-xl object-cover" />
                      <button
                        type="button"
                        onClick={() => setAiImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateFromImages}
                    disabled={generatingFromImages}
                    className="flex-1 rounded-full bg-violet-600 py-3 text-sm font-black text-white disabled:opacity-40"
                  >
                    {generatingFromImages ? "사진 보고 글 쓰는 중..." : `사진 ${aiImages.length}장 보고 AI 글 쓰기`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiImages([])}
                    className="rounded-full border border-violet-200 px-5 py-3 text-sm font-bold text-violet-500"
                  >
                    전체 삭제
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold">제목</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugManuallyEdited.current) setSlug(makeSlug(e.target.value));
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
              placeholder="예: 철산 복싱 다이어트, 초보자도 가능할까요?"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Slug 주소</label>
            <input
              value={slug}
              onChange={(e) => { slugManuallyEdited.current = true; setSlug(e.target.value); }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
              placeholder="cheolsan-boxing-diet"
            />

            <p className="mt-2 text-sm text-zinc-500">
              주소: /blog/{slug || "slug"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {slugSuggestions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSlug(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    slug === item
                      ? "border-[#FC5230] bg-[#FC5230] text-white"
                      : "border-zinc-200 bg-white text-zinc-300 hover:border-[#FC5230]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold">글 번호</label>
            <input
              value={postNo}
              onChange={(e) => setPostNo(e.target.value)}
              placeholder="예: 001"
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
            />
            <p className="mt-1 text-xs text-zinc-400">사진이 blog/지점/글번호/ 폴더에 저장돼요</p>
          </div>

          <div>
            <label className="mb-2 block font-bold">지점</label>
            <select
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
            >
              <option>철산점</option>
              <option>목동점</option>
              <option>신정점</option>
              <option>개봉점</option>
              <option>영등포점</option>
            </select>
          </div>

          <div>
              <label className="mb-2 block font-bold">카테고리</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
              >
                <option>소식</option>
                <option>이벤트</option>
                <option>공지</option>
              </select>
            </div>

          {category === "이벤트" && (
            <div className="rounded-[28px] border border-orange-200 bg-orange-50 p-5 space-y-3">
              <label className="block font-bold text-orange-700">
                🎉 홈페이지 팝업 설정
                <span className="ml-2 text-sm font-normal text-orange-500">(기간 설정 시 홈페이지에 팝업으로 노출)</span>
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-bold text-orange-600">시작일</p>
                  <input
                    type="date"
                    value={popupStart}
                    onChange={(e) => setPopupStart(e.target.value)}
                    className="w-full rounded-2xl border border-orange-200 bg-white p-3 outline-none focus:border-orange-400"
                  />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-xs font-bold text-orange-600">종료일</p>
                  <input
                    type="date"
                    value={popupEnd}
                    onChange={(e) => setPopupEnd(e.target.value)}
                    className="w-full rounded-2xl border border-orange-200 bg-white p-3 outline-none focus:border-orange-400"
                  />
                </div>
              </div>
              {popupStart && popupEnd && (
                <p className="text-xs text-orange-600 font-bold">
                  {popupStart} ~ {popupEnd} 기간 동안 홈페이지 방문 시 팝업 노출
                </p>
              )}
              {(popupStart || popupEnd) && (
                <button
                  type="button"
                  onClick={() => { setPopupStart(""); setPopupEnd(""); }}
                  className="text-xs text-orange-400 underline"
                >
                  팝업 설정 제거
                </button>
              )}
            </div>
          )}

          {/* 대표 썸네일 */}
          <div className="rounded-[28px] border border-emerald-200 bg-white p-5 space-y-3">
            <label className="block font-bold">대표 썸네일 <span className="text-sm font-normal text-zinc-400">(없으면 본문 첫 이미지 사용)</span></label>
            {thumbnail && (
              <div className="relative">
                <img src={thumbnail} alt="썸네일 미리보기" className="w-full max-h-48 object-cover rounded-2xl" />
                <button
                  type="button"
                  onClick={() => setThumbnail("")}
                  className="absolute top-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white"
                >
                  삭제
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingThumb}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleThumbnailUpload(file);
                e.target.value = "";
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 disabled:opacity-50"
            />
            {uploadingThumb && <p className="text-sm font-bold text-emerald-600">썸네일 업로드 중...</p>}
          </div>

          <div>
            <label className="mb-2 block font-bold">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-28 w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
              placeholder="블로그 목록에 보일 짧은 설명"
            />
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 space-y-4">
            <label className="block font-bold">사진 삽입</label>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-3">
              <p className="text-sm font-bold text-blue-700">SEO Alt 텍스트 설정 <span className="font-normal text-blue-500">(업로드 시 자동 생성됨)</span></p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="mb-1 text-xs text-blue-600 font-bold">대상/목적</p>
                  <select
                    value={altTarget}
                    onChange={(e) => setAltTarget(e.target.value)}
                    className="w-full rounded-xl border border-blue-200 bg-white p-2 text-sm outline-none"
                  >
                    <option value="">선택 안함</option>
                    <option>다이어트</option>
                    <option>체력증진</option>
                    <option>성인</option>
                    <option>여성</option>
                    <option>남성</option>
                    <option>초보자</option>
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-blue-600 font-bold">운동종류</p>
                  <select
                    value={altTraining}
                    onChange={(e) => setAltTraining(e.target.value)}
                    className="w-full rounded-xl border border-blue-200 bg-white p-2 text-sm outline-none"
                  >
                    <option value="">선택 안함</option>
                    <option>복싱PT</option>
                    <option>복싱스파링</option>
                    <option>복싱다이어트</option>
                    <option>복싱체력운동</option>
                  </select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-blue-600 font-bold">콘텐츠유형</p>
                  <select
                    value={altContentType}
                    onChange={(e) => setAltContentType(e.target.value)}
                    className="w-full rounded-xl border border-blue-200 bg-white p-2 text-sm outline-none"
                  >
                    <option value="">선택 안함</option>
                    <option>수업현장</option>
                    <option>운동영상</option>
                    <option>이벤트</option>
                    <option>시설</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-blue-500">
                미리보기: <strong>{generateAlt(branchName, altTarget, altTraining, altContentType) || `스트롱복싱 ${branchName.replace("점", "")}점`}</strong>
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-zinc-500">레이아웃 선택</p>
              <div className="flex gap-2">
                {(["1열", "2열", "3열"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setLayoutMode(mode); setPendingImages([]); }}
                    className={`rounded-full px-5 py-2 text-sm font-black transition ${
                      layoutMode === mode
                        ? "bg-[#FC5230] text-white"
                        : "border border-zinc-200 text-zinc-500"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple={layoutMode !== "1열"}
              disabled={uploading}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) setMosaicQueue(files);
                e.target.value = "";
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 disabled:opacity-50"
            />

            {layoutMode === "1열" ? (
              <p className="text-sm text-zinc-400">사진 선택하면 바로 본문에 삽입돼요</p>
            ) : (
              <div>
                <p className="text-sm text-zinc-400 mb-3">
                  사진 {pendingImages.length}장 선택됨 — 다 올리면 아래 버튼 눌러요
                </p>
                {pendingImages.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${layoutMode === "2열" ? "grid-cols-2" : "grid-cols-3"}`}>
                    {pendingImages.map((img, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <img src={img.url} className="w-full rounded-xl object-cover aspect-square" />
                        <input
                          value={img.alt}
                          onChange={(e) => setPendingImages((prev) => prev.map((item, idx) => idx === i ? {...item, alt: e.target.value} : item))}
                          className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs outline-none"
                          placeholder="alt 텍스트"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={insertGallery}
                      disabled={pendingImages.length === 0}
                      className="flex-1 rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
                    >
                      {layoutMode} 갤러리 본문에 삽입
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingImages([])}
                      className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-black"
                    >
                      초기화
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploading && (
              <p className="text-sm font-bold text-[#FC5230]">업로드 중...</p>
            )}
          </div>

          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 space-y-4">
            <label className="block font-bold">영상 삽입</label>
            <input
              type="file"
              accept="video/*"
              disabled={uploadingVideo}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoUpload(file);
                e.target.value = "";
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 disabled:opacity-50"
            />
            <p className="text-sm text-zinc-400">영상 선택하면 바로 본문에 삽입돼요</p>
            {uploadingVideo && (
              <p className="text-sm font-bold text-[#FC5230]">영상 업로드 중...</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold">본문</label>
            <RichTextEditor ref={editorRef} value={content} onChange={setContent} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black disabled:opacity-50"
            >
              {saving
                ? "저장 중..."
                : editingId
                ? "수정 저장하기"
                : "저장하기"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setSlug("");
                  setDescription("");
                  setContent("");
                  setThumbnail("");
                  slugManuallyEdited.current = false;
                  editorRef.current?.setContent("");
                }}
                className="rounded-full border border-zinc-200 px-8 py-5 text-lg font-black"
              >
                새 글 작성
              </button>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black">작성된 블로그 글</h2>

          <div className="space-y-4">
            {(() => {
              // 지점+카테고리별 순번 계산 (오래된 글부터 #001)
              const counters: Record<string, number> = {};
              const postsWithNo = [...posts].reverse().map((post) => {
                const key = `${post.branch_name}_${post.category}`;
                counters[key] = (counters[key] || 0) + 1;
                return { ...post, branchNo: counters[key] };
              }).reverse();
              return postsWithNo.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-4 rounded-[24px] border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm text-zinc-500">{post.branch_name}</p>
                    <span className="rounded border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[11px] font-black tracking-widest text-zinc-400">
                      {post.category} #{String(post.branchNo).padStart(3, "0")}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black">{post.title}</h3>

                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-sm text-zinc-500">/blog/{post.slug}</p>
                    <span className="text-sm font-bold text-zinc-400">👁 {(post.views ?? 0).toLocaleString()}회</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-black"
                  >
                    보기
                  </a>

                  <button
                    onClick={() => handleEdit(post)}
                    className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-full border border-red-500 px-5 py-3 text-sm font-black text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
              ));
            })()}
          </div>
        </section>
      </div>
    </main>

    {/* Mosaic editor — shown for each file in queue */}
    {mosaicQueue.length > 0 && (
      <MosaicEditor
        file={mosaicQueue[0]}
        fileIndex={0}
        fileTotal={mosaicQueue.length}
        onDone={(blob) => {
          const original = mosaicQueue[0];
          const processed = new File([blob], original.name, { type: "image/jpeg" });
          handleImageUpload(processed);
          setMosaicQueue(prev => prev.slice(1));
        }}
        onSkip={() => {
          handleImageUpload(mosaicQueue[0]);
          setMosaicQueue(prev => prev.slice(1));
        }}
        onCancel={() => setMosaicQueue([])}
      />
    )}
    </>
  );
}