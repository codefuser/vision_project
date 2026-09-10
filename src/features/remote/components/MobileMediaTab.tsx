import { useState, useMemo, useEffect } from "react";
import { Search, Image as ImageIcon, Video, Film, AlertCircle } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileMediaTab() {
  const {
    mediaList,
    mediaThumbnails,
    sendCommand,
    currentLive,
    searchQuery,
    setSearchQuery,
    requestMediaThumbnails,
  } = useRemoteClient();

  const query = searchQuery.media || "";
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    requestMediaThumbnails();
  }, [requestMediaThumbnails]);

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

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
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
            onChange={(e) => setSearchQuery("media", e.target.value)}
            placeholder="Search media files..."
            className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setSearchQuery("media", "")}
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
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3 pb-24 content-start">
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
              (currentLive.title === item.name ||
                currentLive.id === `media:${item.id}` ||
                currentLive.metadata?.mediaId === item.id);

            const thumbSrc = mediaThumbnails[item.id] || item.thumbnailUrl;
            const hasPreview = Boolean(thumbSrc) && !imageErrors[item.id];

            return (
              <div
                key={item.id}
                onClick={() => handleProject(item.id)}
                className={cn(
                  "rounded-xl border overflow-hidden flex flex-col transition cursor-pointer select-none active:scale-[0.98] text-left relative bg-card shadow-sm",
                  isLive
                    ? "border-primary ring-2 ring-primary/60 shadow-md"
                    : "border-border hover:border-primary/40",
                )}
              >
                {/* Image Preview Container (16:9 aspect ratio) */}
                <div
                  className="relative w-full bg-slate-950/90 flex items-center justify-center overflow-hidden min-h-[90px]"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  {hasPreview ? (
                    <img
                      src={thumbSrc}
                      alt={item.name}
                      onError={() => handleImageError(item.id)}
                      className="w-full h-full object-contain transition duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/70 gap-1.5 p-2 animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-background/60 flex items-center justify-center">
                        {item.type === "video" ? (
                          <Video className="w-4 h-4 text-primary" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-wider opacity-60">
                        {item.type}
                      </span>
                    </div>
                  )}

                  {/* Type Badge on Top-Right */}
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[9px] font-mono text-white/90 uppercase tracking-wider">
                    {item.type}
                  </div>

                  {/* LIVE Badge on Media Preview */}
                  {isLive && (
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                      LIVE
                    </div>
                  )}
                </div>

                {/* Card Info Footer */}
                <div className="p-2.5 space-y-1 bg-card">
                  <span className="font-semibold text-xs text-foreground line-clamp-1 leading-tight block">
                    {item.name}
                  </span>

                  <div className="flex items-center justify-between">
                    {isLive ? (
                      <span className="text-[10px] font-bold text-emerald-400">
                        Projecting Now
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/70">
                        Tap to Project
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
