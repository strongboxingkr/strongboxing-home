"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function AiCoachChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text:
        "안녕하세요 🥊 스트롱복싱 AI 코치입니다!\n궁금한 점을 편하게 물어보세요.",
    },
  ]);

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function getBotReply(text: string) {
    const q = text.toLowerCase();

    if (
      q.includes("처음") ||
      q.includes("초보")
    ) {
      return "처음 오시는 분들도 정말 많아요 😎\n스트롱복싱은 기초 자세부터 천천히 진행됩니다!";
    }

    if (
      q.includes("다이어트") ||
      q.includes("살")
    ) {
      return "복싱은 유산소 + 근력운동이 같이 들어가서 다이어트 만족도가 높은 편입니다 🔥";
    }

    if (
      q.includes("칼로리") ||
      q.includes("kcal")
    ) {
      return "1시간 기준 평균 500~900kcal 정도 소모됩니다 😎";
    }

    if (
      q.includes("준비물") ||
      q.includes("뭐 입")
    ) {
      return "편한 운동복만 입고 오시면 됩니다 🥊\n글러브는 체험 때 무료 제공돼요!";
    }

    if (
      q.includes("가격") ||
      q.includes("회원권")
    ) {
      return "지점별 이벤트가 달라서 체험 예약 남겨주시면 가장 빠르게 안내 도와드릴게요 😎";
    }

    if (
      q.includes("지점") ||
      q.includes("목동") ||
      q.includes("신정")
    ) {
      return "스트롱복싱은 목동/신정/개봉/철산/영등포 지점을 운영중입니다 🔥";
    }

    return "궁금하신 내용을 더 자세히 남겨주시면 스트롱복싱 AI 코치가 도와드릴게요 😎";
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: input,
    };

    const botMessage = {
      role: "bot" as const,
      text: getBotReply(input),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setInput("");
  }

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[9999] rounded-full bg-[#FC5230] px-5 py-4 text-sm font-black text-white shadow-2xl transition hover:scale-105"
      >
        🥊 AI 복싱코치
      </button>

      {/* chat */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[9999] flex h-[620px] w-[360px] flex-col overflow-hidden border border-white/10 bg-[#16171A] shadow-2xl">
          {/* header */}
          <div className="border-b border-white/10 bg-[#1d1f23] px-5 py-4">
            <p className="text-lg font-black text-white">
              🥊 스트롱 AI 코치
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              복싱 / 다이어트 / 체험 문의
            </p>
          </div>

          {/* messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#111214] p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-[#FC5230] text-white"
                      : "bg-[#202126] text-zinc-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* bottom */}
          <div className="border-t border-white/10 bg-[#16171A] p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="궁금한 점 입력..."
                className="flex-1 border border-white/10 bg-[#202126] px-4 py-3 text-sm text-white outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-[#FC5230] px-5 font-black text-white"
              >
                전송
              </button>
            </div>

            <button
              onClick={() => {
                window.location.href =
                  "/reservation";
              }}
              className="mt-3 w-full bg-white px-4 py-3 text-sm font-black text-black"
            >
              만원 체험 예약하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}