import { Play, MoveRight, Scale, Type, ChevronDown } from "lucide-react";
import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { cn } from "@/lib/utils";
import type { TextAnimation } from "@/lib/broadcast";
import { Field, NumberInput, Select } from "./shared";

interface Props {
  active: StyleGroup;
}

const ANIMATIONS: {
  value: TextAnimation;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "none", label: "None", icon: () => <span className="h-3 w-3 inline-block" /> },
  {
    value: "fade",
    label: "Fade In",
    icon: () => <span className="h-3 w-3 inline-block rounded-sm border opacity-60" />,
  },
  { value: "slide-up", label: "Slide Up", icon: MoveRight },
  { value: "slide-down", label: "Slide Down", icon: MoveRight },
  { value: "scale", label: "Scale In", icon: Scale },
  { value: "typewriter", label: "Typewriter", icon: Type },
];

const DURATIONS = [
  { label: "Fast (0.3s)", value: "0.3" },
  { label: "Medium (0.5s)", value: "0.5" },
  { label: "Slow (0.8s)", value: "0.8" },
  { label: "Very Slow (1.2s)", value: "1.2" },
];

export function AnimationSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const style = groups[active];

  return (
    <div className="space-y-2.5">
      <div>
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
          Entrance Animation
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {ANIMATIONS.map((a) => (
            <button
              key={a.value}
              onClick={() => setField(active, "textAnimation", a.value)}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 rounded-md border px-2 py-2 text-[10px] font-medium transition-all",
                style.textAnimation === a.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              <a.icon className={cn("h-4 w-4", a.value === "slide-down" && "rotate-180")} />
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {style.textAnimation !== "none" && (
        <>
          <Field label="Duration">
            <Select value={String(0.5)} onChange={() => {}} options={DURATIONS} />
          </Field>

          <button className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-medium text-primary transition hover:bg-primary/10">
            <Play className="h-3 w-3" /> Preview Animation
          </button>

          <div className="rounded-md border border-dashed border-border bg-background/40 p-2 text-[10px] text-muted-foreground">
            Animation preview plays in the Live Preview panel above.
          </div>
        </>
      )}

      {style.textAnimation === "none" && (
        <div className="rounded-md border border-dashed border-border bg-background/40 p-2 text-[10px] text-muted-foreground">
          Select an animation above to preview how text enters the stage.
        </div>
      )}
    </div>
  );
}
