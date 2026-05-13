"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContentItem, Task, Frame } from "@/lib/mockData";

type ContentType = "Graphic / Carousel" | "Vertical Video" | "Horizontal Video" | "Text Post" | "Article";
type ImportedContent = { title: string; type: ContentType; channel?: string; frames?: number; tasks?: number; hook?: string; objective?: string };
type ImportWizardProps = { onClose: () => void; onImport: (contents: ContentItem[], frames: Frame[], tasks: Task[]) => void };

const CONTENT_TYPES: ContentType[] = ["Graphic / Carousel", "Vertical Video", "Horizontal Video", "Text Post", "Article"];

export function ImportWizard({ onClose, onImport }: ImportWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [parsedContents, setParsedContents] = useState<ImportedContent[]>([]);
  const [importError, setImportError] = useState("");

  const stepLabel = useMemo(() => ["Overview", "Type", "Prompt", "Upload", "Review"][step - 1], [step]);

  const handleParseJSON = () => {
    setImportError("");
    try {
      const data = JSON.parse(jsonInput);
      if (!data.contents || !Array.isArray(data.contents)) {
        setImportError("รูปแบบ JSON ยังไม่ถูกต้อง: ต้องมี contents[]");
        return;
      }
      setParsedContents(
        data.contents.map((item: any) => ({
          title: item.title || "Untitled",
          type: selectedType || "Article",
          channel: item.channel || "Web",
          frames: item.frames || 0,
          tasks: item.tasks || 1,
          hook: item.hook || "",
          objective: item.objective || "",
        }))
      );
      setStep(5);
    } catch {
      setImportError("JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
    }
  };

  const handleConfirmImport = () => {
    const newContents: ContentItem[] = parsedContents.map((content, idx) => ({
      id: `c${Date.now()}_${idx}`,
      title: content.title,
      thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=60",
      hook: content.hook || "",
      type: "Campaign",
      status: "Draft",
      ownerId: "u1",
      channel: content.channel || "Web",
      shootDate: new Date().toLocaleDateString(),
      postDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
      due: new Date(Date.now() + 3 * 86400000).toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      reviewDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString(),
      tags: ["Imported", selectedType || ""],
      progress: 0,
      objective: content.objective || "",
      target: "",
      painPoint: "",
      keyMessage: "",
      proof: "",
      cta: "",
    }));
    const newFrames: Frame[] = [];
    const newTasks: Task[] = [];
    parsedContents.forEach((content, idx) => {
      for (let i = 0; i < (content.frames || 0); i++) newFrames.push({ id: `f${Date.now()}_${idx}_${i}`, contentId: newContents[idx].id, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60", sceneNumber: i + 1, scriptLine: `Scene ${i + 1}`, note: "Imported frame" });
      for (let i = 0; i < (content.tasks || 1); i++) newTasks.push({ id: `t${Date.now()}_${idx}_${i}`, contentId: newContents[idx].id, title: `Task ${i + 1} for ${content.title}`, assigneeId: "u1", status: "Backlog", startDate: new Date().toLocaleDateString(), due: new Date(Date.now() + 7 * 86400000).toLocaleDateString(), effort: "1d" });
    });
    onImport(newContents, newFrames, newTasks);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100">
      <div className="mx-auto flex h-screen max-w-6xl flex-col px-4 py-4">
        <div className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">AI Import Wizard</h2>
            <p className="text-xs text-slate-500">Step {step}/5 · {stepLabel}</p>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600">Close</button>
        </div>

        <div className="mb-4 grid grid-cols-5 gap-2">
          {[1,2,3,4,5].map((n)=><div key={n} className={`h-1.5 rounded-full ${n<=step?"bg-slate-900":"bg-slate-200"}`} />)}
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
          {step === 1 && <div className="space-y-3"><h3 className="text-sm font-semibold">นำเข้าคอนเทนต์แบบมีขั้นตอน</h3><p className="text-sm text-slate-600">วางแผน → เลือกประเภท → สร้าง JSON → ตรวจสอบก่อนนำเข้า</p></div>}
          {step === 2 && <div className="grid gap-2 md:grid-cols-2">{CONTENT_TYPES.map((t)=><button key={t} onClick={()=>setSelectedType(t)} className={`rounded-lg border px-3 py-2 text-left text-sm ${selectedType===t?"border-slate-900 bg-slate-50":"border-slate-200 hover:bg-slate-50"}`}>{t}</button>)}</div>}
          {step === 3 && <div className="space-y-3"><p className="text-sm text-slate-600">ใช้ prompt นี้กับ AI แล้วนำ JSON กลับมาใส่ในขั้นตอนถัดไป</p><pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">{`{ "contents": [{"title":"...","hook":"...","objective":"...","frames":4}] }`}</pre></div>}
          {step === 4 && <div className="space-y-2"><textarea value={jsonInput} onChange={(e)=>setJsonInput(e.target.value)} rows={16} className="w-full rounded-lg border border-slate-200 p-3 font-mono text-xs" placeholder='{"contents": []}' />{importError && <p className="text-xs text-red-600">{importError}</p>}</div>}
          {step === 5 && (
            <div className="space-y-2">
              {parsedContents.map((content, idx) => (
                <details key={idx} className="rounded-lg border border-slate-200 p-3">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                    <div className="min-w-0"><p className="truncate font-medium">{content.title}</p><p className="text-xs text-slate-500">{content.type} · {content.channel}</p></div>
                    <Badge variant={content.title && content.hook ? "success" : content.title ? "accent" : "warning"}>{content.title && content.hook ? "Ready" : content.title ? "Review" : "Missing"}</Badge>
                  </summary>
                  <div className="mt-2 overflow-x-auto"><div className="flex gap-2">{Array.from({length: content.frames || 0}).map((_, i)=><div key={i} className="min-w-[150px] rounded-md border border-slate-200 bg-slate-50 p-2 text-xs">Scene {i+1}</div>)}</div></div>
                </details>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Button size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</Button>
          <div className="flex gap-2">
            {step < 4 && <Button size="sm" variant="primary" onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={step === 2 && !selectedType}>Next</Button>}
            {step === 4 && <Button size="sm" variant="primary" onClick={handleParseJSON}>Review</Button>}
            {step === 5 && <Button size="sm" variant="primary" onClick={handleConfirmImport}>Import</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
