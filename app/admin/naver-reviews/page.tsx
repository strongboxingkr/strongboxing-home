"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  branch_name: "철산점",
  reviewer_name: "",
  rating: 5,
  content: "",
  image_url: "",
  review_date: "",
  is_active: false,
  sort_order: 0,
};

export default function NaverReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const res = await fetch("/api/naver-reviews");
    const data = await res.json();

    if (data.ok) {
      setReviews(data.reviews);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "blog");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!data.ok) {
      alert(data.message || "이미지 업로드 실패");
      return;
    }

    setForm((prev: any) => ({
      ...prev,
      image_url: data.url,
    }));

    alert("이미지 업로드 완료!");
  }

  async function saveReview() {
    if (!form.content) {
      alert("리뷰 내용을 입력해줘.");
      return;
    }

    const res = await fetch("/api/naver-reviews", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingId,
        ...form,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("저장 실패");
      return;
    }

    alert(editingId ? "수정 완료" : "저장 완료");

    setEditingId(null);
    setForm(emptyForm);
    loadReviews();
  }

  function editReview(review: any) {
    setEditingId(review.id);
    setForm({
      branch_name: review.branch_name || "철산점",
      reviewer_name: review.reviewer_name || "",
      rating: review.rating || 5,
      content: review.content || "",
      image_url: review.image_url || "",
      review_date: review.review_date || "",
      is_active: review.is_active === 1,
      sort_order: review.sort_order || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteReview(id: number) {
    if (!confirm("삭제할까요?")) return;

    await fetch("/api/naver-reviews", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadReviews();
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#22C55E]">
          NAVER REVIEWS
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          네이버 리뷰 관리
        </h1>

        <p className="mb-10 text-zinc-400">
          네이버 리뷰 캡처와 내용을 저장하고 홈페이지 노출 여부를 관리합니다.
        </p>

        <section className="grid gap-5 rounded-[30px] border border-white/10 bg-[#171719] p-6 md:grid-cols-2">
          <select
            value={form.branch_name}
            onChange={(e) =>
              setForm({ ...form, branch_name: e.target.value })
            }
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          <input
            value={form.reviewer_name}
            onChange={(e) =>
              setForm({ ...form, reviewer_name: e.target.value })
            }
            placeholder="리뷰어 이름 예: 김○○"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option value={5}>★★★★★ 5점</option>
            <option value={4}>★★★★ 4점</option>
            <option value={3}>★★★ 3점</option>
          </select>

          <input
            value={form.review_date}
            onChange={(e) =>
              setForm({ ...form, review_date: e.target.value })
            }
            placeholder="리뷰 날짜 예: 2026.06"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <textarea
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="네이버 리뷰 내용을 복붙"
            className="h-40 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
              e.target.value = "";
            }}
            className="rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          {form.image_url && (
            <img
              src={form.image_url}
              alt="리뷰 캡처"
              className="max-h-[300px] rounded-2xl border border-white/10 object-contain md:col-span-2"
            />
          )}

          <input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: Number(e.target.value) })
            }
            placeholder="노출 순서"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black p-4 font-bold">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            홈페이지 노출 승인
          </label>

          <button
            onClick={saveReview}
            className="rounded-full bg-[#22C55E] px-8 py-5 font-black text-black md:col-span-2"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[#22C55E]">
                  {review.branch_name}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    review.is_active === 1
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-500/20 text-zinc-400"
                  }`}
                >
                  {review.is_active === 1 ? "노출중" : "비노출"}
                </span>
              </div>

              <p className="text-lg font-black">
                {"★".repeat(review.rating || 5)}
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {review.reviewer_name || "익명"} · {review.review_date || "-"}
              </p>

              <p className="mt-4 line-clamp-5 whitespace-pre-wrap leading-7 text-zinc-300">
                {review.content}
              </p>

              {review.image_url && (
                <img
                  src={review.image_url}
                  alt="네이버 리뷰 캡처"
                  className="mt-4 h-40 w-full rounded-2xl border border-white/10 object-cover"
                />
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => editReview(review)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-black"
                >
                  수정
                </button>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded-full border border-red-500 px-4 py-2 text-sm font-black text-red-400"
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