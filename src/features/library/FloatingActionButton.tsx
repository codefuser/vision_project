import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  FolderPlus,
  Music,
  BookOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Presentation,
  ListMusic,
} from "lucide-react";

interface FloatingActionButtonProps {
  onNewFolder: () => void;
  onImportSong: () => void;
  onImportBible: () => void;
  onImportMedia: () => void;
  onCreateText: () => void;
}

export function FloatingActionButton({
  onNewFolder,
  onImportSong,
  onImportBible,
  onImportMedia,
  onCreateText,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Actions Dropup Menu */}
      {isOpen && (
        <div className="mb-2 flex flex-col gap-1 rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur select-none animate-in fade-in slide-in-from-bottom-2 duration-150 text-xs">
          <button
            onClick={() => {
              onNewFolder();
              setIsOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-accent"
          >
            <FolderPlus className="h-4 w-4 text-amber-400" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => {
              onImportSong();
              setIsOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-accent"
          >
            <Music className="h-4 w-4 text-purple-400" />
            <span>Import Song</span>
          </button>

          <button
            onClick={() => {
              onImportBible();
              setIsOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-accent"
          >
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span>Import Bible Verse</span>
          </button>

          <button
            onClick={() => {
              onImportMedia();
              setIsOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-accent"
          >
            <ImageIcon className="h-4 w-4 text-green-400" />
            <span>Import Media (Images / Videos)</span>
          </button>

          <button
            onClick={() => {
              onCreateText();
              setIsOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-foreground hover:bg-accent"
          >
            <FileText className="h-4 w-4 text-amber-400" />
            <span>Create Announcement / Text</span>
          </button>
        </div>
      )}

      {/* Floating Action Button (+ Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
        title="Add to Church Content Library"
      >
        <Plus className={`h-6 w-6 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} />
      </button>
    </div>
  );
}
