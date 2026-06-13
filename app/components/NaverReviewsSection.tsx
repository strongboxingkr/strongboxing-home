import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NaverReviewsSection() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_naver_reviews
    WHERE is_active = 1
    ORDER BY sort_order ASC, id DESC
    LIMIT 6
  `);

  const reviews = rows;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#111214] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#22C55E]">
            REAL NAVER REVIEWS
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            네이버 리뷰로 확인하는 스트롱복싱
          </h2>

          <div className="mx-auto mt-5 h-[3px] w-20 rounded-full bg-[#22C55E]" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="rounded-[30px] border border-[#22C55E]/20 bg-[#171719] p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[#22C55E]">
                  {review.branch_name}
                </p>

                <p className="text-sm text-zinc-500">
                  {review.review_date || ""}
                </p>
              </div>

              <p className="text-sm font-black tracking-[0.2em] text-[#22C55E]">
                NAVER REVIEW
              </p>

              <p className="mt-3 text-sm text-zinc-400">
                {review.reviewer_name || "네이버 리뷰"}
              </p>

              <p className="mt-4 line-clamp-6 whitespace-pre-wrap leading-7 text-zinc-300">
                {review.content}
              </p>

              {review.image_url && (
                <img
                  src={review.image_url}
                  alt="네이버 리뷰 캡처"
                  className="mt-5 h-48 w-full rounded-2xl border border-white/10 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}