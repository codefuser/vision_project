import { useState, useEffect, useRef, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  /** Which button has default focus. Defaults to "cancel" */
  defaultFocus?: "cancel" | "confirm";
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onCancel,
  onConfirm,
  defaultFocus = "cancel",
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setBusy(false);
      const timer = setTimeout(() => {
        if (defaultFocus === "confirm") {
          confirmBtnRef.current?.focus();
        } else {
          cancelBtnRef.current?.focus();
        }
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [open, defaultFocus]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !busy) {
        e.preventDefault();
        void handleConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, busy]);

  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !busy && onCancel()}>
      <DialogContent hideCloseButton className="max-w-md border border-[#2D3348] bg-[#111827]/98 p-6 shadow-2xl backdrop-blur-md rounded-xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
            {destructive && <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />}
            <span>{title}</span>
          </DialogTitle>
          {description && (
            <DialogDescription asChild className="text-sm leading-relaxed text-muted-foreground">
              <div>{description}</div>
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-3 sm:gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="cursor-pointer rounded-lg border border-[#2D3348] bg-[#1F2937] px-4 py-2 text-sm font-medium text-foreground hover:bg-[#374151] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className={
              "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 disabled:opacity-50 " +
              (destructive
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50")
            }
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

