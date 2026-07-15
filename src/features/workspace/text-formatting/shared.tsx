import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function NumberInput({
  value, onChange, step = 1, min, max, suffix,
}: {
  value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="flex h-7 items-center rounded-md border border-border bg-background px-2 text-xs">
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) onChange(v); }}
        className="w-full bg-transparent outline-none"
      />
      {suffix && <span className="ml-1 text-[10px] text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function Select({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-full cursor-pointer rounded-md border border-border bg-background px-1.5 text-xs outline-none transition hover:border-muted-foreground/30 focus:border-primary/50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({
  label, active, onClick, size, title,
}: {
  label: React.ReactNode; active?: boolean; onClick?: () => void; size?: "sm" | "md"; title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-md border text-xs font-medium transition-all",
        size === "sm" ? "h-6 min-w-6 px-1.5 text-[10px]" : "h-7 min-w-7 px-2",
        active
          ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function SwitchRow({
  label, checked, onChange, disabled,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <label className={cn(
      "flex items-center gap-2 text-[11px]",
      disabled ? "opacity-50" : "cursor-pointer",
    )}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 cursor-pointer rounded border-border text-primary accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function ColorInput({
  value, onChange, swatches,
}: {
  value: string; onChange: (v: string) => void; swatches?: string[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [expanded]);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-7 items-center gap-2 rounded-md border border-border bg-background px-1.5" suppressHydrationWarning>
        {mounted ? (
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-5 w-6 cursor-pointer rounded border-none bg-transparent p-0"
            suppressHydrationWarning
          />
        ) : (
          <span className="inline-block h-5 w-6 rounded" style={{ background: value }} />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs outline-none"
          onFocus={() => setExpanded(true)}
        />
        {(swatches || DEFAULT_SWATCHES) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        )}
      </div>
      {expanded && (swatches || DEFAULT_SWATCHES) && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-popover p-2 shadow-lg">
          <div className="grid grid-cols-6 gap-1.5">
            {(swatches ?? DEFAULT_SWATCHES).map((c) => (
              <button
                key={c}
                onClick={() => { onChange(c); setExpanded(false); }}
                className={cn(
                  "h-6 w-full cursor-pointer rounded border transition hover:scale-110",
                  c === value ? "border-primary ring-1 ring-primary" : "border-border",
                )}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_SWATCHES = [
  "#ffffff", "#f5f5f4", "#d4d4d8", "#a1a1aa", "#71717a", "#3f3f46",
  "#27272a", "#18181b", "#09090b", "#000000",
  "#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#ef4444",
  "#fff7ed", "#ffedd5", "#fed7aa", "#fb923c", "#f97316",
  "#fefce8", "#fef9c3", "#fde68a", "#fbbf24", "#eab308",
  "#f0fdf4", "#dcfce7", "#bbf7d0", "#4ade80", "#22c55e",
  "#ecfdf5", "#d1fae5", "#a7f3d0", "#2dd4bf", "#14b8a6",
  "#f0f9ff", "#e0f2fe", "#bae6fd", "#38bdf8", "#0ea5e9",
  "#eef2ff", "#e0e7ff", "#c7d2fe", "#818cf8", "#6366f1",
  "#faf5ff", "#ede9fe", "#ddd6fe", "#a78bfa", "#8b5cf6",
  "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59",
  "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337",
  "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95",
  "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63",
];

export function Divider() {
  return <div className="my-2 border-t border-border/60" />;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

export function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-background/40 p-2 text-[10px] text-muted-foreground">
      {children}
    </div>
  );
}
