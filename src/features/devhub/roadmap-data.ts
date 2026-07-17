export interface RoadmapFeature {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "planned";
  priority: "high" | "medium" | "low";
}

export interface RoadmapVersion {
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  features: RoadmapFeature[];
  highlights: string[];
  breakingChanges?: string[];
  image?: string;
}

export interface FutureVersion {
  version: string;
  title: string;
  goals: string[];
  expectedFeatures: string[];
  priority: "high" | "medium" | "low";
  estimatedProgress: number;
}

export const CURRENT_VERSION = "1.0.0";
export const DEV_PROGRESS = 100;

export const VERSIONS: RoadmapVersion[] = [
  {
    version: "1.0.0",
    releaseDate: "Q2 2026",
    title: "Stable Release",
    description: "First stable public release with complete feature set and production readiness.",
    completed: true,
    progress: 100,
    highlights: [
      "Production-ready stability",
      "Bible projection with Tamil and English support",
      "Song lyrics management and projection",
      "Media playback (images and videos)",
      "Playlist creation and service flow management",
      "Customizable themes and typography",
      "Full-screen projection with multi-monitor support",
      "Keyboard shortcuts for every action",
      "Backup and restore functionality",
      "Offline-first architecture",
    ],
    features: [
      {
        title: "Bible projection",
        description: "Display Bible verses from Tamil and English translations",
        status: "completed",
        priority: "high",
      },
      {
        title: "Song lyrics",
        description: "Manage and project song lyrics with formatting",
        status: "completed",
        priority: "high",
      },
      {
        title: "Media library",
        description: "Import and manage images and videos",
        status: "completed",
        priority: "high",
      },
      {
        title: "Playlist system",
        description: "Create and organize service playlists",
        status: "completed",
        priority: "high",
      },
      {
        title: "Theme engine",
        description: "Customizable themes with animations",
        status: "completed",
        priority: "high",
      },
      {
        title: "Projection engine",
        description: "Full-screen multi-monitor projection",
        status: "completed",
        priority: "high",
      },
      {
        title: "Keyboard shortcuts",
        description: "Comprehensive keyboard shortcut system",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Backup & restore",
        description: "Export and import data backups",
        status: "completed",
        priority: "high",
      },
      {
        title: "Typography controls",
        description: "Font, size, alignment, and text effects",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Developer Hub",
        description: "Project information and community hub",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Contact system",
        description: "Contact form and community support",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Version History",
        description: "Release notes and version tracking",
        status: "completed",
        priority: "medium",
      },
    ],
  },
];

export const FUTURE_VERSIONS: FutureVersion[] = [];

export const MILESTONES = [{ version: "1.0.0", date: "Q2 2026", label: "Stable", completed: true }];
