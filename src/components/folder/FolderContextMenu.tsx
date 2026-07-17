import type { FolderRecord } from "@/db/schema";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface FolderContextMenuProps {
  folder: FolderRecord;
  onRename: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export function FolderContextMenu({
  onRename,
  onDelete,
  children,
}: FolderContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-44">
        <ContextMenuItem onSelect={onRename} className="cursor-pointer">
          Rename
        </ContextMenuItem>
        <ContextMenuItem onSelect={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
          Delete
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled className="cursor-default text-muted-foreground">
          Duplicate — coming soon
        </ContextMenuItem>
        <ContextMenuItem disabled className="cursor-default text-muted-foreground">
          Properties — coming soon
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
