import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  isSeparator?: boolean;
  isHeader?: boolean;
}

interface CustomDropdownProps<T extends string = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  className?: string;
  title?: string;
  align?: "left" | "right";
}

export function CustomDropdown<T extends string = string>({
  value,
  options,
  onChange,
  triggerLabel,
  triggerIcon,
  className,
  title,
  align = "right",
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className="relative inline-block text-left shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-[#2D3348] bg-[#111827] text-xs font-semibold text-foreground hover:bg-[#1F2937] hover:border-blue-500/50 transition shadow-sm select-none shrink-0",
          className
        )}
        title={title}
      >
        {triggerIcon || selectedOpt?.icon}
        <span>{triggerLabel || selectedOpt?.label || value}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1.5 z-50 min-w-[190px] rounded-xl border border-[#2D3348] bg-[#111827]/95 p-1.5 shadow-2xl backdrop-blur-md select-none text-xs animate-in fade-in slide-in-from-top-1 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((opt, idx) => {
            if (opt.isSeparator) {
              return <div key={`sep-${idx}`} className="my-1 border-t border-[#2D3348]/80" />;
            }
            if (opt.isHeader) {
              return (
                <span
                  key={`hdr-${idx}`}
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 block"
                >
                  {opt.label}
                </span>
              );
            }

            const isSelected = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-[#1F2937] transition",
                  isSelected && "bg-blue-600/20 text-blue-400 font-bold"
                )}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
