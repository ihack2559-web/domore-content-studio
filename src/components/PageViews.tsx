"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { ContentSidePanel } from "@/components/ContentSidePanel";
import { Button } from "@/components/ui/Button";
import {
  contentItems as defaultContentItems,
  frames as defaultFrames,
  mockUsers,
  tasks as defaultTasks,
} from "@/lib/mockData";

type PageViewsProps = {
  page: string;
  search: string;
  statusFilter: string;
  typeFilter: string;
};

const statusBuckets = ["Draft", "Review", "Published"] as const;

const filterContent = (status: string, type: string, query: string) => {
  return defaultContentItems.filter((item) => {
    const matchesStatus = status === "All" || item.status === status;
    const matchesType = type === "All" || item.type === type;
    const matchesQuery = query === "" || item.title.toLowerCase().includes(query.toLowerCase()) || item.hook.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesType && matchesQuery;
  });
};

const findUser = (id: string) => mockUsers.find((user) => user.id === id) ?? mockUsers[0];

export function PageViews({ page, search, statusFilter, typeFilter }: PageViewsProps) {
  const [frames, setFrames] = useState(defaultFrames);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [calendarFilter, setCalendarFilter] = useState<"all" | "tasks" | "publish">("all");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [actionPlanView, setActionPlanView] = useState<"table" | "timeline">("table");

  const filtered = useMemo(() => filterContent(statusFilter, typeFilter, search), [statusFilter, typeFilter, search]);
  const recentTasks = useMemo(() => defaultTasks.slice(0, 3), []);
  const selectedContent = useMemo(
    () => defaultContentItems.find((item) => item.id === selectedContentId) ?? null,
    [selectedContentId]
  );
  const selectedFrames = useMemo(
    () => (selectedContentId ? frames.filter((frame) => frame.contentId === selectedContentId) : []),
    [frames, selectedContentId]
  );
  const selectedTasks = useMemo(
    () => (selectedContentId ? defaultTasks.filter((task) => task.contentId === selectedContentId) : []),
    [selectedContentId]
  );

  const handleAddFrame = (contentId: string) => {
    const next = {
      id: `f${Date.now()}`,
      contentId,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
      sceneNumber: frames.filter((frame) => frame.contentId === contentId).length + 1,
      scriptLine: "New storyboard note.",
      note: "Detail the shot and layout.",
    };
    setFrames((current) => [...current, next]);
  };

  const handleEditFrame = (frameId: string) => {
    const frame = frames.find((item) => item.id === frameId);
    if (!frame) return;
    const updated = window.prompt("Edit script line", frame.scriptLine);
    if (updated !== null) {
      setFrames((current) => current.map((item) => (item.id === frameId ? { ...item, scriptLine: updated } : item)));
    }
  };

  const handleDeleteFrame = (frameId: string) => {
    if (window.confirm("Delete this frame?")) {
      setFrames((current) => current.filter((item) => item.id !== frameId));
    }
  };

  const closePanel = () => setSelectedContentId(null);

  // Calendar events
  const calendarEvents = useMemo(() => {
    const events = [];
    if (calendarFilter === "all" || calendarFilter === "tasks") {
      defaultTasks.forEach((task) => {
        const content = defaultContentItems.find((c) => c.id === task.contentId);
        if (content) {
          events.push({
            id: task.id,
            title: task.title,
            start: new Date(task.startDate),
            end: new Date(task.due),
            type: "task",
            contentId: task.contentId,
            status: task.status,
          });
        }
      });
    }
    if (calendarFilter === "all" || calendarFilter === "publish") {
      defaultContentItems.forEach((content) => {
        events.push({
          id: content.id,
          title: `${content.title} (Publish)`,
          start: new Date(content.postDate),
          end: new Date(content.postDate),
          type: "publish",
          contentId: content.id,
          status: content.status,
        });
      });
    }
    return events;
  }, [calendarFilter]);

  const renderCalendar = () => {
    if (calendarView === "month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      const days = [];
      for (let d = new Date(startDate); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dayEvents = calendarEvents.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return d >= eventStart && d <= eventEnd;
        });
        days.push({ date: new Date(d), events: dayEvents });
      }

      return (
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-semibold text-slate-600">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div key={index} className="min-h-[120px] border border-slate-200 p-2">
              <div className="text-sm font-semibold text-slate-950">{day.date.getDate()}</div>
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedContentId(event.contentId)}
                    className={`w-full rounded px-1 py-1 text-left text-xs ${
                      event.type === "task" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.title}
                  </button>
                ))}
                {day.events.length > 3 && <div className="text-xs text-slate-500">+{day.events.length - 3} more</div>}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Week view: simple list
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        const dayEvents = calendarEvents.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return day >= eventStart && day <= eventEnd;
        });
        weekDays.push({ date: day, events: dayEvents });
      }

      return (
        <div className="space-y-4">
          {weekDays.map((day) => (
            <div key={day.date.toISOString()} className="rounded-3xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-950">{day.date.toDateString()}</h3>
              <div className="mt-2 space-y-2">
                {day.events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedContentId(event.contentId)}
                    className={`block w-full rounded px-3 py-2 text-left ${
                      event.type === "task" ? "bg-blue-50 border border-blue-200" : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <div className="font-medium text-slate-950">{event.title}</div>
                    <div className="text-sm text-slate-600">{event.type === "task" ? "Task" : "Publish"}</div>
                  </button>
                ))}
                {!day.events.length && <p className="text-sm text-slate-500">No events</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  switch (page) {
    case "Calendar":
      return (
        <div className="space-y-6">
          <Panel title="Planning calendar" subtitle="View production tasks and publish events across time.">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <Button variant={calendarView === "month" ? "primary" : "secondary"} size="sm" onClick={() => setCalendarView("month")}>
                  Month
                </Button>
                <Button variant={calendarView === "week" ? "primary" : "secondary"} size="sm" onClick={() => setCalendarView("week")}>
                  Week
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant={calendarFilter === "all" ? "primary" : "secondary"} size="sm" onClick={() => setCalendarFilter("all")}>
                  All
                </Button>
                <Button variant={calendarFilter === "tasks" ? "primary" : "secondary"} size="sm" onClick={() => setCalendarFilter("tasks")}>
                  Tasks
                </Button>
                <Button variant={calendarFilter === "publish" ? "primary" : "secondary"} size="sm" onClick={() => setCalendarFilter("publish")}>
                  Publish
                </Button>
              </div>
            </div>
            <div className="mt-6">{renderCalendar()}</div>
          </Panel>
          {selectedContent ? (
            <ContentSidePanel
              content={selectedContent}
              owner={findUser(selectedContent.ownerId)}
              frames={selectedFrames}
              tasks={selectedTasks}
              onClose={closePanel}
              onAddFrame={() => selectedContent && handleAddFrame(selectedContent.id)}
              onDeleteFrame={handleDeleteFrame}
              onEditFrame={handleEditFrame}
            />
          ) : null}
        </div>
      );

    case "Board":
      return (
        <div className="relative">
          <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
            <Panel title="Content board" subtitle="Review content items, frames, and status lanes.">
              <div className="grid gap-4 md:grid-cols-3">
                {statusBuckets.map((status) => (
                  <div key={status} className="space-y-4 rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">{status}</p>
                    {defaultContentItems
                      .filter((item) => item.status === status)
                      .map((item) => {
                        const owner = findUser(item.ownerId);
                        const itemFrames = frames.filter((frame) => frame.contentId === item.id);
                        return (
                          <div key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
                            <button
                              type="button"
                              onClick={() => setSelectedContentId(item.id)}
                              className="group w-full text-left"
                            >
                              <div className="flex items-start gap-4">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="h-20 w-20 flex-none rounded-3xl object-cover shadow-sm"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <Badge variant={item.status === "Published" ? "success" : item.status === "Draft" ? "warning" : "accent"}>
                                      {item.type}
                                    </Badge>
                                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.progress}%</span>
                                  </div>
                                  <p className="mt-3 text-base font-semibold text-slate-950">{item.title}</p>
                                  <p className="mt-2 text-sm text-slate-500">{item.hook}</p>
                                </div>
                              </div>
                              <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Owner</p>
                                  <p>{owner.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Channel</p>
                                  <p>{item.channel}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Shoot</p>
                                  <p>{item.shootDate}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Post</p>
                                  <p>{item.postDate}</p>
                                </div>
                              </div>
                            </button>

                            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Storyboard</p>
                                <button
                                  type="button"
                                  onClick={() => handleAddFrame(item.id)}
                                  className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                  + Frame
                                </button>
                              </div>
                              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                                {itemFrames.length ? (
                                  itemFrames.map((frame) => (
                                    <div key={frame.id} className="min-w-[220px] rounded-3xl bg-white p-3 shadow-sm">
                                      <img src={frame.image} alt={`Scene ${frame.sceneNumber}`} className="h-24 w-full rounded-3xl object-cover" />
                                      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                                        <span>Scene {frame.sceneNumber}</span>
                                        <span>{frame.scriptLine.length > 24 ? "..." : ""}</span>
                                      </div>
                                      <p className="mt-2 text-sm text-slate-700">{frame.scriptLine}</p>
                                      <p className="mt-2 text-xs text-slate-500">{frame.note}</p>
                                      <div className="mt-3 flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleEditFrame(frame.id)}
                                          className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteFrame(frame.id)}
                                          className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500">No frames yet.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Board summary" subtitle="A quick view of the work in progress.">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Total items</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{defaultContentItems.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Average progress</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{Math.round(defaultContentItems.reduce((sum, item) => sum + item.progress, 0) / defaultContentItems.length)}%</p>
                </div>
              </div>
            </Panel>
          </div>

          {selectedContent ? (
            <ContentSidePanel
              content={selectedContent}
              owner={findUser(selectedContent.ownerId)}
              frames={selectedFrames}
              tasks={selectedTasks}
              onClose={closePanel}
              onAddFrame={() => selectedContent && handleAddFrame(selectedContent.id)}
              onDeleteFrame={handleDeleteFrame}
              onEditFrame={handleEditFrame}
            />
          ) : null}
        </div>
      );

    case "Action Plan":
      return (
        <div className="space-y-6">
          <Panel title="Action plan" subtitle="Manage tasks and timelines for content production.">
            <div className="flex gap-2">
              <Button variant={actionPlanView === "table" ? "primary" : "secondary"} size="sm" onClick={() => setActionPlanView("table")}>
                Table
              </Button>
              <Button variant={actionPlanView === "timeline" ? "primary" : "secondary"} size="sm" onClick={() => setActionPlanView("timeline")}>
                Timeline
              </Button>
            </div>
            {actionPlanView === "table" ? (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-semibold text-slate-950">Task</th>
                      <th className="text-left py-2 font-semibold text-slate-950">Owner</th>
                      <th className="text-left py-2 font-semibold text-slate-950">Start</th>
                      <th className="text-left py-2 font-semibold text-slate-950">End</th>
                      <th className="text-left py-2 font-semibold text-slate-950">Status</th>
                      <th className="text-left py-2 font-semibold text-slate-950">Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultTasks.map((task) => {
                      const user = findUser(task.assigneeId);
                      const content = defaultContentItems.find((c) => c.id === task.contentId);
                      return (
                        <tr key={task.id} className="border-b border-slate-100">
                          <td className="py-3">
                            <button onClick={() => setSelectedContentId(task.contentId)} className="text-left hover:underline">
                              {task.title}
                            </button>
                          </td>
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{task.startDate}</td>
                          <td className="py-3">{task.due}</td>
                          <td className="py-3">
                            <Badge variant={task.status === "Done" ? "success" : task.status === "Review" ? "accent" : "warning"}>
                              {task.status}
                            </Badge>
                          </td>
                          <td className="py-3">{content?.title}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {defaultTasks.map((task) => {
                  const start = new Date(task.startDate);
                  const end = new Date(task.due);
                  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  return (
                    <div key={task.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <button onClick={() => setSelectedContentId(task.contentId)} className="font-semibold text-slate-950 hover:underline">
                          {task.title}
                        </button>
                        <Badge variant={task.status === "Done" ? "success" : task.status === "Review" ? "accent" : "warning"}>
                          {task.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                        <span>{findUser(task.assigneeId).name}</span>
                        <span>{task.startDate} - {task.due}</span>
                      </div>
                      <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${task.status === "Done" ? "bg-green-500" : task.status === "In progress" ? "bg-blue-500" : "bg-yellow-500"}`}
                          style={{ width: `${(task.status === "Done" ? 100 : task.status === "In progress" ? 50 : 25)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
          {selectedContent ? (
            <ContentSidePanel
              content={selectedContent}
              owner={findUser(selectedContent.ownerId)}
              frames={selectedFrames}
              tasks={selectedTasks}
              onClose={closePanel}
              onAddFrame={() => selectedContent && handleAddFrame(selectedContent.id)}
              onDeleteFrame={handleDeleteFrame}
              onEditFrame={handleEditFrame}
            />
          ) : null}
        </div>
      );

    case "Status":
      return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Draft items", value: defaultContentItems.filter((item) => item.status === "Draft").length },
            { title: "In review", value: defaultContentItems.filter((item) => item.status === "Review").length },
            { title: "Published", value: defaultContentItems.filter((item) => item.status === "Published").length },
            { title: "Active tasks", value: defaultTasks.length },
            { title: "Team members", value: mockUsers.length },
          ].map((metric) => (
            <Panel key={metric.title} title={metric.title} subtitle="Current snapshot">
              <p className="mt-3 text-4xl font-semibold text-slate-950">{metric.value}</p>
            </Panel>
          ))}
        </div>
      );

    case "Brief":
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          {defaultContentItems.map((item) => (
            <Panel key={item.id} title={item.title} subtitle={item.hook}>
              <div className="grid gap-4">
                {[
                  { label: "Objective", value: item.objective },
                  { label: "Target", value: item.target },
                  { label: "Pain point", value: item.painPoint },
                  { label: "Key message", value: item.keyMessage },
                  { label: "Proof", value: item.proof },
                  { label: "CTA", value: item.cta },
                ].map((detail) => (
                  <div key={detail.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{detail.label}</p>
                    <p className="mt-2 text-sm text-slate-700">{detail.value}</p>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      );

    case "Assets":
      return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {defaultContentItems.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <Badge variant="neutral">{item.type}</Badge>
              </div>
              <p className="text-sm text-slate-500">{item.tags.join(" · ")}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>Due {item.due}</span>
                <span>{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "KPI":
      return (
        <div className="grid gap-6 xl:grid-cols-3">
          {[
            { label: "Engagement", value: "82%", trend: "+6.1%" },
            { label: "Content velocity", value: "12 / mo", trend: "+1" },
            { label: "Approval cycle", value: "2.8 days", trend: "-0.4 day" },
          ].map((card) => (
            <Panel key={card.label} title={card.label} subtitle="Performance overview">
              <p className="mt-3 text-4xl font-semibold text-slate-950">{card.value}</p>
              <p className="mt-2 text-sm text-slate-500">{card.trend} vs last month</p>
            </Panel>
          ))}
        </div>
      );

    case "Labels":
      return (
        <Panel title="Labels" subtitle="Manage tags and categories for content." className="grid gap-4 md:grid-cols-2">
          {[
            "Launch",
            "Social",
            "Video",
            "UX",
            "Performance",
            "Editorial",
            "Q2",
            "Paid",
          ].map((label) => (
            <div
              key={label}
              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
            >
              {label}
            </div>
          ))}
        </Panel>
      );

    case "Team":
      return (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {mockUsers.map((user) => (
            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-sm font-semibold text-white">
                  {user.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.team}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>Role: <span className="font-medium text-slate-900">{user.role}</span></p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <Panel title="Workspace" subtitle="Choose a page from the sidebar to begin.">
          <p className="text-sm text-slate-600">The Domore Content Studio foundation is ready. Navigate through the left menu to preview the available modules.</p>
        </Panel>
      );
  }
}
