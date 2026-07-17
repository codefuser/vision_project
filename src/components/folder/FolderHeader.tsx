import { FolderToolbar } from "./FolderToolbar";

interface FolderHeaderProps {
  onNewFolder: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

export function FolderHeader({ onNewFolder, onToggleCollapse, collapsed }: FolderHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Folders
      </div>
      <FolderToolbar
        onNewFolder={onNewFolder}
        onToggleCollapse={onToggleCollapse}
        collapsed={collapsed}
      />
    </div>
  );
}
