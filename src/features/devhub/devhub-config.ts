import {
  Code2,
  Route,
  Mail,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Globe,
  MessageCircle,
  Send,
  Facebook,
  Heart,
  Coffee,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export interface SocialLink {
  label: string;
  url: string;
  icon: LucideIcon;
  color: string;
}

export interface Badge {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
  icon?: LucideIcon;
}

export interface Technology {
  name: string;
  description: string;
  category: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
}

export const PROJECT_INFO = {
  name: "Vision Projector",
  tagline: "Free & Open Source Church Presentation Software",
  shortDescription:
    "Modern, offline-first presentation software built for churches. Project Bible verses, songs, media, and sermon content with beautiful themes and real-time control.",
  version: "1.0.0",
  buildStatus: "Stable",
  badges: [
    { label: "Offline First", variant: "secondary" as const },
    { label: "Open Source", variant: "default" as const },
    { label: "Tamil First", variant: "outline" as const },
    { label: "Cross Platform", variant: "secondary" as const },
  ],
  description: `Vision Projector is a free and open-source church presentation software designed for modern worship services. Unlike proprietary solutions that lock you into expensive licenses and internet-dependent workflows, Vision Projector is built from the ground up with an offline-first architecture, putting you in complete control of your presentation experience.

Whether you're projecting Bible verses in Tamil or English, displaying song lyrics, showing media content, or managing complex service flows, Vision Projector provides a fast, beautiful, and reliable tool that respects your privacy and independence.`,
  whoItIsFor:
    "Churches of all sizes, worship teams, pastors, youth groups, missionaries, and anyone who needs reliable projection software without the burden of subscription fees or internet dependency.",
  mainGoals: [
    "Provide a free, professional-grade presentation tool for churches worldwide",
    "Deliver blazing-fast performance with offline-first architecture",
    "Support Tamil language natively while offering full English support",
    "Create beautiful, customizable themes for worship environments",
    "Build a sustainable open-source community around the project",
  ],
  problemsItSolves: [
    "Eliminates expensive subscription costs for church presentation software",
    "Works reliably without internet connectivity during services",
    "Provides native Tamil script support with proper font rendering",
    "Simplifies complex service workflows with intuitive design",
    "Removes data privacy concerns with fully local database storage",
  ],
  whyDifferent: [
    "Truly offline-first — your data never leaves your device",
    "Built specifically with Tamil churches in mind from day one",
    "Free and open source — no hidden costs, no premium tiers",
    "Modern tech stack — React, TypeScript, and Electron for native performance",
    "Community-driven development — built by the church, for the church",
  ],
};

export const DEVELOPER_INFO = {
  name: "Joseph",
  role: "Founder & Lead Developer",
  country: "India",
  flag: "🇮🇳",
  photoUrl: "",
  coverUrl: "",
  biography:
    "A passionate developer dedicated to building tools that empower churches and ministry work. With a heart for worship technology and a vision for accessible, beautiful presentation software, Joseph created Vision Projector to serve the global church community.",
  mission:
    "To equip every church with professional-grade presentation tools that are accessible, beautiful, and free.",
  vision:
    "A world where every church, regardless of size or budget, can present the Gospel with excellence and creativity.",
  story:
    "The idea for Vision Projector was born from a simple observation: churches in India and around the world were spending thousands on presentation software that was either too expensive, required constant internet, or didn't support local languages properly. After years of struggling with existing solutions during worship services, the decision was made to build something better — something built for the church, by the church. What started as a personal project quickly grew into a vision for a truly free, open-source alternative that could serve congregations worldwide.",
  timeline: [
    { year: "2023", event: "Initial concept and prototyping began" },
    { year: "2024", event: "First alpha release with core Bible and song functionality" },
    { year: "2025", event: "Beta release with media support and themes" },
    { year: "2026", event: "Version 1.0 — stable release with full feature set" },
  ],
  education: "Computer Science & Engineering",
  skills: [
    "React",
    "TypeScript",
    "Electron",
    "Node.js",
    "SQLite",
    "TailwindCSS",
    "UI/UX Design",
    "Desktop Applications",
    "Open Source",
    "Church Technology",
  ],
  experience:
    "Building church technology solutions with a focus on presentation software, media management, and worship tools.",
  favoriteTechnologies: ["React", "TypeScript", "Electron", "SQLite", "TanStack"],
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Website", url: "https://visionprojector.app", icon: Globe, color: "text-sky-500" },
  {
    label: "GitHub",
    url: "https://github.com/vision-projector",
    icon: Github,
    color: "text-foreground",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/vision-projector",
    icon: Linkedin,
    color: "text-blue-600",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@visionprojector",
    icon: Youtube,
    color: "text-red-600",
  },
  {
    label: "Instagram",
    url: "https://instagram.com/visionprojector",
    icon: Instagram,
    color: "text-pink-500",
  },
  { label: "Email", url: "mailto:hello@visionprojector.app", icon: Mail, color: "text-amber-500" },
];

export const COMMUNITY_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/vision-projector",
    icon: Github,
    color: "text-foreground",
  },
  {
    label: "Discord",
    url: "https://discord.gg/visionprojector",
    icon: MessageCircle,
    color: "text-indigo-500",
  },
  { label: "Send", url: "https://t.me/visionprojector", icon: Send, color: "text-blue-500" },
  {
    label: "Facebook",
    url: "https://facebook.com/visionprojector",
    icon: Facebook,
    color: "text-blue-700",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@visionprojector",
    icon: Youtube,
    color: "text-red-600",
  },
  { label: "Website", url: "https://visionprojector.app", icon: Globe, color: "text-sky-500" },
];

export const SUPPORT_LINKS: SocialLink[] = [
  {
    label: "Buy Me A Coffee",
    url: "https://buymeacoffee.com/visionprojector",
    icon: Coffee,
    color: "text-amber-600",
  },
  {
    label: "GitHub Sponsors",
    url: "https://github.com/sponsors/vision-projector",
    icon: Heart,
    color: "text-pink-600",
  },
  {
    label: "PayPal",
    url: "https://paypal.me/visionprojector",
    icon: DollarSign,
    color: "text-blue-600",
  },
  { label: "UPI", url: "https://visionprojector.app/donate", icon: Heart, color: "text-green-600" },
];

export const VISION_MISSION = {
  mission:
    "To democratize church presentation technology by providing a free, open-source, and beautifully designed software solution that works flawlessly offline and respects user privacy.",
  vision:
    "A global community where churches of all sizes and languages can present worship content with professional quality, without financial barriers or technical complexity.",
  coreValues: [
    {
      title: "Accessibility",
      description: "Free for everyone, always. No premium tiers, no hidden costs.",
    },
    {
      title: "Excellence",
      description: "Professional-grade quality that honors the message being presented.",
    },
    {
      title: "Community",
      description: "Built by the church, for the church. Open to all contributions.",
    },
    { title: "Privacy", description: "Your data stays on your device. No tracking, no telemetry." },
    { title: "Simplicity", description: "Powerful tools that are intuitive and easy to use." },
    {
      title: "Cultural Respect",
      description: "First-class support for Tamil and other regional languages.",
    },
  ],
  futureGoals: [
    "Achieve 10,000+ active installations worldwide",
    "Build a thriving community of 100+ contributors",
    "Add support for 50+ languages",
    "Create a plugin/extension ecosystem",
    "Develop mobile companion apps for remote control",
  ],
  projectPhilosophy:
    "Vision Projector believes that church technology should be a blessing, not a burden. Every design decision is made with the end goal of helping worship leaders focus on what matters most — presenting the Gospel. We prioritize reliability, performance, and beauty in equal measure, knowing that technology serves ministry, not the other way around.",
  designPhilosophy:
    "Clean, purposeful, and unobtrusive. The interface should fade into the background during a service, letting the content shine. We follow platform conventions when appropriate, but aren't afraid to innovate when it serves the user. Every pixel, animation, and interaction is designed with intention.",
  openSourcePhilosophy:
    "Open source isn't just about code — it's about community, transparency, and shared mission. We believe the best church software is built when diverse voices contribute their unique perspectives and talents. All contributions are welcome, from code to design to documentation to translation.",
};

export const FEATURES: FeatureCard[] = [
  {
    title: "Bible",
    description:
      "Read and project Bible verses from multiple translations. Supports Tamil and English Bibles with instant search.",
    icon: Globe,
    tags: ["Tamil", "English", "Multiple Translations"],
  },
  {
    title: "Songs",
    description:
      "Manage and project song lyrics with beautiful formatting. Import from popular song databases.",
    icon: Code2,
    tags: ["Lyrics", "Chord Support", "Import"],
  },
  {
    title: "Media",
    description:
      "Display images, videos, and GIFs during services. Drag-and-drop media management.",
    icon: Route,
    tags: ["Images", "Videos", "GIFs"],
  },
  {
    title: "Playlists",
    description:
      "Create and organize service playlists. Drag-and-drop reordering for seamless service flow.",
    icon: Mail,
    tags: ["Drag & Drop", "Service Flow"],
  },
  {
    title: "Projection",
    description:
      "Full-screen projection with multi-monitor support. Real-time preview and control.",
    icon: Github,
    tags: ["Multi-Monitor", "Live Preview"],
  },
  {
    title: "Themes",
    description:
      "Beautiful, customizable themes for every worship style. Create and save your own.",
    icon: Heart,
    tags: ["Customizable", "Templates"],
  },
  {
    title: "Tanglish Search",
    description:
      "Search in Tanglish (Tamil typed in English script). Fast, fuzzy search across all content.",
    icon: Globe,
    tags: ["Tamil", "Fuzzy Search"],
  },
  {
    title: "Fast Search",
    description:
      "Lightning-fast indexed search. Find anything instantly across your entire library.",
    icon: Route,
    tags: ["Instant", "Indexed"],
  },
  {
    title: "Offline First",
    description: "Works completely offline. No internet required for any feature.",
    icon: Code2,
    tags: ["Local DB", "No Internet"],
  },
  {
    title: "Custom Themes",
    description:
      "Design your own themes with full control over colors, fonts, animations, and backgrounds.",
    icon: Heart,
    tags: ["Full Control", "Save/Load"],
  },
  {
    title: "Keyboard Shortcuts",
    description:
      "Professional-grade keyboard shortcuts for every action. Stay in control without reaching for the mouse.",
    icon: Route,
    tags: ["Productivity", "Accessibility"],
  },
  {
    title: "Performance",
    description:
      "Blazing-fast performance with virtualized lists, lazy loading, and optimized rendering.",
    icon: Mail,
    tags: ["Optimized", "Smooth"],
  },
];

export const TECHNOLOGIES: Technology[] = [
  {
    name: "React 19",
    description: "Modern UI framework for building reactive interfaces",
    category: "Frontend",
  },
  {
    name: "TanStack Router",
    description: "Type-safe file-based routing with SSR support",
    category: "Frontend",
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript for robust application code",
    category: "Language",
  },
  {
    name: "Electron",
    description: "Cross-platform desktop application framework",
    category: "Desktop",
  },
  {
    name: "SQLite (Dexie)",
    description: "Offline-first local database with IndexedDB",
    category: "Database",
  },
  {
    name: "TailwindCSS v4",
    description: "Utility-first CSS framework for rapid UI development",
    category: "Styling",
  },
  {
    name: "Motion (CSS)",
    description: "CSS animations and transitions for smooth UI",
    category: "Animation",
  },
  {
    name: "Node.js",
    description: "JavaScript runtime for build tools and tooling",
    category: "Tooling",
  },
  { name: "Vite", description: "Fast build tool and development server", category: "Tooling" },
  {
    name: "Zustand",
    description: "Lightweight state management with minimal boilerplate",
    category: "State",
  },
  { name: "Radix UI", description: "Accessible headless UI primitives", category: "Components" },
  { name: "Lucide Icons", description: "Beautiful, consistent icon library", category: "Design" },
];

export const STATISTICS: Stat[] = [
  { label: "Lines of Code", value: 85000, suffix: "+", icon: Code2 },
  { label: "Modules", value: 280, suffix: "+", icon: Route },
  { label: "Components", value: 120, suffix: "+", icon: Globe },
  { label: "Themes", value: 25, suffix: "+", icon: Heart },
  { label: "Bible Versions", value: 4, suffix: "", icon: Mail },
  { label: "Songs", value: 10000, suffix: "+", icon: Github },
  { label: "Contributors", value: 8, suffix: "", icon: Heart },
  { label: "Releases", value: 24, suffix: "", icon: Route },
];

export const CONTRIBUTORS = [
  { name: "Joseph", role: "Lead Developer", country: "India", avatar: "" },
  { name: "You?", role: "Future Contributor", country: "Your Country", avatar: "", future: true },
];

export const LICENSE_INFO = {
  name: "MIT License",
  description:
    "Vision Projector is released under the MIT License, allowing you to freely use, modify, and distribute the software.",
  url: "https://github.com/vision-projector/vision-projector/blob/main/LICENSE",
  credits: [
    "React — MIT License",
    "TanStack Router — MIT License",
    "TailwindCSS — MIT License",
    "Radix UI — MIT License",
    "Lucide Icons — ISC License",
    "Dexie.js — Apache-2.0 License",
    "Zustand — MIT License",
    "shadcn/ui — MIT License",
  ],
  acknowledgements: [
    "The Tamil Bible Society for Bible text access",
    "Open source contributors who made this project possible",
    "The church community for their invaluable feedback and support",
    "All future contributors who will help shape this project",
  ],
};

export const FAQ_ITEMS = [
  {
    q: "Is Vision Projector really free?",
    a: "Yes! Vision Projector is and always will be free. It's an open-source project licensed under MIT. There are no premium tiers, no subscription fees, and no hidden costs.",
  },
  {
    q: "Does Vision Projector work offline?",
    a: "Absolutely. Vision Projector is built with an offline-first architecture. All features work without an internet connection. Your data is stored locally on your device.",
  },
  {
    q: "Which platforms are supported?",
    a: "Vision Projector runs on Windows, macOS, and Linux. A web version is also available for basic use.",
  },
  {
    q: "Can I contribute to the project?",
    a: "Yes! We welcome contributions of all kinds — code, design, documentation, translations, and more. Visit our GitHub repository to get started.",
  },
  {
    q: "Does it support Tamil?",
    a: "Yes, Tamil is a first-class citizen in Vision Projector. The entire interface, Bible texts, and search functionality support Tamil and Tanglish (Tamil typed in English script).",
  },
  {
    q: "How do I report a bug?",
    a: "You can report bugs through the Contact page, open an issue on GitHub, or reach out on our Discord community. Please include as much detail as possible to help us fix it quickly.",
  },
];
