import React, { useState, useRef, useEffect } from "react";
import {
  Star,
  BookOpen,
  Music,
  Image as ImageIcon,
  X,
  Play,
  Trash2,
} from "lucide-react";
import { useBibleStore } from "@/lib/bible/store";
import { useSongsStore } from "@/lib/songs/store";
import { useMediaFavorites } from "@/stores/media-favorites.store";
import { getMedia } from "@/db/repo";
import type { MediaRecord } from "@/db/schema";
import { Thumb } from "@/components/Thumb";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  activateBibleFavorite,
  activateMediaFavorite,
  activateSongFavorite,
} from "@/lib/favorites/dispatch";
import { useNavigate } from "@tanstack/react-router";

type FavCategory = "all" | "bible" | "songs" | "media";

export function GlobalFavoritesPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FavCategory>("all");
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const bibleFavorites = useBibleStore((s) => s.favorites);
  const removeBibleFav = useBibleStore((s) => s.removeFavorite);
  const songFavorites = useSongsStore((s) => s.favorites);
  const removeSongFav = useSongsStore((s) => s.removeFavorite);
  const mediaFavIds = useMediaFavorites((s) => s.ids);
  const removeMediaFav = useMediaFavorites((s) => s.remove);

  const [mediaItems, setMediaItems] = useState<MediaRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const items = (await Promise.all(mediaFavIds.map((id) => getMedia(id)))).filter(
        (m): m is MediaRecord => !!m,
      );
      if (!cancelled) setMediaItems(items);
    })();
    return () => {
      cancelled = true;
    };
  }, [mediaFavIds]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCount = bibleFavorites.length + songFavorites.length + mediaItems.length;

  return (
    <div ref={popoverRef} className="relative inline-block text-left select-none">
      {/* Header Trigger Button */}
      <Tooltip content="Starred Favorites (Bible, Songs, Media)">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition shadow-md cursor-pointer",
            isOpen
              ? "border-amber-400/60 bg-amber-500/20 text-amber-400"
              : "border-[#2D3348] bg-[#111827] text-amber-400 hover:bg-[#1F2937] hover:border-amber-400/40"
          )}
        >
          <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
          <span>Favorites</span>
          {totalCount > 0 && (
            <span className="ml-0.5 rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[10px] font-mono font-bold text-amber-300">
              {totalCount}
            </span>
          )}
        </button>
      </Tooltip>

      {/* Floating 380px Popover Box */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-[380px] rounded-xl border border-[#2D3348] bg-[#111827]/95 p-3 shadow-2xl backdrop-blur-md text-xs animate-in fade-in slide-in-from-top-1 duration-150 flex flex-col max-h-[460px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2D3348] pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current text-amber-400" />
              <span className="font-bold text-foreground text-xs">Starred Favorites</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 border-b border-[#2D3348] pb-2 mb-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-semibold transition shrink-0",
                activeCategory === "all" ? "bg-amber-500/20 text-amber-300" : "text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
              )}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setActiveCategory("bible")}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-semibold transition shrink-0 flex items-center gap-1",
                activeCategory === "bible" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
              )}
            >
              <BookOpen className="h-3 w-3 text-blue-400" />
              <span>Bible ({bibleFavorites.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory("songs")}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-semibold transition shrink-0 flex items-center gap-1",
                activeCategory === "songs" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
              )}
            >
              <Music className="h-3 w-3 text-purple-400" />
              <span>Songs ({songFavorites.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory("media")}
              className={cn(
                "px-2 py-1 rounded-md text-[11px] font-semibold transition shrink-0 flex items-center gap-1",
                activeCategory === "media" ? "bg-green-500/20 text-green-400" : "text-muted-foreground hover:bg-[#1F2937] hover:text-foreground"
              )}
            >
              <ImageIcon className="h-3 w-3 text-green-400" />
              <span>Media ({mediaItems.length})</span>
            </button>
          </div>

          {/* Favorites Content List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {totalCount === 0 ? (
              <div className="py-8 text-center text-muted-foreground opacity-70">
                <Star className="mx-auto h-8 w-8 mb-2 opacity-30 text-amber-400" />
                <p className="font-semibold text-xs">No Favorites Saved</p>
                <p className="text-[10px] mt-0.5">Click ★ star icon on Bible, Songs or Media to pin items here.</p>
              </div>
            ) : (
              <>
                {/* Bible Favorites */}
                {(activeCategory === "all" || activeCategory === "bible") &&
                  bibleFavorites.map((fav) => (
                    <div
                      key={`bible-${fav.id}`}
                      onClick={() => {
                        void activateBibleFavorite(navigate, fav.book, fav.chapter, fav.verse, fav.displayMode);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between rounded-lg border border-[#2D3348]/60 bg-[#111827] p-2 hover:border-blue-500/50 hover:bg-[#1F2937] cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BookOpen className="h-4 w-4 shrink-0 text-blue-400" />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground text-xs">{fav.ref}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{fav.text}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Tooltip content="Project Live">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void activateBibleFavorite(navigate, fav.book, fav.chapter, fav.verse, fav.displayMode);
                              setIsOpen(false);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <Play className="h-3 w-3 fill-current" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Remove Favorite">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBibleFav(fav.id);
                              toast.success(`Removed ${fav.ref}`);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}

                {/* Song Favorites */}
                {(activeCategory === "all" || activeCategory === "songs") &&
                  songFavorites.map((fav) => (
                    <div
                      key={`song-${fav.id}`}
                      onClick={() => {
                        void activateSongFavorite(fav.id, 0);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between rounded-lg border border-[#2D3348]/60 bg-[#111827] p-2 hover:border-purple-500/50 hover:bg-[#1F2937] cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Music className="h-4 w-4 shrink-0 text-purple-400" />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground text-xs">{fav.title}</p>
                          <p className="truncate text-[10px] text-muted-foreground">Song Slide</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Tooltip content="Project Live">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void activateSongFavorite(fav.id, 0);
                              setIsOpen(false);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <Play className="h-3 w-3 fill-current" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Remove Favorite">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSongFav(fav.id);
                              toast.success(`Removed ${fav.title}`);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}

                {/* Media Favorites */}
                {(activeCategory === "all" || activeCategory === "media") &&
                  mediaItems.map((media) => (
                    <div
                      key={`media-${media.id}`}
                      onClick={() => {
                        void activateMediaFavorite(media.id);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between rounded-lg border border-[#2D3348]/60 bg-[#111827] p-2 hover:border-green-500/50 hover:bg-[#1F2937] cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-7 w-7 rounded overflow-hidden bg-black/60 shrink-0 flex items-center justify-center">
                          <Thumb media={media} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground text-xs">{media.name}</p>
                          <p className="truncate text-[10px] text-muted-foreground uppercase">{media.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Tooltip content="Project Live">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              void activateMediaFavorite(media.id);
                              setIsOpen(false);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <Play className="h-3 w-3 fill-current" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Remove Favorite">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMediaFav(media.id);
                              toast.success(`Removed ${media.name}`);
                            }}
                            className="h-6 w-6 rounded flex items-center justify-center text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
