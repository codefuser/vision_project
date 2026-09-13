import { useState } from "react";
import { Send, Type, Search, Sparkles, Plus, Check } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import { cn } from "@/lib/utils";

const QUICK_PRESETS = [
  { title: "Welcome", content: "Welcome to our worship service!\nGod bless you abundantly." },
  { title: "Opening Prayer", content: "Let us look to the Lord in prayer." },
  { title: "Offering & Tithes", content: "Honor the Lord with your wealth\nProverbs 3:9" },
  { title: "Announcements", content: "Special service this Friday at 7:00 PM." },
  { title: "Closing Benediction", content: "The grace of our Lord Jesus Christ be with you all. Amen." },
];

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
    <div className="flex flex-col h-full overflow-y-auto p-3 space-y-4 pb-32 bg-background">
      {/* Quick Live Text Authoring Card */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Custom Announcement / Live Text</span>
          </div>
          {content && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {content.length} chars
            </span>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {QUICK_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => {
                setTitle(preset.title);
                setContent(preset.content);
              }}
              className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-[11px] font-semibold text-muted-foreground hover:text-foreground shrink-0 transition active:scale-95 cursor-pointer"
            >
              + {preset.title}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Slide Heading (e.g. Welcome, Offering, Notice)"
          className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
        />

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type message or announcement to project live on screen..."
          className="w-full p-3 text-sm rounded-xl border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed font-medium"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleProjectCustom}
            disabled={!content.trim()}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition cursor-pointer shadow-md shadow-primary/20 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" /> Project Message Live
          </button>
          {(title || content) && (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="h-11 px-3 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Saved Announcements Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-primary" /> Saved Church Announcements
          </span>
          <span className="text-[10px] text-muted-foreground font-mono font-medium">
            {textList.length} items
          </span>
        </div>

        {textList.length > 3 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearchQuery("text", e.target.value)}
              placeholder="Search saved text items..."
              className="w-full h-8.5 pl-8 pr-3 text-xs rounded-xl border border-input bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        <div className="space-y-2">
          {filteredSaved.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground rounded-2xl border border-dashed border-border bg-card/40">
              No saved announcements yet. Compose one above to project immediately.
            </div>
          ) : (
            filteredSaved.map((item) => {
              const isLive =
                currentLive?.type === "text" &&
                (currentLive.title === item.title || currentLive.details === item.content);

              return (
                <div
                  key={item.id}
                  onClick={() => handleProjectSaved(item)}
                  className={cn(
                    "p-3.5 rounded-2xl border transition cursor-pointer active:scale-[0.98] select-none text-left relative",
                    isLive
                      ? "bg-primary/10 border-primary ring-2 ring-primary/40 shadow-xs"
                      : "bg-card border-border/80 hover:border-primary/40 hover:bg-card/90",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-foreground">{item.title}</span>
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Tap to Project</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/90 whitespace-pre-line line-clamp-2 leading-relaxed">
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
