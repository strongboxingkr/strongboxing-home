import { db } from "@/lib/db";
import ReelsClient from "./ReelsClient";

export const dynamic = "force-dynamic";

export default async function ReelsSection() {
  const [rows]: any = await db.query(`
    SELECT id, branch_name, title, video_url, is_muted
    FROM homepage_reels
    WHERE is_active = 1
    ORDER BY sort_order ASC, id DESC
  `);

  const reels = rows;

  if (reels.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#16171A] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            STRONG CLIP
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
            Inside STRONG BOXING
          </h2>

          <div className="mx-auto mt-5 h-[3px] w-20 rounded-full bg-[#FC5230]" />
        </div>

        <ReelsClient reels={reels} />

      </div>
    </section>
  );
}