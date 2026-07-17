import type { FolderRecord, MediaRecord, PlaylistRecord } from "./schema";

type CacheEntry<T> = { data: T; loaded: boolean };

const folderCache: CacheEntry<FolderRecord[]> = { data: [], loaded: false };
const mediaCache: CacheEntry<MediaRecord[]> = { data: [], loaded: false };
const playlistCache: CacheEntry<PlaylistRecord[]> = { data: [], loaded: false };

export function getCachedFolders() {
  return folderCache;
}

export function setCachedFolders(folders: FolderRecord[]) {
  folderCache.data = folders;
  folderCache.loaded = true;
}

export function invalidateFolders() {
  folderCache.loaded = false;
}

export function getCachedMedia() {
  return mediaCache;
}

export function setCachedMedia(media: MediaRecord[]) {
  mediaCache.data = media;
  mediaCache.loaded = true;
}

export function invalidateMedia() {
  mediaCache.loaded = false;
}

export function getCachedPlaylists() {
  return playlistCache;
}

export function setCachedPlaylists(playlists: PlaylistRecord[]) {
  playlistCache.data = playlists;
  playlistCache.loaded = true;
}

export function invalidatePlaylists() {
  playlistCache.loaded = false;
}

export function invalidateAll() {
  invalidateFolders();
  invalidateMedia();
  invalidatePlaylists();
}
