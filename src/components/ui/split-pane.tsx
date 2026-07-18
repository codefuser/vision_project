import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  storageKey?: string;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  className?: string;
}

export function SplitPane({
  left,
  right,
  storageKey = "vision-split-pane-width",
  defaultLeftWidth = 320,
  minLeftWidth = 260,
  maxLeftWidth = 600,
  className,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Initialize width from storage
  useEffect(() => {
    let initialWidth = defaultLeftWidth;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= minLeftWidth && val <= maxLeftWidth) {
          initialWidth = val;
        }
      }
    } catch (e) {
      // ignore
    }
    if (leftPaneRef.current) {
      leftPaneRef.current.style.width = `${initialWidth}px`;
    }
  }, [storageKey, defaultLeftWidth, minLeftWidth, maxLeftWidth]);

  const saveWidth = useCallback(
    (width: number) => {
      try {
        localStorage.setItem(storageKey, width.toString());
      } catch (e) {}
    },
    [storageKey]
  );

  const startDragging = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    if (handleRef.current) {
      handleRef.current.setAttribute("data-active", "true");
    }
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopDragging = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (handleRef.current) {
      handleRef.current.removeAttribute("data-active");
    }
    
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    if (leftPaneRef.current) {
      const currentWidth = parseInt(leftPaneRef.current.style.width || "0", 10);
      if (currentWidth > 0) saveWidth(currentWidth);
    }
  }, [saveWidth]);

  const onDrag = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current || !containerRef.current || !leftPaneRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;
      
      newWidth = Math.max(minLeftWidth, Math.min(newWidth, maxLeftWidth));
      // Direct DOM update avoids React re-renders for 60fps dragging
      leftPaneRef.current.style.width = `${newWidth}px`;
    },
    [minLeftWidth, maxLeftWidth]
  );

  useEffect(() => {
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", stopDragging);
    return () => {
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [onDrag, stopDragging]);

  const resetWidth = () => {
    if (leftPaneRef.current) {
      leftPaneRef.current.style.width = `${defaultLeftWidth}px`;
    }
    saveWidth(defaultLeftWidth);
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full min-h-0 w-full flex-row overflow-hidden", className)}
    >
      {/* Left Pane */}
      <div
        ref={leftPaneRef}
        className="flex min-h-0 flex-shrink-0 flex-col overflow-hidden"
        style={{ width: defaultLeftWidth }}
      >
        {left}
      </div>

      {/* Optimized Splitter Handle */}
      <div
        ref={handleRef}
        role="separator"
        aria-orientation="vertical"
        className={cn(
          "relative z-10 flex w-2 flex-shrink-0 cursor-col-resize flex-col items-center justify-center bg-transparent transition-colors",
          "hover:bg-primary/30",
          "data-[active=true]:bg-primary/50"
        )}
        onPointerDown={startDragging}
        onDoubleClick={resetWidth}
      >
        {/* Invisible wider grab area */}
        <div className="absolute inset-y-0 -left-1 w-4 cursor-col-resize" />
        {/* Visible dark thick solid handle */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-border data-[active=true]:bg-primary transition-colors group-hover:bg-primary/50" />
      </div>

      {/* Right Pane */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {right}
      </div>
    </div>
  );
}
