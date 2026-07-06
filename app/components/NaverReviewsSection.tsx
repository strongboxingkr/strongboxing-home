import { db } from "@/lib/db";
import NaverReviewsClient from "./NaverReviewsClient";

export const dynamic = "force-dynamic";

export default async function NaverReviewsSection() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM homepage_naver_reviews
    WHERE is_active = 1
    ORDER BY review_date DESC, id DESC
  `);

  const reviews = rows;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#111214] px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="reveal mb-3 text-xs font-black tracking-[0.35em]" style={{ color: "#D01E2E" }}>
            REAL NAVER REVIEWS
          </p>

          <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(32px, 5vw, 64px)", letterSpacing: "-0.05em", color: "#F5F4F1" }}>
            회원들이 직접 남긴<br />네이버 리뷰
          </h2>

          <div className="mt-5 h-[2px] w-14" style={{ background: "#D01E2E" }} />
        </div>

        <NaverReviewsClient reviews={reviews} />

      </div>
    </section>
  );
}