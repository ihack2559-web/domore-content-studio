"use client";

import { Badge } from "@/components/ui/Badge";
import { ContentItem, Frame, Task, User } from "@/lib/mockData";

type ContentSidePanelProps = {
  content: ContentItem;
  owner: User;
  frames: Frame[];
  tasks: Task[];
  onClose: () => void;
  onDeleteFrame: (frameId: string) => void;
  onAddFrame: () => void;
  onEditFrame: (frameId: string, scriptLine: string) => void;
};

export function ContentSidePanel({ content, owner, tasks, onClose, onAddFrame }: ContentSidePanelProps) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[390px] overflow-y-auto border-l border-slate-200 bg-white px-4 py-4 shadow-2xl sm:relative sm:max-w-none">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Content details</h2>
        <button onClick={onClose} className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">Close</button>
      </div>

      <div className="space-y-3">
        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Title</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{content.title}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={content.status === "Published" ? "success" : content.status === "Draft" ? "warning" : "accent"}>{content.status}</Badge>
            <span className="text-xs text-slate-500">Owner: {owner.name}</span>
          </div>
          <p className="mt-2 text-xs text-slate-600">{content.hook}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Brief</p>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            <p><span className="text-slate-500">Objective:</span> {content.objective}</p>
            <p><span className="text-slate-500">Target:</span> {content.target}</p>
            <p><span className="text-slate-500">Key message:</span> {content.keyMessage}</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Tasks</p>
          <div className="mt-2 space-y-2">
            {tasks.length ? tasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900">{task.title}</p>
                  <Badge variant={task.status === "Done" ? "success" : task.status === "Review" ? "accent" : "warning"}>{task.status}</Badge>
                </div>
              </div>
            )) : <p className="text-xs text-slate-500">No tasks yet.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">Actions</p>
          <button onClick={onAddFrame} className="mt-2 w-full rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">Add frame</button>
        </section>
      </div>
    </aside>
  );
}
