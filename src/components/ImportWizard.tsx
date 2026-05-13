"use client";

import { useState } from "react";
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

  const handleParseJSON = () => {
    setImportError("");
    try {
      const data = JSON.parse(jsonInput);
      if (!data.contents || !Array.isArray(data.contents)) return setImportError("รูปแบบ JSON ยังไม่ถูกต้อง: ต้องมี contents[]");
      setParsedContents(data.contents.map((item: any) => ({ title: item.title || "Untitled", type: selectedType || "Article", channel: item.channel || "Web", frames: item.frames || 0, tasks: item.tasks || 1, hook: item.hook || "", objective: item.objective || "" })));
      setStep(5);
    } catch {
      setImportError("JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
    }
  };

  const handleConfirmImport = () => {
    const newContents: ContentItem[] = parsedContents.map((content, idx) => ({ id: `c${Date.now()}_${idx}`, title: content.title, thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=60", hook: content.hook || "", type: "Campaign", status: "Draft", ownerId: "u1", channel: content.channel || "Web", shootDate: new Date().toLocaleDateString(), postDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString(), due: new Date(Date.now() + 3 * 86400000).toLocaleDateString(), createdAt: new Date().toLocaleDateString(), reviewDate: new Date(Date.now() + 5 * 86400000).toLocaleDateString(), tags: ["Imported", selectedType || ""], progress: 0, objective: content.objective || "", target: "", painPoint: "", keyMessage: "", proof: "", cta: "" }));
    const newFrames: Frame[] = []; const newTasks: Task[] = [];
    parsedContents.forEach((content, idx) => {
      for (let i = 0; i < (content.frames || 0); i++) newFrames.push({ id: `f${Date.now()}_${idx}_${i}`, contentId: newContents[idx].id, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60", sceneNumber: i + 1, scriptLine: `Scene ${i + 1}`, note: "Imported frame" });
      for (let i = 0; i < (content.tasks || 1); i++) newTasks.push({ id: `t${Date.now()}_${idx}_${i}`, contentId: newContents[idx].id, title: `Task ${i + 1} for ${content.title}`, assigneeId: "u1", status: "Backlog", startDate: new Date().toLocaleDateString(), due: new Date(Date.now() + 7 * 86400000).toLocaleDateString(), effort: "1d" });
    });
    onImport(newContents, newFrames, newTasks);
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"><div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl p-4 space-y-4"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Import Wizard</h2><button onClick={onClose}>×</button></div><p className="text-xs text-slate-500">Overview → Type → Prompt → Upload → Review · Step {step}/5</p>{step===1&&<div><p className="text-sm">นำเข้าเนื้อหาแบบมีขั้นตอน (guided flow)</p></div>}{step===2&&<div className="grid gap-2">{CONTENT_TYPES.map(t=><button key={t} onClick={()=>setSelectedType(t)} className={`rounded-lg border px-3 py-2 text-left text-sm ${selectedType===t?"border-slate-900 bg-slate-50":"border-slate-200"}`}>{t}</button>)}</div>}{step===3&&<div className="space-y-2"><p className="text-sm">คัดลอก prompt แล้วไป generate JSON</p><pre className="rounded-lg bg-slate-50 p-3 text-xs">{`{ "contents": [{"title":"...","hook":"...","frames":4}] }`}</pre></div>}{step===4&&<div className="space-y-2"><textarea value={jsonInput} onChange={(e)=>setJsonInput(e.target.value)} rows={8} className="w-full rounded-lg border border-slate-200 p-3 text-xs font-mono"/>{importError&&<p className="text-xs text-red-600">{importError}</p>}</div>}{step===5&&<div className="space-y-2">{parsedContents.map((c,i)=><details key={i} className="rounded-lg border border-slate-200 p-3"><summary className="flex items-center justify-between text-sm"><span>{c.title}</span><Badge variant={c.title && c.hook ? "success" : c.title ? "accent" : "warning"}>{c.title && c.hook ? "Ready" : c.title ? "Review" : "Missing"}</Badge></summary><div className="mt-2 overflow-x-auto"><div className="flex gap-2">{Array.from({length:c.frames||0}).map((_,idx)=><div key={idx} className="min-w-[140px] rounded-md border border-slate-200 bg-slate-50 p-2 text-xs">Frame {idx+1}</div>)}</div></div></details>)}</div>}<div className="flex justify-between"><Button size="sm" onClick={()=>setStep((s)=>Math.max(1,s-1))} variant="secondary">Back</Button><div className="flex gap-2">{step<4&&<Button size="sm" onClick={()=>setStep((s)=>Math.min(5,s+1))} variant="primary" disabled={step===2&&!selectedType}>Next</Button>}{step===4&&<Button size="sm" onClick={handleParseJSON} variant="primary">Review</Button>}{step===5&&<Button size="sm" onClick={handleConfirmImport} variant="primary">Import</Button>}</div></div></div></div>;
}
