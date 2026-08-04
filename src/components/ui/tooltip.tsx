"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { useShortcutFor } from "@/lib/shortcuts/use-shortcut-for";
import { formatCombo } from "@/lib/shortcuts/manager";

export interface TooltipProps {
  /** Text or element displayed in the tooltip */
  content?: React.ReactNode;
  /** Alias for `content` for convenience */
  label?: React.ReactNode;
  /** Optional shortcut registry ID, e.g. "projector.toggle" */
  id?: string;
  /** Optional extra description shown below the main content */
  description?: string;
  /** Placement side of the tooltip */
  side?: "top" | "right" | "bottom" | "left";
  /** Placement alignment of the tooltip */
  align?: "start" | "center" | "end";
  /** Distance from trigger element (px) */
  sideOffset?: number;
  /** Delay before tooltip appears (ms). Default 200. */
  delayDuration?: number;
  /** If true, tooltip is disabled and only renders children */
  disabled?: boolean;
  /** Additional CSS classes for tooltip content container */
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  label,
  id,
  description,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  delayDuration = 200,
  disabled = false,
  className,
  children,
}: TooltipProps) {
  const displayText = content ?? label;
  const def = useShortcutFor(id ?? "");

  // If no tooltip text or disabled, return children directly
  if (disabled || (!displayText && !def?.description)) {
    return <>{children}</>;
  }

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              "z-[99999] max-w-[340px] break-words rounded-lg border border-border/80 bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 select-none pointer-events-none",
              className,
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium leading-snug break-words">
                {displayText}
              </span>
              {def && def.keys.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  {def.keys.slice(0, 2).map((k) => (
                    <kbd
                      key={k}
                      className="inline-flex items-center rounded border border-border/50 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-muted-foreground shadow-xs"
                    >
                      {formatCombo(k)}
                    </kbd>
                  ))}
                </span>
              )}
            </div>
            {(description ?? def?.description) && (
              <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                {description ?? def?.description}
              </p>
            )}
            <TooltipPrimitive.Arrow className="fill-popover text-popover" width={8} height={4} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

// Low-level Radix primitive exports if needed
export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = TooltipPrimitive.Content;
export const TooltipArrow = TooltipPrimitive.Arrow;
