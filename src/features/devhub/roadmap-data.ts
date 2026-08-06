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

export const CURRENT_VERSION = "In Development";
export const DEV_PROGRESS = 65;

export const VERSIONS: RoadmapVersion[] = [
  {
    version: "In Active Development",
    releaseDate: "Unreleased",
    title: "Initial Development Build",
    description: "Core presentation web application features under active development.",
    completed: false,
    progress: 65,
    highlights: [
      "Project started on June 6, 2026",
      "Bible verse projection with Tamil and English support",
      "Song lyrics management and Tanglish search",
      "Media management and display background options",
      "Ordered service playlist management",
      "Customizable typography and theme controls",
      "Dual display projection window",
      "Open-source development under MIT License",
    ],
    features: [
      {
        title: "Bible projection",
        description: "Display Bible verses from Tamil and English translations",
        status: "in-progress",
        priority: "high",
      },
      {
        title: "Song lyrics & Tanglish search",
        description: "Manage and project song lyrics with Tanglish search",
        status: "in-progress",
        priority: "high",
      },
      {
        title: "Media library",
        description: "Manage background images and video presentation assets",
        status: "in-progress",
        priority: "high",
      },
      {
        title: "Playlist system",
        description: "Create and organize service playlists",
        status: "in-progress",
        priority: "high",
      },
      {
        title: "Theme engine",
        description: "Customizable presentation themes and styling",
        status: "in-progress",
        priority: "high",
      },
      {
        title: "Live projection display",
        description: "Dual display output with live slide preview",
        status: "in-progress",
        priority: "high",
      },
    ],
  },
];

export const FUTURE_VERSIONS: FutureVersion[] = [];

export const MILESTONES = [{ version: "In Dev", date: "Started June 6, 2026", label: "Active Development", completed: false }];

