"use client";

import { useState } from "react";

export default function TodoCard() {
  const [todos, setTodos] = useState<{ text: string; done: boolean }[]>([]);
  const [input, setInput] = useState("");

  function add() {
    if (!input.trim()) return;
    setTodos((p) => [...p, { text: input.trim(), done: false }]);
    setInput("");
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="할 일 추가..."
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none"
        />
        <button onClick={add} className="rounded-lg bg-[#FC5230] px-3 py-2 text-sm font-black text-white">+</button>
      </div>
      <ul className="space-y-2">
        {todos.map((t, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={t.done} onChange={() => setTodos((p) => p.map((x, j) => j === i ? { ...x, done: !x.done } : x))} />
            <span className={t.done ? "line-through text-zinc-400" : "text-zinc-700"}>{t.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
