"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const quickQuestions = [
  "여자 혼자 가도 되나요?",
  "운동 처음인데 가능?",
  "다이어트 효과 있나요?",
  "키즈반 있나요?",
  "무릎 안 좋아도 가능?",
];

export default function AiCoachChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text:
      "안녕하세요 🥊 스트롱복싱 AI 상담입니다!\n복싱 입문, 다이어트, 운동 방식, 회원권 관련 내용을 편하게 물어보세요.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function getBotReply(text: string) {
    const q = text.toLowerCase();

    if (
      q.includes("가격") ||
      q.includes("회원권") ||
      q.includes("비용") ||
      q.includes("얼마")
    ) {
      return "회원권/가격은 지점별 이벤트와 할인 내용이 달라 정확한 안내를 위해 방문 상담을 도와드리고 있습니다🙂\n아래 버튼으로 신청 남겨주시면 빠르게 도와드릴게요!";
    }

    if (q.includes("여자") || q.includes("혼자")) {
      return "네, 여자 혼자 오시는 회원님들도 많아요 🙂\n처음 오셔도 기초부터 천천히 알려드려서 부담 없이 시작하실 수 있습니다.";
    }

    if (q.includes("처음") || q.includes("초보")) {
      return "운동이 처음이어도 괜찮습니다 🥊\n스트롱복싱은 자세, 스텝, 펀치부터 단계별로 진행해서 초보자도 쉽게 적응할 수 있어요.";
    }

    if (q.includes("다이어트") || q.includes("살")) {
      return "복싱은 유산소와 근력운동이 같이 들어가서 다이어트 만족도가 높은 운동입니다 🔥\n주 3회 이상 꾸준히 하면 체력과 라인 변화도 느끼기 좋아요.";
    }

    if (q.includes("키즈") || q.includes("아이") || q.includes("초등")) {
      return "키즈 수업은 지점별 운영 여부가 다를 수 있어요 🙂\n원하시는 지점으로 방문 상담 예약을 남겨주시면 가능 시간과 수업 안내를 도와드릴게요.";
    }

    if (q.includes("무릎") || q.includes("허리") || q.includes("아파")) {
      return "무릎이나 허리가 불편하신 경우에는 무리한 동작을 줄이고 가능한 범위에서 안내드릴 수 있어요.\n다만 상태에 따라 다르니 방문 상담 때 꼭 말씀해주세요 🙂";
    }

    if (q.includes("준비물") || q.includes("복장") || q.includes("뭐 입")) {
      return "편한 운동복과 실내용 운동화면 충분합니다 🙂\n 필요한 기본 장비는 지점에서 안내받으실 수 있어요.";
    }

    if (
      q.includes("지점") ||
      q.includes("목동") ||
      q.includes("신정") ||
      q.includes("개봉") ||
      q.includes("철산") ||
      q.includes("영등포")
    ) {
      return "스트롱복싱은 목동점, 신정점, 개봉점, 철산점, 영등포점이 있습니다 🥊\n가까운 지점을 선택해서 방문 상담 예약을 남겨주세요.";
    }

    return "좋은 질문이에요 🙂\n복싱 입문, 다이어트, 수업 방식, 지점 상담 모두 도와드릴 수 있습니다.\n더 자세한 안내는 방문 상담으로 연결해드릴게요!";
  }

  function sendMessage(text?: string) {
    const finalText = text || input;

    if (!finalText.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: finalText,
    };

    const botMessage: Message = {
      role: "bot",
      text: getBotReply(finalText),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[9999] rounded-[10px] bg-[#D01E2E] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#B71C2B]"
      >
        💬 AI 복싱 상담
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[9999] flex h-[620px] w-[360px] max-w-[calc(100vw-40px)] flex-col overflow-hidden border border-white/10 bg-[#16171A] shadow-2xl">
          <div className="border-b border-white/10 bg-[#1d1f23] px-5 py-4">
            <p className="text-lg font-black text-white">
              🥊 스트롱 AI 상담
            </p>
            <p className="mt-1 text-sm text-[#8A8D91]">
              복싱 입문 · 다이어트 · 상담 문의
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#111214] p-4">
            {messages.length === 1 && (
              <div className="grid gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="border border-white/10 bg-[#1A1A1C] px-4 py-3 text-left text-sm font-bold text-zinc-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] whitespace-pre-line rounded-[10px] px-4 py-3 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-[#D01E2E] text-white"
                      : "bg-[#1A1A1C] text-zinc-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 bg-[#16171A] p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="궁금한 점 입력..."
                className="flex-1 border border-white/10 bg-[#1A1A1C] px-4 py-3 text-sm text-white outline-none"
              />

              <button
                onClick={() => sendMessage()}
                className="rounded-[10px] bg-[#D01E2E] px-5 font-black text-white transition hover:bg-[#B71C2B]"
              >
                전송
              </button>
            </div>

            <button
              onClick={() => {
                window.location.href = "/reservation";
              }}
              className="mt-3 w-full bg-white px-4 py-3 text-sm font-black text-black"
            >
              🥊 방문 상담 예약하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}