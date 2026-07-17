/**
 * Session Export Menu
 * Renders a dropdown with export options: JSON, CSV, Markdown, PDF.
 */
import { useState } from "react";
import { Download, ChevronDown, FileJson, FileText, FileCode2, Printer } from "lucide-react";
import type { SessionRecord, SessionEventRecord } from "@/db/schema";
import { format } from "date-fns";

interface Props {
  session: SessionRecord;
  events: SessionEventRecord[];
}

function formatTs(ts: number): string {
  return format(new Date(ts), "HH:mm");
}

function exportJSON(session: SessionRecord, events: SessionEventRecord[]): void {
  const data = { session, events };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${session.name.replace(/\s+/g, "_")}_${session.date}.json`);
}

function exportCSV(session: SessionRecord, events: SessionEventRecord[]): void {
  const header = "Time,Event Type,Label,Detail,Module\n";
  const rows = events
    .map(
      (e) =>
        `"${formatTs(e.ts)}","${e.eventType}","${e.label.replace(/"/g, '""')}","${(e.detail ?? "").replace(/"/g, '""')}","${e.module}"`,
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  downloadBlob(blob, `${session.name.replace(/\s+/g, "_")}_${session.date}.csv`);
}

function exportMarkdown(session: SessionRecord, events: SessionEventRecord[]): void {
  const duration = session.endedAt
    ? formatDurationMs(session.endedAt - session.startedAt)
    : "Ongoing";

  const lines: string[] = [
    `# ${session.name}`,
    ``,
    `**Date:** ${session.date}  `,
    `**Started:** ${format(new Date(session.startedAt), "hh:mm a")}  `,
    `**Duration:** ${duration}  `,
    `**Total Events:** ${session.totalEvents}  `,
    ``,
    `## Summary`,
    ``,
    `| Category | Count |`,
    `|---|---|`,
    `| 📖 Bible Verses | ${session.bibleCount} |`,
    `| 🎵 Songs | ${session.songCount} |`,
    `| 🖼 Images | ${session.imageCount} |`,
    `| 🎬 Videos | ${session.videoCount} |`,
    `| 📝 Text | ${session.textCount} |`,
    `| 🎨 Themes | ${session.themeCount} |`,
    ``,
    `## Timeline`,
    ``,
    ...events.map(
      (e) =>
        `- **${formatTs(e.ts)}** — ${e.label}${e.detail ? ` *(${e.detail.slice(0, 80)})*` : ""}`,
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  downloadBlob(blob, `${session.name.replace(/\s+/g, "_")}_${session.date}.md`);
}

function exportPDF(session: SessionRecord, events: SessionEventRecord[]): void {
  // Use the browser's print dialog with a temporary print-ready window
  const duration = session.endedAt
    ? formatDurationMs(session.endedAt - session.startedAt)
    : "Ongoing";

  const rows = events
    .map(
      (e) =>
        `<tr>
          <td style="color:#888;white-space:nowrap">${formatTs(e.ts)}</td>
          <td style="font-weight:600">${e.label}</td>
          <td style="color:#666;font-size:12px">${e.detail ?? ""}</td>
          <td style="color:#999;font-size:11px">${e.module}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${session.name}</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 40px; color: #1a1a1a; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 24px; }
    .stats { display: flex; gap: 20px; margin-bottom: 28px; flex-wrap: wrap; }
    .stat { background: #f5f5f5; border-radius: 8px; padding: 10px 16px; font-size: 13px; }
    .stat strong { display: block; font-size: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; border-bottom: 2px solid #eee; padding: 6px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #999; }
    td { padding: 5px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${session.name}</h1>
  <div class="meta">${session.date} · ${format(new Date(session.startedAt), "hh:mm a")} · Duration: ${duration}</div>
  <div class="stats">
    <div class="stat"><strong>${session.bibleCount}</strong>Bible Verses</div>
    <div class="stat"><strong>${session.songCount}</strong>Songs</div>
    <div class="stat"><strong>${session.imageCount}</strong>Images</div>
    <div class="stat"><strong>${session.videoCount}</strong>Videos</div>
    <div class="stat"><strong>${session.textCount}</strong>Text</div>
    <div class="stat"><strong>${session.totalEvents}</strong>Total Events</div>
  </div>
  <table>
    <thead><tr><th>Time</th><th>Event</th><th>Detail</th><th>Module</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }<\/script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatDurationMs(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function SessionExportMenu({ session, events }: Props) {
  const [open, setOpen] = useState(false);

  const options = [
    {
      label: "Export as JSON",
      icon: FileJson,
      action: () => exportJSON(session, events),
    },
    {
      label: "Export as CSV",
      icon: FileText,
      action: () => exportCSV(session, events),
    },
    {
      label: "Export as Markdown",
      icon: FileCode2,
      action: () => exportMarkdown(session, events),
    },
    {
      label: "Print / Export PDF",
      icon: Printer,
      action: () => exportPDF(session, events),
    },
  ];

  return (
    <div className="relative">
      <button
        id="session-export-btn"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent"
      >
        <Download className="h-3.5 w-3.5" />
        Export
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    opt.action();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-xs text-foreground transition hover:bg-accent"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
