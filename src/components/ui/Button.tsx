"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

const variantStyles: Record<string, string> = {
  primary:
    "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-400",
  secondary:
    "bg-white text-slate-950 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400",
  ghost: "bg-transparent text-slate-800 hover:bg-slate-100 focus-visible:ring-slate-400",
};

const sizeStyles: Record<string, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "secondary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-150 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
