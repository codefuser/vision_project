import { memo, useState, useEffect } from "react";
import { useAuthStore } from "../auth.store";
import { VersoLynLogo } from "@/components/ui/VersoLynLogo";
import {
  Church,
  MapPin,
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  CheckCircle2,
  KeyRound,
  RotateCw,
  Edit2,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Music,
  MonitorPlay,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Cloud,
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
  "Tiruppur",
  "Sivaganga",
  "Tenkasi",
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Bilingual Scripture Engine",
    desc: "31,102 verses in Tamil (BSI) & English (KJV/NIV/ESV) with split-pane projection.",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Music,
    title: "Tanglish Song Engine",
    desc: "17,000+ Tamil Christian songs with phonetic search, transpose, and quick lyrics.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: MonitorPlay,
    title: "Dual-Screen 4K Projection",
    desc: "Zero-latency output to sanctuary projectors and broadcast lower-thirds.",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: QrCode,
    title: "Mobile Remote & Live QR",
    desc: "Stage control for pastors and real-time live lyrics for congregations.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
];

export const AuthScreen = memo(function AuthScreen() {
  const {
    modalTab,
    setModalTab,
    profile,
    isLoading,
    error,
    pendingVerificationEmail,
    signUpWithChurch,
    verifyEmailOtp,
    resendVerificationCode,
    signIn,
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Form State
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

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
      toast.error("Please enter the 6-digit verification code sent to your email.");
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

  return (
    <div className="relative min-h-screen w-full bg-[#080c16] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Top Branding Navigation Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 border border-blue-500/30">
            <VersoLynLogo className="h-full w-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">VersoLyn</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Church Presentation Software
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Offline-First Scripture & Worship Projection Console</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            100% Offline Ready
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5 text-blue-400" />
            Cloud Synced
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            Verified Registry
          </span>
        </div>
      </header>

      {/* Main Center Area: Split Presentation Showcase + Auth Console */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Software Showcase & Ministry Benefits (7 cols on large) */}
          <div className="lg:col-span-6 space-y-6 lg:pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                Designed Specifically for Church Media Teams
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Empower Your Sanctuary with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                  VersoLyn
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
                Seamless worship projection with Tamil & English Scriptures, 17,000+ Tanglish songs, instant dual-screen 4K output, and real-time congregation live streaming.
              </p>
            </div>

            {/* 4 Key Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 backdrop-blur-md shadow-xs group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-xl shrink-0 border", feat.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h2 className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                          {feat.title}
                        </h2>
                        <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Proof Note */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 flex items-center gap-3.5 backdrop-blur-md">
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white border-2 border-slate-950">
                  ⛪
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white border-2 border-slate-950">
                  ✝️
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white border-2 border-slate-950">
                  📖
                </span>
              </div>
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Register your church once</span> to unlock automatic cloud synchronization, custom themes, and activity logging.
              </div>
            </div>
          </div>

          {/* Right Column: Presentation Auth Console Card (6 cols on large) */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto">
            <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-slate-700/70 shadow-2xl shadow-black/80 overflow-hidden">
              {/* Card Top Header Banner */}
              <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-md">
                    <Church className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                      VersoLyn Church Network
                    </h3>
                    <p className="text-xs text-blue-100/90 mt-0.5">
                      {modalTab === "register"
                        ? "Register your church to open the presentation console."
                        : modalTab === "login"
                          ? "Sign in with your verified church account."
                          : "Enter 6-digit verification code sent to your inbox."}
                    </p>
                  </div>
                </div>

                {/* Pill Switcher */}
                <div className="flex items-center gap-1.5 mt-4 p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/15 w-fit">
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
                </div>
              </div>

              {/* Card Body Forms */}
              <div className="p-6 sm:p-7 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="mb-4 rounded-xl bg-destructive/15 border border-destructive/30 p-3.5 text-xs text-red-300 flex items-center gap-2">
                    <span className="font-bold text-red-400">Notice:</span> {error}
                  </div>
                )}

                {/* TAB 1: REGISTER CHURCH */}
                {modalTab === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-3 text-xs text-blue-200 flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>
                        Please provide your real church email. A 6-digit confirmation code will be sent to verify your inbox.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Church Name */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Church className="h-3.5 w-3.5 text-blue-400" />
                          Church Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={churchName}
                          onChange={(e) => setChurchName(e.target.value)}
                          placeholder="e.g. St. Paul's Church / Grace Fellowship"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* City / Location */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-blue-400" />
                          City / District <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          list="tn-districts-list"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Chennai, Tirunelveli"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <datalist id="tn-districts-list">
                          {TAMIL_NADU_DISTRICTS.map((d) => (
                            <option key={d} value={d} />
                          ))}
                        </datalist>
                      </div>

                      {/* State */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          State / Region
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Tamil Nadu"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Pastor Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-blue-400" />
                          Pastor / Senior Leader
                        </label>
                        <input
                          type="text"
                          value={pastorName}
                          onChange={(e) => setPastorName(e.target.value)}
                          placeholder="e.g. Rev. John Samuel"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Operator Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-blue-400" />
                          Media Operator Name
                        </label>
                        <input
                          type="text"
                          value={operatorName}
                          onChange={(e) => setOperatorName(e.target.value)}
                          placeholder="Your name"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      {/* Real Email */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-blue-400" />
                          Official Church / Personal Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. churchoffice@gmail.com"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <p className="text-[11px] text-slate-400">
                          We send the 6-digit confirmation code and important software updates to this address. Fake/dummy emails will not receive the code.
                        </p>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-blue-400" />
                          Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Contact Phone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-blue-400" />
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs text-slate-300 font-medium">
                        Remember me on this machine (Auto-login on future visits)
                      </span>
                    </label>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        {isLoading ? "Sending Verification Code..." : "Register Church & Verify Email"}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 text-center pt-2">
                      Already registered previously?{" "}
                      <button
                        type="button"
                        onClick={() => setModalTab("login")}
                        className="text-blue-400 hover:text-blue-300 font-bold hover:underline cursor-pointer"
                      >
                        Sign In with Password
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: VERIFY OTP (EMAIL CONFIRMATION) */}
                {modalTab === "verify_otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center space-y-2.5">
                      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                        <KeyRound className="h-6 w-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">
                        Verify Your Church Email Address
                      </h3>
                      <p className="text-xs text-slate-300">
                        We sent a 6-digit confirmation code to:
                        <br />
                        <span className="font-bold text-amber-300 text-sm tracking-wide">
                          {pendingVerificationEmail}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-200 block text-center">
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
                        className="w-full h-14 text-center tracking-[0.5em] text-3xl font-mono font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition shadow-inner"
                      />
                      <p className="text-[11px] text-slate-400 text-center">
                        Please check your inbox or Spam/Junk folder if not seen immediately.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.trim().length < 6}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      {isLoading ? "Verifying..." : "Verify Code & Open VersoLyn"}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setModalTab("register")}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-medium cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        Change Email
                      </button>

                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold disabled:opacity-50 cursor-pointer"
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
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-blue-400" />
                          Registered Church Email
                        </label>
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="churchoffice@gmail.com"
                          className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-blue-400" />
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className="text-xs text-slate-300 font-medium">
                          Remember me on this machine (Auto-login enabled)
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-150 disabled:opacity-50 cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4" />
                      {isLoading ? "Signing In..." : "Sign In & Enter VersoLyn"}
                    </button>

                    <div className="text-xs text-slate-400 text-center pt-2">
                      First time using VersoLyn?{" "}
                      <button
                        type="button"
                        onClick={() => setModalTab("register")}
                        className="text-blue-400 hover:text-blue-300 font-bold hover:underline cursor-pointer"
                      >
                        Register your church now
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span>VersoLyn v1.0.0</span>
          <span>•</span>
          <span>High-Performance Dual-Display Presentation Platform</span>
        </div>
        <div className="text-slate-500">
          Tamil BSI Scripture • Tanglish Song Engine • 4K Stage Projection
        </div>
      </footer>
    </div>
  );
});
