import { AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical } from "lucide-react";
import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { cn } from "@/lib/utils";
import { Field, Toggle } from "./shared";

interface Props {
  active: StyleGroup;
}

export function AlignmentSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const style = groups[active];

  const hAlignments = [
    { value: "left" as const, label: "L", icon: AlignLeft },
    { value: "center" as const, label: "C", icon: AlignCenter },
    { value: "right" as const, label: "R", icon: AlignRight },
  ];

  const vAlignments = [
    { value: "top" as const, label: "Top", icon: AlignStartVertical },
    { value: "middle" as const, label: "Mid", icon: AlignCenterVertical },
    { value: "bottom" as const, label: "Bot", icon: AlignEndVertical },
  ];

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">Horizontal</div>
        <div className="flex gap-1">
          {hAlignments.map((a) => (
            <button
              key={a.value}
              onClick={() => setField(active, "align", a.value)}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[10px] font-medium transition-all",
                style.align === a.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              <a.icon className="h-3 w-3" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">Vertical</div>
        <div className="flex gap-1">
          {vAlignments.map((a) => (
            <button
              key={a.value}
              onClick={() => setField(active, "vAlign", a.value)}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[10px] font-medium transition-all",
                style.vAlign === a.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              <a.icon className="h-3 w-3" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="Safe Margin">
        <div className="flex h-7 items-center gap-2 rounded-md border border-border bg-background px-2 text-xs">
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={style.paddingVw}
            onChange={(e) => setField(active, "paddingVw", Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-8 text-right text-[10px] text-muted-foreground">
            {style.paddingVw}%
          </span>
        </div>
      </Field>
    </div>
  );
}
