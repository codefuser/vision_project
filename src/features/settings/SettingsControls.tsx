import { cn } from "@/lib/utils";
import { type ReactNode, useId } from "react";
import { RotateCcw } from "lucide-react";
import type { SettingDef } from "./settings-defs";
import { DEFAULT_SETTINGS } from "@/db/schema";

/* ───── VS Code–style Toggle with glow ───── */
export function SettingToggle({
  def, value, onChange,
}: {
  def: SettingDef; value: boolean; onChange: (v: boolean) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as boolean;
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="cursor-pointer text-[13px] font-medium text-foreground/90">
          {def.title}
        </label>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {value !== dv && (
          <button
            onClick={() => onChange(dv)}
            title={`Reset to default (${dv ? "on" : "off"})`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <button
          id={id}
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            value
              ? "bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              : "bg-muted-foreground/20",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
              value ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </div>
  );
}

/* ───── Slider ───── */
export function SettingSlider({
  def, value, onChange,
}: {
  def: SettingDef; value: number; onChange: (v: number) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as number;
  const min = def.min ?? 0;
  const max = def.max ?? 100;
  const step = def.step ?? 1;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value !== dv && (
          <button
            onClick={() => onChange(dv)}
            title={`Reset to default (${dv}${def.unit ?? ""})`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <span className="w-10 text-right text-[12px] tabular-nums text-muted-foreground">{value}{def.unit ?? ""}</span>
        <div className="relative h-6 w-24">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/15">
            <div
              className="h-full rounded-full bg-primary transition-all duration-75"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───── Select ───── */
export function SettingSelect({
  def, value, onChange,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {value !== dv && (
          <button
            onClick={() => onChange(dv)}
            title={`Reset to default (${dv})`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 min-w-[120px] appearance-none rounded-md border border-border/60 bg-background px-2.5 pr-6 text-[12px] font-medium text-foreground outline-none transition-colors focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
          >
            {(def.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───── Number / Text Input ───── */
export function SettingInput({
  def, value, onChange,
}: {
  def: SettingDef; value: string | number; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key];
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {String(value) !== String(dv) && (
          <button
            onClick={() => onChange(String(dv))}
            title={`Reset to default (${dv})`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <input
          id={id}
          type={def.type === "number" ? "number" : "text"}
          value={value}
          min={def.min}
          max={def.max}
          step={def.step}
          placeholder={def.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-28 rounded-md border border-border/60 bg-background px-2.5 text-[12px] font-medium text-foreground outline-none transition-colors focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        {def.unit && <span className="text-[11px] text-muted-foreground/50">{def.unit}</span>}
      </div>
    </div>
  );
}

/* ───── Color Picker ───── */
export function SettingColor({
  def, value, onChange,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {value !== dv && (
          <button
            onClick={() => onChange(dv)}
            title={`Reset to default (${dv})`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 overflow-hidden rounded-md border border-border/60">
            <input
              id={id}
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="h-full w-full" style={{ backgroundColor: value }} />
          </div>
          <span className="w-14 text-[11px] tabular-nums text-muted-foreground/70">{value}</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Card wrapper ───── */
export function SettingCard({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/50 bg-card shadow-xs", className)}>
      {title && (
        <div className="border-b border-border/20 px-3 py-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-border/10">{children}</div>
    </div>
  );
}

/* ───── Stat badge ───── */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/30 bg-muted/10 p-2.5 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
