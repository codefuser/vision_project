/**
 * SessionSearchBar
 * Sticky search + filter bar for the session list.
 */
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
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "thisYear", label: "This Year" },
];

export function SessionSearchBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: Props) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 space-y-2">
      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
        <input
          id="session-search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search sessions, Bible, songs, themes…"
          className="h-9 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Date filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {DATE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
