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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [branchName, setBranchName] = useState("철산점");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

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

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      alert("이미지 업로드 실패 ㅠ");
      return;
    }

    const data = await res.json();

    const imageMarkdown = `\n\n![업로드 이미지](${data.url})\n\n`;

    setContent((prev) => {
      const textarea = contentRef.current;

      if (!textarea) {
        return prev + imageMarkdown;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      return prev.slice(0, start) + imageMarkdown + prev.slice(end);
    });

    setTimeout(() => {
      contentRef.current?.focus();
    }, 0);

    alert("이미지가 본문에 추가됐어!");
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

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d0f] px-6 text-white">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#171719] p-8">
          <h1 className="mb-6 text-4xl font-black">관리자 로그인</h1>

          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
                  setIsAuthed(true);
                } else {
                  alert("비밀번호가 틀렸어.");
                }
              }
            }}
            className="mb-4 w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
            placeholder="관리자 비밀번호"
          />

          <button
            onClick={() => {
              if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
                setIsAuthed(true);
              } else {
                alert("비밀번호가 틀렸어.");
              }
            }}
            className="w-full rounded-full bg-[#FC5230] px-8 py-4 font-black"
          >
            들어가기
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="mb-8 inline-block text-zinc-400">
          ← 메인으로
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
          BLOG
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          {editingId ? "블로그 수정" : "블로그 작성"}
        </h1>

        <p className="mb-10 text-zinc-400">
          AI 생성 · 직접 작성 · 사진 첨부
        </p>

        <div className="mb-10 flex flex-wrap gap-3">

          <a
            href="/admin/naver-blog"
            className="rounded-full border border-[#FC5230]/30 bg-[#FC5230]/10 px-5 py-3 font-black text-[#FC5230]"
          >
            NAVER BLOG
          </a>

          <a
            href="/admin/reels"
            className="rounded-full border border-[#FC5230]/30 bg-[#FC5230]/10 px-5 py-3 font-black text-[#FC5230]"
          >
            STRONG CLIP
          </a>

          <a
            href="/admin/replies"
            className="rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-5 py-3 font-black text-[#2DD4BF]"
          >
            CRM REPLIES
          </a>

          <a href="/admin/branch-info">BRANCH INFO</a>

          <a href="/admin/accounts">ACCOUNT INFO</a>
          
          <a href="/admin/marketing">MARKETING</a>

        </div>
        
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#FC5230]/30 bg-[#171719] p-5">
            <label className="mb-2 block font-bold">AI 키워드</label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
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
              className="w-full rounded-2xl border border-white/10 bg-[#171719] p-4 outline-none focus:border-[#FC5230]"
              placeholder="예: 철산 복싱 다이어트, 초보자도 가능할까요?"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Slug 주소</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#171719] p-4 outline-none focus:border-[#FC5230]"
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
                      : "border-white/10 bg-[#171719] text-zinc-300 hover:border-[#FC5230]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold">지점</label>
            <select
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#171719] p-4 outline-none focus:border-[#FC5230]"
            >
              <option>철산점</option>
              <option>목동점</option>
              <option>신정점</option>
              <option>개봉점</option>
              <option>영등포점</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-28 w-full rounded-2xl border border-white/10 bg-[#171719] p-4 outline-none focus:border-[#FC5230]"
              placeholder="블로그 목록에 보일 짧은 설명"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#171719] p-5">
            <label className="mb-2 block font-bold">본문 중간 이미지</label>

            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
              className="w-full rounded-2xl border border-white/10 bg-black p-4 disabled:opacity-50"
            />

            <p className="mt-2 text-sm text-zinc-500">
              이미지를 선택하면 커서 위치에 자동으로 삽입돼.
            </p>

            {uploading && (
              <p className="mt-2 text-sm font-bold text-[#FC5230]">
                이미지 업로드 중...
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold">본문</label>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-80 w-full rounded-2xl border border-white/10 bg-[#171719] p-4 leading-8 outline-none focus:border-[#FC5230]"
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
                }}
                className="rounded-full border border-white/10 px-8 py-5 text-lg font-black"
              >
                새 글 작성
              </button>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black">작성된 블로그 글</h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#171719] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-zinc-500">{post.branch_name}</p>

                  <h3 className="text-2xl font-black">{post.title}</h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    /blog/{post.slug}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-black"
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
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}