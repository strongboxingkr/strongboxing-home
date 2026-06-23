"use client";

import { useEffect, useState } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("strong_admin_auth") === "Y") {
      setIsAuthed(true);
    }
    setChecked(true);
  }, []);

  function login() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("strong_admin_auth", "Y");
      setIsAuthed(true);
    } else {
      alert("비밀번호가 틀렸어.");
    }
  }

  if (!checked) return null;

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0d0f] px-6 text-white">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#171719] p-8">
          <h1 className="mb-6 text-4xl font-black">관리자 로그인</h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
            className="mb-4 w-full rounded-2xl border border-white/10 bg-black p-4 outline-none focus:border-[#FC5230]"
            placeholder="관리자 비밀번호"
          />

          <button
            onClick={login}
            className="w-full rounded-full bg-[#FC5230] px-8 py-4 font-black"
          >
            들어가기
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
