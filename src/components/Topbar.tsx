"use client";

import { typeOptions, statusOptions, User } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

type TopbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  typeFilter: string;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  currentUser: User;
  canAdd: boolean;
  onImportClick: () => void;
};

export function Topbar({ search, onSearchChange, statusFilter, typeFilter, onStatusChange, onTypeChange, currentUser, canAdd, onImportClick }: TopbarProps) {
  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search content"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
        />
        <div className="flex gap-2">
          <Select label="Status" options={statusOptions.map((value) => ({ label: value, value }))} value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} />
          <Select label="Type" options={typeOptions.map((value) => ({ label: value, value }))} value={typeFilter} onChange={(event) => onTypeChange(event.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="md" onClick={onImportClick}>Import</Button>
        <Button variant="primary" size="md" disabled={!canAdd}>Add</Button>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-950 text-[11px] font-semibold text-white">{currentUser.initials}</div>
          <div className="pr-1">
            <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
