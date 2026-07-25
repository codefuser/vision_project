import type { MediaType } from "@/db/schema";

export const IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
  "image/x-icon",
];

export const VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/x-matroska",
  "video/avi",
  "video/x-msvideo",
  "video/x-flv",
  "video/x-ms-wmv",
  "video/mpeg",
  "video/3gpp",
];

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  avif: "image/avif",
  tif: "image/tiff",
  tiff: "image/tiff",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  mkv: "video/x-matroska",
  avi: "video/avi",
  flv: "video/x-flv",
  wmv: "video/x-ms-wmv",
  mpg: "video/mpeg",
  mpeg: "video/mpeg",
  "3gp": "video/3gpp",
};

export function detectMime(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MIME[ext] ?? "application/octet-stream";
}

export function classifyMime(mime: string): MediaType {
  if (IMAGE_MIMES.includes(mime) || mime.startsWith("image/")) return "image";
  if (VIDEO_MIMES.includes(mime) || mime.startsWith("video/")) return "video";
  return "image"; // Fallback to image type for display
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDuration(ms: number | undefined): string {
  if (!ms || !Number.isFinite(ms)) return "—";
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
