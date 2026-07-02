"use client";

export default function SearchBar({ placeholder = "검색..." }: { placeholder?: string }) {
  return (
    <input
      type="search"
      placeholder={placeholder}
      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-[#FC5230]"
    />
  );
}
