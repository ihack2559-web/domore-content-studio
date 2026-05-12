"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { PageViews } from "@/components/PageViews";
import { ImportWizard } from "@/components/ImportWizard";
import { mockUsers, rolePermissions, contentItems as defaultContentItems, frames as defaultFrames, tasks as defaultTasks } from "@/lib/mockData";
import { ContentItem, Frame, Task } from "@/lib/mockData";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("Calendar");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentUserId, setCurrentUserId] = useState("u1");
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [contentItems, setContentItems] = useState(defaultContentItems);
  const [frames, setFrames] = useState(defaultFrames);
  const [tasks, setTasks] = useState(defaultTasks);

  const currentUser = useMemo(
    () => mockUsers.find((user) => user.id === currentUserId) ?? mockUsers[0],
    [currentUserId]
  );

  const canAdd = rolePermissions[currentUser.role].canAdd;

  const handleImport = (importedContents: ContentItem[], importedFrames: Frame[], importedTasks: Task[]) => {
    setContentItems((prev) => [...prev, ...importedContents]);
    setFrames((prev) => [...prev, ...importedFrames]);
    setTasks((prev) => [...prev, ...importedTasks]);
    setShowImportWizard(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1720px] gap-6 px-5 py-6 xl:px-8">
        <Sidebar selectedPage={currentPage} onSelectPage={setCurrentPage} />

        <main className="flex min-h-screen flex-1 flex-col gap-6">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sprint 1 foundation</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Domore Content Studio</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    A clean, minimal foundation for planning content, managing status, and aligning team work across the first studio workflow.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-950">Current page:</span>
                  <span>{currentPage}</span>
                </div>
              </div>
            </div>

            <Topbar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              onStatusChange={setStatusFilter}
              onTypeChange={setTypeFilter}
              currentUser={currentUser}
              onUserChange={setCurrentUserId}
              canAdd={canAdd}
              onImportClick={() => setShowImportWizard(true)}
            />
          </div>

          <div className="flex-1">
            <PageViews page={currentPage} search={search} statusFilter={statusFilter} typeFilter={typeFilter} />
          </div>
        </main>
      </div>

      {showImportWizard && (
        <ImportWizard
          onClose={() => setShowImportWizard(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
