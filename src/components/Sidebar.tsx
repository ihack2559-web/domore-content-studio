"use client";

import { mockUsers } from "@/lib/mockData";

type SidebarProps = {
  selectedPage: string;
  onSelectPage: (page: string) => void;
};

const menuItems = ["Calendar", "Board", "Action Plan", "Status", "Brief", "Assets", "KPI", "Labels", "Team"] as const;

export function Sidebar({ selectedPage, onSelectPage }: SidebarProps) {
  return (
    <aside className="hidden h-full w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 xl:flex">
      <div className="mb-5 flex items-center gap-2.5 px-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold uppercase text-white">D</div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Domore Studio</p>
          <p className="text-[11px] text-slate-500">Content workspace</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const active = item === selectedPage;
          return (
            <button
              key={item}
              onClick={() => onSelectPage(item)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>{item}</span>
              <span className={`text-xs ${active ? "text-slate-300" : "text-slate-400"}`}>›</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Team</p>
        <div className="mt-2 flex -space-x-2">
          {mockUsers.slice(0, 4).map((user) => (
            <div key={user.id} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white ring-2 ring-slate-50">
              {user.initials}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
