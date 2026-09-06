import { History, X, Clock, Play } from "lucide-react";
import { useRemoteClient } from "../remote-client.store";
import type { RemoteRecentItem } from "../types";

export function MobileRecentSheet({ onClose }: { onClose: () => void }) {
  const { recentHistory, reprojectHistory, currentLive } = useRemoteClient();

  const handleReproject = (item: RemoteRecentItem) => {
    reprojectHistory(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end select-none">
      <div className="bg-card border-t border-border rounded-t-2xl max-h-[80vh] flex flex-col p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Recent Projections</span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-mono">
              {recentHistory.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1">
          {recentHistory.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs space-y-1">
              <Clock className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="font-medium text-foreground">No recent projections yet</p>
              <p>Projected verses, songs, media, and texts will appear here.</p>
            </div>
          ) : (
            recentHistory.map((item) => {
              const isLive = currentLive?.title === item.title;

              return (
                <div
                  key={item.id}
                  onClick={() => handleReproject(item)}
                  className="p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition cursor-pointer select-none flex items-center justify-between text-left active:scale-[0.98]"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-xs text-foreground truncate">
                        {item.title}
                      </span>
                      {isLive && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0">
                          LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      {item.type.replace("_", " ")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 shrink-0"
                    title="Project again"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
