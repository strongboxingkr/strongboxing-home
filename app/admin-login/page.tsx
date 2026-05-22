"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    document.cookie = `admin-password=${password}; path=/; max-age=86400`;

    window.location.href = "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0f] px-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#171719] p-8"
      >
        <p className="mb-4 text-sm font-black tracking-[0.32em] text-[#FC5230]">
          STRONG BOXING ADMIN
        </p>

        <h1 className="mb-6 text-4xl font-black tracking-[-0.05em]">
          관리자 로그인
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호"
          className="mb-5 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none focus:border-[#FC5230]"
        />

        <button className="w-full rounded-full bg-[#FC5230] px-8 py-4 font-black">
          로그인
        </button>
      </form>
    </main>
  );
}