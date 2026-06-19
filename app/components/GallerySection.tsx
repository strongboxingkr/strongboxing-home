const gallery = [
  "/images/gallery/moments/story1.jpg",
  "/images/gallery/moments/story2.jpg",
  "/images/gallery/moments/story3.jpg",
  "/images/gallery/moments/story4.jpg",
  "/images/gallery/moments/story5.jpg",
  "/images/gallery/moments/story6.jpg",
];

export default function GallerySection() {
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
          <div className="overflow-hidden rounded-[30px] border border-white/10">
            <img
              src={gallery[0]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 2 */}
          <div className="overflow-hidden rounded-[30px] border border-white/10">
            <img
              src={gallery[1]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 4 */}
          <div className="overflow-hidden rounded-[30px] border border-white/10">
            <img
              src={gallery[2]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 3 (큰 사진) */}
          <div className="overflow-hidden rounded-[30px] border border-white/10 md:col-span-2">
            <img
              src={gallery[3]}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* 5 + 6 */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-white/10">
              <img
                src={gallery[4]}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10">
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