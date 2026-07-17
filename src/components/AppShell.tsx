import { Link, useRouterState } from "@tanstack/react-router";
import {
  FolderTree,
  ListVideo,
  MonitorPlay,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  PanelLeftClose,
  Keyboard,
  Code2,
  Route,
  Mail,
  History,
} from "lucide-react";
import { memo, type ReactNode, useEffect } from "react";
import { useSettings } from "@/stores/settings.store";
import { useProjection } from "@/stores/projection.store";
import { projectionEngine } from "@/projection";
import { GlobalFavoritesDock } from "@/components/GlobalFavoritesDock";
import { AppStartupProvider } from "@/components/AppStartupProvider";
import { useShortcutTooltip } from "@/lib/shortcuts/use-shortcut-for";
import { useWorkspace } from "@/features/workspace/workspace.store";
import { cn } from "@/lib/utils";
import { StartupScreen } from "@/components/StartupScreen";
import { useSessionHistory } from "@/features/history/session-history.store";

const PRIMARY_NAV = [
  { to: "/library", label: "Library", icon: FolderTree, shortcutId: "nav.library" },
  { to: "/playlists", label: "Playlists", icon: ListVideo, shortcutId: "nav.playlists" },
  { to: "/history", label: "Service History", icon: History, shortcutId: "nav.history" },
  { to: "/project", label: "Project", icon: MonitorPlay, shortcutId: "nav.project" },
  { to: "/shortcuts", label: "Shortcuts", icon: Keyboard, shortcutId: "nav.shortcuts" },
] as const;

const DEVELOPER_NAV = [
  { to: "/developer-hub", label: "Developer", icon: Code2, shortcutId: "nav.developer-hub" },
  { to: "/roadmap", label: "Version History", icon: Route, shortcutId: "nav.roadmap" },
  { to: "/contact", label: "Contact", icon: Mail, shortcutId: "nav.contact" },
] as const;

const SETTINGS_NAV = {
  to: "/settings",
  label: "Settings",
  icon: SettingsIcon,
  shortcutId: "nav.settings",
} as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { settings, update } = useSettings();
  const { projectorOpen, openProjector, closeProjector, init } = useProjection();
  const collapsed = useWorkspace((s) => s.sidebarCollapsed);
  const setCollapsed = useWorkspace((s) => s.setSidebarCollapsed);
  const activeSessionId = useSessionHistory((s) => s.activeSessionId);
  useEffect(() => {
    init();
    projectionEngine.bootstrap();
  }, [init]);

  const cycleTheme = () => {
    const order: Array<typeof settings.theme> = ["light", "dark", "system"];
    const next = order[(order.indexOf(settings.theme) + 1) % order.length];
    void update({ theme: next });
  };

  const renderNavItem = (
    item: {
      to: string;
      label: string;
      icon: typeof FolderTree;
      shortcutId?: string;
    },
    badge?: React.ReactNode,
  ) => {
    const active = pathname === item.to || pathname.startsWith(item.to + "/");
    const Icon = item.icon;
    return (
      <NavItem
        key={item.to}
        item={item}
        active={active}
        icon={Icon}
        collapsed={collapsed}
        badge={badge}
      />
    );
  };

  return (
    <StartupScreen onReady={() => {}}>
    <div className="flex h-screen bg-background text-foreground">
      <aside
        style={{ width: collapsed ? 56 : 224, willChange: "width" }}
        className="flex shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar transition-[width] duration-200 ease-out"
      >
        {/* Brand / toggle header — stable layout regardless of collapsed state */}
        <div className="flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-sidebar-border px-2.5">
          <button
            type="button"
            onClick={collapsed ? () => setCollapsed(false) : undefined}
            aria-label={collapsed ? "Expand sidebar" : "Church Media"}
            title={collapsed ? "Expand sidebar" : "Church Media"}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform",
              collapsed ? "cursor-pointer hover:scale-105" : "cursor-default",
            )}
          >
            <MonitorPlay className="h-4 w-4" />
          </button>

          <div
            className={cn(
              "min-w-0 flex-1 truncate whitespace-nowrap text-sm font-semibold transition-opacity duration-200",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            Church Media
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className={cn(
              "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[opacity,colors] duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Primary nav — icons always visible; labels fade with the sidebar width */}
        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-2">
          {PRIMARY_NAV.map((item) => {
            // Attach a live recording dot to the History nav item
            const badge =
              item.to === "/history" && activeSessionId ? (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-red-500"
                  title="Recording"
                  aria-label="Session recording"
                />
              ) : undefined;
            return renderNavItem(item, badge);
          })}
        </nav>

        {/* Developer Hub section */}
        <div className="overflow-hidden border-t border-sidebar-border/50 px-2 pt-1 pb-0">
          <div
            className={cn(
              "mb-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 transition-opacity duration-200",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            Developer
          </div>
          {DEVELOPER_NAV.map(renderNavItem)}
        </div>

        {/* Pinned bottom: Settings */}
        <div className="overflow-hidden border-t border-sidebar-border/50 p-2">
          {renderNavItem(SETTINGS_NAV)}
          <div
            className={cn(
              "whitespace-nowrap px-2 pt-2 text-[10px] text-muted-foreground transition-opacity duration-200",
              collapsed ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            Offline-first · Local only
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppStartupProvider>
          {/* Integrated top bar — projector + theme controls. Compact, anchored, not floating. */}
          <header className="flex h-10 shrink-0 items-center justify-end gap-1 border-b border-border bg-background px-3">
            <ProjectorToggleButton
              projectorOpen={projectorOpen}
              onToggle={projectorOpen ? closeProjector : openProjector}
            />
            <button
              onClick={cycleTheme}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Toggle theme"
              title={`Theme: ${settings.theme}`}
            >
              {settings.theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : settings.theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </button>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </AppStartupProvider>
      </div>
      <GlobalFavoritesDock />
    </div></StartupScreen>
  );
}

const NavItem = memo(({
  item,
  active,
  icon: Icon,
  collapsed,
  badge,
}: {
  item: { to: string; label: string; shortcutId?: string };
  active: boolean;
  icon: typeof FolderTree;
  collapsed: boolean;
  badge?: React.ReactNode;
}) => {
  const tooltip = useShortcutTooltip(item.shortcutId ?? "", item.label);
  return (
    <Link
      to={item.to}
      title={tooltip}
      aria-label={tooltip}
      className={cn(
        "relative flex h-9 cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2.5 text-sm transition-colors duration-150",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      )}
    >
      {/* Icon — with an absolute badge dot when sidebar is collapsed */}
      <span className="relative shrink-0">
        <Icon className="h-4 w-4" />
        {badge && collapsed && (
          <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        )}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate whitespace-nowrap transition-[opacity,transform] duration-200 ease-out",
          collapsed ? "pointer-events-none -translate-x-1 opacity-0" : "translate-x-0 opacity-100",
        )}
      >
        {item.label}
      </span>
      {/* Badge shown inline when sidebar is expanded */}
      {badge && !collapsed && (
        <span className="ml-auto shrink-0">{badge}</span>
      )}
    </Link>
  );
});

function ProjectorToggleButton({
  projectorOpen,
  onToggle,
}: {
  projectorOpen: boolean;
  onToggle: () => void;
}) {
  const tooltip = useShortcutTooltip(
    "projector.toggle",
    projectorOpen ? "Close Projector" : "Open Projector",
  );
  return (
    <button
      onClick={onToggle}
      title={tooltip}
      aria-label={tooltip}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-medium transition",
        projectorOpen
          ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
          : "bg-primary text-primary-foreground hover:opacity-90",
      )}
    >
      <MonitorPlay className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">
        {projectorOpen ? "Close Projector" : "Open Projector"}
      </span>
    </button>
  );
}
