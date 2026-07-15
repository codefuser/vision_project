import { cn } from "@/lib/utils";
import { type ReactNode, useId, useState, useCallback } from "react";
import { RotateCcw, Star } from "lucide-react";
import type { SettingDef } from "./settings-defs";
import { DEFAULT_SETTINGS } from "@/db/schema";

/* ───── Premium Toggle (VS Code / Figma quality) ───── */
export function SettingToggle({
  def, value, onChange, starred, onStar,
}: {
  def: SettingDef; value: boolean; onChange: (v: boolean) => void; starred?: boolean; onStar?: () => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as boolean;
  const [pressed, setPressed] = useState(false);

  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {onStar && (
            <button
              onClick={onStar}
              className={cn(
                "cursor-pointer rounded p-0.5 transition-all opacity-0 group-hover:opacity-100",
                starred ? "text-amber-400 opacity-100" : "text-muted-foreground/30 hover:text-amber-400/60",
              )}
            >
              <Star className="h-3 w-3 fill-current" />
            </button>
          )}
          <label htmlFor={id} className="cursor-pointer text-[13px] font-medium text-foreground/90">
            {def.title}
          </label>
        </div>
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/60">{def.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {value !== dv && (
          <button
            onClick={() => onChange(dv)}
            title={`Reset to default`}
            className="cursor-pointer rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-muted-foreground/70 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
        <button
          id={id}
          role="switch"
          aria-checked={value}
          disabled={false}
          onClick={() => onChange(!value)}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          style={{ transition: "all 250ms cubic-bezier(.22,.9,.33,1)" }}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 outline-none transition-all duration-[250ms]",
            "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "hover:scale-[1.03] active:scale-[0.95]",
            value
              ? "bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.45)]"
              : "bg-muted-foreground/20",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm ring-0",
              "transition-all duration-[250ms]",
              value ? "translate-x-[18px]" : "translate-x-[2px]",
            )}
          />
        </button>
      </div>
    </div>
  );
}

/* ───── Premium Slider with filled track ───── */
export function SettingSlider({
  def, value, onChange, starred, onStar,
}: {
  def: SettingDef; value: number; onChange: (v: number) => void; starred?: boolean; onStar?: () => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as number;
  const min = def.min ?? 0;
  const max = def.max ?? 100;
  const step = def.step ?? 1;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {onStar && (
            <button
              onClick={onStar}
              className={cn(
                "cursor-pointer rounded p-0.5 transition-all opacity-0 group-hover:opacity-100",
                starred ? "text-amber-400 opacity-100" : "text-muted-foreground/30 hover:text-amber-400/60",
              )}
            >
              <Star className="h-3 w-3 fill-current" />
            </button>
          )}
          <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        </div>
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
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-75"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-1 ring-black/5"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───── Premium Select ───── */
export function SettingSelect({
  def, value, onChange, starred, onStar,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void; starred?: boolean; onStar?: () => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {onStar && (
            <button
              onClick={onStar}
              className={cn(
                "cursor-pointer rounded p-0.5 transition-all opacity-0 group-hover:opacity-100",
                starred ? "text-amber-400 opacity-100" : "text-muted-foreground/30 hover:text-amber-400/60",
              )}
            >
              <Star className="h-3 w-3 fill-current" />
            </button>
          )}
          <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        </div>
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
            className="h-7 min-w-[120px] appearance-none rounded-md border border-border/50 bg-background/80 px-2.5 pr-6 text-[12px] font-medium text-foreground outline-none transition-all hover:border-border hover:bg-background focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
          >
            {(def.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ───── Premium Input ───── */
export function SettingInput({
  def, value, onChange, starred, onStar,
}: {
  def: SettingDef; value: string | number; onChange: (v: string) => void; starred?: boolean; onStar?: () => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key];
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {onStar && (
            <button
              onClick={onStar}
              className={cn(
                "cursor-pointer rounded p-0.5 transition-all opacity-0 group-hover:opacity-100",
                starred ? "text-amber-400 opacity-100" : "text-muted-foreground/30 hover:text-amber-400/60",
              )}
            >
              <Star className="h-3 w-3 fill-current" />
            </button>
          )}
          <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        </div>
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
          className="h-7 w-28 rounded-md border border-border/50 bg-background/80 px-2.5 text-[12px] font-medium text-foreground outline-none transition-all hover:border-border hover:bg-background focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        {def.unit && <span className="text-[11px] text-muted-foreground/50">{def.unit}</span>}
      </div>
    </div>
  );
}

/* ───── Premium Color Picker ───── */
export function SettingColor({
  def, value, onChange, starred, onStar,
}: {
  def: SettingDef; value: string; onChange: (v: string) => void; starred?: boolean; onStar?: () => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <div className="group flex items-start justify-between gap-3 rounded-md px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {onStar && (
            <button
              onClick={onStar}
              className={cn(
                "cursor-pointer rounded p-0.5 transition-all opacity-0 group-hover:opacity-100",
                starred ? "text-amber-400 opacity-100" : "text-muted-foreground/30 hover:text-amber-400/60",
              )}
            >
              <Star className="h-3 w-3 fill-current" />
            </button>
          )}
          <label htmlFor={id} className="text-[13px] font-medium text-foreground/90">{def.title}</label>
        </div>
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
          <div className="relative h-7 w-7 overflow-hidden rounded-md border border-border/50">
            <input
              id={id}
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="h-full w-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: value }} />
          </div>
          <span className="w-14 text-[11px] tabular-nums text-muted-foreground/60">{value}</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Card wrapper ───── */
export function SettingCard({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border/40 bg-card shadow-xs", className)}>
      {title && (
        <div className="border-b border-border/15 px-4 py-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/45">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-border/8">{children}</div>
    </div>
  );
}

/* ───── Stat badge ───── */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/25 bg-muted/5 p-2.5 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/45">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
