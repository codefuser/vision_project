import type { MediaRecord, FolderRecord } from "@/db/schema";
import type { Song } from "@/lib/songs/loader";

export type LibraryItemType =
  | "image"
  | "video"
  | "song"
  | "bible"
  | "text"
  | "announcement"
  | "presentation"
  | "playlist"
  | "folder";

export type ViewMode =
  | "large-icons"
  | "medium-icons"
  | "small-icons"
  | "list"
  | "details"
  | "grid";

export type CategoryFilter =
  | "all"
  | "songs"
  | "bible"
  | "media"
  | "images"
  | "videos"
  | "announcements"
  | "presentations"
  | "playlists"
  | "favorites"
  | "recent"
  | "trash";

export type SortField = "name" | "type" | "createdAt" | "size" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface LibraryItem {
  id: string;
  name: string;
  type: LibraryItemType;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
  size?: number;
  mime?: string;
  durationMs?: number;
  width?: number;
  height?: number;
  blobId?: string;
  thumbBlobId?: string | null;
  // Payload objects
  songData?: Song;
  bibleData?: {
    book: number;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
  };
  textData?: {
    content: string;
    category?: string;
  };
  folderRecord?: FolderRecord;
  mediaRecord?: MediaRecord;
  isFavorite?: boolean;
}
