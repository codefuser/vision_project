import { memo, useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../auth.store";
import { VersoLynLogo } from "@/components/ui/VersoLynLogo";
import {
  Church,
  MapPin,
  User,
  Mail,
  Lock,
  Phone,
  KeyRound,
  RotateCw,
  Edit2,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Comprehensive State & District dictionary
const STATES_AND_DISTRICTS: Record<string, string[]> = {
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  "Kerala": [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],
  "Karnataka": [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ],
  "Andhra Pradesh": [
    "Ananthapuramu",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Kadapa",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
  ],
  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Karimnagar",
    "Khammam",
    "Mahabubnagar",
    "Medak",
    "Medchal-Malkajgiri",
    "Nalgonda",
    "Nizamabad",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Warangal",
  ],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Maharashtra": [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Kolhapur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nashik",
    "Pune",
    "Thane",
  ],
  "Delhi": [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
  ],
  "Other State": ["Other District"],
};

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
  const [state, setState] = useState(profile?.state || "Tamil Nadu");
  const [customState, setCustomState] = useState("");
  const [city, setCity] = useState(profile?.city || "Chennai");
  const [customCity, setCustomCity] = useState("");
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

  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    return STATES_AND_DISTRICTS[state] || ["Other District"];
  }, [state]);

  // When state changes, reset district to the first available district
  const handleStateChange = (newState: string) => {
    setState(newState);
    const districts = STATES_AND_DISTRICTS[newState];
    if (districts && districts.length > 0) {
      setCity(districts[0]);
    } else {
      setCity("");
    }
  };

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
    const finalState = state === "Other State" ? customState.trim() || "Other" : state;
    const finalCity =
      state === "Other State" || city === "Other District"
        ? customCity.trim() || "Local"
        : city;

    if (!churchName.trim() || !finalCity.trim() || !email.trim() || !password) {
      toast.error("Please fill in Church Name, Location, Email, and Password.");
      return;
    }

    const res = await signUpWithChurch({
      churchName: churchName.trim(),
      city: finalCity.trim(),
      state: finalState.trim(),
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

  const activeTab = modalTab === "verify_otp" ? "verify_otp" : modalTab === "register" ? "register" : "login";

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-10 select-none relative overflow-x-hidden">
      {/* ── Dynamic Ambient Aurora Lighting ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft breathing radial glows */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[650px] h-[400px] rounded-full bg-gradient-to-b from-blue-600/18 via-indigo-600/12 to-transparent blur-[140px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[20%] w-[450px] h-[350px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[15%] w-[400px] h-[350px] rounded-full bg-amber-500/8 blur-[130px]" />

        {/* High-tech fine dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* ── Main Centered Console ── */}
      <div className="w-full flex-1 flex flex-col items-center justify-center z-10 my-auto py-4">
        {/* Brand Emblem & Header */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 opacity-70 blur-md group-hover:opacity-100 transition duration-300" />
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-slate-900 border border-white/15 p-1.5 shadow-2xl flex items-center justify-center">
              <VersoLynLogo className="h-full w-full" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              VersoLyn
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-400">
                Church Presentation Software
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
          </div>
        </div>

        {/* ── Glassmorphism Presentation Console Card ── */}
        <div
          className={cn(
            "w-full rounded-3xl bg-slate-900/80 border border-slate-700/60 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8),0_0_50px_-10px_rgba(59,130,246,0.12)] backdrop-blur-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ease-out",
            activeTab === "register" ? "max-w-xl" : "max-w-md",
          )}
        >
          {/* Subtle Top Specular Light Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          {/* ── Smooth Segmented Switcher Pill ── */}
          <div className="relative mb-6 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center shadow-inner">
            {/* Animated Gliding Background Indicator */}
            <div
              className={cn(
                "absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-600/30 transition-all duration-300 ease-out pointer-events-none",
                activeTab === "login"
                  ? "left-1.5 w-[calc(50%-6px)] translate-x-0"
                  : activeTab === "register"
                    ? "left-1.5 w-[calc(50%-6px)] translate-x-[calc(100%+6px)]"
                    : "left-1.5 w-[calc(100%-12px)] translate-x-0 bg-amber-500 shadow-amber-500/30",
              )}
            />

            {activeTab !== "verify_otp" ? (
              <>
                <button
                  type="button"
                  onClick={() => setModalTab("login")}
                  className={cn(
                    "relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer text-center select-none",
                    activeTab === "login"
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200",
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className={cn(
                    "relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer text-center select-none",
                    activeTab === "register"
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200",
                  )}
                >
                  Register Church
                </button>
              </>
            ) : (
              <div className="relative z-10 flex-1 py-2 text-xs font-extrabold text-slate-950 flex items-center justify-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                Email Verification (6-Digit OTP)
              </div>
            )}
          </div>

          {/* Inline Error Notice */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-300 flex items-center gap-2">
              <span className="font-bold text-red-400">Notice:</span> {error}
            </div>
          )}

          {/* ── TAB 1: SIGN IN ── */}
          {activeTab === "login" && (
            <form
              onSubmit={handleLogin}
              className="space-y-4 animate-in fade-in-0 slide-in-from-left-4 duration-300 ease-out"
            >
              <div className="space-y-3.5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Church / Operator Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="churchoffice@gmail.com"
                      className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-inner"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4 transition"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      Remember this device (Auto-login)
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA Button with Hover Shimmer */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading ? "Signing In..." : "Sign In & Open VersoLyn"}
              </button>

              <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
                New church?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-blue-400 hover:text-blue-300 font-bold hover:underline cursor-pointer"
                >
                  Register Church Now
                </button>
              </div>
            </form>
          )}

          {/* ── TAB 2: REGISTER CHURCH (With Dynamic State & District Dropdowns) ── */}
          {activeTab === "register" && (
            <form
              onSubmit={handleRegister}
              className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300 ease-out"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Church Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Church className="h-3.5 w-3.5 text-blue-400" />
                    Church Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. Grace Fellowship / St. Paul's Church"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-inner"
                  />
                </div>

                {/* 1. STATE DROPDOWN */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />
                    State / Region <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full h-10 appearance-none rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 pr-8 text-sm text-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer shadow-inner"
                    >
                      {Object.keys(STATES_AND_DISTRICTS).map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-100">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* 2. DISTRICT DROPDOWN (Dynamically populated based on State) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5 text-blue-400" />
                    District / City <span className="text-red-400">*</span>
                  </label>
                  {state !== "Other State" ? (
                    <div className="relative">
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 appearance-none rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 pr-8 text-sm text-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer shadow-inner"
                      >
                        {availableDistricts.map((d) => (
                          <option key={d} value={d} className="bg-slate-900 text-slate-100">
                            {d}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      required
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter district / city"
                      className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-inner"
                    />
                  )}
                </div>

                {/* If custom state is chosen */}
                {state === "Other State" && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300">
                      Specify Custom State Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customState}
                      onChange={(e) => setCustomState(e.target.value)}
                      placeholder="e.g. Goa / International"
                      className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                    />
                  </div>
                )}

                {/* Pastor Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Pastor / Senior Leader
                  </label>
                  <input
                    type="text"
                    value={pastorName}
                    onChange={(e) => setPastorName(e.target.value)}
                    placeholder="e.g. Rev. John Samuel"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>

                {/* Media Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Media Operator Name
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>

                {/* Real Official Church Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Official / Personal Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="churchoffice@gmail.com"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-400/90 pt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>Real email required. A 6-digit confirmation code will be sent to your inbox.</span>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4 transition"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Remember this device (Auto-login on future visits)
                </span>
              </label>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Sending Verification Code..." : "Register Church & Verify Email"}
                </button>
              </div>

              <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
                Already registered previously?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("login")}
                  className="text-blue-400 hover:text-blue-300 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ── TAB 3: VERIFY EMAIL (6-Digit OTP) ── */}
          {activeTab === "verify_otp" && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5 animate-in fade-in-0 zoom-in-95 duration-300 ease-out"
            >
              <div className="text-center space-y-2.5">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur-md animate-pulse" />
                  <div className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40">
                    <KeyRound className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">
                  Enter 6-Digit Verification Code
                </h3>
                <p className="text-xs text-slate-400">
                  We sent a confirmation code to your real inbox:
                  <br />
                  <span className="font-bold text-amber-300 tracking-wide">
                    {pendingVerificationEmail}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  maxLength={10}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full h-14 text-center tracking-[0.45em] text-3xl font-mono font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-inner"
                />
                <p className="text-[11px] text-slate-500 text-center">
                  Please check your inbox or Spam folder if not received in a few moments.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.trim().length < 6}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Verifying..." : "Verify Code & Enter VersoLyn"}
              </button>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold disabled:opacity-50 transition cursor-pointer"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : "Resend Code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full text-center text-xs text-slate-500 py-2">
        VersoLyn Presentation Software • Cloud Synchronization & Sanctuary Display
      </footer>
    </div>
  );
});
