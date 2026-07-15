import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "../workspace.store";

interface AccordionSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  badge?: string | number;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionSection({ id, title, icon, badge, children }: AccordionSectionProps) {
  const [mounted, setMounted] = useState(false);
  const isOpen = useWorkspace((s) => s.textFormatSections[id] ?? false);
  const setOpen = useWorkspace((s) => s.setTextFormatSectionOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpenActual = mounted ? isOpen : true;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-all",
        isOpenActual ? "border-border shadow-sm" : "border-border/60",
      )}
    >
      <button
        onClick={() => {
          setMounted(true);
          setOpen(id, !isOpen);
        }}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left transition-colors",
          "hover:bg-accent/30",
          isOpenActual && "border-b border-border/50",
        )}
      >
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
        <span className="flex-1 text-[11px] font-semibold uppercase tracking-wide">{title}</span>
        {badge != null && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpenActual && "rotate-180",
          )}
        />
      </button>
      <div
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpenActual ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-3 pt-2.5">{children}</div>
      </div>
    </div>
  );
}
