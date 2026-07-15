import { cn } from "@/lib/utils";
import { type ReactNode, useId } from "react";

/* ───── Toggle (modern switch) ───── */
export function SettingToggle({
  label, description, checked, onChange, disabled,
}: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">{label}</label>
        {description && <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          checked ? "bg-primary" : "bg-muted-foreground/20",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

/* ───── Slider ───── */
export function SettingSlider({
  label, description, value, min, max, step, onChange, unit, disabled,
}: {
  label: string; description?: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; unit?: string; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs tabular-nums text-muted-foreground">{value}{unit}</span>
      </div>
      {description && <p className="mb-1.5 text-xs text-muted-foreground/70">{description}</p>}
      <input
        id={id}
        type="range"
        min={min} max={max} step={step ?? 1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted-foreground/15 accent-primary outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
      />
    </div>
  );
}

/* ───── Select ───── */
export function SettingSelect({
  label, description, value, options, onChange, disabled,
}: {
  label: string; description?: string; value: string; options: { value: string; label: string }[];
  onChange: (v: string) => void; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>}
      </div>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 min-w-[140px] rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ───── Number Input ───── */
export function SettingInput({
  label, description, value, type, min, max, step, placeholder, onChange, disabled, suffix,
}: {
  label: string; description?: string; value: string | number; type?: string; min?: number; max?: number; step?: number;
  placeholder?: string; onChange: (v: string) => void; disabled?: boolean; suffix?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type={type ?? "text"}
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-28 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

/* ───── Color Picker ───── */
export function SettingColor({
  label, description, value, onChange, disabled,
}: {
  label: string; description?: string; value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        {description && <p className="mt-0.5 text-xs text-muted-foreground/70">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded-md border border-border bg-transparent p-0.5 disabled:opacity-50"
        />
        <span className="w-16 text-xs tabular-nums text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

/* ───── Card wrapper ───── */
export function SettingCard({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card shadow-xs", className)}>
      {title && (
        <div className="border-b border-border/30 px-4 py-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{title}</h3>
        </div>
      )}
      <div className="divide-y divide-border/20 px-4">{children}</div>
    </div>
  );
}

/* ───── Stat badge ───── */
export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/20 p-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{label}</div>
      <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
