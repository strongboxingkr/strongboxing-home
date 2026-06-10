"use client";

import { useEffect, useState } from "react";

export default function RepliesPage() {
  const [replies, setReplies] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [category, setCategory] = useState("가격문의");
  const [branchName, setBranchName] = useState("공통");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  async function loadReplies() {
    const res = await fetch("/api/replies");
    const data = await res.json();

    if (data.ok) {
      setReplies(data.replies);
    }
  }

  useEffect(() => {
    loadReplies();
  }, []);

  async function saveReply() {
    if (!title || !content) {
      alert("제목과 내용을 입력해줘.");
      return;
    }

    const res = await fetch("/api/replies", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      id: editingId,
      category,
      branch_name: branchName,
      title,
      content,
      is_pinned: isPinned ? 1 : 0,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("저장 실패");
      return;
    }

    alert("저장 완료!");

    setEditingId(null);
    setTitle("");
    setContent("");
    setIsPinned(false);

    loadReplies();
  }

  async function deleteReply(id: number) {
    if (!confirm("삭제할까요?")) return;

    await fetch("/api/replies", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadReplies();
  }

  function editReply(reply: any) {
    setEditingId(reply.id);
    setCategory(reply.category);
    setBranchName(reply.branch_name);
    setTitle(reply.title);
    setContent(reply.content);
    setIsPinned(reply.is_pinned === 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function copyReply(text: string) {
    navigator.clipboard.writeText(text);
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">

        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#2DD4BF]">
          CRM REPLIES
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          답장 템플릿
        </h1>

        <p className="mb-10 text-zinc-400">
          인스타 · 문자 · 카카오 문의 답장 관리
        </p>

        <section className="space-y-5 rounded-[30px] border border-white/10 bg-[#171719] p-6">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full rounded-2xl border border-white/10 bg-black p-4"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답장 내용"
            className="h-60 w-full rounded-2xl border border-white/10 bg-black p-4"
          />

          <label className="flex items-center gap-3 text-sm font-bold text-zinc-300">
            <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
            />
            ⭐ 즐겨찾기 상단 고정
          </label>

          <button
            onClick={saveReply}
            className="w-full rounded-full bg-[#FC5230] px-8 py-5 font-black"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>
        </section>

        <section className="mt-14 space-y-4">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-6"
            >
               {reply.is_pinned === 1 && (
               <p className="mb-3 text-sm font-black text-[#2DD4BF]">⭐ 고정 답장</p>
               )}

              <h2 className="text-2xl font-black">
                {reply.title}
              </h2>

              <pre className="mt-4 whitespace-pre-wrap text-zinc-300">
                {reply.content}
              </pre>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  onClick={() => copyReply(reply.content)}
                  className="rounded-full bg-[#FC5230] px-5 py-3 text-sm font-black"
                >
                  전체 복사
                </button>

                <button
                  onClick={() => editReply(reply)}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-black"
                >
                  수정
                </button>

                <button
                  onClick={() => deleteReply(reply.id)}
                  className="rounded-full border border-red-500 px-5 py-3 text-sm font-black text-red-400"
                >
                  삭제
                </button>

              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}