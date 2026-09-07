import { Link, useRouterState } from "@tanstack/react-router";
import { VersoLynLogo } from "@/components/ui/VersoLynLogo";
import {
  FolderTree,
  ListVideo,
  MonitorPlay,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Keyboard,
  Code2,
  Route,
  Mail,
  History,
  Smartphone,
  Radio,
} from "lucide-react";
import { memo, type ReactNode, useEffect, useRef, useState } from "react";
import { useSettings } from "@/stores/settings.store";
import { useProjection } from "@/stores/projection.store";
import { projectionEngine } from "@/projection";
import { GlobalFavoritesPopover } from "@/components/GlobalFavoritesPopover";
import { AppStartupProvider } from "@/components/AppStartupProvider";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";
import { useWorkspace } from "@/features/workspace/workspace.store";
import { cn } from "@/lib/utils";
import { StartupScreen } from "@/components/StartupScreen";
import { useSessionHistory } from "@/features/history/session-history.store";
import { initBackupScheduler } from "@/lib/backup-scheduler";
import { useHostRemote } from "@/features/remote/remote-host.store";
import { RemoteControlDialog } from "@/features/remote/RemoteControlDialog";
import { useHostLiveQr } from "@/features/live-qr/live-qr-host.store";
import { LiveQrDialog } from "@/features/live-qr/components/LiveQrDialog";

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
  const errorPageMode = useWorkspace((s) => s.errorPageMode);
  const activeSessionId = useSessionHistory((s) => s.activeSessionId);
  const { session, setDialogOpen } = useHostRemote();
  const {
    session: liveQrSession,
    isExpired: isLiveQrExpired,
    remainingTime: liveQrRemainingTime,
    setDialogOpen: setLiveQrDialogOpen,
  } = useHostLiveQr();
  const isLiveQrActive = Boolean(liveQrSession && !isLiveQrExpired);
  useEffect(() => {
    init();
    projectionEngine.bootstrap();
    initBackupScheduler();
  }, [init]);

  const [isHovered, setIsHovered] = useState(false);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
        hoverLeaveTimerRef.current = null;
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
    }
    hoverLeaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (hoverLeaveTimerRef.current) {
        clearTimeout(hoverLeaveTimerRef.current);
      }
    };
  }, []);

  const isEffectiveCollapsed = collapsed && !isHovered;

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
        collapsed={isEffectiveCollapsed}
        badge={badge}
      />
    );
  };

  return (
    <StartupScreen onReady={() => {}}>
    <div className="flex h-screen bg-background text-foreground">
      {!errorPageMode && (
        <div
          className="relative shrink-0 select-none z-30"
          style={{ width: collapsed ? 56 : 224 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <aside
            style={{ width: !collapsed || isHovered ? 224 : 56, willChange: "width" }}
            className={cn(
              "flex flex-col h-full overflow-hidden border-r border-border bg-sidebar transition-[width,box-shadow] duration-200 ease-out",
              collapsed && isHovered && "absolute top-0 bottom-0 left-0 z-40 shadow-2xl shadow-black/40 border-r border-border/80"
            )}
          >
            {/* Brand / toggle header — stable layout regardless of collapsed state */}
            <div className="flex h-14 shrink-0 items-center gap-2.5 overflow-hidden border-b border-sidebar-border px-2">
              <button
                type="button"
                onClick={collapsed ? () => setCollapsed(false) : undefined}
                aria-label={collapsed ? "Expand sidebar (keep open)" : "VersoLyn"}
                title={collapsed ? "Expand sidebar (keep open)" : "VersoLyn"}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full p-0 bg-transparent transition-transform overflow-hidden",
                  collapsed ? "cursor-pointer hover:scale-105" : "cursor-default",
                )}
              >
                <VersoLynLogo className="h-full w-full rounded-full" />
              </button>

              <div
                className={cn(
                  "min-w-0 flex-1 truncate whitespace-nowrap text-sm font-semibold tracking-tight text-sidebar-foreground transition-opacity duration-200",
                  isEffectiveCollapsed ? "pointer-events-none opacity-0" : "opacity-100",
                )}
              >
                VersoLyn
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? "Keep sidebar open (Pin)" : "Collapse sidebar"}
                aria-label={collapsed ? "Keep sidebar open (Pin)" : "Collapse sidebar"}
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[opacity,colors] duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  isEffectiveCollapsed ? "pointer-events-none opacity-0" : "opacity-100",
                )}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            {/* Primary nav — icons always visible; labels fade with the effective state */}
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
                  isEffectiveCollapsed ? "pointer-events-none opacity-0" : "opacity-100",
                )}
              >
                Developer
              </div>
              {DEVELOPER_NAV.map((item) => renderNavItem(item))}
            </div>

            {/* Pinned bottom: Settings */}
            <div className="overflow-hidden border-t border-sidebar-border/50 p-2">
              {renderNavItem(SETTINGS_NAV)}
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppStartupProvider>
          {/* Integrated top bar — projector + favorites + theme controls. Compact, anchored, not floating. */}
          <header className="flex h-10 shrink-0 items-center justify-end gap-2 border-b border-border bg-background px-3 select-none">
            <button
              onClick={() => setDialogOpen(true)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-medium transition",
                session?.connectedDevices.length
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                  : session
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              title={
                session?.connectedDevices.length
                  ? `${session.connectedDevices.length} phone(s) connected`
                  : session
                    ? "Remote session active - waiting for device"
                    : "Remote Control via Mobile"
              }
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {session?.connectedDevices.length ? "Remote Connected" : "Remote Control"}
              </span>
              {session?.connectedDevices.length ? (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ) : null}
            </button>
            <RemoteControlDialog />

            {/* Live Projection QR button (View-Only livestream) */}
            <button
              onClick={() => setLiveQrDialogOpen(true)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-medium transition",
                isLiveQrActive
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30 hover:bg-sky-500/25"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              title={
                isLiveQrActive
                  ? `Live QR active (${liveQrRemainingTime} remaining) - Click to view/share`
                  : "Live Projection QR (View-Only)"
              }
            >
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isLiveQrActive ? "Live QR Active" : "Live QR"}
              </span>
              {isLiveQrActive ? (
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              ) : null}
            </button>
            <LiveQrDialog />

            <ProjectorToggleButton
              projectorOpen={projectorOpen}
              onToggle={projectorOpen ? closeProjector : openProjector}
            />
            <GlobalFavoritesPopover />
            <button
              onClick={cycleTheme}
              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition"
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
  return (
    <ShortcutTooltip id={item.shortcutId ?? ""} label={item.label} side="right" disabled={!item.shortcutId}>
      <Link
        to={item.to}
        aria-label={item.label}
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
    </ShortcutTooltip>
  );
});

function ProjectorToggleButton({
  projectorOpen,
  onToggle,
}: {
  projectorOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <ShortcutTooltip id="projector.toggle" label={projectorOpen ? "Close Projector" : "Open Projector"}>
      <button
        onClick={onToggle}
        aria-label={projectorOpen ? "Close Projector" : "Open Projector"}
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
    </ShortcutTooltip>
  );
}
