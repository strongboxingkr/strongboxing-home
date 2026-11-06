import { db } from "@/lib/db";
import NaverReviewsClient from "./NaverReviewsClient";

export const dynamic = "force-dynamic";

interface Props {
  branchName?: string;
}

export default async function NaverReviewsSection({ branchName }: Props = {}) {
  const [rows]: any = branchName
    ? await db.query(
        `SELECT * FROM homepage_naver_reviews WHERE is_active = 1 AND branch_name = ? ORDER BY review_date DESC, id DESC`,
        [branchName]
      )
    : await db.query(
        `SELECT * FROM homepage_naver_reviews WHERE is_active = 1 ORDER BY review_date DESC, id DESC`
      );

  const reviews = rows;

  if (reviews.length === 0) {
    return null;
  }

  const heading = branchName
    ? <>{branchName} 회원들이 직접 남긴<br />네이버 리뷰</>
    : <>회원들이 직접 남긴<br />네이버 리뷰</>;

  return (
    <section className="bg-[#111214] px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <div className="reveal mb-4">
            <p className="text-xs font-black tracking-[0.35em]" style={{ color: "#03C75A" }}>
              NAVER REVIEWS
            </p>
          </div>

          <h2 className="reveal d1 font-black leading-[0.88]" style={{ fontSize: "clamp(32px, 5vw, 64px)", letterSpacing: "-0.05em", color: "#F5F4F1" }}>
            {heading}
          </h2>

          <div className="mt-5 h-[2px] w-14" style={{ background: "#03C75A" }} />
        </div>

        <NaverReviewsClient reviews={reviews} branchMode={!!branchName} />

      </div>
    </section>
  );
}