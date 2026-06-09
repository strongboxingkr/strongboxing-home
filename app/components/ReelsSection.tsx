export default function ReelsSection() {
  return (
    <section className="px-6 py-28 bg-[#16171A]">
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

          <div className="overflow-hidden rounded-3xl border border-[#FC5230]/20 bg-[#202126]">
            <video
              src="/videos/sample.mp4"
              controls
              className="w-full"
            />

            <div className="p-5">
              <p className="font-bold text-white">
                철산점 체력운동 시간
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}