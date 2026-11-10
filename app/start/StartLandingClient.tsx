"use client";

import { useState, useRef, useEffect } from "react";
import {
  trackEvent,
  trackPhoneClick,
  trackKakaoClick,
  trackNaverReservationClick,
} from "@/lib/gtag";

interface Branch {
  slug: string;
  name: string;
  area: string;
  address: string;
  hours: string[];
  phone: string;
  booking: string;
  naverMap: string;
  kakaoChat?: string;
  image: string;
}

const BRANCHES: Branch[] = [
  {
    slug: "gaebong",
    name: "개봉점",
    area: "서울 구로구",
    address: "개봉동 166-5 유원빌딩 지하 1층",
    hours: ["월-금 13:00~23:00"],
    phone: "02-2060-1279",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440071?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/5aFquqcz",
    kakaoChat: "https://pf.kakao.com/_uyxbnX/chat",
    image: "/images/branches/gaebong.jpg",
  },
  {
    slug: "sinjeong",
    name: "신정점",
    area: "서울 양천구",
    address: "신정동 1021-7 태화상가 2층",
    hours: ["월-금 10:00~24:00", "토 10:00~16:00"],
    phone: "02-2647-3373",
    booking: "https://booking.naver.com/booking/13/bizes/1367177",
    naverMap: "https://naver.me/5nhXvzXH",
    kakaoChat: "http://pf.kakao.com/_rxoQxiX/chat",
    image: "/images/branches/sinjeong.jpg",
  },
  {
    slug: "mokdong",
    name: "목동점",
    area: "서울 양천구",
    address: "목동 909-6 우방빌딩 4층",
    hours: ["월-금 14:00~24:00", "토 11:00~16:00"],
    phone: "02-2643-5971",
    booking: "https://booking.naver.com/booking/13/bizes/1510638",
    naverMap: "https://naver.me/GII8f9Qv",
    kakaoChat: "http://pf.kakao.com/_xfGZnX/chat",
    image: "/images/branches/mokdong.png",
  },
  {
    slug: "cheolsan",
    name: "철산점",
    area: "경기 광명시",
    address: "철산동 56-14 3층",
    hours: ["월-금 14:00~23:00", "토·일 14:00~18:00"],
    phone: "02-2066-0406",
    booking: "https://booking.naver.com/booking/12/bizes/1673598",
    naverMap: "https://naver.me/F8lwn3Te",
    kakaoChat: "https://pf.kakao.com/_MAKnX/chat",
    image: "/images/branches/cheolsan.jpg",
  },
  {
    slug: "yeongdeungpo",
    name: "영등포점",
    area: "서울 영등포구",
    address: "도림로 313 건영상가 2층",
    hours: ["월-금 13:00~23:00"],
    phone: "02-831-9312",
    booking:
      "https://m.booking.naver.com/booking/13/bizes/1440022?theme=place&entry=pll&lang=ko&area=pll",
    naverMap: "https://naver.me/G4yQwkR0",
    image: "/images/branches/yeongdeungpo.jpg",
  },
];

const BENEFITS = [
  {
    icon: "🥊",
    title: "처음이어도 OK",
    desc: "운동 경험이 없어도 괜찮습니다. 기초 자세와 스텝부터 개인 수준에 맞춰 안내해 드립니다.",
  },
  {
    icon: "👤",
    title: "개인 맞춤 수업",
    desc: "운영 시간 내 방문하면 목적과 진도에 맞춰 1:1로 진행됩니다. 그룹 수업이 아닙니다.",
  },
  {
    icon: "💪",
    title: "다이어트 & 체력",
    desc: "복싱은 유산소와 근력이 결합된 전신 운동입니다. 체중 관리와 체력 향상에 효과적입니다.",
  },
];

const STEPS = [
  { step: 1, title: "도착 & 준비", desc: "탈의실에서 운동복으로 갈아입고 글러브를 착용합니다." },
  { step: 2, title: "준비운동", desc: "줄넘기와 스트레칭으로 몸을 충분히 풀어줍니다." },
  { step: 3, title: "기본기 훈련", desc: "스텝, 잽, 스트레이트 등 기본 콤비네이션을 배웁니다." },
  { step: 4, title: "샌드백 타격", desc: "배운 동작을 샌드백에 직접 적용해 봅니다." },
  { step: 5, title: "미트 훈련", desc: "코치와 1:1 미트 훈련으로 실전 감각을 키웁니다." },
  { step: 6, title: "쿨다운", desc: "스트레칭으로 마무리하고 목표·진도를 코치와 조율합니다." },
];

const FAQS = [
  {
    q: "복싱 경험이 없어도 되나요?",
    a: "처음이신 분들도 기초 자세와 스텝부터 개인 수준에 맞춰 안내해 드립니다. 대부분의 회원이 처음 시작하는 분들입니다.",
  },
  {
    q: "여성도 다닐 수 있나요?",
    a: "여성 회원분들도 다이어트와 체력 향상 목적으로 편하게 운동하고 계십니다. 부담 없는 환경에서 목표에 맞게 진행됩니다.",
  },
  {
    q: "상담은 어떻게 신청하나요?",
    a: "지점을 선택한 후 카카오 상담 또는 전화로 문의해 주세요. 방문 가능 시간을 조율해 드립니다.",
  },
  {
    q: "운동 목적이 다이어트인데 복싱이 맞나요?",
    a: "복싱은 전신 유산소+근력 운동이라 체중 관리와 체력 향상에 도움이 됩니다. 목적에 맞게 수업을 조율해 드립니다.",
  },
];

export default function StartLandingClient() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [branchInView, setBranchInView] = useState(false);
  const branchRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = branchRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBranchInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedBranch = BRANCHES.find((b) => b.slug === selectedSlug) ?? null;
  const showBottomBar = !!selectedBranch || !branchInView;

  const scrollToBranch = () => {
    branchRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBranchSelect = (slug: string) => {
    const branch = BRANCHES.find((b) => b.slug === slug);
    if (!branch) return;
    setSelectedSlug(slug);
    trackEvent("branch_select", { branch_name: branch.name });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0E0E10] text-white">
      {/* 상단 로고 */}
      <header
        className="fixed left-0 right-0 top-0 z-40 flex items-center px-5 py-3.5"
        style={{
          background: "rgba(14,14,16,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <a href="/" className="text-[13px] font-black tracking-tight text-[#F5F4F1]">
          STRONG<span className="text-[#D01E2E]">BOXING</span>
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-14">
        {/* 배경 사진 */}
        <div className="absolute inset-0">
          <img
            src="/images/gallery/moments/story2.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(14,14,16,0.82) 70%, #0E0E10 100%)",
            }}
          />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 px-5 pb-16 pt-10 text-center">
          <p className="mb-4 text-[11px] font-black tracking-[0.4em] text-[#D01E2E]">
            STRONG BOXING
          </p>

          <h1
            className="mb-5 font-black tracking-[-0.03em] text-[#F5F4F1]"
            style={{ fontSize: "clamp(32px, 9vw, 60px)", lineHeight: 1.1 }}
          >
            내 시간에 맞춰,
            <br />
            내 수준에 맞춰
            <br />
            배우는 복싱
          </h1>

          <p className="mb-1 text-[14px] leading-[1.75] text-[#C9C9C9]">
            정해진 수업시간 없이 편한 시간에.
          </p>
          <p className="mb-2 text-[14px] leading-[1.75] text-[#C9C9C9]">
            선수 출신 지도진에게 기본자세부터
            <br />
            차근차근 배웁니다.
          </p>
          <p className="mb-8 text-[12px] font-bold text-[#8A8D91]">서울·광명 5개 지점</p>

          <button
            onClick={scrollToBranch}
            className="rounded-[12px] bg-[#D01E2E] px-8 py-4 text-[15px] font-black text-white transition hover:bg-[#B71C2B] active:scale-95"
          >
            가까운 지점 찾기 →
          </button>
        </div>
      </section>

      {/* ── 지점 선택 ── */}
      <section ref={branchRef} className="px-4 pb-16 pt-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-center text-[11px] font-black tracking-[0.3em] text-[#D01E2E]">
            LOCATION
          </p>
          <h2 className="mb-3 text-center text-[22px] font-black tracking-tight text-[#F5F4F1]">
            가까운 스트롱복싱을
            <br />
            찾아보세요
          </h2>
          <p className="mb-8 text-center text-[13px] text-[#9A9EA5]">
            지점을 선택하면 위치와 상담·예약 방법을 확인할 수 있습니다.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BRANCHES.map((b) => {
              const isSelected = selectedSlug === b.slug;
              return (
                <button
                  key={b.slug}
                  onClick={() => handleBranchSelect(b.slug)}
                  className="relative overflow-hidden rounded-[12px] text-left transition-all"
                  style={{
                    border: isSelected ? "2px solid #D01E2E" : "2px solid rgba(255,255,255,0.1)",
                    background: isSelected ? "#1C1C1F" : "#161618",
                    boxShadow: isSelected ? "0 0 0 1px rgba(208,30,46,0.2)" : "none",
                  }}
                >
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={b.image}
                      alt={`스트롱복싱 ${b.name}`}
                      className="h-full w-full object-cover transition-opacity"
                      style={{ opacity: isSelected ? 1 : 0.55 }}
                    />
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D01E2E] text-[10px] font-black text-white">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-black text-[#F5F4F1]">{b.name}</p>
                    <p className="text-[11px] text-[#9A9EA5]">{b.area}</p>
                    <p className="mt-1.5 text-[10px] font-bold text-[#D01E2E]">
                      위치·상담 보기
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 선택된 지점 정보 */}
          {selectedBranch && (
            <div
              className="mt-5 rounded-[16px] p-5"
              style={{
                background: "#1C1C1F",
                border: "1px solid rgba(208,30,46,0.35)",
              }}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-black tracking-[0.25em] text-[#D01E2E]">
                    선택된 지점
                  </p>
                  <p className="mt-0.5 text-[18px] font-black text-[#F5F4F1]">
                    스트롱복싱 {selectedBranch.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSlug(null)}
                  className="mt-0.5 shrink-0 text-[12px] text-[#5A5C61] transition hover:text-[#F5F4F1]"
                >
                  변경
                </button>
              </div>

              <div className="mb-5 flex flex-col gap-1">
                <p className="text-[13px] text-[#9A9EA5]">📍 {selectedBranch.address}</p>
                <p className="text-[12px] text-[#7A7D82]">
                  🕐 {selectedBranch.hours.join(" / ")}
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`tel:${selectedBranch.phone.replaceAll("-", "")}`}
                  onClick={() =>
                    trackPhoneClick({
                      branch_name: selectedBranch.name,
                      phone: selectedBranch.phone,
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-[10px] bg-[#D01E2E] py-3.5 text-[14px] font-black text-white transition hover:bg-[#B71C2B]"
                >
                  📞 전화 문의 · {selectedBranch.phone}
                </a>

                {selectedBranch.kakaoChat && (
                  <a
                    href={selectedBranch.kakaoChat}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackKakaoClick({ branch_name: selectedBranch.name })
                    }
                    className="flex items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-black"
                    style={{ background: "#FEE500", color: "#1C1C1F" }}
                  >
                    카카오 상담
                  </a>
                )}

                <a
                  href={selectedBranch.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackNaverReservationClick({ branch_name: selectedBranch.name })
                  }
                  className="flex items-center justify-center rounded-[10px] border border-white/10 py-3.5 text-[14px] font-black text-[#F5F4F1] transition hover:border-white/20"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  네이버 예약
                </a>

                <a
                  href={selectedBranch.naverMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("navermap_click", { branch_name: selectedBranch.name })
                  }
                  className="flex items-center justify-center rounded-[10px] border border-white/10 py-3.5 text-[14px] font-black text-[#9A9EA5] transition hover:border-white/20 hover:text-white"
                >
                  위치 보기 →
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 혜택 ── */}
      <section className="px-4 py-16" style={{ background: "#0A0A0C" }}>
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-center text-[11px] font-black tracking-[0.3em] text-[#D01E2E]">
            WHY STRONG BOXING
          </p>
          <h2 className="mb-10 text-center text-[22px] font-black tracking-tight text-[#F5F4F1]">
            이런 분들께 맞습니다
          </h2>

          <div className="flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-4 rounded-[12px] p-5"
                style={{ background: "#1C1C1F" }}
              >
                <span className="mt-0.5 text-2xl">{b.icon}</span>
                <div>
                  <p className="mb-1 text-[15px] font-black text-[#F5F4F1]">{b.title}</p>
                  <p className="text-[13px] leading-[1.7] text-[#8A8D91]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 하루 루틴 ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-center text-[11px] font-black tracking-[0.3em] text-[#D01E2E]">
            ONE DAY FLOW
          </p>
          <h2 className="mb-3 text-center text-[22px] font-black tracking-tight text-[#F5F4F1]">
            수업은 이렇게 진행됩니다
          </h2>
          <p className="mb-10 text-center text-[13px] text-[#8A8D91]">
            처음 오신 분도 코치가 처음부터 안내해 드립니다
          </p>

          {/* 코치 사진 */}
          <div className="mb-10 overflow-hidden rounded-[14px]">
            <img
              src="/images/coaches/hansol.jpg"
              alt="스트롱복싱 코치 지도 모습"
              className="h-48 w-full object-cover object-top"
            />
          </div>

          <div className="flex flex-col">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D01E2E] text-[12px] font-black text-white">
                    {s.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-[2px] flex-1"
                      style={{ background: "rgba(208,30,46,0.2)", minHeight: 28 }}
                    />
                  )}
                </div>
                <div className="pb-7">
                  <p className="mb-1 text-[15px] font-black text-[#F5F4F1]">{s.title}</p>
                  <p className="text-[13px] leading-[1.7] text-[#8A8D91]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16" style={{ background: "#0A0A0C" }}>
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-center text-[11px] font-black tracking-[0.3em] text-[#D01E2E]">
            FAQ
          </p>
          <h2 className="mb-10 text-center text-[22px] font-black tracking-tight text-[#F5F4F1]">
            자주 묻는 질문
          </h2>

          <div className="flex flex-col gap-2">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[12px]"
                style={{ background: "#1C1C1F" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-black text-[#F5F4F1]">{f.q}</span>
                  <span
                    className="shrink-0 text-[20px] font-black text-[#D01E2E] transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-[13px] leading-[1.7] text-[#8A8D91]">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="px-4 py-20 text-center"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(208,30,46,0.08) 0%, transparent 70%)",
          paddingBottom: "max(80px, calc(env(safe-area-inset-bottom) + 80px))",
        }}
      >
        <div className="mx-auto max-w-xl">
          <p className="mb-4 text-[11px] font-black tracking-[0.3em] text-[#D01E2E]">
            GET STARTED
          </p>
          <h2 className="mb-4 text-[26px] font-black tracking-tight text-[#F5F4F1]">
            지금 시작해보세요
          </h2>
          <p className="mb-8 text-[14px] leading-[1.8] text-[#8A8D91]">
            운동 경험이 없어도 괜찮습니다.
            <br />
            지점을 선택하고 편한 방법으로 문의해 주세요.
          </p>
          <button
            onClick={scrollToBranch}
            className="rounded-[12px] bg-[#D01E2E] px-10 py-4 text-[15px] font-black text-white transition hover:bg-[#B71C2B] active:scale-95"
          >
            지점 선택하기 →
          </button>
        </div>
      </section>

      {/* ── 하단 고정 바 ── */}
      {showBottomBar && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-2"
          style={{
            background: "rgba(14,14,16,0.97)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          }}
        >
          {!selectedBranch ? (
            <button
              onClick={scrollToBranch}
              className="mb-2 w-full rounded-[12px] bg-[#D01E2E] py-4 text-[15px] font-black text-white transition hover:bg-[#B71C2B] active:scale-95"
            >
              가까운 지점 찾기 →
            </button>
          ) : (
            <div className="mb-2 flex gap-2">
              <a
                href={`tel:${selectedBranch.phone.replaceAll("-", "")}`}
                onClick={() =>
                  trackPhoneClick({
                    branch_name: selectedBranch.name,
                    phone: selectedBranch.phone,
                  })
                }
                className="flex w-20 shrink-0 items-center justify-center rounded-[12px] border border-white/10 py-4 text-[13px] font-black text-[#F5F4F1] transition hover:border-white/20"
              >
                📞 전화
              </a>
              {selectedBranch.kakaoChat ? (
                <a
                  href={selectedBranch.kakaoChat}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackKakaoClick({ branch_name: selectedBranch.name })
                  }
                  className="flex flex-1 items-center justify-center rounded-[12px] py-4 text-[14px] font-black"
                  style={{ background: "#FEE500", color: "#1C1C1F" }}
                >
                  {selectedBranch.name} 카카오 상담
                </a>
              ) : (
                <a
                  href={selectedBranch.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackNaverReservationClick({ branch_name: selectedBranch.name })
                  }
                  className="flex flex-1 items-center justify-center rounded-[12px] bg-[#D01E2E] py-4 text-[14px] font-black text-white"
                >
                  {selectedBranch.name} 네이버 예약
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
