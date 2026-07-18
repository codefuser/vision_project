/**
 * ShortcutTooltip — premium Radix-based tooltip that shows the shortcut badge
 * alongside the action label. Drop-in wrapper around any button/icon.
 *
 * Usage:
 *   <ShortcutTooltip id="projector.toggle" label="Toggle Projector">
 *     <button>...</button>
 *   </ShortcutTooltip>
 *
 *   <ShortcutTooltip id="nav.library" label="Library" side="right">
 *     <SidebarItem />
 *   </ShortcutTooltip>
 */
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { useShortcutFor } from "@/lib/shortcuts/use-shortcut-for";
import { formatCombo } from "@/lib/shortcuts/manager";

interface ShortcutTooltipProps {
  /** Shortcut registry ID, e.g. "projector.toggle" */
  id: string;
  /** Human label shown as the main tooltip text */
  label: string;
  /** Optional extra description shown below the label */
  description?: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Delay before tooltip appears (ms). Default 600. */
  delayDuration?: number;
  /** If true, tooltip is not rendered (for programmatic disable). */
  disabled?: boolean;
}

export function ShortcutTooltip({
  id,
  label,
  description,
  children,
  side = "bottom",
  align = "center",
  delayDuration = 600,
  disabled = false,
}: ShortcutTooltipProps) {
  const def = useShortcutFor(id);

  if (disabled) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className="z-[9999] max-w-[240px] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            style={{
              background: "rgba(12,12,18,0.97)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
              padding: "8px 11px",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{label}</span>
              {def && def.keys.length > 0 && (
                <span className="flex items-center gap-1">
                  {def.keys.slice(0, 2).map((k) => (
                    <kbd
                      key={k}
                      className="inline-flex items-center rounded border border-border/50 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-muted-foreground"
                      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }}
                    >
                      {formatCombo(k)}
                    </kbd>
                  ))}
                </span>
              )}
            </div>
            {(description ?? def?.description) && (
              <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground/70">
                {description ?? def?.description}
              </p>
            )}
            <TooltipPrimitive.Arrow
              className="fill-current text-border/40"
              style={{ fill: "rgba(255,255,255,0.07)" }}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/**
 * Convenience hook to get a simple tooltip string "Label · Ctrl+K"
 * for use in plain `title={}` attributes.
 */
export { useShortcutTooltip } from "@/lib/shortcuts/use-shortcut-for";
