"use client";

import { mockUsers } from "@/lib/mockData";

type SidebarProps = {
  selectedPage: string;
  onSelectPage: (page: string) => void;
};

const menuItems = [
  "Calendar",
  "Board",
  "Action Plan",
  "Status",
  "Brief",
  "Assets",
  "KPI",
  "Labels",
  "Team",
] as const;

export function Sidebar({ selectedPage, onSelectPage }: SidebarProps) {
  return (
    <aside className="hidden h-full w-[260px] shrink-0 flex-col border-r border-slate-200/80 bg-slate-50 px-5 py-6 xl:flex">
      <div className="mb-10 flex flex-col gap-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-sm font-bold uppercase text-white shadow-sm">
          D
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Domore Content</p>
          <p className="text-xs text-slate-500">Studio workspace</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const active = item === selectedPage;
          return (
            <button
              key={item}
              onClick={() => onSelectPage(item)}
              className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-slate-950 text-white shadow-md" : "text-slate-700 hover:bg-slate-100"}`}
            >
              <span>{item}</span>
              <span className="text-xs text-slate-400">›</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Team summary</p>
        <div className="mt-4 flex -space-x-3">
          {mockUsers.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white ring-2 ring-white"
            >
              {user.initials}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">4 members · 8 active projects</p>
      </div>
    </aside>
  );
}
