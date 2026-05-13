import { ReactNode } from "react";

type PanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, subtitle, children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
