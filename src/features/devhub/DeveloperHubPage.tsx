import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Route,
  Heart,
  ExternalLink,
  Quote,
  Target,
  Eye,
  Sparkles,
  Layers,
  Lightbulb,
  Compass,
  Flag,
  Users,
  Award,
  Shield,
  Star,
  BookOpen,
  MonitorPlay,
  Zap,
  Check,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  PROJECT_INFO,
  DEVELOPER_INFO,
  SOCIAL_LINKS,
  COMMUNITY_LINKS,
  SUPPORT_LINKS,
  VISION_MISSION,
  FEATURES,
  TECHNOLOGIES,
  STATISTICS,
  CONTRIBUTORS,
  LICENSE_INFO,
  type FeatureCard,
  type Technology,
  type Stat,
  type SocialLink,
} from "@/features/devhub/devhub-config";

function useScrollReveal(options?: { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold]);
  return { ref, visible };
}

function AnimatedCounter({
  value,
  suffix = "",
  visible,
}: {
  value: number;
  suffix?: string;
  visible: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let frame: number;
    const start = performance.now();
    const duration = 1500;
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

const SECTION_IDS = [
  "overview",
  "about",
  "developer",
  "vision",
  "features",
  "tech-stack",
  "gallery",
  "stats",
  "community",
  "support",
  "contributors",
  "license",
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const SECTION_LABELS: Record<SectionId, string> = {
  overview: "Overview",
  about: "About",
  developer: "Developer",
  vision: "Vision",
  features: "Features",
  "tech-stack": "Tech Stack",
  gallery: "Gallery",
  stats: "Stats",
  community: "Community",
  support: "Support",
  contributors: "Contributors",
  license: "License",
};

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("overview");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

function SideNav() {
  const active = useActiveSection();
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
      <div className="flex flex-col gap-1.5">
        {SECTION_IDS.map((id) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={cn(
              "devhub-section-link group flex items-center gap-3 text-xs font-medium transition-all duration-300",
              active === id ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "transition-all duration-300",
                active === id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {SECTION_LABELS[id]}
            </span>
            <span
              className={cn(
                "h-px w-6 transition-all duration-300",
                active === id ? "bg-primary w-10" : "bg-border w-6",
              )}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}

function Particles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 3,
    left: 10 + ((i * 23) % 80),
    top: 15 + ((i * 17) % 70),
    duration: 6 + (i % 3),
    delay: i * 0.8,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="devhub-particle absolute rounded-full bg-primary/20"
          style={
            {
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function HeroSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      id="overview"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="devhub-hero-gradient absolute inset-0" />
      <Particles />
      <div
        ref={ref}
        className={cn(
          "devhub-reveal relative z-10 text-center max-w-4xl mx-auto px-6 py-24",
          visible && "visible",
        )}
      >
        <div className="devhub-float inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-8 shadow-lg shadow-primary/5">
          <MonitorPlay className="w-10 h-10 text-primary" />
        </div>
        <h1 className="devhub-gradient-text text-5xl md:text-7xl font-bold tracking-tight mb-4">
          {PROJECT_INFO.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">
          {PROJECT_INFO.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            v{PROJECT_INFO.version}
          </Badge>
          {PROJECT_INFO.badges.map((badge, i) => (
            <Badge key={i} variant={badge.variant} className="text-sm px-3 py-1">
              {badge.label}
            </Badge>
          ))}
        </div>
        <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
          {PROJECT_INFO.shortDescription}
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            size="lg"
            className="gap-2"
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Sparkles className="w-4 h-4" />
            Explore Features
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          >
            <BookOpen className="w-4 h-4" />
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} id={id} className={cn("devhub-reveal text-center mb-14", visible && "visible")}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function AboutSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <section id="about" className="py-20 px-6">
      <SectionHeader
        title="About Vision Projector"
        subtitle="A modern presentation tool built for the church, by the church."
      />
      <div
        ref={ref}
        className={cn(
          "devhub-reveal max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8",
          visible && "visible",
        )}
      >
        <Card className="devhub-glass devhub-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="devhub-gradient-text text-xl">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {PROJECT_INFO.description}
            </p>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Who It's For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{PROJECT_INFO.whoItIsFor}</p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Main Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PROJECT_INFO.mainGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card className="devhub-glass devhub-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Problems It Solves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PROJECT_INFO.problemsItSolves.map((problem, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-chart-2 mt-1 shrink-0" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="devhub-glass devhub-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Why We're Different
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PROJECT_INFO.whyDifferent.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-chart-1 mt-1 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Timeline({ events }: { events: { year: string; event: string }[] }) {
  return (
    <div className="relative pl-8">
      <div className="devhub-timeline-line absolute left-3 top-2 bottom-2 w-px bg-border" />
      {events.map((item, i) => (
        <div key={i} className="relative pb-8 last:pb-0">
          <div className="absolute left-[-1.65rem] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
          <div className="text-sm font-semibold text-primary mb-1">{item.year}</div>
          <p className="text-muted-foreground">{item.event}</p>
        </div>
      ))}
    </div>
  );
}

function DeveloperSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <section id="developer" className="py-20 px-6 bg-muted/30">
      <SectionHeader title="About the Developer" subtitle="The person behind Vision Projector." />
      <div
        ref={ref}
        className={cn(
          "devhub-reveal max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8",
          visible && "visible",
        )}
      >
        <Card className="devhub-glass-strong devhub-card-hover border-border/50 lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <Avatar className="w-28 h-28 mx-auto mb-4 ring-4 ring-primary/20">
              <AvatarImage src={DEVELOPER_INFO.photoUrl} alt={DEVELOPER_INFO.name} />
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                {DEVELOPER_INFO.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{DEVELOPER_INFO.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{DEVELOPER_INFO.role}</p>
            <p className="text-sm flex items-center justify-center gap-1.5 text-muted-foreground">
              <Flag className="w-3.5 h-3.5" />
              {DEVELOPER_INFO.flag} {DEVELOPER_INFO.country}
            </p>
            <Separator className="my-4" />
            <div className="space-y-3 text-left">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Education
                </p>
                <p className="text-sm">{DEVELOPER_INFO.education}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Experience
                </p>
                <p className="text-sm">{DEVELOPER_INFO.experience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEVELOPER_INFO.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Favorite Technologies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEVELOPER_INFO.favoriteTechnologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Quote className="w-4 h-4 text-primary" />
                Biography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{DEVELOPER_INFO.biography}</p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                The Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{DEVELOPER_INFO.story}</p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={DEVELOPER_INFO.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  const { ref: ref2, visible: vis2 } = useScrollReveal({ threshold: 0.05 });
  return (
    <section id="vision" className="py-20 px-6">
      <SectionHeader
        title="Vision & Mission"
        subtitle="The driving force behind everything we build."
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div
          ref={ref}
          className={cn(
            "devhub-reveal grid grid-cols-1 md:grid-cols-2 gap-6",
            visible && "visible",
          )}
        >
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-4 h-4 text-chart-1" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{VISION_MISSION.mission}</p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="w-4 h-4 text-chart-2" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{VISION_MISSION.vision}</p>
            </CardContent>
          </Card>
        </div>
        <div
          ref={ref2}
          className={cn(
            "devhub-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
            vis2 && "visible",
          )}
        >
          {VISION_MISSION.coreValues.map((value) => (
            <Card key={value.title} className="devhub-glass devhub-card-hover border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {value.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="devhub-glass devhub-card-hover border-border/50 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              Project Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {VISION_MISSION.projectPhilosophy}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FeatureCardComponent({ feature, index }: { feature: FeatureCard; index: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <Card className="devhub-glass devhub-card-hover border-border/50 h-full">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <feature.icon className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-base">{feature.title}</CardTitle>
          <CardDescription className="text-sm">{feature.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-1.5">
          {feature.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Feature Showcase"
        subtitle="Everything you need for beautiful, reliable presentations."
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <FeatureCardComponent key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  return (
    <Card className="devhub-glass devhub-card-hover border-border/50 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          Architecture Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {["Electron Shell", "React UI", "TanStack Router", "Zustand State"].map((layer) => (
              <div
                key={layer}
                className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
              >
                {layer}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="w-16 h-px bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Application Layer
            </span>
            <span className="w-16 h-px bg-border" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Dexie / SQLite", "IndexedDB", "File System"].map((layer) => (
              <div
                key={layer}
                className="px-4 py-2 rounded-lg bg-chart-1/10 border border-chart-1/20 text-sm font-medium text-chart-1"
              >
                {layer}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="w-16 h-px bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Data Layer</span>
            <span className="w-16 h-px bg-border" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Windows", "macOS", "Linux"].map((platform) => (
              <div
                key={platform}
                className="px-4 py-2 rounded-lg bg-chart-2/10 border border-chart-2/20 text-sm font-medium text-chart-2"
              >
                {platform}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="w-16 h-px bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Platform</span>
            <span className="w-16 h-px bg-border" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TechCard({ tech, index }: { tech: Technology; index: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <Card className="devhub-glass devhub-card-hover border-border/50 h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm">{tech.name}</CardTitle>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {tech.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">{tech.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 px-6">
      <SectionHeader
        title="Technology Stack"
        subtitle="Modern tools powering a modern application."
      />
      <div className="max-w-6xl mx-auto space-y-8">
        <ArchitectureDiagram />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TECHNOLOGIES.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const items = [
    { label: "Bible Projection", icon: BookOpen },
    { label: "Song Lyrics", icon: Code2 },
    { label: "Media Manager", icon: Layers },
    { label: "Theme Editor", icon: Zap },
    { label: "Service Flow", icon: Route },
    { label: "Settings Panel", icon: MonitorPlay },
  ];
  const { ref, visible } = useScrollReveal();
  return (
    <section id="gallery" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Screenshots"
        subtitle="A visual preview of Vision Projector in action."
      />
      <div
        ref={ref}
        className={cn(
          "devhub-reveal max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
          visible && "visible",
        )}
      >
        {items.map((item) => (
          <Card
            key={item.label}
            className="devhub-glass-strong devhub-card-hover border-border/50 overflow-hidden group"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5 flex items-center justify-center relative overflow-hidden">
              <div className="devhub-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <item.icon className="w-10 h-10 text-muted-foreground/30 group-hover:text-primary/40 transition-colors duration-300" />
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-center text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.2 });
  return (
    <section id="stats" className="py-20 px-6">
      <SectionHeader title="By the Numbers" subtitle="Vision Projector in statistics." />
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATISTICS.map((stat) => (
          <Card
            key={stat.label}
            className="devhub-glass devhub-card-hover border-border/50 text-center"
          >
            <CardContent className="pt-6 pb-6">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="devhub-stat-number text-2xl md:text-3xl font-bold mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ""} visible={visible} />
              </div>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CommunityCard({ link }: { link: SocialLink }) {
  const Icon = link.icon;
  return (
    <Card className="devhub-glass devhub-card-hover border-border/50">
      <CardContent className="pt-6 text-center">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${link.color} bg-current/10`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold mb-1">{link.label}</h3>
        <p className="text-[10px] text-muted-foreground mb-4 truncate max-w-full">
          {link.url.replace(/^https?:\/\//, "")}
        </p>
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" asChild>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            Visit
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function CommunitySection() {
  return (
    <section id="community" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Join the Community"
        subtitle="Connect with us and be part of the Vision Projector community."
      />
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {COMMUNITY_LINKS.map((link) => (
          <CommunityCard key={link.label} link={link} />
        ))}
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section id="support" className="py-20 px-6">
      <SectionHeader
        title="Support Development"
        subtitle="Help keep Vision Projector free and open source."
      />
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUPPORT_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Card
              key={link.label}
              className="devhub-glass-strong devhub-card-hover border-border/50"
            >
              <CardContent className="pt-6 text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${link.color} bg-current/10`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold mb-3">{link.label}</h3>
                <Button variant="default" size="sm" className="w-full gap-1.5 text-xs" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Support Now
                    <Heart className="w-3 h-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function ContributorCard({
  contributor,
  index,
}: {
  contributor: (typeof CONTRIBUTORS)[number] & { future?: boolean };
  index: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <Card
        className={cn(
          "devhub-glass devhub-card-hover border-border/50 text-center",
          contributor.future && "border-dashed border-primary/30 bg-primary/[0.02]",
        )}
      >
        <CardContent className="pt-6">
          <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-primary/20">
            <AvatarImage src={contributor.avatar} alt={contributor.name} />
            <AvatarFallback
              className={cn(
                "text-lg font-bold",
                contributor.future
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              {contributor.future ? <UserPlus className="w-6 h-6" /> : contributor.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-semibold">{contributor.name}</h3>
          <p className="text-xs text-muted-foreground mb-1">{contributor.role}</p>
          {contributor.country && (
            <p className="text-[10px] text-muted-foreground/70">{contributor.country}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ContributorsSection() {
  return (
    <section id="contributors" className="py-20 px-6 bg-muted/30">
      <SectionHeader title="Contributors" subtitle="The people making Vision Projector possible." />
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CONTRIBUTORS.map((contributor, i) => (
          <ContributorCard key={`${contributor.name}-${i}`} contributor={contributor} index={i} />
        ))}
      </div>
    </section>
  );
}

function LicenseSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <section id="license" className="py-20 px-6">
      <SectionHeader title="License" subtitle="Vision Projector is free and open source." />
      <div ref={ref} className={cn("devhub-reveal max-w-3xl mx-auto", visible && "visible")}>
        <Card className="devhub-glass-strong devhub-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-chart-2" />
              {LICENSE_INFO.name}
            </CardTitle>
            <CardDescription className="text-sm">{LICENSE_INFO.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Credits & Licenses
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LICENSE_INFO.credits.map((credit) => (
                  <div
                    key={credit}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{credit}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Acknowledgements
              </p>
              <ul className="space-y-2">
                {LICENSE_INFO.acknowledgements.map((ack) => (
                  <li key={ack} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Award className="w-3.5 h-3.5 text-chart-3 mt-0.5 shrink-0" />
                    <span>{ack}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
              <a href={LICENSE_INFO.url} target="_blank" rel="noopener noreferrer">
                View Full License
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-border/40 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MonitorPlay className="w-4 h-4 text-primary" />
          <span className="font-medium">{PROJECT_INFO.name}</span>
          <span className="text-muted-foreground/50">v{PROJECT_INFO.version}</span>
        </div>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.slice(0, 4).map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} hover:opacity-80 transition-opacity`}
                title={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground/50">Released under the {LICENSE_INFO.name}</p>
      </div>
    </footer>
  );
}

export function DeveloperHubPage() {
  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <SideNav />
      <HeroSection />
      <AboutSection />
      <DeveloperSection />
      <VisionSection />
      <FeaturesSection />
      <TechStackSection />
      <GallerySection />
      <StatsSection />
      <CommunitySection />
      <SupportSection />
      <ContributorsSection />
      <LicenseSection />
      <FooterSection />
    </div>
  );
}
