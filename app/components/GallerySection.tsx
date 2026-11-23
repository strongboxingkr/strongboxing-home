const gallery = [
  "/images/gallery/moments/story1.jpg",
  "/images/gallery/moments/story2.jpg",
  "/images/gallery/moments/story3.jpg",
  "/images/gallery/moments/story4.jpg",
  "/images/gallery/moments/story5.jpg",
  "/images/gallery/moments/story6.jpg",
];

export default function GallerySection({ compact = false }: { compact?: boolean } = {}) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.map((src, index) => (
          <figure key={src} className="m-0">
            <img src={src} alt={src === gallery[2] ? "프로복싱 대회 현장에서 경기 전 준비하는 모습" : `스트롱복싱 활동기록 ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-[4px] object-cover" />
          </figure>
        ))}
      </div>
    );
  }
  return (
    <section className="bg-[#111214] px-6 py-28">
      <div className="mx-auto max-w-7xl">

        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-black tracking-[0.35em] text-[#FC5230]">
            STRONG MOMENTS
          </p>

          <h2 className="text-5xl font-black tracking-[-0.05em] text-white">
            스트롱복싱의 기록
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {/* 1 */}
          <div className="overflow-hidden rounded-[4px] border border-white/10">
            <img
              src={gallery[0]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 2 */}
          <div className="overflow-hidden rounded-[4px] border border-white/10">
            <img
              src={gallery[1]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 4 */}
          <div className="overflow-hidden rounded-[4px] border border-white/10">
            <img
              src={gallery[2]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 3 (큰 사진) */}
          <div className="overflow-hidden rounded-[4px] border border-white/10 md:col-span-2">
            <img
              src={gallery[3]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 5 + 6 */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[4px] border border-white/10">
              <img
                src={gallery[4]}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="overflow-hidden rounded-[4px] border border-white/10">
              <img
                src={gallery[5]}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}