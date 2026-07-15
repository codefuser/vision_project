import { useEffect, useRef, useState } from "react";
import {
  Check,
  Circle,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
  Layers,
  Flag,
  Star,
  Zap,
  Code2,
  Route,
  Calendar,
  GitFork,
  TrendingUp,
  ListTodo,
  GripVertical,
  SquareCode,
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CURRENT_VERSION,
  DEV_PROGRESS,
  VERSIONS,
  FUTURE_VERSIONS,
  MILESTONES,
  type RoadmapFeature,
  type RoadmapVersion,
  type FutureVersion,
} from "@/features/devhub/roadmap-data";

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

const SECTION_IDS = ["overview", "milestones", "past-versions", "future", "progress"] as const;

type SectionId = (typeof SECTION_IDS)[number];

const SECTION_LABELS: Record<SectionId, string> = {
  overview: "Overview",
  milestones: "Milestones",
  "past-versions": "Past Versions",
  future: "Future",
  progress: "Progress",
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
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 2 + (i % 3) * 2,
    left: 5 + ((i * 17) % 90),
    top: 10 + ((i * 13) % 80),
    duration: 3 + (i % 4),
    delay: i * 0.4,
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

function SectionHeader({ title, subtitle, id }: { title: string; subtitle?: string; id?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} id={id} className={cn("devhub-reveal text-center mb-14", visible && "visible")}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
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
          <Route className="w-10 h-10 text-primary" />
        </div>
        <h1 className="devhub-gradient-text text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Product Roadmap
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-2">
          v{CURRENT_VERSION}
        </p>
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Overall progress</span>
            <span>{DEV_PROGRESS}%</span>
          </div>
          <div className="devhub-progress-bar h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="devhub-progress-fill h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: visible ? `${DEV_PROGRESS}%` : "0%" }}
            />
          </div>
        </div>
        <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
          The journey of Vision Projector — past, present, and future
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            size="lg"
            className="gap-2"
            onClick={() =>
              document.getElementById("milestones")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Flag className="w-4 h-4" />
            View Milestones
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={() =>
              document.getElementById("future")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Sparkles className="w-4 h-4" />
            Future Plans
          </Button>
        </div>
      </div>
    </section>
  );
}

function MilestoneTimelineSection() {
  const { ref: sectionRef, visible: sectionVisible } = useScrollReveal();
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineAnimated, setLineAnimated] = useState(false);

  useEffect(() => {
    if (sectionVisible && !lineAnimated) {
      const timer = setTimeout(() => setLineAnimated(true), 300);
      return () => clearTimeout(timer);
    }
  }, [sectionVisible, lineAnimated]);

  const completedCount = MILESTONES.filter((m) => m.completed).length;
  const totalCount = MILESTONES.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <section id="milestones" className="py-20 px-6">
      <SectionHeader
        title="Milestone Timeline"
        subtitle="Key milestones in the Vision Projector journey."
      />
      <div
        ref={sectionRef}
        className={cn("devhub-reveal max-w-6xl mx-auto", sectionVisible && "visible")}
      >
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="relative min-w-[700px] px-4 pt-8 pb-4">
            <div className="absolute left-8 right-8 top-[3.25rem] h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                ref={lineRef}
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: lineAnimated ? `${progressPercent}%` : "0%" }}
              />
            </div>
            <div className="flex items-start justify-between relative">
              {MILESTONES.map((milestone, i) => (
                <div key={milestone.version} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "relative z-10 w-5 h-5 rounded-full border-2 transition-all duration-500 mb-3",
                      milestone.completed
                        ? "bg-primary border-primary shadow-md shadow-primary/30"
                        : "bg-background border-muted-foreground/30",
                    )}
                  >
                    {milestone.completed && (
                      <Check className="w-3 h-3 text-primary-foreground absolute inset-0 m-auto" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold whitespace-nowrap transition-colors duration-300",
                      milestone.completed ? "text-primary" : "text-muted-foreground/50",
                    )}
                  >
                    {milestone.version}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] whitespace-nowrap transition-colors duration-300",
                      milestone.completed ? "text-muted-foreground" : "text-muted-foreground/30",
                    )}
                  >
                    {milestone.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/40 mt-0.5">
                    {milestone.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>Completed ({completedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-muted-foreground/30 bg-background" />
            <span>Planned ({totalCount - completedCount})</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "in-progress": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  upcoming: "bg-muted text-muted-foreground border-border",
  planned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const statusLabels: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  upcoming: "Upcoming",
  planned: "Planned",
};

function FeatureRow({ feature }: { feature: RoadmapFeature }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border/30 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{feature.title}</p>
        <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 text-[10px] font-medium px-2 py-0.5 border",
          statusStyles[feature.status],
        )}
      >
        {statusLabels[feature.status]}
      </Badge>
    </div>
  );
}

function VersionCard({
  version,
  isCurrent = false,
  index = 0,
}: {
  version: RoadmapVersion;
  isCurrent?: boolean;
  index?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(
        `devhub-reveal ${isCurrent ? "" : `devhub-reveal-delay-${(index % 5) + 1}`}`,
        visible && "visible",
      )}
    >
      <Card
        className={cn(
          "devhub-glass devhub-card-hover border-border/50 overflow-hidden",
          isCurrent && "border-primary/40 shadow-lg shadow-primary/5 relative",
        )}
      >
        {isCurrent && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isCurrent && (
                  <Badge variant="default" className="text-[10px] px-2 py-0.5 gap-1">
                    <Zap className="w-3 h-3" />
                    Current
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                  {version.releaseDate}
                </Badge>
              </div>
              <CardTitle className="devhub-gradient-text text-2xl md:text-3xl font-bold tracking-tight">
                v{version.version}
              </CardTitle>
              <CardDescription className="text-base font-medium text-foreground/80 mt-1">
                {version.title}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">{version.description}</p>

          {version.highlights.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-primary" />
                Highlights
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {version.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-primary" />
              Features
            </p>
            <div className="divide-y divide-border/30">
              {version.features.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </div>
          </div>

          {version.breakingChanges && version.breakingChanges.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Breaking Changes
              </p>
              <ul className="space-y-1">
                {version.breakingChanges.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-destructive">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span>{version.progress}%</span>
            </div>
            <Progress value={version.progress} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VersionHistorySection() {
  const currentVersion = VERSIONS.find((v) => v.version === CURRENT_VERSION);
  const pastVersions = VERSIONS.filter((v) => v.completed && v.version !== CURRENT_VERSION).sort(
    (a, b) => {
      const parseVersion = (v: string) => v.split(".").map(Number);
      const [aMajor, aMinor, aPatch] = parseVersion(a.version);
      const [bMajor, bMinor, bPatch] = parseVersion(b.version);
      if (bMajor !== aMajor) return bMajor - aMajor;
      if (bMinor !== aMinor) return bMinor - aMinor;
      return bPatch - aPatch;
    },
  );

  return (
    <section id="past-versions" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Version History"
        subtitle="Every release that shaped Vision Projector."
      />
      <div className="max-w-4xl mx-auto space-y-8">
        {currentVersion && <VersionCard version={currentVersion} isCurrent />}
        {pastVersions.map((version, i) => (
          <VersionCard key={version.version} version={version} index={i} />
        ))}
      </div>
    </section>
  );
}

const priorityVariants: Record<string, "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

const priorityLabels: Record<string, string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

function FutureVersionCard({ version, index }: { version: FutureVersion; index: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <Card className="devhub-glass devhub-card-hover border-dashed border-border/60 h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={priorityVariants[version.priority]}
                  className="text-[10px] px-2 py-0.5"
                >
                  {priorityLabels[version.priority]}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">v{version.version}</CardTitle>
              <CardDescription className="text-sm font-medium text-foreground/70 mt-0.5">
                {version.title}
              </CardDescription>
            </div>
            <div className="devhub-float-slow shrink-0 w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary/60" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Estimated progress</span>
              <span>{version.estimatedProgress}%</span>
            </div>
            <Progress value={version.estimatedProgress} className="h-1.5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Flag className="w-3 h-3" />
              Goals
            </p>
            <ul className="space-y-1">
              {version.goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <SquareCode className="w-3 h-3" />
              Expected Features
            </p>
            <div className="flex flex-wrap gap-1.5">
              {version.expectedFeatures.map((feat, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {feat}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/20 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Planned for future release</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function FutureRoadmapSection() {
  return (
    <section id="future" className="py-20 px-6">
      <SectionHeader title="Future Roadmap" subtitle="What's coming next for Vision Projector." />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {FUTURE_VERSIONS.map((version, i) => (
          <FutureVersionCard key={version.version} version={version} index={i} />
        ))}
      </div>
    </section>
  );
}

function DevelopmentProgressSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.2 });

  const completedVersions = VERSIONS.filter((v) => v.completed).length;
  const allFeatures = VERSIONS.flatMap((v) => v.features);
  const featuresShipped = allFeatures.filter((f) => f.status === "completed").length;
  const totalFeatures = allFeatures.length;
  const inProgressFeatures = allFeatures.filter((f) => f.status === "in-progress").length;
  const currentPhase = FUTURE_VERSIONS[0]?.title ?? "Stable Release";

  const stats = [
    {
      icon: GitFork,
      value: completedVersions,
      suffix: "",
      label: "Versions Completed",
      color: "text-chart-1",
    },
    {
      icon: Check,
      value: featuresShipped,
      suffix: "",
      label: "Features Shipped",
      color: "text-chart-2",
    },
    {
      icon: Zap,
      value: inProgressFeatures,
      suffix: "",
      label: "In Progress",
      color: "text-chart-3",
    },
    {
      icon: Target,
      value: DEV_PROGRESS,
      suffix: "%",
      label: "Overall Progress",
      color: "text-primary",
    },
  ];

  return (
    <section id="progress" className="py-20 px-6 bg-muted/30">
      <SectionHeader
        title="Development Progress"
        subtitle="Tracking the journey from prototype to production."
      />
      <div
        ref={ref}
        className={cn("devhub-reveal max-w-5xl mx-auto space-y-8", visible && "visible")}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="devhub-glass devhub-card-hover border-border/50 text-center"
            >
              <CardContent className="pt-6 pb-6">
                <stat.icon className={cn("w-6 h-6 mx-auto mb-3", stat.color)} />
                <div className="devhub-stat-number text-2xl md:text-3xl font-bold mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} visible={visible} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="devhub-glass-strong devhub-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Current Phase: {currentPhase}
            </CardTitle>
            <CardDescription>Overall feature completion across all versions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Features shipped</span>
                <span className="font-medium">
                  {featuresShipped} / {totalFeatures}
                </span>
              </div>
              <Progress value={(featuresShipped / totalFeatures) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-emerald-500">Completed</p>
                  <p className="text-lg font-bold">
                    {allFeatures.filter((f) => f.status === "completed").length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-500">In Progress</p>
                  <p className="text-lg font-bold">{inProgressFeatures}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-500">Planned</p>
                  <p className="text-lg font-bold">
                    {
                      allFeatures.filter((f) => f.status === "planned" || f.status === "upcoming")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
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
          <Route className="w-4 h-4 text-primary" />
          <span className="font-medium">Product Roadmap</span>
          <span className="text-muted-foreground/50">v{CURRENT_VERSION}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
          <Calendar className="w-3 h-3" />
          <span>Last updated Q2 2026</span>
        </div>
        <p className="text-xs text-muted-foreground/50">
          Vision Projector &middot; The journey continues
        </p>
      </div>
    </footer>
  );
}

export function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideNav />
      <HeroSection />
      <MilestoneTimelineSection />
      <VersionHistorySection />
      <FutureRoadmapSection />
      <DevelopmentProgressSection />
      <FooterSection />
    </div>
  );
}
