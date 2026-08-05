import { cn } from "@/lib/utils";
import { type ReactNode, useId } from "react";
import { RotateCcw } from "lucide-react";
import type { SettingDef } from "./settings-defs";
import { DEFAULT_SETTINGS } from "@/db/schema";

/* ───── SettingRow — generic reusable wrapper ───── */
function SettingRow({ def, children, id }: { def: SettingDef; children: ReactNode; id?: string }) {
  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-4 rounded-md px-4 py-3 transition-colors hover:bg-accent/20",
        def.comingSoon && "opacity-80",
      )}
    >
      <div className="min-w-0 flex-1">
        {id && !def.comingSoon ? (
          <label htmlFor={id} className="cursor-pointer text-[13px] font-medium text-foreground/90">
            {def.title}
          </label>
        ) : (
          <span className="text-[13px] font-medium text-foreground/90">{def.title}</span>
        )}
        {def.description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/55">
            {def.description}
          </p>
        )}
        {def.comingSoon && (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">{children}</div>
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

/* ───── Coming Soon badge (disabled control slot) ───── */
function ComingSoonSlot() {
  return (
    <div className="h-5 w-9 shrink-0 rounded-full bg-muted/60 ring-1 ring-inset ring-border/50" />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Premium Toggle Switch — VersoLyn design system
   Theme-aware (CSS variables only), smooth 200ms motion, explicit
   hover / active / focus / disabled states. Keyboard + screen-reader
   accessible via Radix Switch.
   ═══════════════════════════════════════════════════════════════════ */
export function SettingToggle({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as boolean;

  if (def.comingSoon) {
    return (
      <SettingRow def={def} id={id}>
        <ComingSoonSlot />
      </SettingRow>
    );
  }

  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={def.title}
        disabled={def.comingSoon}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!value);
          }
        }}
        className={cn(
          // Track
          "group relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full border border-transparent outline-none",
          "transition-all duration-200 ease-out",
          value
            ? "bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_45%,transparent)]"
            : "bg-muted ring-1 ring-inset ring-border/60",
          // Hover
          "hover:scale-[1.03]",
          !value && "hover:bg-muted/80 hover:ring-border",
          // Active
          "active:scale-[0.95]",
          // Focus
          "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute h-[16px] w-[16px] rounded-full bg-background shadow-md",
            "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-active:scale-90",
            value ? "translate-x-[18px]" : "translate-x-[2px]",
          )}
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.08)" }}
        />
      </button>
    </SettingRow>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Premium Slider — VersoLyn design system
   Animated gradient fill, custom ring thumb, live value pill, native
   range keyboard support (arrows / Home / End) with a visible focus ring.
   ═══════════════════════════════════════════════════════════════════ */
export function SettingSlider({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as number;
  const min = def.min ?? 0;
  const max = def.max ?? 100;
  const step = def.step ?? 1;
  const shown = def.mapFromSetting ? def.mapFromSetting(value) : value;
  const pct = Math.min(100, Math.max(0, ((shown - min) / (max - min)) * 100));
  const emit = (v: number) => onChange(def.mapToSetting ? def.mapToSetting(v) : v);

  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      {/* Live value pill */}
      <span className="inline-flex min-w-[2.75rem] items-center justify-end rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-foreground/80 ring-1 ring-inset ring-border/40">
        {formatValue(shown)}
        {def.unit ?? ""}
      </span>
      <div className="relative h-5 w-32 shrink-0">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={shown}
          onChange={(e) => emit(Number(e.target.value))}
          aria-label={def.title}
          aria-valuetext={`${formatValue(shown)}${def.unit ?? ""}`}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
        {/* Track */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted/70 ring-1 ring-inset ring-border/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_35%,transparent)] transition-[width] duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Thumb */}
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md",
            "transition-[transform,box-shadow] duration-150 ease-out",
            "peer-hover:scale-110 peer-hover:shadow-lg",
            "peer-active:scale-125 peer-active:shadow-lg",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/60",
          )}
          style={{
            left: `${pct}%`,
            border: "2px solid var(--primary)",
          }}
        />
      </div>
    </SettingRow>
  );
}

function formatValue(v: number): string {
  if (!Number.isFinite(v)) return "0";
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 100) / 100);
}

/* ───── Premium Select ───── */
export function SettingSelect({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: string;
  onChange: (v: string) => void;
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
          className="h-8 min-w-[130px] appearance-none rounded-lg border border-border/40 bg-background/60 pl-2.5 pr-7 text-[12px] font-medium text-foreground shadow-xs outline-none transition-all hover:border-border/80 hover:bg-background/90 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          {(def.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </SettingRow>
  );
}

/* ───── Premium Input ───── */
export function SettingInput({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: string | number;
  onChange: (v: string) => void;
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
          className="h-8 w-28 rounded-lg border border-border/40 bg-background/60 px-2.5 text-[12px] font-medium text-foreground shadow-xs outline-none transition-all hover:border-border/80 hover:bg-background/90 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {def.unit && <span className="text-[11px] text-muted-foreground/45">{def.unit}</span>}
      </div>
    </SettingRow>
  );
}

/* ───── Premium Color Picker ───── */
export function SettingColor({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const dv = DEFAULT_SETTINGS[def.key] as string;
  return (
    <SettingRow def={def} id={id}>
      <ResetBtn show={value !== dv} onReset={() => onChange(dv)} />
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-border/40 shadow-xs transition-all hover:border-border/80 focus-within:ring-2 focus-within:ring-primary/20">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className="h-full w-full ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: value }}
          />
        </div>
        <span className="w-14 text-[11px] tabular-nums text-muted-foreground/55">{value}</span>
      </div>
    </SettingRow>
  );
}

/* ───── Card Wrapper ───── */
export function SettingCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border/30 bg-card shadow-xs", className)}>
      {title && (
        <div className="border-b border-border/12 px-4 py-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            {title}
          </h3>
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
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
