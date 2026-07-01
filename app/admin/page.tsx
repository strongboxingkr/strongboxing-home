"use client";

import { useEffect, useRef, useState } from "react";

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

  const [layoutMode, setLayoutMode] = useState<"1열" | "2열" | "3열">("1열");
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const contentRef = useRef<HTMLTextAreaElement | null>(null);

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
        const imageMarkdown = `\n\n![이미지](${data.url})\n\n`;
        setContent((prev) => {
          const textarea = contentRef.current;
          if (!textarea) return prev + imageMarkdown;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          return prev.slice(0, start) + imageMarkdown + prev.slice(end);
        });
        setTimeout(() => contentRef.current?.focus(), 0);
        alert("이미지가 본문에 추가됐어!");
      } else {
        setPendingImages((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 실패 ㅠ");
    } finally {
      setUploading(false);
    }
  }

  function insertGallery() {
    if (pendingImages.length === 0) {
      alert("사진을 먼저 업로드해줘.");
      return;
    }
    const cols = layoutMode === "2열" ? 2 : 3;
    const imgs = pendingImages
      .map((url) => `<img src="${url}" style="width:100%;border-radius:16px;object-fit:cover" />`)
      .join("\n");
    const gallery = `\n\n<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px">\n${imgs}\n</div>\n\n`;
    setContent((prev) => prev + gallery);
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

          <div>
            <label className="mb-2 block font-bold">제목</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(makeSlug(e.target.value));
              }}
              className="w-full rounded-2xl border border-zinc-200 bg-white p-4 outline-none focus:border-[#FC5230]"
              placeholder="예: 철산 복싱 다이어트, 초보자도 가능할까요?"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Slug 주소</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
                files.forEach(handleImageUpload);
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
                    {pendingImages.map((url, i) => (
                      <img key={i} src={url} className="w-full rounded-xl object-cover aspect-square" />
                    ))}
                  </div>
                )}
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
            )}

            {uploading && (
              <p className="text-sm font-bold text-[#FC5230]">업로드 중...</p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold">본문</label>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-80 w-full rounded-2xl border border-zinc-200 bg-white p-4 leading-8 outline-none focus:border-[#FC5230]"
              placeholder={`본문을 입력해줘.\n줄바꿈하면 상세페이지에서 문단으로 나와.`}
            />
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
                  setContent("");
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

                  <p className="mt-2 text-sm text-zinc-500">
                    /blog/{post.slug}
                  </p>
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
  );
}