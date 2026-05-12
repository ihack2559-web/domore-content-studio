"use client";

import { mockUsers, rolePermissions, typeOptions, statusOptions, User } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
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
  onUserChange: (userId: string) => void;
  canAdd: boolean;
  onImportClick: () => void;
};

export function Topbar({
  search,
  onSearchChange,
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
  currentUser,
  onUserChange,
  canAdd,
  onImportClick,
}: TopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
        <div className="min-w-[250px]">
          <label className="relative block">
            <span className="sr-only">Search content</span>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search content, frames, tasks"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            label="Status"
            options={statusOptions.map((value) => ({ label: value, value }))}
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
          />
          <Select
            label="Type"
            options={typeOptions.map((value) => ({ label: value, value }))}
            value={typeFilter}
            onChange={(event) => onTypeChange(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="md" onClick={onImportClick}>Import</Button>
          <Button variant="primary" size="md" disabled={!canAdd}>Add</Button>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            {currentUser.initials}
          </div>
          <div className="min-w-[130px]">
            <p className="text-sm font-semibold text-slate-950">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
          <Badge variant="accent">{currentUser.role}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Permissions</p>
          <p className="mt-1 text-sm text-slate-900">{rolePermissions[currentUser.role].description}</p>
        </div>
        <label className="flex min-w-[160px] flex-col gap-2 text-xs text-slate-500">
          Current user
          <select
            value={currentUser.id}
            onChange={(event) => onUserChange(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} – {user.role}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
