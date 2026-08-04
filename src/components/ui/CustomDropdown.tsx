import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShortcutTooltip } from "@/components/ShortcutTooltip";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  isSeparator?: boolean;
  isHeader?: boolean;
}

interface CustomDropdownProps<T extends string = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  className?: string;
  title?: string;
  align?: "left" | "right";
}

export function CustomDropdown<T extends string = string>({
  value,
  options,
  onChange,
  triggerLabel,
  triggerIcon,
  className,
  title,
  align = "left",
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({
    top: 0,
  });

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const top = rect.bottom + 4;

    if (align === "right") {
      const right = Math.max(8, window.innerWidth - rect.right);
      setCoords({ top, right });
    } else {
      const left = Math.max(8, Math.min(window.innerWidth - 230, rect.left));
      setCoords({ top, left });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOpt = options.find((o) => o.value === value);

  const menuContent = isOpen ? (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        ...(coords.right !== undefined ? { right: `${coords.right}px` } : {}),
        ...(coords.left !== undefined ? { left: `${coords.left}px` } : {}),
        zIndex: 99999,
      }}
      className="w-max min-w-[220px] max-w-[320px] max-h-[420px] overflow-y-auto rounded-xl border border-border bg-popover/98 p-1.5 shadow-2xl backdrop-blur-md select-none text-xs transition-opacity duration-75 opacity-100 custom-scrollbar text-popover-foreground"
    >
      {options.map((opt, idx) => {
        if (opt.isSeparator) {
          return <div key={`sep-${idx}`} className="my-1 border-t border-border/80" />;
        }
        if (opt.isHeader) {
          return (
            <span
              key={`hdr-${idx}`}
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 block"
            >
              {opt.label}
            </span>
          );
        }

        const isSelected = opt.value === value;

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
            className={cn(
              "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors duration-100",
              isSelected && "bg-primary/15 text-primary font-semibold border border-primary/30"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {opt.icon}
              <span className="truncate">{opt.label}</span>
            </div>
            {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />}
          </button>
        );
      })}
    </div>
  ) : null;

  const buttonEl = (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-7 px-2.5 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition shadow-xs select-none shrink-0",
        className
      )}
    >
      {triggerIcon || selectedOpt?.icon}
      <span>{triggerLabel || selectedOpt?.label || value}</span>
      <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
    </button>
  );

  return (
    <div className="inline-block text-left shrink-0">
      {title ? <ShortcutTooltip label={title}>{buttonEl}</ShortcutTooltip> : buttonEl}

      {typeof document !== "undefined" && menuContent && createPortal(menuContent, document.body)}
    </div>
  );
}
