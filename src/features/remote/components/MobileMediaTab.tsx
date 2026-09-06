import { useState, useMemo } from "react";
import { Search, Image as ImageIcon, Video, Film, Check } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileMediaTab() {
  const { mediaList, sendCommand, currentLive } = useRemoteClient();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");

  const filtered = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesType = filterType === "all" || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [mediaList, query, filterType]);

  const handleProject = (mediaId: string) => {
    sendCommand({
      action: "PROJECT_MEDIA",
      mediaId,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-border bg-card/60 backdrop-blur shrink-0 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media files..."
            className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2.5 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={cn(
              "px-3 py-1 rounded-lg font-medium transition cursor-pointer",
              filterType === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            All Media ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("image")}
            className={cn(
              "px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1",
              filterType === "image"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <ImageIcon className="w-3 h-3" /> Images
          </button>
          <button
            type="button"
            onClick={() => setFilterType("video")}
            className={cn(
              "px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1",
              filterType === "video"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <Video className="w-3 h-3" /> Videos
          </button>
        </div>
      </div>

      {/* Media Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 pb-24 content-start">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground text-xs space-y-1">
            <Film className="w-8 h-8 mx-auto opacity-30 mb-2" />
            <p className="font-medium text-foreground">No media found</p>
            <p>
              {mediaList.length === 0
                ? "The church media library on the laptop is empty or loading."
                : "Try a different search term or filter."}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isLive =
              (currentLive?.type === "image" || currentLive?.type === "video") &&
              currentLive.title === item.name;

            return (
              <div
                key={item.id}
                onClick={() => handleProject(item.id)}
                className={cn(
                  "p-3 rounded-xl border flex flex-col justify-between transition cursor-pointer select-none active:scale-[0.98] text-left min-h-[110px]",
                  isLive
                    ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm"
                    : "bg-card border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-muted flex items-center justify-center text-primary">
                    {item.type === "video" ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </div>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      {item.type}
                    </span>
                  )}
                </div>

                <div>
                  <span className="font-semibold text-xs text-foreground line-clamp-2 leading-tight block mb-0.5">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 block">
                    Tap to Project
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
