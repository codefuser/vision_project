import { memo } from "react";
import { useAuthStore } from "../auth.store";
import { Church, Sparkles, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChurchBadge = memo(function ChurchBadge() {
  const { profile, openAuthModal } = useAuthStore();

  if (profile && profile.church_name) {
    return (
      <button
        onClick={() => openAuthModal("profile")}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-medium transition",
          "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/25",
        )}
        title={`Registered Church: ${profile.church_name} (${profile.city}) — Click to view profile & usage`}
      >
        <Church className="h-3.5 w-3.5 text-blue-400" />
        <span className="font-semibold max-w-[130px] truncate sm:max-w-[160px]">
          {profile.church_name}
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 font-normal">
          • {profile.city}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => openAuthModal("register")}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 cursor-pointer rounded-md px-2.5 text-xs font-semibold transition",
        "bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-xs hover:from-blue-500 hover:to-indigo-500",
      )}
      title="Register your Church and Location to enable cloud backups and activity analytics"
    >
      <Church className="h-3.5 w-3.5 text-blue-100" />
      <span>Register Church</span>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
    </button>
  );
});
