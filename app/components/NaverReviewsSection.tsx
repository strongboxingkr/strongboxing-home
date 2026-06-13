import { db } from "@/lib/db";
import NaverReviewsClient from "./NaverReviewsClient";

export const dynamic = "force-dynamic";

export default async function NaverReviewsSection() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_naver_reviews
    WHERE is_active = 1
    ORDER BY id DESC
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

        <NaverReviewsClient reviews={reviews} />

      </div>
    </section>
  );
}