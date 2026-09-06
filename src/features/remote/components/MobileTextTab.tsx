import { useState } from "react";
import { Send, Type, Search, Sparkles } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

export function MobileTextTab() {
  const { textList, sendCommand, currentLive, searchQuery, setSearchQuery } = useRemoteClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const search = searchQuery.text || "";

  const handleProjectCustom = () => {
    const textToProject = content.trim();
    if (!textToProject) return;

    sendCommand({
      action: "PROJECT_TEXT",
      input: {
        itemId: `live-${Date.now()}`,
        slideIndex: 0,
        totalSlides: 1,
        title: title.trim() || "Announcement",
        text: textToProject,
      },
    });
  };

  const handleProjectSaved = (item: { id: string; title: string; content: string }) => {
    sendCommand({
      action: "PROJECT_TEXT",
      input: {
        itemId: item.id,
        slideIndex: 0,
        totalSlides: 1,
        title: item.title,
        text: item.content,
      },
    });
  };

  const filteredSaved = textList.filter(
    (t) =>
      t.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      t.content.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-4 pb-24 bg-background">
      {/* Quick Live Text Authoring Card */}
      <div className="p-4 rounded-2xl border border-border bg-card/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Project Custom Live Text / Announcement</span>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. Welcome, Offerings, Prayer)"
          className="w-full h-9 px-3 text-xs rounded-lg border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type message text to show on projector..."
          className="w-full p-3 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
        />

        <button
          type="button"
          onClick={handleProjectCustom}
          disabled={!content.trim()}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-medium text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition cursor-pointer shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> Project Live Text
        </button>
      </div>

      {/* Saved Announcements Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-primary" /> Saved Church Announcements
          </span>
          <span className="text-[10px] text-muted-foreground">{textList.length} items</span>
        </div>

        {textList.length > 3 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchQuery("text", e.target.value)}
              placeholder="Search saved text items..."
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-input bg-background placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearchQuery("text", "")}
                className="absolute right-2 top-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        )}

        <div className="space-y-2">
          {filteredSaved.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-xs">
              No saved text items from the laptop library.
            </div>
          ) : (
            filteredSaved.map((item) => {
              const isLive =
                currentLive?.type === "live_text" &&
                (currentLive.metadata?.itemId === item.id ||
                  currentLive.title.includes(item.title));

              return (
                <div
                  key={item.id}
                  onClick={() => handleProjectSaved(item)}
                  className={cn(
                    "p-3 rounded-xl border transition cursor-pointer select-none active:scale-[0.98] text-left",
                    isLive
                      ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm"
                      : "bg-card border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-primary truncate block">
                      {item.title}
                    </span>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Tap to Project</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
