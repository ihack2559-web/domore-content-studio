"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { ContentItem, Task, Frame } from "@/lib/mockData";

type ContentType = "Graphic / Carousel" | "Vertical Video" | "Horizontal Video" | "Text Post" | "Article";

type ImportedContent = {
  title: string;
  type: ContentType;
  channel?: string;
  frames?: number;
  tasks?: number;
  hook?: string;
  objective?: string;
};

type ImportWizardProps = {
  onClose: () => void;
  onImport: (contents: ContentItem[], frames: Frame[], tasks: Task[]) => void;
};

const CONTENT_TYPES: ContentType[] = [
  "Graphic / Carousel",
  "Vertical Video",
  "Horizontal Video",
  "Text Post",
  "Article",
];

const THAI_PROMPTS: Record<ContentType, string> = {
  "Graphic / Carousel": `คุณเป็นผู้สร้างเนื้อหาดีไซน์กราฟิกส์และชุดรูปภาพ ต้องสร้าง JSON ที่มีโครงสร้าง:
{
  "contents": [
    {
      "title": "ชื่อเรื่อง",
      "hook": "บรรยายเนื้อหา",
      "objective": "วัตถุประสงค์",
      "target": "กลุ่มเป้าหมาย",
      "channel": "ช่องทางสื่อ",
      "frames": 5
    }
  ]
}`,
  "Vertical Video": `คุณเป็นผู้สร้างเนื้อหาวิดีโอแนวตั้ง บนโซเชียลมีเดีย สร้าง JSON ที่บรรยาย:
{
  "contents": [
    {
      "title": "ชื่อเรื่อง",
      "hook": "บรรยายเนื้อหา",
      "objective": "วัตถุประสงค์",
      "target": "กลุ่มเป้าหมาย",
      "channel": "Social",
      "frames": 8
    }
  ]
}`,
  "Horizontal Video": `คุณเป็นผู้สร้างเนื้อหาวิดีโอแนวนอน สำหรับเว็บและการนำเสนอ สร้าง JSON:
{
  "contents": [
    {
      "title": "ชื่อเรื่อง",
      "hook": "บรรยายเนื้อหา",
      "objective": "วัตถุประสงค์",
      "target": "กลุ่มเป้าหมาย",
      "channel": "Web",
      "frames": 10
    }
  ]
}`,
  "Text Post": `คุณเป็นผู้สร้างเนื้อหาโพสต์ข้อความสำหรับโซเชียลมีเดีย สร้าง JSON:
{
  "contents": [
    {
      "title": "ชื่อเรื่อง",
      "hook": "เนื้อหาข้อความ",
      "objective": "วัตถุประสงค์",
      "target": "กลุ่มเป้าหมาย",
      "channel": "Social",
      "keyMessage": "ข้อความหลัก"
    }
  ]
}`,
  "Article": `คุณเป็นผู้เขียนบทความและเนื้อหา สร้าง JSON:
{
  "contents": [
    {
      "title": "ชื่อเรื่อง",
      "hook": "บรรยายเนื้อหา",
      "objective": "วัตถุประสงค์",
      "target": "กลุ่มเป้าหมาย",
      "channel": "Web",
      "keyMessage": "ข้อความหลัก"
    }
  ]
}`,
};

export function ImportWizard({ onClose, onImport }: ImportWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [parsedContents, setParsedContents] = useState<ImportedContent[]>([]);
  const [importError, setImportError] = useState("");

  const currentPrompt = selectedType ? THAI_PROMPTS[selectedType] : "";

  const handleParseJSON = () => {
    setImportError("");
    try {
      const data = JSON.parse(jsonInput);
      if (!data.contents || !Array.isArray(data.contents)) {
        setImportError("JSON must have a 'contents' array");
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
    } catch (error) {
      setImportError("Invalid JSON format");
    }
  };

  const handleConfirmImport = () => {
    // Generate mock imported content
    const newContents: ContentItem[] = parsedContents.map((content, idx) => ({
      id: `c${Date.now()}_${idx}`,
      title: content.title,
      thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=60",
      hook: content.hook || "",
      type: "Campaign" as const, // Normalize all to Campaign for now
      status: "Draft" as const,
      ownerId: "u1",
      channel: content.channel || "Web",
      shootDate: new Date().toLocaleDateString(),
      postDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      reviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
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
    parsedContents.forEach((content, idx) => {
      for (let i = 0; i < (content.frames || 0); i++) {
        newFrames.push({
          id: `f${Date.now()}_${idx}_${i}`,
          contentId: newContents[idx].id,
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
          sceneNumber: i + 1,
          scriptLine: `Scene ${i + 1}`,
          note: "Imported frame",
        });
      }
    });

    const newTasks: Task[] = [];
    parsedContents.forEach((content, idx) => {
      for (let i = 0; i < (content.tasks || 1); i++) {
        newTasks.push({
          id: `t${Date.now()}_${idx}_${i}`,
          contentId: newContents[idx].id,
          title: `Task ${i + 1} for ${content.title}`,
          assigneeId: "u1",
          status: "Backlog" as const,
          startDate: new Date().toLocaleDateString(),
          due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          effort: "1d",
        });
      }
    });

    onImport(newContents, newFrames, newTasks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Import Wizard</h2>
              <p className="mt-2 text-sm text-slate-600">
                Step {step} of 5 · {["Overview", "Content Type", "AI Prompt", "Upload JSON", "Review"][step - 1]}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${s <= step ? "bg-slate-950" : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Import Content with AI</h3>
              <p className="text-sm text-slate-600">
                Upload JSON files containing your content metadata. Use our AI prompts to generate properly structured JSON from your content strategy.
              </p>
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">What you can import:</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Content items (title, hook, objective, target audience)</li>
                  <li>✓ Storyboard frames (scene numbers, script lines, notes)</li>
                  <li>✓ Production tasks (assignments, deadlines)</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> ZIP extraction and automatic image matching will be available in Sprint 5.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Select Content Type</h3>
              <p className="text-sm text-slate-600">
                Choose the primary content type. Each has an optimized AI prompt.
              </p>
              <div className="grid gap-3">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-3xl border-2 p-4 text-left transition ${
                      selectedType === type
                        ? "border-slate-950 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-950">{type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Copy AI Prompt</h3>
              <p className="text-sm text-slate-600">
                Use this prompt with your AI tool (ChatGPT, Claude, etc.) to generate JSON content.
              </p>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap text-xs text-slate-700">{currentPrompt}</pre>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentPrompt);
                  alert("Prompt copied to clipboard!");
                }}
                className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Copy to Clipboard
              </button>
              <p className="text-xs text-slate-500">
                Paste the prompt into your AI tool, then return here with the generated JSON.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Upload JSON</h3>
              <p className="text-sm text-slate-600">
                Paste the JSON response from your AI tool here.
              </p>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"contents": [{"title": "..."}]}'
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                rows={10}
              />
              {importError && <p className="text-sm text-red-600">{importError}</p>}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Review Before Import</h3>
              <p className="text-sm text-slate-600">
                Review the {parsedContents.length} content items to be imported.
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {parsedContents.map((content, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-950">{content.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{content.hook}</p>
                      </div>
                      <Badge variant="accent">{content.type}</Badge>
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-slate-600">
                      {content.frames ? (
                        <span>📹 {content.frames} frames</span>
                      ) : null}
                      {content.tasks ? (
                        <span>✓ {content.tasks} task{content.tasks !== 1 ? "s" : ""}</span>
                      ) : null}
                      <span>📍 {content.channel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (step === 1) onClose();
                else setStep((s) => (s - 1) as 1 | 2 | 3 | 4 | 5);
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <div className="flex gap-2">
              {step === 4 && (
                <Button variant="secondary" onClick={() => setStep(5)}>
                  Skip to Review
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => {
                  if (step === 2 && !selectedType) {
                    alert("Please select a content type");
                    return;
                  }
                  if (step === 4) {
                    handleParseJSON();
                  } else if (step === 5) {
                    handleConfirmImport();
                  } else {
                    setStep((s) => (s + 1) as 1 | 2 | 3 | 4 | 5);
                  }
                }}
              >
                {step === 5 ? "Import" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
