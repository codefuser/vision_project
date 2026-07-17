import { FolderPlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface FolderToolbarProps {
  onNewFolder: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed";

export function FolderToolbar({ onNewFolder, onToggleCollapse, collapsed }: FolderToolbarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onNewFolder} className={btnBase} aria-label="New folder" title="New folder">
        <FolderPlus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">New</span>
      </button>
      <button
        onClick={onToggleCollapse}
        className={btnBase}
        aria-label={collapsed ? "Expand folders" : "Collapse folders"}
        title={collapsed ? "Expand folders" : "Collapse folders"}
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
