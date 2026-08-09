import {
  Code2,
  Route,
  Mail,
  Github,
  Linkedin,
  Globe,
  Heart,
  Shield,
  Layers,
  Sparkles,
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
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
}

export const PROJECT_INFO = {
  name: "VersoLyn",
  tagline: "Free & Open Source Church Presentation Web Application",
  shortDescription:
    "Modern web presentation software built for churches. Project Bible verses in Tamil and English, song lyrics, media, and sermon content with real-time control.",
  version: "In Development",
  buildStatus: "Active Development",
  badges: [
    { label: "Tamil & English", variant: "secondary" as const },
    { label: "Open Source", variant: "default" as const },
    { label: "Web Platform", variant: "outline" as const },
    { label: "MIT License", variant: "secondary" as const },
  ],
  description: `VersoLyn is a free and open-source church presentation web application designed for modern worship services. Built and tested while serving at IRM (India Revival Ministry), Kuruvankootai, Tirunelveli, Tamil Nadu, VersoLyn provides an accessible, beautiful, and intuitive presentation experience without subscription fees or proprietary locks.

Whether you are projecting Bible verses in Tamil or English, displaying song lyrics, managing worship media, or organizing service flows, VersoLyn provides a fast, reliable tool built specifically to serve congregations worldwide.`,
  whoItIsFor:
    "Churches of all sizes, worship teams, pastors, youth groups, and ministry teams needing reliable Tamil and English presentation software without subscription burdens.",
  mainGoals: [
    "Provide a free, professional-grade web presentation tool for churches worldwide",
    "Deliver fast, responsive performance using modern web architecture",
    "Support Tamil language natively with first-class font rendering and Tanglish search",
    "Create beautiful, customizable templates and themes for worship environments",
    "Build a transparent, community-driven open-source project under the MIT license",
  ],
  problemsItSolves: [
    "Eliminates expensive software subscription fees for church presentation tools",
    "Solves native Tamil script rendering and Tanglish search issues in traditional tools",
    "Resolves display scaling and aspect ratio issues across different TV screens",
    "Removes lock-in by offering a 100% free and open-source web application",
  ],
  whyDifferent: [
    "Born out of real church projection challenges during actual worship services at IRM, Kuruvankootai",
    "First-class native Tamil and Tanglish search support built from day one",
    "Completely free and open source under the MIT License — no hidden tiers",
    "Modern tech stack powered by React 19, TypeScript, and TailwindCSS v4",
    "Clean, unobtrusive interface designed specifically for worship environments",
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
    "Full Stack Developer and founder of VersoLyn. Driven by a passion for worship technology and open-source software, Joseph created VersoLyn to solve real projection and language difficulties faced during church services in daily ministry.",
  mission:
    "To equip every church with free, modern, and beautiful presentation tools for worship in Tamil and English.",
  vision:
    "A world where every congregation, regardless of size or budget, can present the Gospel with clarity, beauty, and technical excellence.",
  story: `The idea for VersoLyn came after experiencing real presentation problems during worship services at IRM (India Revival Ministry), Kuruvankootai, Tirunelveli, Tamil Nadu, India.

Common problems experienced:
• Existing presentation software was difficult to use.
• Tamil support was not satisfactory.
• Projection scaling problems occurred on different TVs.
• Some displays showed white bars because every church used different aspect ratios.
• Need for a simple, modern and open-source presentation platform.

Development officially started on June 6, 2026.`,
  timeline: [
    {
      year: "Late May 2026",
      event:
        "Idea born while solving real projection problems during church services at IRM (India Revival Ministry), Kuruvankootai, Tirunelveli.",
    },
    {
      year: "June 6, 2026",
      event: "Official development started.",
    },
    {
      year: "Present",
      event:
        "Active development of VersoLyn continues with Bible, Songs, Media, Projection and Church workflow improvements.",
    },
  ],
  education: "Electronics & Communication Engineering (ECE)",
  skills: [
    "React 19 / TypeScript",
    "TailwindCSS v4 / Web UI Architecture",
    "IndexedDB / Dexie.js Data Storage",
    "Tamil & Tanglish Search Algorithms",
    "State Management (Zustand)",
  ],
  interests: ["Worship Technology", "Open Source", "UI/UX Design", "Full Stack Web Development"],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/codefuser/vision-projector", icon: Github },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/joseph-fullstack", icon: Linkedin },
  ],
  experience:
    "Building modern web applications and ministry technology solutions with a focus on presentation performance and bilingual support.",
  favoriteTechnologies: ["React", "TypeScript", "Vite", "TailwindCSS", "Zustand"],
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/codefuser/vision-projector",
    icon: Github,
    color: "text-foreground",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/joseph-fullstack",
    icon: Linkedin,
    color: "text-blue-600",
  },
];

export const COMMUNITY_LINKS: SocialLink[] = [
  {
    label: "GitHub",
    url: "https://github.com/codefuser/vision-projector",
    icon: Github,
    color: "text-foreground",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/joseph-fullstack",
    icon: Linkedin,
    color: "text-blue-600",
  },
];

export const SUPPORT_LINKS: SocialLink[] = [];

export const VISION_MISSION = {
  mission:
    "To equip churches with a free, open-source, and beautifully designed web application for worship presentation in Tamil and English.",
  vision:
    "A global church community where congregations of any size can present worship content with professional quality, without financial barriers or software lock-in.",
  coreValues: [
    {
      title: "Accessibility",
      description: "100% Free and open source for everyone. No premium tiers or subscription fees.",
    },
    {
      title: "Excellence",
      description: "Clean, reliable presentation quality that honors the worship environment.",
    },
    {
      title: "Community",
      description: "Built by and for the church. Open for community feedback and contributions.",
    },
    {
      title: "Language Respect",
      description: "First-class native support for Tamil and Tanglish transliteration search.",
    },
    {
      title: "Simplicity",
      description: "An intuitive interface designed to minimize distraction during worship services.",
    },
  ],
  projectPhilosophy:
    "VersoLyn believes that church technology should serve the ministry, not create extra burdens. Every design decision is made with the goal of helping worship leaders and media operators present scripture and songs with ease, clarity, and beauty.",
  designPhilosophy:
    "Clean, modern, and purposeful. The interface stays out of the way during service operation, allowing media operators to react quickly and maintain smooth service flow.",
  openSourcePhilosophy:
    "Open source fosters transparency, collaboration, and long-term sustainability. VersoLyn is built under the MIT license so churches worldwide can benefit from and contribute to its growth.",
};

export const FEATURES: FeatureCard[] = [
  {
    title: "Bible Module",
    description:
      "Search and project scripture verses from Tamil and English Bibles with instant passage lookup.",
    icon: Globe,
    tags: ["Tamil", "English", "Bible Passages"],
  },
  {
    title: "Song Lyrics",
    description:
      "Manage song lyrics library with chord display and instant live presentation slide control.",
    icon: Code2,
    tags: ["Lyrics", "Live Slide Output", "Song Library"],
  },
  {
    title: "Tanglish Search",
    description:
      "Find Tamil songs and scripture passages quickly by typing Tamil words using English script.",
    icon: Sparkles,
    tags: ["Tamil Transliteration", "Fuzzy Search"],
  },
  {
    title: "Service Playlists",
    description:
      "Organize service items, songs, and scripture readings into ordered playlists for smooth service flow.",
    icon: Route,
    tags: ["Service Flow", "Reorder Items"],
  },
  {
    title: "Live Projection Display",
    description:
      "Dedicated full-screen projection window with live slide preview and operator controls.",
    icon: Layers,
    tags: ["Dual Screen", "Live Output"],
  },
  {
    title: "Themes & Styling",
    description:
      "Customizable slide typography, background colors, alignment, and theme presets.",
    icon: Heart,
    tags: ["Typography", "Theme Presets"],
  },
];

export const TECHNOLOGIES: Technology[] = [
  {
    name: "React 19",
    description: "Modern component framework for high-performance reactive web interfaces",
    category: "Frontend",
  },
  {
    name: "TypeScript 5.8",
    description: "Type-safe programming for robust, maintainable application code",
    category: "Language",
  },
  {
    name: "Vite 7",
    description: "Lightning-fast build tool and modern frontend dev server",
    category: "Tooling",
  },
  {
    name: "TanStack Router & Start",
    description: "Type-safe routing and web application structure",
    category: "Frontend",
  },
  {
    name: "TailwindCSS v4",
    description: "Utility-first CSS framework powering modern UI styling",
    category: "Styling",
  },
  {
    name: "Dexie.js (IndexedDB)",
    description: "IndexedDB wrapper for client-side database storage",
    category: "Database",
  },
  {
    name: "Zustand 5",
    description: "Lightweight state management store",
    category: "State",
  },
  {
    name: "Radix UI",
    description: "Accessible, unstyled headless UI components",
    category: "Components",
  },
  {
    name: "Lucide Icons",
    description: "Clean, consistent icon library",
    category: "Design",
  },
];

export const STATISTICS: Stat[] = [
  { label: "Supported Languages", value: 2, suffix: " (Tamil & English)", icon: Globe },
  { label: "License", value: "MIT", suffix: "", icon: Shield },
  { label: "Platform", value: "Web App", suffix: "", icon: Route },
  { label: "Status", value: "In Active Dev", suffix: "", icon: Sparkles },
];

export const CONTRIBUTORS = [
  { name: "Joseph", role: "Founder & Lead Developer", country: "India 🇮🇳", avatar: "" },
];

export const LICENSE_INFO = {
  name: "MIT License",
  description:
    "VersoLyn is released under the open-source MIT License, allowing you to freely use, modify, and distribute the software.",
  url: "https://github.com/codefuser/vision-projector/blob/main/LICENSE",
};

export const CUSTOM_SERVICES_INFO = {
  title: "Need a Custom Software?",
  description:
    "Need software for your church, ministry, company, shop or organization? We build modern custom web applications tailored to your needs.",
  examples: [
    "Church Management",
    "Church Presentation",
    "School Software",
    "Company Dashboard",
    "Inventory System",
    "Billing",
    "ERP",
    "CRM",
    "Custom Web Applications",
  ],
  contact: {
    name: "Joseph",
    email: "josephsamuvel1310@gmail.com",
    phone: "+91 6369589486",
  },
};

export const FAQ_ITEMS = [
  {
    q: "Is VersoLyn really free?",
    a: "Yes! VersoLyn is 100% free and open-source under the MIT License. There are no subscription fees, premium tiers, or hidden costs.",
  },
  {
    q: "What platform does VersoLyn run on?",
    a: "VersoLyn is a modern web application designed for desktop and laptop web browsers.",
  },
  {
    q: "Does VersoLyn support Tamil?",
    a: "Yes! Native Tamil text rendering and Tanglish search (searching Tamil lyrics and verses using English transliteration) are core built-in features.",
  },
  {
    q: "Can I contribute to the project?",
    a: "Absolutely! We welcome contributions of all kinds — code, documentation, UI design, translations, and feature feedback on our GitHub repository.",
  },
  {
    q: "How do I report a bug or request a feature?",
    a: "You can submit bug reports or feature requests using our Contact page form or by opening an issue on GitHub.",
  },
];

