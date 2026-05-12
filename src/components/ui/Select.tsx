"use client";

import { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  label?: string;
};

export function Select({ options, label, className = "", ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-xs text-slate-600">
      {label ? <span>{label}</span> : null}
      <select
        className={`min-w-[140px] rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
