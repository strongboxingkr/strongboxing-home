"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = {
  type: "image" | "video";
  url: string;
  name: string;
};

export default function NaverBlogPage() {
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [branchName, setBranchName] = useState("철산점");
  const [keyword, setKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [memo, setMemo] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const res = await fetch("/api/naver-blog-posts");
    const data = await res.json();

    if (data.ok) {
      setPosts(data.posts);
    }
  }

  function insertText(text: string) {
    const textarea = contentRef.current;

    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setContent((prev) => prev.slice(0, start) + text + prev.slice(end));

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
    }, 0);
  }

  async function handleUpload(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
        console.error("업로드 실패 응답:", data);
        alert(data.message || "업로드 실패");
        return;
        }

        const type = file.type.startsWith("video") ? "video" : "image";

        const item: MediaItem = {
        type,
        url: data.url,
        name: file.name,
        };

        setMedia((prev) => [...prev, item]);

        if (type === "image") {
        insertText(`\n\n[사진] ${data.url}\n\n`);
        } else {
        insertText(`\n\n[영상] ${data.url}\n\n`);
        }
        } catch (error) {
            console.error("업로드 요청 오류:", error);
            alert("업로드 실패");
        } finally {
            setUploading(false);
        }
    }

  async function handleAI() {
    if (!keyword) {
      alert("키워드를 입력해줘.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("branch", branchName);
    formData.append("keyword", keyword);
    formData.append("topic", topic);
    formData.append("memo", memo);

    const res = await fetch("/api/naver-blog-ai", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      alert(data.message || "AI 생성 실패");
      return;
    }

    setTitle(data.draft.title || "");
    setContent(data.draft.body || "");
    setHashtags(
      Array.isArray(data.draft.hashtags)
        ? data.draft.hashtags.map((tag: string) => `#${tag}`).join(" ")
        : data.draft.hashtags || ""
    );
  }

  async function handleSave() {
    if (!title || !content) {
      alert("제목과 본문은 꼭 입력해야 해.");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/naver-blog-posts", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        title,
        branch_name: branchName,
        keyword,
        content,
        hashtags,
        media,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!data.ok) {
      alert(data.message || "저장 실패");
      return;
    }

    alert(editingId ? "수정 완료!" : "저장 완료!");

    resetForm();
    loadPosts();
  }

  function handleEdit(post: any) {
    setEditingId(post.id);
    setTitle(post.title || "");
    setBranchName(post.branch_name || "철산점");
    setKeyword(post.keyword || "");
    setContent(post.content || "");
    setHashtags(post.hashtags || "");

    try {
      setMedia(typeof post.media === "string" ? JSON.parse(post.media) : post.media || []);
    } catch {
      setMedia([]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제할까요?")) return;

    const res = await fetch("/api/naver-blog-posts", {
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

    alert("삭제 완료");
    loadPosts();

    if (editingId === id) {
      resetForm();
    }
  }

  function resetForm() {
    setEditingId(null);
    setBranchName("철산점");
    setKeyword("");
    setTopic("");
    setMemo("");
    setTitle("");
    setContent("");
    setHashtags("");
    setMedia([]);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    alert("복사 완료!");
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
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
        ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#FC5230]">
        NAVER BLOG
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
        네이버 블로그 작성
        </h1>

        <p className="mb-10 text-zinc-400">
        AI 생성 · 직접 작성 · 사진 · 영상 첨부
        </p>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-5 rounded-[30px] border border-white/10 bg-[#171719] p-6">
            <div>
              <label className="mb-2 block font-bold">지점</label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              >
                <option>철산점</option>
                <option>목동점</option>
                <option>신정점</option>
                <option>개봉점</option>
                <option>영등포점</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold">ai 키워드</label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="예: 철산 복싱"
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">글 주제</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 초보자 복싱 입문"
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold">AI 참고 메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="예: 목동점 블로그 말투처럼 자연스럽게"
                className="h-28 w-full rounded-2xl border border-white/10 bg-black p-4"
              />
            </div>

            <button
              onClick={handleAI}
              disabled={loading}
              className="w-full rounded-full bg-[#FC5230] px-6 py-4 font-black disabled:opacity-50"
            >
              {loading ? "AI 작성 중..." : "AI로 글 생성"}
            </button>

            <div className="border-t border-white/10 pt-5">
              <label className="mb-2 block font-bold">사진/영상 삽입</label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                disabled={uploading}
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  selected.forEach(handleUpload);
                  e.target.value = "";
                }}
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              />

              {uploading && (
                <p className="mt-2 text-sm font-bold text-[#FC5230]">
                  업로드 중...
                </p>
              )}
            </div>

            <button
              onClick={() => insertText("\n\n[사진]\n\n")}
              className="w-full rounded-full border border-white/10 px-6 py-3 font-bold"
            >
              [사진] 자리 넣기
            </button>

            <button
              onClick={() => insertText("\n\n[영상]\n\n")}
              className="w-full rounded-full border border-white/10 px-6 py-3 font-bold"
            >
              [영상] 자리 넣기
            </button>
          </aside>

          <section className="space-y-5">
            <div className="rounded-[30px] border border-white/10 bg-[#171719] p-6">
              <label className="mb-2 block font-bold">제목</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="네이버 블로그 제목"
                className="w-full rounded-2xl border border-white/10 bg-black p-4"
              />
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#171719] p-6">
              <div className="mb-3 flex justify-between">
                <label className="font-bold">본문</label>
                <button
                  onClick={() => copy(content)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                >
                  본문 복사
                </button>
              </div>

              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 네이버 블로그 글을 직접 작성하거나 AI 생성 결과를 수정해."
                className="h-[560px] w-full rounded-2xl border border-white/10 bg-black p-5 leading-8"
              />
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#171719] p-6">
              <div className="mb-3 flex justify-between">
                <label className="font-bold">해시태그</label>
                <button
                  onClick={() => copy(hashtags)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                >
                  태그 복사
                </button>
              </div>

              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#철산복싱 #광명복싱 #스트롱복싱"
                className="h-24 w-full rounded-2xl border border-white/10 bg-black p-4"
              />
            </div>

            {media.length > 0 && (
              <div className="rounded-[30px] border border-white/10 bg-[#171719] p-6">
                <h2 className="mb-4 text-2xl font-black">첨부 미디어</h2>

                <div className="grid gap-3 md:grid-cols-2">
                  {media.map((item, i) => (
                    <div
                      key={`${item.url}-${i}`}
                      className="rounded-2xl border border-white/10 bg-black p-4"
                    >
                      <p className="mb-2 text-sm text-zinc-400">
                        {item.type === "image" ? "사진" : "영상"} {i + 1}
                      </p>

                      <p className="break-all text-sm text-zinc-300">
                        {item.url}
                      </p>

                      <button
                        onClick={() => copy(item.url)}
                        className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                      >
                        URL 복사
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-[#FC5230] px-8 py-5 text-lg font-black disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingId ? "수정 저장" : "저장"}
              </button>

              <button
                onClick={resetForm}
                className="rounded-full border border-white/10 px-8 py-5 text-lg font-black"
              >
                새 글
              </button>
            </div>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-3xl font-black">저장된 네이버 블로그 글</h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-[24px] border border-white/10 bg-[#171719] p-5"
              >
                <p className="text-sm text-zinc-500">
                  {post.branch_name} · {post.keyword}
                </p>

                <h3 className="mt-1 text-2xl font-black">{post.title}</h3>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEdit(post)}
                    className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => copy(post.content)}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-black"
                  >
                    본문 복사
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