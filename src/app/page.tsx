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
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-4 py-4 xl:px-6">
        <Sidebar selectedPage={currentPage} onSelectPage={setCurrentPage} />

        <main className="flex min-h-screen flex-1 flex-col gap-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-medium text-slate-900">Domore Content Studio</p>
              <p>Page: <span className="font-semibold text-slate-900">{currentPage}</span></p>
            </div>

            <Topbar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              onStatusChange={setStatusFilter}
              onTypeChange={setTypeFilter}
              currentUser={currentUser}
              canAdd={canAdd}
              onImportClick={() => setShowImportWizard(true)}
            />
          </div>

          <div className="flex-1">
            <PageViews
              page={currentPage}
              search={search}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              contentItems={contentItems}
              frames={frames}
              tasks={tasks}
              setFrames={setFrames}
            />
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
