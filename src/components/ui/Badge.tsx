"use client";

import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "success" | "warning" | "accent";
};

const badgeStyles: Record<string, string> = {
  neutral: "bg-slate-100 text-slate-900",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  accent: "bg-sky-100 text-sky-900",
};

export function Badge({ variant = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[variant]} ${className}`} {...props} />
  );
}
