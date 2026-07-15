import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Send,
  Check,
  Copy,
  Clock,
  Bug,
  Lightbulb,
  HelpCircle,
  ExternalLink,
  FileText,
  Camera,
  AlertCircle,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SOCIAL_LINKS, COMMUNITY_LINKS, FAQ_ITEMS } from "@/features/devhub/devhub-config";

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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("devhub-reveal text-center mb-14", visible && "visible")}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
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

interface FormData {
  name: string;
  church: string;
  country: string;
  email: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  attachment: File | null;
  screenshot: File | null;
  logFile: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SuccessState {
  ticketId: string;
  timestamp: string;
}

const CATEGORIES = [
  "Bug Report",
  "Feature Request",
  "Suggestion",
  "Question",
  "Support",
  "Business",
  "Translation",
  "Volunteer",
  "Partnership",
] as const;

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Brazil",
  "South Africa",
  "Singapore",
  "Malaysia",
  "Sri Lanka",
  "United Arab Emirates",
  "Other",
] as const;

const INITIAL_FORM: FormData = {
  name: "",
  church: "",
  country: "",
  email: "",
  subject: "",
  category: "",
  priority: "Medium",
  message: "",
  attachment: null,
  screenshot: null,
  logFile: null,
};

function generateTicketId(): string {
  return "VP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatTimestamp(): string {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function ContactForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [copied, setCopied] = useState(false);
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setFile(key: "attachment" | "screenshot" | "logFile", file: File | null) {
    setForm((prev) => ({ ...prev, [key]: file }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSuccess({ ticketId: generateTicketId(), timestamp: formatTimestamp() });
  }

  if (success) {
    return (
      <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
        <Card className="devhub-glass-strong border-border/50 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-chart-2/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chart-1/10 rounded-full blur-3xl" />
          </div>
          <CardContent className="relative pt-16 pb-12 text-center">
            <div className="w-20 h-20 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in-90 duration-500">
              <div className="w-16 h-16 rounded-full bg-chart-2/30 flex items-center justify-center">
                <Check className="w-8 h-8 text-chart-2" />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your request has been submitted successfully. We'll review it and get back to you
              within 48 hours.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/5 border border-primary/10 mb-8">
              <span className="text-sm font-mono font-semibold text-primary">
                {success.ticketId}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(success.ticketId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                title="Copy ticket ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-chart-2" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-10">
              <Clock className="w-3.5 h-3.5" />
              <span>{success.timestamp}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setForm(INITIAL_FORM);
                setErrors({});
                setSuccess(null);
              }}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Send another message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Send us a message</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={cn(errors.name && "border-destructive")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="church">Church / Organization</Label>
                <Input
                  id="church"
                  placeholder="Your church or organization"
                  value={form.church}
                  onChange={(e) => setField("church", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={form.country} onValueChange={(v) => setField("country", v)}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="flex items-center gap-1">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="What is this about?"
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  className={cn(errors.subject && "border-destructive")}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.subject}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setField("priority", v)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center gap-1">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Describe your issue, question, or suggestion in detail..."
                rows={6}
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                className={cn(errors.message && "border-destructive")}
              />
              {errors.message && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <FileUploadButton
                icon={Paperclip}
                label="Attachment"
                accept=".pdf,.doc,.docx,.txt,.zip"
                file={form.attachment}
                onChange={(f) => setFile("attachment", f)}
              />
              <FileUploadButton
                icon={Camera}
                label="Screenshot"
                accept="image/*"
                file={form.screenshot}
                onChange={(f) => setFile("screenshot", f)}
              />
              <FileUploadButton
                icon={FileText}
                label="Log File"
                accept=".log,.txt"
                file={form.logFile}
                onChange={(f) => setFile("logFile", f)}
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" size="lg" className="gap-2">
                <Send className="w-4 h-4" />
                Submit Request
              </Button>
              <p className="text-xs text-muted-foreground">
                All fields marked with <span className="text-destructive">*</span> are required
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Paperclip({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function FileUploadButton({
  icon: Icon,
  label,
  accept,
  file,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2 text-xs"
        onClick={() => inputRef.current?.click()}
      >
        <Icon className="w-3.5 h-3.5" />
        {file ? file.name : label}
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="ml-1 p-0.5 rounded hover:bg-muted transition-colors"
          >
            <span className="sr-only">Remove</span>
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </Button>
    </div>
  );
}

function ContactInfoCard({ link, index }: { link: (typeof SOCIAL_LINKS)[number]; index: number }) {
  const Icon = link.icon;
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn(`devhub-reveal devhub-reveal-delay-${(index % 5) + 1}`, visible && "visible")}
    >
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="devhub-glass devhub-card-hover border-border/50 group cursor-pointer">
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${link.color} bg-current/10`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{link.label}</p>
              <p className="text-xs text-muted-foreground truncate">
                {link.url.replace(/^https?:\/\//, "").replace(/^mailto:/, "")}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
          </CardContent>
        </Card>
      </a>
    </div>
  );
}

function ContactInfoSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("devhub-reveal space-y-6", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Contact Information
          </CardTitle>
          <CardDescription>Reach out through any of these channels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SOCIAL_LINKS.map((link, i) => (
            <ContactInfoCard key={link.label} link={link} index={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StepCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
          {number}
        </div>
        {number < 4 && <div className="w-px flex-1 bg-border mt-2" />}
      </div>
      <div className="pb-6">
        <h4 className="font-semibold mb-1">{title}</h4>
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function BugReportingGuide() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50 devhub-card-hover">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Bug className="w-5 h-5 text-destructive" />
            </div>
            <CardTitle className="text-lg">Bug Reporting Guide</CardTitle>
          </div>
          <CardDescription>Help us fix issues faster by following these steps</CardDescription>
        </CardHeader>
        <CardContent>
          <StepCard number={1} title="Check if the bug is already reported">
            Search our GitHub issues and community forums to see if someone has already reported the
            same bug.
          </StepCard>
          <StepCard number={2} title="Gather information">
            <ul className="space-y-1 mt-1 list-disc list-inside">
              <li>Take screenshots or screen recordings</li>
              <li>Collect log files (Settings &gt; About &gt; View Logs)</li>
              <li>Note your OS version and Vision Projector version</li>
              <li>Write down steps to reproduce the bug</li>
            </ul>
          </StepCard>
          <StepCard number={3} title="Submit through the contact form">
            Fill out the form with all the details you've gathered. Select "Bug Report" as the
            category and include reproduction steps.
          </StepCard>
          <StepCard number={4} title="Follow up">
            Watch your email for updates. Our team may reach out for additional information or
            clarification.
          </StepCard>
          <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5" />
              Tips for great bug reports
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Be specific: "Crashes when clicking X" is better than "Doesn't work"</li>
              <li>• Include error messages exactly as they appear</li>
              <li>• Mention if the bug is reproducible every time or intermittent</li>
              <li>• Attach logs and screenshots whenever possible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureRequestGuide() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50 devhub-card-hover">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-chart-3" />
            </div>
            <CardTitle className="text-lg">Feature Request Guide</CardTitle>
          </div>
          <CardDescription>Help shape the future of Vision Projector</CardDescription>
        </CardHeader>
        <CardContent>
          <StepCard number={1} title="Search existing requests">
            Check our roadmap and GitHub issues to see if your feature has already been requested or
            is in development.
          </StepCard>
          <StepCard number={2} title="Describe the problem">
            Explain what problem you're trying to solve or what gap you've identified. A clear
            problem statement helps us understand the need.
          </StepCard>
          <StepCard number={3} title="Describe your proposed solution">
            Explain how you envision the feature working. Include mockups, examples from other apps,
            or detailed descriptions.
          </StepCard>
          <StepCard number={4} title="Submit through the contact form">
            Select "Feature Request" as the category and include all the details from the steps
            above.
          </StepCard>
          <div className="mt-4 p-4 rounded-xl bg-chart-3/5 border border-chart-3/10">
            <p className="text-xs font-semibold text-chart-3 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5" />
              Tips for effective feature requests
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Focus on the problem, not just the solution</li>
              <li>• Explain how it benefits the broader community</li>
              <li>• Keep it focused — one feature per request</li>
              <li>• Be open to alternative implementations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/40">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunityLinksSection() {
  const { ref, visible } = useScrollReveal({ threshold: 0.05 });
  return (
    <div ref={ref} className={cn("devhub-reveal", visible && "visible")}>
      <Card className="devhub-glass-strong border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Join Our Community
          </CardTitle>
          <CardDescription>Connect with the Vision Projector community</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COMMUNITY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="devhub-glass devhub-card-hover border-border/50 group cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${link.color} bg-current/10`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold mb-1">{link.label}</p>
                    <div className="text-[10px] text-muted-foreground/70">Visit &rarr;</div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="devhub-hero-gradient absolute inset-0" />
        <Particles />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-24">
          <div className="devhub-float inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 shadow-lg shadow-primary/5">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="devhub-gradient-text text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Have a question, bug report, or feature idea? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Get In Touch"
            subtitle="Reach out and we'll respond as quickly as possible."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="space-y-8">
              <ContactInfoSection />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Reporting & Requests"
            subtitle="Follow these guides to help us help you better."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BugReportingGuide />
            <FeatureRequestGuide />
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="FAQ" subtitle="Find answers to common questions." />
          <FAQSection />
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Community"
            subtitle="Join the conversation on your favorite platform."
          />
          <CommunityLinksSection />
        </div>
      </section>
    </div>
  );
}
