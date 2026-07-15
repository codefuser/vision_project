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
export const DEV_PROGRESS = 68;

export const VERSIONS: RoadmapVersion[] = [
  {
    version: "0.1.0",
    releaseDate: "Q1 2024",
    title: "Initial Prototype",
    description: "First working prototype with core Bible projection functionality.",
    completed: true,
    progress: 100,
    highlights: [
      "Basic Bible verse projection",
      "Simple song lyrics display",
      "Minimal UI prototype",
    ],
    features: [
      {
        title: "Bible verse rendering",
        description: "Display verses from Tamil and English Bibles",
        status: "completed",
        priority: "high",
      },
      {
        title: "Song lyrics display",
        description: "Basic song lyric projection with formatting",
        status: "completed",
        priority: "high",
      },
      {
        title: "Simple projection window",
        description: "Full-screen projector output window",
        status: "completed",
        priority: "high",
      },
      {
        title: "Basic UI shell",
        description: "Application shell with sidebar navigation",
        status: "completed",
        priority: "high",
      },
    ],
  },
  {
    version: "0.2.0",
    releaseDate: "Q2 2024",
    title: "Media Support",
    description: "Added media playback and image projection capabilities.",
    completed: true,
    progress: 100,
    highlights: ["Image projection support", "Video playback", "Media library management"],
    features: [
      {
        title: "Image projection",
        description: "Display images in the projector window",
        status: "completed",
        priority: "high",
      },
      {
        title: "Video playback",
        description: "Play videos with controls in projection",
        status: "completed",
        priority: "high",
      },
      {
        title: "Media library",
        description: "Organize and manage media files",
        status: "completed",
        priority: "high",
      },
      {
        title: "Drag-drop import",
        description: "Import media files via drag and drop",
        status: "completed",
        priority: "medium",
      },
    ],
  },
  {
    version: "0.3.0",
    releaseDate: "Q3 2024",
    title: "Playlist System",
    description: "Introduced playlist creation and service flow management.",
    completed: true,
    progress: 100,
    highlights: [
      "Playlist creation and editing",
      "Drag-and-drop reordering",
      "Service flow management",
    ],
    features: [
      {
        title: "Playlist editor",
        description: "Create and edit presentation playlists",
        status: "completed",
        priority: "high",
      },
      {
        title: "Drag-and-drop reorder",
        description: "Reorder playlist items with drag and drop",
        status: "completed",
        priority: "high",
      },
      {
        title: "Service templates",
        description: "Save and reuse service templates",
        status: "completed",
        priority: "medium",
      },
    ],
  },
  {
    version: "0.4.0",
    releaseDate: "Q4 2024",
    title: "Theme Engine",
    description: "Complete theme system with customizable presets and animations.",
    completed: true,
    progress: 100,
    highlights: ["Theme system with presets", "Custom theme creation", "Animated backgrounds"],
    features: [
      {
        title: "Theme presets",
        description: "Pre-designed themes for different worship styles",
        status: "completed",
        priority: "high",
      },
      {
        title: "Custom theme editor",
        description: "Create and save custom themes",
        status: "completed",
        priority: "high",
      },
      {
        title: "Animated backgrounds",
        description: "CSS-animated background effects",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Theme gallery",
        description: "Browse and preview available themes",
        status: "completed",
        priority: "medium",
      },
    ],
  },
  {
    version: "0.5.0",
    releaseDate: "Q1 2025",
    title: "Search & Performance",
    description: "Major performance overhaul with instant search capabilities.",
    completed: true,
    progress: 100,
    highlights: ["Tanglish search support", "Indexed search engine", "Virtualized lists"],
    features: [
      {
        title: "Tanglish search",
        description: "Search Tamil content using English script",
        status: "completed",
        priority: "high",
      },
      {
        title: "Indexed search",
        description: "Fast indexed search across all content",
        status: "completed",
        priority: "high",
      },
      {
        title: "Virtualized lists",
        description: "Smooth scrolling with virtualization",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Performance optimization",
        description: "Reduced load times and memory usage",
        status: "completed",
        priority: "high",
      },
    ],
  },
  {
    version: "0.6.0",
    releaseDate: "Q2 2025",
    title: "Electron Desktop App",
    description: "Native desktop application with offline-first architecture.",
    completed: true,
    progress: 100,
    highlights: [
      "Electron desktop application",
      "Native file system access",
      "System tray integration",
    ],
    features: [
      {
        title: "Electron shell",
        description: "Native desktop application wrapper",
        status: "completed",
        priority: "high",
      },
      {
        title: "File system access",
        description: "Native file import and export",
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
        title: "System tray",
        description: "Minimize to system tray",
        status: "completed",
        priority: "low",
      },
    ],
  },
  {
    version: "0.7.0",
    releaseDate: "Q3 2025",
    title: "Projection Engine",
    description: "Complete rewrite of the projection engine for reliability.",
    completed: true,
    progress: 100,
    highlights: ["Multi-monitor support", "Broadcast channel communication", "Real-time preview"],
    features: [
      {
        title: "Multi-monitor projection",
        description: "Support for multiple output displays",
        status: "completed",
        priority: "high",
      },
      {
        title: "Broadcast channel",
        description: "Cross-window communication for projection",
        status: "completed",
        priority: "high",
      },
      {
        title: "Live preview",
        description: "Real-time preview of projected content",
        status: "completed",
        priority: "medium",
      },
    ],
  },
  {
    version: "0.8.0",
    releaseDate: "Q4 2025",
    title: "Settings & Polish",
    description: "Comprehensive settings system and UI polish pass.",
    completed: true,
    progress: 100,
    highlights: ["Full settings system", "Backup and restore", "UI refinement"],
    features: [
      {
        title: "Settings system",
        description: "Comprehensive application settings",
        status: "completed",
        priority: "high",
      },
      {
        title: "Backup & restore",
        description: "Export and import data backups",
        status: "completed",
        priority: "high",
      },
      {
        title: "Global shortcuts",
        description: "Customizable keyboard shortcuts",
        status: "completed",
        priority: "medium",
      },
      {
        title: "UI polish",
        description: "Visual refinements across the application",
        status: "completed",
        priority: "medium",
      },
    ],
  },
  {
    version: "1.0.0",
    releaseDate: "Q2 2026",
    title: "Stable Release",
    description: "First stable release with complete feature set and production readiness.",
    completed: true,
    progress: 100,
    highlights: [
      "Production-ready stability",
      "Complete feature coverage",
      "Developer Hub & community pages",
    ],
    features: [
      {
        title: "Developer Hub",
        description: "Project information and community hub",
        status: "completed",
        priority: "medium",
      },
      {
        title: "Roadmap page",
        description: "Product roadmap and version history",
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
        title: "Performance monitoring",
        description: "Application performance metrics",
        status: "completed",
        priority: "low",
      },
    ],
  },
];

export const FUTURE_VERSIONS: FutureVersion[] = [
  {
    version: "1.1.0",
    title: "Enhanced Bible Tools",
    goals: [
      "Add parallel Bible view (side-by-side translations)",
      "Implement Bible reading plans and devotionals",
      "Add verse image generation for social media",
      "Improve Bible search with regex and wildcard support",
    ],
    expectedFeatures: [
      "Parallel Bible view",
      "Reading plans",
      "Verse image generator",
      "Advanced search operators",
      "Bible bookmarking system",
    ],
    priority: "high",
    estimatedProgress: 15,
  },
  {
    version: "1.2.0",
    title: "Advanced Media & Effects",
    goals: [
      "Add video transitions between items",
      "Implement picture-in-picture mode",
      "Add audio playback and mixing",
      "Support for live camera input",
    ],
    expectedFeatures: [
      "Video transitions",
      "Picture-in-picture",
      "Audio mixing",
      "Live camera input",
      "Screen capture support",
    ],
    priority: "high",
    estimatedProgress: 5,
  },
  {
    version: "2.0.0",
    title: "Service Mode & Collaboration",
    goals: [
      "Complete service planning workflow",
      "Real-time collaboration features",
      "Cloud sync (optional)",
      "Mobile companion app",
    ],
    expectedFeatures: [
      "Service planning calendar",
      "Real-time collaboration",
      "Optional cloud sync",
      "iOS and Android companion apps",
      "Remote control via mobile",
      "Multi-user support",
    ],
    priority: "medium",
    estimatedProgress: 0,
  },
  {
    version: "3.0.0",
    title: "Plugin System & Enterprise",
    goals: [
      "Plugin/extension ecosystem",
      "API for integrations",
      "Advanced analytics and reporting",
      "Multi-language interface (50+ languages)",
    ],
    expectedFeatures: [
      "Plugin SDK and marketplace",
      "REST API for integrations",
      "Advanced analytics dashboard",
      "50+ language interface",
      "Enterprise deployment tools",
      "LDAP/SSO authentication",
    ],
    priority: "low",
    estimatedProgress: 0,
  },
];

export const MILESTONES = [
  { version: "0.1.0", date: "Q1 2024", label: "Prototype", completed: true },
  { version: "0.2.0", date: "Q2 2024", label: "Media", completed: true },
  { version: "0.3.0", date: "Q3 2024", label: "Playlists", completed: true },
  { version: "0.4.0", date: "Q4 2024", label: "Themes", completed: true },
  { version: "0.5.0", date: "Q1 2025", label: "Search", completed: true },
  { version: "0.6.0", date: "Q2 2025", label: "Desktop", completed: true },
  { version: "0.7.0", date: "Q3 2025", label: "Engine", completed: true },
  { version: "0.8.0", date: "Q4 2025", label: "Settings", completed: true },
  { version: "1.0.0", date: "Q2 2026", label: "Stable", completed: true },
  { version: "1.1.0", date: "Q4 2026", label: "Bible Tools", completed: false },
  { version: "1.2.0", date: "Q2 2027", label: "Media Effects", completed: false },
  { version: "2.0.0", date: "2028", label: "Service Mode", completed: false },
  { version: "3.0.0", date: "2029+", label: "Plugin System", completed: false },
];
