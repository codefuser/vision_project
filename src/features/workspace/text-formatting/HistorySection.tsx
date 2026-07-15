import { Undo2, Redo2, RotateCcw, History } from "lucide-react";
import { useWorkspace } from "../workspace.store";
import { useTextFormat } from "@/lib/text-format/store";
import { cn } from "@/lib/utils";

export function HistorySection() {
  const historyStack = useWorkspace((s) => s.historyStack);
  const historyIndex = useWorkspace((s) => s.historyIndex);
  const undoHistory = useWorkspace((s) => s.undoHistory);
  const redoHistory = useWorkspace((s) => s.redoHistory);
  const pushHistory = useWorkspace((s) => s.pushHistory);
  const groups = useTextFormat((s) => s.groups);
  const patchGroup = useTextFormat((s) => s.patchGroup);
  const setBackground = useTextFormat((s) => s.setBackground);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < historyStack.length - 1;

  const handleUndo = () => {
    const snapshot = undoHistory();
    if (!snapshot) return;
    // Push current state to redo stack
    pushHistory({
      reference: { ...groups.reference },
      tamil: { ...groups.tamil },
      english: { ...groups.english },
      background: { ...groups.background },
    });
    // Apply snapshot
    if (snapshot.reference) patchGroup("reference", { ...snapshot.reference });
    if (snapshot.tamil) patchGroup("tamil", { ...snapshot.tamil });
    if (snapshot.english) patchGroup("english", { ...snapshot.english });
    if (snapshot.background) setBackground(snapshot.background as never);
  };

  const handleRedo = () => {
    const snapshot = redoHistory();
    if (!snapshot) return;
    if (snapshot.reference) patchGroup("reference", { ...snapshot.reference });
    if (snapshot.tamil) patchGroup("tamil", { ...snapshot.tamil });
    if (snapshot.english) patchGroup("english", { ...snapshot.english });
    if (snapshot.background) setBackground(snapshot.background as never);
  };

  const handleSnapshot = () => {
    pushHistory({
      reference: { ...groups.reference },
      tamil: { ...groups.tamil },
      english: { ...groups.english },
      background: { ...groups.background },
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={cn(
            "inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border text-[11px] font-medium transition",
            canUndo
              ? "border-border bg-background text-foreground hover:bg-accent"
              : "border-border/40 bg-background/40 text-muted-foreground/40 cursor-not-allowed",
          )}
        >
          <Undo2 className="h-3.5 w-3.5" /> Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={cn(
            "inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border text-[11px] font-medium transition",
            canRedo
              ? "border-border bg-background text-foreground hover:bg-accent"
              : "border-border/40 bg-background/40 text-muted-foreground/40 cursor-not-allowed",
          )}
        >
          <Redo2 className="h-3.5 w-3.5" /> Redo
        </button>
        <button
          onClick={handleSnapshot}
          className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 text-[11px] font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          title="Save snapshot"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {historyStack.length === 0 && (
        <div className="rounded-md border border-dashed border-border bg-background/40 p-2 text-center text-[10px] text-muted-foreground">
          <History className="mx-auto mb-1 h-3.5 w-3.5 opacity-50" />
          No history yet. Changes are auto-saved.
        </div>
      )}
    </div>
  );
}
