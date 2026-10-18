import { memo, useState, useEffect } from "react";
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
  KeyRound,
  RotateCw,
  Edit2,
  Check,
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
    pendingVerificationEmail,
    signUpWithChurch,
    verifyEmailOtp,
    resendVerificationCode,
    signIn,
    signOut,
    isAuthenticated,
  } = useAuthStore();

  const isGatekeeper = !isAuthenticated();

  // Registration Form State
  const [churchName, setChurchName] = useState(profile?.church_name || "");
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "Tamil Nadu");
  const [pastorName, setPastorName] = useState("");
  const [operatorName, setOperatorName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Form State
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchName.trim() || !city.trim() || !email.trim() || !password) {
      toast.error("Please fill in Church Name, City, Email, and Password.");
      return;
    }

    const res = await signUpWithChurch({
      churchName: churchName.trim(),
      city: city.trim(),
      state: state.trim(),
      pastorName: pastorName.trim(),
      operatorName: operatorName.trim() || "Media Operator",
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      rememberMe,
    });

    if (res.success) {
      toast.success(res.message);
      if (res.needsOtp) {
        setResendCooldown(60);
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      toast.error("Please enter the 6-digit verification code from your email.");
      return;
    }

    const res = await verifyEmailOtp(otpCode.trim());
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const res = await resendVerificationCode();
    if (res.success) {
      toast.success(res.message);
      setResendCooldown(60);
    } else {
      toast.error(res.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    const res = await signIn({
      email: loginEmail.trim().toLowerCase(),
      password: loginPassword,
      rememberMe,
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const stats = presenceTracker.getStatsSummary();

  return (
    <Dialog
      open={isAuthModalOpen}
      onOpenChange={(open) => {
        // Prevent closing if user is not yet authenticated (mandatory gatekeeper)
        if (!open && !isGatekeeper) {
          closeAuthModal();
        }
      }}
    >
      <DialogContent
        hideCloseButton={isGatekeeper}
        className="sm:max-w-xl p-0 overflow-hidden bg-card/95 backdrop-blur-2xl border-border/70 shadow-2xl"
        onPointerDownOutside={(e) => {
          if (isGatekeeper) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isGatekeeper) e.preventDefault();
        }}
      >
        {/* Modal Top Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 px-6 py-5 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
              <Church className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VersoLyn Church Network
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-white">
                  Verified Cloud
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100/90 mt-0.5">
                {isGatekeeper
                  ? "Welcome to VersoLyn. Please register your church to access the presentation workspace."
                  : "Church profile, cloud synchronization & activity telemetry."}
              </DialogDescription>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-1.5 mt-4 p-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 w-fit">
            <button
              type="button"
              onClick={() => setModalTab("register")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer",
                modalTab === "register"
                  ? "bg-white text-blue-950 font-bold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Register Church
            </button>
            <button
              type="button"
              onClick={() => setModalTab("login")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer",
                modalTab === "login"
                  ? "bg-white text-blue-950 font-bold shadow-xs"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )}
            >
              Sign In
            </button>
            {modalTab === "verify_otp" && (
              <button
                type="button"
                onClick={() => setModalTab("verify_otp")}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-blue-950 shadow-xs cursor-pointer flex items-center gap-1"
              >
                <KeyRound className="h-3 w-3" />
                Verify Email
              </button>
            )}
            {!isGatekeeper && (profile || user) && (
              <button
                type="button"
                onClick={() => setModalTab("profile")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer",
                  modalTab === "profile"
                    ? "bg-white text-blue-950 font-bold shadow-xs"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                )}
              >
                Church Profile
              </button>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-xl bg-destructive/15 border border-destructive/30 p-3.5 text-xs text-destructive flex items-center gap-2">
              <span className="font-bold">Notice:</span> {error}
            </div>
          )}

          {/* TAB 1: REGISTER CHURCH */}
          {modalTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  Please enter your real church email. A 6-digit confirmation code will be sent to verify your church account.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Church Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Church className="h-3.5 w-3.5 text-blue-500" />
                    Church Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. St. Paul's Church / Grace Fellowship"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    City / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="tamilnadu-districts"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chennai, Tirunelveli"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <datalist id="tamilnadu-districts">
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Pastor Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    Pastor / Senior Leader
                  </label>
                  <input
                    type="text"
                    value={pastorName}
                    onChange={(e) => setPastorName(e.target.value)}
                    placeholder="e.g. Rev. John Samuel"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    Media Operator Name
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Real Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Official / Personal Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. churchoffice@gmail.com"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <p className="text-[11px] text-muted-foreground/80">
                    We send verification codes and feature updates to this address. Fake/dummy emails will not pass verification.
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-500" />
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-9 rounded-lg border border-input bg-background/80 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-foreground font-medium">
                  Remember me on this machine (Auto-login on future visits)
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Sending Verification Code..." : "Register Church & Verify Email"}
                </button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-1">
                Already registered previously?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("login")}
                  className="text-blue-500 hover:underline font-bold cursor-pointer"
                >
                  Sign In with Password
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: VERIFY OTP (EMAIL CONFIRMATION) */}
          {modalTab === "verify_otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-2">
                <div className="flex h-11 w-11 mx-auto items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Verify Your Church Email Address
                </h3>
                <p className="text-xs text-muted-foreground">
                  We sent a 6-digit verification code to:
                  <br />
                  <span className="font-bold text-foreground text-sm">
                    {pendingVerificationEmail}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block text-center">
                  Enter 6-Digit Verification Code:
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full h-12 text-center tracking-[0.5em] text-2xl font-mono font-bold rounded-xl border border-input bg-background/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                />
                <p className="text-[11px] text-muted-foreground text-center">
                  Tip: Please check your inbox and Spam/Junk folder if not seen immediately.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.trim().length < 6}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Verifying..." : "Verify Code & Enter VersoLyn"}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-blue-500 hover:underline font-bold disabled:opacity-50 cursor-pointer"
                >
                  <RotateCw className="h-3 w-3" />
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Code"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SIGN IN */}
          {modalTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-500" />
                    Registered Church Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="churchoffice@gmail.com"
                    className="w-full h-10 rounded-xl border border-input bg-background/80 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-500" />
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 rounded-xl border border-input bg-background/80 px-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-input text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs text-foreground font-medium">
                    Remember me on this machine (Auto-login enabled)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading ? "Signing In..." : "Sign In & Enter VersoLyn"}
              </button>

              <div className="text-xs text-muted-foreground text-center pt-1">
                First time using VersoLyn?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-blue-500 hover:underline font-bold cursor-pointer"
                >
                  Register your church now
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CHURCH PROFILE & USAGE TELEMETRY */}
          {modalTab === "profile" && profile && (
            <div className="space-y-5">
              {/* Church Card */}
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3 shadow-xs">
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
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified & Active
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/50">
                  <div>
                    <span className="text-muted-foreground/70">Operator: </span>
                    <span className="font-semibold text-foreground">{profile.full_name}</span>
                  </div>
                  {profile.email && (
                    <div className="truncate">
                      <span className="text-muted-foreground/70">Email: </span>
                      <span className="font-semibold text-foreground">{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage & Session Analytics Card */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  Church Activity & Telemetry
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-border/60 bg-background/80 p-3 text-center shadow-xs">
                    <Calendar className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                    <div className="text-xl font-bold text-foreground">{stats.totalDays}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Days Active</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/80 p-3 text-center shadow-xs">
                    <Clock className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                    <div className="text-xl font-bold text-foreground">{stats.totalHours}h</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Screen Time</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/80 p-3 text-center shadow-xs">
                    <Layers className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
                    <div className="text-xl font-bold text-foreground">{stats.totalSessions}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Services Run</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-xs text-blue-500 hover:underline font-semibold cursor-pointer"
                >
                  Edit Church Details
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      closeAuthModal();
                      await signOut();
                      toast.info("Signed out from church account");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-destructive hover:bg-destructive/10 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs cursor-pointer"
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
