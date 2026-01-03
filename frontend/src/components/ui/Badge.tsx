import React from "react";
import { cn } from "@/lib/utils"; // Standard Shadcn utility helper

// 1. Define the allowed variants
type Variant = "green" | "yellow" | "gray" | "secondary" | "outline" | "default";

// 2. Map the variants to their respective Tailwind classes
const variantStyles: Record<Variant, string> = {
  green: "bg-emerald-600 text-white",
  yellow: "bg-yellow-600 text-white",
  gray: "bg-slate-600 text-white",
  secondary: "bg-purple-600 text-white",
  outline: "bg-transparent border border-slate-500 text-slate-500",
  default: "", // Default is empty because we often pass custom colors via className
};

// 3. Define the Props interface
interface BadgeProps {
  text?: string;
  children?: React.ReactNode; // Added children support just in case
  variant?: Variant;
  className?: string;
}

export default function Badge({
  text,
  children,
  variant = "default", // Default to "default" if no variant is provided
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center justify-center",
        variantStyles[variant], // Safely look up the style
        className // Apply any extra classes (like your STATUS_COLORS)
      )}
    >
      {/* Renders text prop or children, whichever is provided */}
      {text || children}
    </span>
  );
}