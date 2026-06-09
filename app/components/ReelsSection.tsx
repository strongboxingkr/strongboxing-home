import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReelsSection() {
  const [rows]: any = await db.query(`
    SELECT id, branch_name, title, video_url
    FROM homepage_reels
    WHERE is_active = 1
    ORDER BY sort_order ASC, id DESC
    LIMIT 6
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

        <div className="grid gap-5 md:grid-cols-3">
          {reels.map((reel: any) => (
            <div
              key={reel.id}
              className="overflow-hidden rounded-3xl border border-[#FC5230]/20 bg-[#202126]"
            >
              <video
                src={reel.video_url}
                controls
                preload="metadata"
                className="aspect-video w-full bg-black object-cover"
              />

              <div className="p-5">
                <p className="mb-1 text-xs font-black tracking-[0.2em] text-[#FC5230]">
                  {reel.branch_name}
                </p>

                <p className="font-bold text-white">{reel.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}