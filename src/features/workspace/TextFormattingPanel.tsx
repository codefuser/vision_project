import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Type, Palette, AlignLeft, Sparkle, Play,
  Layers, ImageIcon, Image as LogoIcon, SlidersHorizontal,
  Shield, LayoutDashboard, History, RotateCcw, ChevronDown,
  Eye, EyeOff, PanelRightClose,
} from "lucide-react";
import { useFocusZone } from "./focus-manager";
import { useWorkspace } from "./workspace.store";
import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import type { SectionStyle, TextStyle } from "@/lib/broadcast";
import { cn } from "@/lib/utils";

import { AccordionSection } from "./text-formatting/AccordionSection";
import { ThemeSection } from "./text-formatting/ThemeSection";
import { QuickTextSection } from "./text-formatting/QuickTextSection";
import { ColorSection } from "./text-formatting/ColorSection";
import { AlignmentSection } from "./text-formatting/AlignmentSection";
import { EffectsSection } from "./text-formatting/EffectsSection";
import { AnimationSection } from "./text-formatting/AnimationSection";
import { LayersSection } from "./text-formatting/LayersSection";
import { BackgroundSection } from "./text-formatting/BackgroundSection";
import { LogoSection } from "./text-formatting/LogoSection";
import { AdvancedSection } from "./text-formatting/AdvancedSection";
import { QuickPresetsSection } from "./text-formatting/QuickPresetsSection";
import { HistorySection } from "./text-formatting/HistorySection";
import { Toggle } from "./text-formatting/shared";

const GROUP_LABELS: Record<StyleGroup, string> = {
  reference: "Reference",
  tamil: "Tamil",
  english: "English",
};

export function TextFormattingPanel() {
  const focus = useFocusZone("text-format");
  const collapsed = useWorkspace((s) => s.textFormatCollapsed);
  const toggle = useWorkspace((s) => s.toggleTextFormatCollapsed);
  const activeTab = useWorkspace((s) => s.activeTab);
  const groups = useTextFormat((s) => s.groups);
  const patchGroup = useTextFormat((s) => s.patchGroup);
  const resetGroup = useTextFormat((s) => s.resetGroup);
  const reset = useTextFormat((s) => s.reset);
  const wsActiveSection = useWorkspace((s) => s.textFormatActiveSection);
  const setTextFormatActiveSection = useWorkspace((s) => s.setTextFormatActiveSection);
  const pushHistory = useWorkspace((s) => s.pushHistory);

  const songsMode = activeTab === "songs";
  const visibleGroups: StyleGroup[] = songsMode ? ["tamil"] : (Object.keys(GROUP_LABELS) as StyleGroup[]);
  const [activeRaw, setActive] = useState<StyleGroup>(() => (wsActiveSection as StyleGroup) || "reference");
  const active: StyleGroup = songsMode ? "tamil" : activeRaw;

  useEffect(() => { if (!songsMode) setTextFormatActiveSection(activeRaw); }, [activeRaw, songsMode]);

  const style = groups[active];

  // Auto-save history on field changes (debounced)
  const historyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveHistory = () => {
    if (historyTimer.current) clearTimeout(historyTimer.current);
    historyTimer.current = setTimeout(() => {
      pushHistory({
        reference: { ...groups.reference },
        tamil: { ...groups.tamil },
        english: { ...groups.english },
        background: { ...groups.background },
      });
    }, 3000);
  };

  const sectionIcons: Record<string, React.ReactNode> = {
    theme: <Sparkles className="h-3.5 w-3.5" />,
    "quick-text": <Type className="h-3.5 w-3.5" />,
    color: <Palette className="h-3.5 w-3.5" />,
    alignment: <AlignLeft className="h-3.5 w-3.5" />,
    effects: <Sparkle className="h-3.5 w-3.5" />,
    animation: <Play className="h-3.5 w-3.5" />,
    layers: <Layers className="h-3.5 w-3.5" />,
    background: <ImageIcon className="h-3.5 w-3.5" />,
    logo: <LogoIcon className="h-3.5 w-3.5" />,
    "advanced-typography": <SlidersHorizontal className="h-3.5 w-3.5" />,
    "safe-area": <Shield className="h-3.5 w-3.5" />,
    "quick-presets": <LayoutDashboard className="h-3.5 w-3.5" />,
    history: <History className="h-3.5 w-3.5" />,
  };

  return (
    <div
      className={cn(
        "@container flex h-full min-h-0 flex-col bg-card",
        focus.isActive && "ring-1 ring-primary/40",
      )}
      onFocus={focus.onFocus}
      onMouseDown={focus.onFocus}
      tabIndex={focus.tabIndex}
    >
      {/* ── Header bar ── */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/30 px-3">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <div className="shrink-0 text-[11px] font-semibold uppercase tracking-wide">Text</div>
          {!collapsed && (
            <span className="hidden truncate text-[10px] text-muted-foreground/70 @sm:inline">
              {songsMode ? "Tamil + Background" : `${GROUP_LABELS[active]} · All groups`}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!collapsed && (
            <>
              <button
                onClick={reset}
                title="Reset all groups"
                className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden @sm:inline">Reset</span>
              </button>
            </>
          )}
          <button
            onClick={toggle}
            title={collapsed ? "Expand" : "Collapse"}
            className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <PanelRightClose className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* ── Group selector ── */}
          <div className="flex shrink-0 items-center gap-1 border-b border-border bg-muted/10 px-3 py-2">
            <div className="flex flex-1 flex-wrap items-center gap-1 rounded-md border border-border bg-background p-0.5">
              {visibleGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => setActive(g)}
                  disabled={songsMode}
                  className={cn(
                    "min-w-[60px] flex-1 cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition",
                    active === g
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {songsMode ? "Tamil Song" : GROUP_LABELS[g]}
                </button>
              ))}
              <button
                onClick={() => patchGroup(active, { visible: !style.visible })}
                title={style.visible ? "Hide section in projection" : "Show section in projection"}
                className={cn(
                  "ml-auto inline-flex h-6 w-7 shrink-0 cursor-pointer items-center justify-center rounded border text-[10px]",
                  style.visible ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground",
                )}
              >
                {style.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              <button
                onClick={() => resetGroup(active)}
                title={`Reset ${GROUP_LABELS[active]}`}
                className="inline-flex h-6 w-7 shrink-0 cursor-pointer items-center justify-center rounded border border-border bg-background text-[10px] text-muted-foreground hover:bg-accent"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* ── Scrollable accordion sections ── */}
          <div className="flex-1 space-y-1.5 overflow-y-auto p-2.5">
            <AccordionSection id="theme" title="Theme" icon={sectionIcons.theme}>
              <ThemeSection />
            </AccordionSection>

            <AccordionSection id="quick-text" title="Text" icon={sectionIcons["quick-text"]}>
              <QuickTextSection active={active} />
            </AccordionSection>

            <AccordionSection id="color" title="Color" icon={sectionIcons.color}>
              <ColorSection active={active} />
            </AccordionSection>

            <AccordionSection id="alignment" title="Alignment" icon={sectionIcons.alignment}>
              <AlignmentSection active={active} />
            </AccordionSection>

            <AccordionSection id="effects" title="Effects" icon={sectionIcons.effects}>
              <EffectsSection active={active} />
            </AccordionSection>

            <AccordionSection id="animation" title="Animation" icon={sectionIcons.animation}>
              <AnimationSection active={active} />
            </AccordionSection>

            <AccordionSection id="layers" title="Layers" icon={sectionIcons.layers}>
              <LayersSection />
            </AccordionSection>

            <AccordionSection id="background" title="Projection Background" icon={sectionIcons.background}>
              <BackgroundSection />
            </AccordionSection>

            <AccordionSection id="logo" title="Logo" icon={sectionIcons.logo}>
              <LogoSection />
            </AccordionSection>

            <AccordionSection id="advanced-typography" title="Advanced Typography" icon={sectionIcons["advanced-typography"]}>
              <AdvancedSection active={active} />
            </AccordionSection>

            <AccordionSection id="safe-area" title="Safe Area" icon={sectionIcons["safe-area"]}>
              <div className="rounded-md border border-dashed border-border bg-background/40 p-2.5 text-[10px] text-muted-foreground">
                Safe area guides ensure text stays within broadcast-safe zones. Adjust the margin in Alignment section.
              </div>
            </AccordionSection>

            <AccordionSection id="quick-presets" title="Quick Presets" icon={sectionIcons["quick-presets"]}>
              <QuickPresetsSection />
            </AccordionSection>

            <AccordionSection id="history" title="History" icon={sectionIcons.history}>
              <HistorySection />
            </AccordionSection>
          </div>
        </>
      )}
    </div>
  );
}

export type { TextStyle, SectionStyle };
