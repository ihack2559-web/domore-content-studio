"use client";

import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
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

export function ContentSidePanel({
  content,
  owner,
  frames,
  tasks,
  onClose,
  onDeleteFrame,
  onAddFrame,
  onEditFrame,
}: ContentSidePanelProps) {
  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] overflow-y-auto border-l border-slate-200 bg-white px-6 py-6 shadow-2xl sm:relative sm:m-0 sm:max-w-none">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Content details</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">{content.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
          Close
        </button>
      </div>

      <div className="space-y-5">
        <Panel title="Overview" subtitle="Core details for this content item.">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                <Badge variant={content.status === "Published" ? "success" : content.status === "Draft" ? "warning" : "accent"} className="mt-2">
                  {content.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Owner</p>
                <p className="mt-2 text-sm text-slate-900">{owner.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Channel</p>
                <p className="mt-2 text-sm text-slate-900">{content.channel}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Shoot date</p>
                <p className="mt-2 text-sm text-slate-900">{content.shootDate}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Hook</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{content.hook}</p>
            </div>
          </div>
        </Panel>

        <Panel title="Content status trail" subtitle="Recent workflow milestones.">
          <div className="space-y-4 text-sm text-slate-700">
            {[
              { label: "Draft created", date: content.createdAt },
              { label: "Review requested", date: content.reviewDate },
              { label: "Final approval", date: content.postDate },
            ].map((step) => (
              <div key={step.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{step.label}</p>
                <p className="mt-1 text-sm text-slate-500">{step.date}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Template brief" subtitle="Core narrative and messaging.">
          <div className="grid gap-4">
            {[
              { label: "Objective", value: content.objective },
              { label: "Target", value: content.target },
              { label: "Pain point", value: content.painPoint },
              { label: "Key message", value: content.keyMessage },
              { label: "Proof", value: content.proof },
              { label: "CTA", value: content.cta },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-sm text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Tasks" subtitle="Task list for this content item.">
          <div className="space-y-3">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <Badge variant={task.status === "Done" ? "success" : task.status === "Review" ? "accent" : "warning"}>{task.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Due {task.due} • {task.effort}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No tasks assigned to this content item yet.</p>
            )}
          </div>
        </Panel>

        <div className="sticky bottom-0 left-0 z-10 mt-4 rounded-3xl bg-white p-4 shadow-sm">
          <button
            onClick={onAddFrame}
            className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add frame
          </button>
        </div>
      </div>
    </aside>
  );
}
