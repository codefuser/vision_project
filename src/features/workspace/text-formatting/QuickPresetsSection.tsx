import { applyTemplate } from "@/lib/templates/apply";
import { cn } from "@/lib/utils";

const QUICK_PRESETS = [
  { id: "mw-mono-bold", name: "Large Text", icon: "T", desc: "Bold & readable" },
  { id: "mn-light", name: "Small Text", icon: "t", desc: "Compact details" },
  { id: "bs-parchment", name: "Bible", icon: "B", desc: "Scripture focus", category: "Bible Study" },
  { id: "mw-slate", name: "Lyrics", icon: "♪", desc: "Song presentation" },
  { id: "cw-navy", name: "Reference", icon: "¶", desc: "Citation style" },
  { id: "ss-sky", name: "Announcement", icon: "A", desc: "Clear & bright" },
  { id: "dk-onyx", name: "Countdown", icon: "⏱", desc: "Dark minimal" },
  { id: "ch-rainbow", name: "Children", icon: "★", desc: "Fun & colorful" },
  { id: "mn-dark", name: "Youth", icon: "Y", desc: "Bold modern" },
  { id: "mn-charcoal", name: "Custom", icon: "✦", desc: "Current style" },
];

export function QuickPresetsSection() {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {QUICK_PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            if (p.id === "mn-charcoal") return; // "Custom" is informational
            applyTemplate(p.id);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-0.5 rounded-md border px-1.5 py-2 text-center transition-all hover:border-primary/40 hover:bg-accent",
            p.id === "mn-charcoal" ? "border-dashed border-border text-muted-foreground" : "border-border bg-background",
          )}
          title={p.desc}
        >
          <span className="text-sm font-bold leading-none">{p.icon}</span>
          <span className="text-[9px] font-medium leading-tight">{p.name}</span>
          <span className="text-[7px] text-muted-foreground leading-tight">{p.desc}</span>
        </button>
      ))}
    </div>
  );
}
