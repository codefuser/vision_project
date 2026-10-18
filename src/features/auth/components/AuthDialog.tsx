import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthStore } from "../auth.store";
import { presenceTracker } from "../services/presence";
import {
  Church,
  MapPin,
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  CheckCircle2,
  LogOut,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TAMIL_NADU_DISTRICTS = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Erode",
  "Vellore",
  "Thoothukudi",
  "Dindigul",
  "Thanjavur",
  "Ranipet",
  "Virudhunagar",
  "Karur",
  "Namakkal",
  "Kanyakumari",
  "Kanchipuram",
  "Cuddalore",
  "Tiruvallur",
  "Krishnagiri",
];

export const AuthDialog = memo(function AuthDialog() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalTab,
    setModalTab,
    profile,
    user,
    isLoading,
    error,
    signUpWithChurch,
    signIn,
    quickRegister,
    signOut,
    updateChurchProfile,
  } = useAuthStore();

  // Registration Form State
  const [churchName, setChurchName] = useState(profile?.church_name || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "Tamil Nadu");
  const [pastorName, setPastorName] = useState("");
  const [operatorName, setOperatorName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(profile?.phone || "");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchName.trim() || !city.trim()) {
      toast.error("Please enter Church Name and City/Location");
      return;
    }

    if (email && password) {
      // Full cloud account signup
      const res = await signUpWithChurch({
        churchName: churchName.trim(),
        city: city.trim(),
        state: state.trim(),
        pastorName: pastorName.trim(),
        operatorName: operatorName.trim() || "Media Operator",
        email: email.trim(),
        password,
        phone: phone.trim(),
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } else {
      // Quick offline-first registration
      const res = await quickRegister({
        churchName: churchName.trim(),
        city: city.trim(),
        state: state.trim(),
        pastorName: pastorName.trim(),
        operatorName: operatorName.trim() || "Media Operator",
        email: email.trim() || "church@local.app",
        phone: phone.trim(),
      });

      if (res.success) {
        toast.success(res.message);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    const res = await signIn({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const stats = presenceTracker.getStatsSummary();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/60 shadow-2xl">
        {/* Modal Top Decorative Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
              <Church className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VersoLyn Church Network
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-white">
                  Cloud Synced
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100/80 mt-0.5">
                Register your church and location to enable synchronized worship presentations & service logs.
              </DialogDescription>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-1.5 mt-4 p-1 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 w-fit">
            <button
              type="button"
              onClick={() => setModalTab("register")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition",
                modalTab === "register"
                  ? "bg-white text-blue-900 font-semibold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Register Church
            </button>
            <button
              type="button"
              onClick={() => setModalTab("login")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition",
                modalTab === "login"
                  ? "bg-white text-blue-900 font-semibold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Sign In
            </button>
            {(profile || user) && (
              <button
                type="button"
                onClick={() => setModalTab("profile")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition",
                  modalTab === "profile"
                    ? "bg-white text-blue-900 font-semibold shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                Church Profile
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive flex items-center gap-2">
              <span className="font-semibold">Notice:</span> {error}
            </div>
          )}

          {/* TAB 1: REGISTER CHURCH */}
          {modalTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Church Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Church className="h-3.5 w-3.5 text-blue-500" />
                    Church Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. Grace Fellowship Church / St. Paul's"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    City / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="district-list"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chennai, Madurai"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <datalist id="district-list">
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Pastor / In-Charge Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    Pastor / Leader Name
                  </label>
                  <input
                    type="text"
                    value={pastorName}
                    onChange={(e) => setPastorName(e.target.value)}
                    placeholder="e.g. Rev. John Samuel"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    Media Operator Name
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Email (Cloud Login)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="church@gmail.com"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-500" />
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-9 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Register Church & Connect"}
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="w-full sm:w-auto h-10 px-4 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground text-sm font-medium transition cursor-pointer"
                >
                  Later
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground text-center pt-1">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("login")}
                  className="text-blue-500 hover:underline font-semibold cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN IN */}
          {modalTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="church@gmail.com"
                    className="w-full h-10 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 rounded-lg border border-input bg-background/60 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading ? "Signing In..." : "Sign In to Church Account"}
              </button>

              <div className="text-[11px] text-muted-foreground text-center pt-1">
                New church?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-blue-500 hover:underline font-semibold cursor-pointer"
                >
                  Register your church now
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CHURCH PROFILE & USAGE STATS */}
          {modalTab === "profile" && profile && (
            <div className="space-y-5">
              {/* Church Info Card */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Church className="h-4 w-4 text-blue-500" />
                      {profile.church_name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground/70" />
                      {profile.city}{profile.state ? `, ${profile.state}` : ""}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                  <div>
                    <span className="text-muted-foreground/70">Operator: </span>
                    <span className="font-medium text-foreground">{profile.full_name}</span>
                  </div>
                  {profile.email && (
                    <div className="truncate">
                      <span className="text-muted-foreground/70">Email: </span>
                      <span className="font-medium text-foreground">{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage & Session Analytics Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  Activity & Presence Telemetry
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-lg border border-border/50 bg-background/60 p-3 text-center">
                    <Calendar className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                    <div className="text-lg font-bold text-foreground">{stats.totalDays}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Days Active</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/60 p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                    <div className="text-lg font-bold text-foreground">{stats.totalHours}h</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Screen Time</div>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-background/60 p-3 text-center">
                    <Layers className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
                    <div className="text-lg font-bold text-foreground">{stats.totalSessions}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Services Run</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-xs text-blue-500 hover:underline font-medium cursor-pointer"
                >
                  Edit Church Details
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      toast.info("Signed out from church profile");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
