import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, History, Star, ListTodo, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CURRENT_VERSION,
  VERSIONS,
  type RoadmapFeature,
  type RoadmapVersion,
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

function FeatureRow({ feature }: { feature: RoadmapFeature }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border/30 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{feature.title}</p>
        <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
      </div>
      <Badge
        variant="outline"
        className="shrink-0 text-[10px] font-medium px-2 py-0.5 border bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      >
        Completed
      </Badge>
    </div>
  );
}

function VersionCard({
  version,
  isCurrent = false,
}: {
  version: RoadmapVersion;
  isCurrent?: boolean;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
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
        </CardContent>
      </Card>
    </div>
  );
}

function VersionHistorySection() {
  const currentVersion = VERSIONS.find((v) => v.version === CURRENT_VERSION);

  return (
    <section id="version-history" className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-8">
        {currentVersion && <VersionCard version={currentVersion} isCurrent />}
      </div>
    </section>
  );
}

export function RoadmapPage() {
  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="devhub-hero-gradient absolute inset-0" />
        <Particles />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-24">
          <div className="devhub-float inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-lg shadow-primary/5">
            <History className="w-8 h-8 text-primary" />
          </div>
          <h1 className="devhub-gradient-text text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Version History
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">v{CURRENT_VERSION}</p>
          <p className="text-md text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed mt-4">
            Track the evolution of Vision Projector — from initial release to latest updates.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={() =>
                document.getElementById("version-history")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <History className="w-4 h-4" />
              View Releases
            </Button>
          </div>
        </div>
      </section>

      <VersionHistorySection />

      <footer className="border-t border-border/40 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Route className="w-4 h-4 text-primary" />
            <span className="font-medium">Version History</span>
            <span className="text-muted-foreground/50">v{CURRENT_VERSION}</span>
          </div>
          <p className="text-xs text-muted-foreground/50">
            Vision Projector &middot; First public release
          </p>
        </div>
      </footer>
    </div>
  );
}
