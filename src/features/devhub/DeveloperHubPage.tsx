import { useEffect, useRef, useState } from "react";
import { VersoLynLogo } from "@/components/ui/VersoLynLogo";
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
  Calendar,
  Rocket,
  Phone,
  Mail,
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
  CUSTOM_SERVICES_INFO,
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
  value: number | string;
  suffix?: string;
  visible: boolean;
}) {
  const [count, setCount] = useState(0);
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!visible || !isNumeric) return;
    let frame: number;
    const start = performance.now();
    const duration = 1500;
    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (value as number)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, visible, isNumeric]);

  if (!isNumeric) {
    return (
      <>
        {value}
        {suffix}
      </>
    );
  }

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
  "stats",
  "services",
  "community",
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
  stats: "Stats",
  services: "Services",
  community: "Community",
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
        <div className="devhub-float inline-flex items-center justify-center w-32 h-32 md:w-36 md:h-36 mb-6 select-none rounded-full drop-shadow-[0_0_28px_rgba(59,130,246,0.45)] dark:drop-shadow-[0_0_28px_rgba(147,197,253,0.35)]">
          <VersoLynLogo className="w-full h-full object-contain rounded-full" />
        </div>
        <h1 className="devhub-gradient-text text-5xl md:text-7xl font-bold tracking-tight mb-4">
          {PROJECT_INFO.name}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">
          {PROJECT_INFO.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {PROJECT_INFO.version}
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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <h2 className="devhub-gradient-text text-3xl font-bold tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function AboutSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <section id="about" className="py-20 px-6">
      <SectionHeader title="About VersoLyn" subtitle="Why VersoLyn exists and what drives it." />
      <div
        ref={ref}
        className={cn("devhub-reveal max-w-4xl mx-auto space-y-6", visible && "visible")}
      >
        <Card className="devhub-glass-strong devhub-card-hover border-border/50 p-6 md:p-8">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="devhub-gradient-text text-xl md:text-2xl">
              Free & Open Source Church Presentation Web Application
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-muted-foreground leading-relaxed whitespace-pre-line">
            {PROJECT_INFO.description}
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Who It's For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {PROJECT_INFO.whoItIsFor}
              </p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="devhub-gradient-text-accent text-lg flex items-center gap-2">
                <Shield className="w-4 h-4 text-chart-2" />
                Problems It Solves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PROJECT_INFO.problemsItSolves.map((problem, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <Check className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
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
                  <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                    <Check className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Timeline({ events }: { events: { year: string; event: string }[] }) {
  const icons = [Lightbulb, Calendar, Rocket, Sparkles];

  return (
    <div className="relative max-w-2xl mx-auto py-4">
      <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/10" />

      <div className="space-y-10 relative">
        {events.map((item, i) => {
          const IconComponent = icons[i % icons.length] || Sparkles;
          const isEven = i % 2 === 0;

          return (
            <div
              key={i}
              className="relative flex flex-col md:flex-row items-center justify-between group"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-background border-2 border-primary text-primary shadow-md shadow-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <IconComponent className="w-4 h-4" />
              </div>

              <div
                className={cn(
                  "w-full md:w-[calc(50%-2.5rem)] pt-12 md:pt-0",
                  isEven ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left",
                )}
              >
                <div className="p-4 rounded-xl bg-card/60 border border-border/40 hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <div
                    className={cn(
                      "flex items-center gap-2 mb-2",
                      isEven ? "md:justify-end" : "md:justify-start",
                    )}
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold px-2.5 py-0.5 text-primary bg-primary/10 border-primary/20"
                    >
                      {item.year}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed whitespace-pre-line">
                    {item.event}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeveloperSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <section id="developer" className="py-20 px-6 bg-muted/30">
      <SectionHeader title="About the Developer" subtitle="The person behind VersoLyn." />
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
                <p className="text-sm font-medium">{DEVELOPER_INFO.education}</p>
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
                Project Origin & Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {DEVELOPER_INFO.story}
              </p>
            </CardContent>
          </Card>
          <Card className="devhub-glass devhub-card-hover border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Route className="w-4 h-4 text-primary" />
                Development Timeline
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
          {VISION_MISSION.coreValues.map((val) => (
            <Card key={val.title} className="devhub-glass devhub-card-hover border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{val.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.description}</p>
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

function FeatureCardItem({ feature, index }: { feature: FeatureCard; index: number }) {
  const { ref, visible } = useScrollReveal();
  const Icon = feature.icon;
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <Card className="devhub-glass devhub-card-hover border-border/50 h-full flex flex-col justify-between">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Icon className="w-5 h-5" />
          </div>
          <CardTitle className="text-base">{feature.title}</CardTitle>
          <CardDescription className="text-xs leading-relaxed mt-1">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5 mt-2">
            {feature.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Application Modules"
        subtitle="Key features built into VersoLyn."
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => (
          <FeatureCardItem key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  const { ref, visible } = useScrollReveal();
  return (
    <Card
      ref={ref}
      className={cn(
        "devhub-reveal devhub-glass-strong border-border/50 p-6 max-w-3xl mx-auto text-center",
        visible && "visible",
      )}
    >
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Web Application Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {["React 19", "TypeScript 5.8", "TailwindCSS v4", "TanStack Router", "Zustand 5"].map(
              (tech) => (
                <div
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
                >
                  {tech}
                </div>
              ),
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="w-16 h-px bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Application Layer
            </span>
            <span className="w-16 h-px bg-border" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Dexie.js (IndexedDB)", "Local Storage Cache", "Media Assets"].map((layer) => (
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
            {["Desktop & Laptop Browsers", "Dual Display Output"].map((platform) => (
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

function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 px-6">
      <SectionHeader
        title="Technology Stack"
        subtitle="Modern web stack powering VersoLyn."
      />
      <div className="max-w-6xl mx-auto space-y-8">
        <ArchitectureDiagram />
      </div>
    </section>
  );
}

function StatsSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.2 });
  return (
    <section id="stats" className="py-20 px-6 bg-muted/30">
      <SectionHeader title="Project Facts" subtitle="VersoLyn project details." />
      <div ref={ref} className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATISTICS.map((stat) => (
          <Card
            key={stat.label}
            className="devhub-glass devhub-card-hover border-border/50 text-center"
          >
            <CardContent className="pt-6 pb-6">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="devhub-stat-number text-xl md:text-2xl font-bold mb-1">
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

function ServicesSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <section id="services" className="py-20 px-6">
      <SectionHeader
        title={CUSTOM_SERVICES_INFO.title}
        subtitle="Custom web application development tailored to your needs."
      />
      <div ref={ref} className={cn("devhub-reveal max-w-4xl mx-auto", visible && "visible")}>
        <Card className="devhub-glass-strong border-primary/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          <CardHeader className="text-center pb-4">
            <Badge variant="secondary" className="w-fit mx-auto mb-2 text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20">
              Custom Development Services
            </Badge>
            <CardTitle className="text-2xl md:text-3xl font-bold">{CUSTOM_SERVICES_INFO.title}</CardTitle>
            <CardDescription className="text-base max-w-2xl mx-auto mt-2 text-muted-foreground">
              {CUSTOM_SERVICES_INFO.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">
                Software Solutions We Build
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {CUSTOM_SERVICES_INFO.examples.map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="text-sm px-3.5 py-1.5 bg-background/60 hover:border-primary/40 transition-colors gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="bg-muted/40 p-6 rounded-2xl border border-border/50 text-center max-w-xl mx-auto">
              <h4 className="text-lg font-bold mb-1">Get in Touch with {CUSTOM_SERVICES_INFO.contact.name}</h4>
              <p className="text-xs text-muted-foreground mb-6">
                Have a project idea? Reach out directly via email or phone to discuss your requirements.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
                  <a href={`mailto:${CUSTOM_SERVICES_INFO.contact.email}`}>
                    <Mail className="w-4 h-4" />
                    {CUSTOM_SERVICES_INFO.contact.email}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" asChild>
                  <a href={`tel:${CUSTOM_SERVICES_INFO.contact.phone.replace(/\s+/g, "")}`}>
                    <Phone className="w-4 h-4 text-primary" />
                    {CUSTOM_SERVICES_INFO.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
        subtitle="Connect with us on GitHub and LinkedIn."
      />
      <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMMUNITY_LINKS.map((link) => (
          <CommunityCard key={link.label} link={link} />
        ))}
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
    <section id="contributors" className="py-20 px-6">
      <SectionHeader title="Project Developer" subtitle="The lead developer behind VersoLyn." />
      <div className="max-w-sm mx-auto">
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
    <section id="license" className="py-20 px-6 bg-muted/30">
      <SectionHeader title="Project License" subtitle="VersoLyn is open-source software." />
      <div ref={ref} className={cn("devhub-reveal max-w-2xl mx-auto text-center", visible && "visible")}>
        <Card className="devhub-glass-strong border-border/50 p-6 text-center">
          <CardHeader className="pb-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-chart-2/10 text-chart-2 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold">{LICENSE_INFO.name}</CardTitle>
            <CardDescription className="text-sm max-w-lg mx-auto mt-2 leading-relaxed">
              {LICENSE_INFO.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center pt-2">
            <Button size="lg" variant="outline" className="gap-2 text-sm" asChild>
              <a href={LICENSE_INFO.url} target="_blank" rel="noopener noreferrer">
                View MIT License on GitHub
                <ExternalLink className="w-4 h-4" />
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
          <VersoLynLogo className="w-5 h-5 rounded-full" />
          <span className="font-medium">{PROJECT_INFO.name}</span>
          <span className="text-muted-foreground/50">({PROJECT_INFO.version})</span>
        </div>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => {
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
      <StatsSection />
      <ServicesSection />
      <CommunitySection />
      <ContributorsSection />
      <LicenseSection />
      <FooterSection />
    </div>
  );
}

