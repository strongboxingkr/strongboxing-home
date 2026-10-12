import type { Metadata } from "next";
import MarkdownContent from "@/app/blog/[slug]/MarkdownContent";
import { ensureSchema } from "@/lib/blog-auto/schema";
import { getDraft } from "@/lib/blog-auto/repo";
import { isPublishable } from "@/lib/blog-auto/render";

export const metadata: Metadata = {
  title: { absolute: "초안 미리보기 | 스트롱복싱" },
  robots: { index: false, follow: false },
};

/** 관리자 전용 미리보기 — 공개 블로그 글과 같은 본문 스타일, 이미지 자리표시 포함 */
export default async function DraftPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureSchema();
  const d = await getDraft(Number(id));

  if (!d) {
    return <main className="min-h-screen bg-[#0E0E10] px-6 py-24 text-white">초안을 찾을 수 없습니다.</main>;
  }

  const cover = d.images.find((i) => i.role === "cover");
  const ogImage = cover && isPublishable(cover) ? cover.url : null;
  const readMin = Math.max(1, Math.ceil(d.content_html.replace(/<[^>]*>/g, "").length / 300));

  return (
    <main className="min-h-screen bg-[#0E0E10] text-white">
      <div className="sticky top-0 z-40 border-b border-[#FC5230]/40 bg-[#1A1212] px-6 py-3 text-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <span className="font-black text-[#FC5230]">미리보기 · 공개되지 않은 초안</span>
          <a href={`/admin/blog-auto/${d.id}`} className="text-[#C8CACD] underline">검토 화면으로</a>
          <span className="ml-auto text-xs text-[#8A8D91]">공개 주소 예정: /blog/{d.slug}</span>
        </div>
      </div>

      {/* 검색·공유 정보 미리보기 */}
      <section className="px-6 pt-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#141416] p-5 text-sm">
          <p className="mb-3 text-[10px] font-black tracking-[0.3em] text-[#5A5C61]">SEARCH · SHARE</p>
          <div className="flex flex-col gap-4 md:flex-row">
            {ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ogImage} alt={cover?.alt ?? ""} className="w-full rounded-xl border border-white/10 md:w-64" />
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-[#8A8D91] md:w-64">
                대표 이미지 없음 → og.png 사용
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-[#8A8D91]">strongboxing.kr › blog › {d.slug}</p>
              <p className="mt-1 text-lg font-bold text-[#8AB4F8]">{d.title} | 스트롱복싱</p>
              <p className="mt-1 leading-6 text-[#C8CACD]">{d.description}</p>
            </div>
          </div>
        </div>
      </section>

      <article>
        <section className="px-6 py-12 md:py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-[#D01E2E] px-3 py-1 text-xs font-black">스트롱복싱</span>
              <span className="rounded-full border border-[#4A4C50]/30 px-3 py-1 text-xs text-[#8A8D91]">복싱정보</span>
              <span className="text-xs text-[#4A4C50]">{readMin}분 읽기</span>
            </div>
            <h1 className="text-[28px] font-black leading-[1.35] tracking-[-0.04em] md:text-[36px] md:leading-[1.28]">{d.title}</h1>
          </div>
        </section>

        <section className="px-6 py-10 md:py-14">
          <div className="mx-auto max-w-4xl">
            <MarkdownContent content={d.content_html} />
            <p className="mt-16 border-t border-white/10 pt-6 text-xs text-[#5A5C61]">
              발행하면 이 아래에 기존 블로그와 같은 관련 글 목록, 지점 둘러보기, 상담 예약 안내가 자동으로 붙습니다.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
