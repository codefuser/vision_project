import React, { useState, Suspense } from "react";
import {
  Image as ImageIcon,
  BookOpen,
  Music,
  Type,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useWorkspace, type WorkspaceTab } from "./workspace.store";
import { TabPanelSkeleton } from "@/components/skeletons/RouteSkeletons";
import { useFocusZone, type FocusZone } from "./focus-manager";
import { useShortcutScope } from "@/lib/shortcuts/use-shortcut";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Lazy load each internal tab module independently so opening /project
// does not evaluate or initialize all 4 heavy subsystems simultaneously.
const LibraryPage = React.lazy(() =>
  import("@/features/library/LibraryPage").then((m) => ({ default: m.LibraryPage })),
);
const BiblePanel = React.lazy(() =>
  import("@/features/bible/BiblePanel").then((m) => ({ default: m.BiblePanel })),
);
const SongsPanel = React.lazy(() =>
  import("@/features/songs/SongsPanel").then((m) => ({ default: m.SongsPanel })),
);
const TextPanel = React.lazy(() =>
  import("@/features/text/TextPanel").then((m) => ({ default: m.TextPanel })),
);

const TABS: {
  id: WorkspaceTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  focus: Exclude<FocusZone, null>;
  shortcutId: string;
}[] = [
  { id: "media", label: "File Manager", icon: ImageIcon, focus: "media", shortcutId: "tab.media" },
  { id: "bible", label: "Bible", icon: BookOpen, focus: "bible", shortcutId: "tab.bible" },
  { id: "songs", label: "Songs", icon: Music, focus: "songs", shortcutId: "tab.songs" },
  { id: "text", label: "Text", icon: Type, focus: "text", shortcutId: "tab.text" },
];

function LazyKeepAlive({
  active,
  fallback,
  children,
}: {
  active: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [hasRendered, setHasRendered] = useState(active);
  if (active && !hasRendered) setHasRendered(true);

  if (!hasRendered) return null;

  return (
    <div className={cn("h-full overflow-hidden", !active && "hidden")}>
      <Suspense fallback={fallback || <div className="h-full w-full bg-card animate-pulse" />}>
        {children}
      </Suspense>
    </div>
  );
}

export function WorkspaceTabsPanel() {
  const { activeTab, setActiveTab } = useWorkspace();
  const collapsed = useWorkspace((s) => s.tabsCollapsed);
  const toggleCollapsed = useWorkspace((s) => s.toggleTabsCollapsed);
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const focus = useFocusZone(active.focus);

  // Activate the shortcut scope only while that tab is showing
  useShortcutScope("bible", activeTab === "bible");
  useShortcutScope("songs", activeTab === "songs");
  useShortcutScope("text", activeTab === "text");
  useShortcutScope("media", activeTab === "media");

  // Collapsed icon-rail
  if (collapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center gap-1 border-l border-border bg-card py-2">
        <Tooltip content="Expand workspace" side="left">
          <button
            onClick={toggleCollapsed}
            aria-label="Expand workspace"
            className="mb-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <PanelRightOpen className="h-4 w-4" />
          </button>
        </Tooltip>
        {TABS.map((t) => (
          <TabRailButton
            key={t.id}
            tab={t}
            isActive={t.id === activeTab}
            onClick={() => {
              setActiveTab(t.id);
              toggleCollapsed();
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-card",
        focus.isActive && "ring-1 ring-primary/40",
      )}
      onFocus={focus.onFocus}
      onMouseDown={focus.onFocus}
      tabIndex={focus.tabIndex}
    >
      <div
        role="tablist"
        aria-label="Workspace tabs"
        className="flex h-9 shrink-0 items-center gap-0.5 border-b border-border bg-muted/30 px-1"
      >
        {TABS.map((t) => (
          <TabBarButton
            key={t.id}
            tab={t}
            isActive={t.id === activeTab}
            onClick={() => setActiveTab(t.id)}
          />
        ))}
        <Tooltip content="Collapse workspace" side="left">
          <button
            onClick={toggleCollapsed}
            aria-label="Collapse workspace"
            className="ml-auto inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>

      <div
        className="min-h-0 flex-1 overflow-hidden"
        role="tabpanel"
        aria-label={`${activeTab} panel`}
      >
        <LazyKeepAlive
          active={activeTab === "media"}
          fallback={<TabPanelSkeleton type="media" />}
        >
          <LibraryPage />
        </LazyKeepAlive>
        <LazyKeepAlive
          active={activeTab === "bible"}
          fallback={<TabPanelSkeleton type="bible" />}
        >
          <BiblePanel />
        </LazyKeepAlive>
        <LazyKeepAlive
          active={activeTab === "songs"}
          fallback={<TabPanelSkeleton type="songs" />}
        >
          <SongsPanel />
        </LazyKeepAlive>
        <LazyKeepAlive
          active={activeTab === "text"}
          fallback={<TabPanelSkeleton type="text" />}
        >
          <TextPanel />
        </LazyKeepAlive>
      </div>
    </div>
  );
}

type TabDef = (typeof TABS)[number];

function TabRailButton({
  tab,
  isActive,
  onClick,
}: {
  tab: TabDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <ShortcutTooltip id={tab.shortcutId} label={tab.label} side="left">
      <button
        onClick={onClick}
        role="tab"
        aria-selected={isActive}
        aria-label={tab.label}
        className={cn(
          "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </button>
    </ShortcutTooltip>
  );
}

function TabBarButton({
  tab,
  isActive,
  onClick,
}: {
  tab: TabDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;
  return (
    <ShortcutTooltip id={tab.shortcutId} label={tab.label} side="bottom">
      <button
        onClick={onClick}
        role="tab"
        aria-selected={isActive}
        aria-label={tab.label}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {tab.label}
      </button>
    </ShortcutTooltip>
  );
}
