import { Search, X } from "lucide-react";
import type { HistoryDateFilter } from "./session-history.store";
import { cn } from "@/lib/utils";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  filter: HistoryDateFilter;
  onFilterChange: (f: HistoryDateFilter) => void;
}

const DATE_FILTERS: { value: HistoryDateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "7 Days" },
  { value: "last30", label: "30 Days" },
  { value: "thisMonth", label: "Month" },
  { value: "thisYear", label: "Year" },
];

export function SessionSearchBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: Props) {
  return (
    <div className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-4 py-2.5 backdrop-blur-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        <input
          id="session-search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search sessions, Bible, songs, themes…"
          className="h-8 w-full rounded-lg border border-border/50 bg-muted/30 pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {DATE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-150 ease-out",
              filter === f.value
                ? "scale-105 bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/40 text-muted-foreground/70 hover:bg-muted/70 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
