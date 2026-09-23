/**
 * High-performance lightweight skeletons for instantaneous UI transitions.
 * Rendered within 1 frame (< 16ms) while async route and tab chunks stream in the background.
 */

import React, { memo } from "react";
import { cn } from "@/lib/utils";

export const PlaylistsSkeleton = memo(function PlaylistsSkeleton() {
  return (
    <div className="h-full overflow-y-auto p-6 bg-background animate-pulse select-none">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-36 rounded-md bg-muted/60" />
            <div className="h-4 w-64 rounded-md bg-muted/40" />
          </div>
          <div className="h-9 w-32 rounded-md bg-muted/60" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/60 p-4 space-y-3 shadow-xs"
            >
              <div className="aspect-video w-full rounded-lg bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-4 w-3/4 rounded bg-muted/60" />
                <div className="h-3 w-1/2 rounded bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const LibrarySkeleton = memo(function LibrarySkeleton() {
  return (
    <div className="flex h-full w-full bg-background animate-pulse select-none overflow-hidden">
      {/* Sidebar Tree Skeleton */}
      <div className="w-56 shrink-0 border-r border-border/60 p-3 space-y-3 hidden sm:block">
        <div className="h-6 w-28 rounded bg-muted/60" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-full rounded bg-muted/40" />
          ))}
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 border-b border-border/60 px-4 flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-muted/50" />
          <div className="h-7 w-48 rounded bg-muted/40" />
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-lg bg-muted/40 border border-border/40" />
          ))}
        </div>
      </div>
    </div>
  );
});

export const WorkspaceSkeleton = memo(function WorkspaceSkeleton() {
  return (
    <div className="flex h-full w-full bg-background animate-pulse select-none overflow-hidden">
      {/* Left Preview Skeleton */}
      <div className="w-80 shrink-0 border-r border-border/60 p-3 flex flex-col space-y-3">
        <div className="h-5 w-24 rounded bg-muted/60" />
        <div className="aspect-video w-full rounded-lg bg-muted/50" />
        <div className="flex-1 rounded-lg bg-muted/30 border border-border/40" />
      </div>

      {/* Right Tabs Panel Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 border-b border-border/60 px-3 flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-20 rounded bg-muted/50" />
          ))}
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-8 w-full rounded-md bg-muted/40" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted/30 border border-border/30" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const SettingsSkeleton = memo(function SettingsSkeleton() {
  return (
    <div className="h-full overflow-y-auto p-6 bg-background animate-pulse select-none">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-md bg-muted/60" />
          <div className="h-4 w-56 rounded-md bg-muted/40" />
        </div>
        <div className="space-y-4 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/60 p-4 space-y-2"
            >
              <div className="h-5 w-48 rounded bg-muted/60" />
              <div className="h-4 w-72 rounded bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const TabPanelSkeleton = memo(function TabPanelSkeleton({
  type,
}: {
  type: "media" | "bible" | "songs" | "text";
}) {
  return (
    <div className="flex flex-col h-full w-full p-3 bg-card animate-pulse select-none space-y-3">
      {/* Search / Toolbar Strip */}
      <div className="flex items-center gap-2 pb-1 border-b border-border/50">
        <div className="h-7 w-48 rounded-md bg-muted/60" />
        <div className="h-7 w-24 rounded-md bg-muted/40" />
        <div className="h-7 w-24 rounded-md bg-muted/40 ml-auto" />
      </div>

      {/* Grid or List View based on Tab */}
      {type === "media" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-md bg-muted/40 border border-border/30" />
          ))}
        </div>
      ) : type === "songs" ? (
        <div className="space-y-2 pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-muted/30 border border-border/30 px-3 flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="h-4 w-44 rounded bg-muted/50" />
                <div className="h-2.5 w-28 rounded bg-muted/30" />
              </div>
              <div className="h-4 w-12 rounded bg-muted/40" />
            </div>
          ))}
        </div>
      ) : type === "bible" ? (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-muted/30 border border-border/30 p-2.5 space-y-2"
            >
              <div className="h-4 w-24 rounded bg-muted/50" />
              <div className="h-3 w-full rounded bg-muted/40" />
              <div className="h-3 w-4/5 rounded bg-muted/30" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          <div className="h-10 w-full rounded-md bg-muted/40" />
          <div className="h-40 w-full rounded-md bg-muted/30 border border-border/30" />
        </div>
      )}
    </div>
  );
});
