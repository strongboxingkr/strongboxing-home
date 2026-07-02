import Link from "next/link";
import { NAV_ITEMS } from "@/lib/hq/navigation";

export default function HQSidebar() {
  return (
    <aside className="flex h-full w-56 flex-col border-r border-zinc-200 bg-white py-6">
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
