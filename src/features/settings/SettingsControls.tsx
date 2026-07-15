import { cn } from "@/lib/utils";
import { type ReactNode, useId, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { SettingDef } from "./settings-defs";
import { DEFAULT_SETTINGS } from "@/db/schema";

/* ───── SettingRow — generic reusable wrapper ───── */
function SettingRow({ def, children, id }: { def: SettingDef; children: ReactNode; id?: string }) {
  return (
    <div className="group flex items-start justify-between gap-4 rounded-md px-4 py-3 transition-colors hover:bg-accent/20">
      <div className="min-w-0 flex-1">
        {id ? (
          <label htmlFor={id} className="cursor-pointer text-[13px] font-medium text-foreground/90">
            {def.title}
          </label>
        ) : (
          <span className="text-[13px] font-medium text-foreground/90">{def.title}</span>
        )}
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/55">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );
}

/* ───── Reset button ───── */
function ResetBtn({ show, onReset }: { show: boolean; onReset: () => void }) {
  if (!show) return null;
  return (
    <button
      onClick={onReset}
      title="Reset to default"
      className="cursor-pointer rounded p-0.5 text-muted-foreground/25 opacity-0 transition-all hover:text-muted-foreground/60 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <RotateCcw className="h-3 w-3" />
    </button>
  );
}

/* ───── Premium Toggle (iOS / Figma quality) ───── */
export function SettingToggle({
  def, value, onChange,
}: {
  def: SettingDef; value: boolean; onChange: (v: boolean) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as boolean;
  const [pressed, setPressed] = useState(false);

  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <button
        id={id}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          transition: "all 250ms cubic-bezier(.22,.9,.33,1)",
          transform: pressed ? "scale(0.95)" : "",
          backgroundColor: value ? "var(--primary)" : "#2B3245",
          boxShadow: value ? "0 0 12px color-mix(in srgb, var(--primary) 50%, transparent)" : "none",
        }}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "hover:scale-[1.03] active:scale-[0.95]",
        )}
      >
        <span
          style={{
            transition: "all 250ms cubic-bezier(.22,.9,.33,1)",
            backgroundColor: value ? "#ffffff" : "#7A859A",
            transform: value ? "translateX(17px)" : "translateX(2px)",
          }}
          className="pointer-events-none inline-block h-[14px] w-[14px] rounded-full shadow-sm ring-0"
        />
      </button>
    </SettingRow>
  );
}

/* ───── Premium Slider ───── */
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
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <span className="w-10 text-right text-[12px] tabular-nums text-muted-foreground">{value}{def.unit ?? ""}</span>
      <div className="relative h-5 w-24">
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
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/12">
          <div
            className="h-full rounded-full bg-primary transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-1 ring-black/5"
          style={{ left: `${pct}%` }}
        />
      </div>
    </SettingRow>
  );
}

/* ───── Premium Select ───── */
export function SettingSelect({
  def, value, onChange,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 min-w-[120px] appearance-none rounded-md border border-border/40 bg-background/60 px-2.5 pr-6 text-[12px] font-medium text-foreground outline-none transition-all hover:border-border/70 hover:bg-background/80 focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
        >
          {(def.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </SettingRow>
  );
}

/* ───── Premium Input ───── */
export function SettingInput({
  def, value, onChange,
}: {
  def: SettingDef; value: string | number; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key];
  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={String(value) !== String(dv)} onReset={() => onChange(String(dv))} />
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type={def.type === "number" ? "number" : "text"}
          value={value}
          min={def.min}
          max={def.max}
          step={def.step}
          placeholder={def.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-28 rounded-md border border-border/40 bg-background/60 px-2.5 text-[12px] font-medium text-foreground outline-none transition-all hover:border-border/70 hover:bg-background/80 focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        {def.unit && <span className="text-[11px] text-muted-foreground/45">{def.unit}</span>}
      </div>
    </SettingRow>
  );
}

/* ───── Premium Color Picker ───── */
export function SettingColor({
  def, value, onChange,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <div className="flex items-center gap-2">
        <div className="relative h-7 w-7 overflow-hidden rounded-md border border-border/40">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="h-full w-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: value }} />
        </div>
        <span className="w-14 text-[11px] tabular-nums text-muted-foreground/55">{value}</span>
      </div>
    </SettingRow>
  );
}

/* ───── Card Wrapper ───── */
export function SettingCard({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/30 bg-card shadow-xs", className)}>
      {title && (
        <div className="border-b border-border/12 px-4 py-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-border/6">{children}</div>
    </div>
  );
}

/* ───── Stat Badge ───── */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/20 bg-muted/5 p-2.5 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
