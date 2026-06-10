"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  branch_name: "철산점",
  service_name: "인스타그램",
  account_id: "",
  account_password: "",
  login_url: "",
  memo: "",
};

export default function AccountsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const res = await fetch("/api/branch-accounts");
    const data = await res.json();
    if (data.ok) setItems(data.items);
  }

  async function saveItem() {
    if (!form.service_name) {
      alert("서비스명을 입력해줘.");
      return;
    }

    const res = await fetch("/api/branch-accounts", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...form }),
    });

    const data = await res.json();

    if (!data.ok) {
      alert("저장 실패");
      return;
    }

    alert(editingId ? "수정 완료" : "저장 완료");
    setEditingId(null);
    setForm(emptyForm);
    loadItems();
  }

  async function deleteItem(id: number) {
    if (!confirm("삭제할까요?")) return;

    await fetch("/api/branch-accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadItems();
  }

  function editItem(item: any) {
    setEditingId(item.id);
    setForm({
      branch_name: item.branch_name || "철산점",
      service_name: item.service_name || "",
      account_id: item.account_id || "",
      account_password: item.account_password || "",
      login_url: item.login_url || "",
      memo: item.memo || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text || "");
    alert("복사 완료!");
  }

  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <a href="/admin" className="mb-8 inline-block text-zinc-400">
          ← 관리자 메인
        </a>

        <p className="mb-3 text-sm font-black tracking-[0.3em] text-[#C084FC]">
          ACCOUNT INFO
        </p>

        <h1 className="mb-3 text-6xl font-black tracking-[-0.06em]">
          계정 정보
        </h1>

        <p className="mb-10 text-zinc-400">
          인스타 · 네이버 · 하이록스 · 카카오 · 메타 광고 계정 관리
        </p>

        <section className="grid gap-5 rounded-[30px] border border-white/10 bg-[#171719] p-6 md:grid-cols-2">
          <select
            value={form.branch_name}
            onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>공통</option>
            <option>철산점</option>
            <option>목동점</option>
            <option>신정점</option>
            <option>개봉점</option>
            <option>영등포점</option>
          </select>

          <select
            value={form.service_name}
            onChange={(e) =>
              setForm({ ...form, service_name: e.target.value })
            }
            className="rounded-2xl border border-white/10 bg-black p-4"
          >
            <option>인스타그램</option>
            <option>네이버</option>
            <option>하이록스</option>
            <option>카카오</option>
            <option>페이스북</option>
            <option>메타 광고</option>
            <option>Gmail</option>
            <option>기타</option>
          </select>

          <input
            value={form.account_id}
            onChange={(e) => setForm({ ...form, account_id: e.target.value })}
            placeholder="아이디"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.account_password}
            onChange={(e) =>
              setForm({ ...form, account_password: e.target.value })
            }
            placeholder="비밀번호"
            className="rounded-2xl border border-white/10 bg-black p-4"
          />

          <input
            value={form.login_url}
            onChange={(e) => setForm({ ...form, login_url: e.target.value })}
            placeholder="로그인 URL"
            className="rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <textarea
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            placeholder="메모"
            className="h-28 rounded-2xl border border-white/10 bg-black p-4 md:col-span-2"
          />

          <button
            onClick={saveItem}
            className="rounded-full bg-[#C084FC] px-8 py-5 font-black text-black md:col-span-2"
          >
            {editingId ? "수정 저장" : "저장"}
          </button>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[30px] border border-white/10 bg-[#171719] p-6"
            >
              <p className="text-sm font-black text-[#C084FC]">
                {item.branch_name} · {item.service_name}
              </p>

              <h2 className="mt-2 break-all text-2xl font-black">
                {item.account_id || "아이디 없음"}
              </h2>

              <p className="mt-3 break-all text-zinc-300">
                {item.account_password || "비밀번호 없음"}
              </p>

              {item.login_url && (
                <p className="mt-3 break-all text-sm text-zinc-500">
                  {item.login_url}
                </p>
              )}

              {item.memo && (
                <pre className="mt-4 whitespace-pre-wrap text-zinc-400">
                  {item.memo}
                </pre>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => copy(item.account_id)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-black text-black"
                >
                  ID 복사
                </button>

                <button
                  onClick={() => copy(item.account_password)}
                  className="rounded-full bg-[#C084FC] px-4 py-2 text-sm font-black text-black"
                >
                  PW 복사
                </button>

                {item.login_url && (
                  <a
                    href={item.login_url}
                    target="_blank"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-black"
                  >
                    로그인 열기
                  </a>
                )}

                <button
                  onClick={() => editItem(item)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-black"
                >
                  수정
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="rounded-full border border-red-500 px-4 py-2 text-sm font-black text-red-400"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}