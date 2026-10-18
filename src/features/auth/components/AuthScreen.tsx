import { memo, useState, useEffect, useMemo, useRef } from "react";
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
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Comprehensive States and their districts
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
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Hooghly"],
};

const ALL_STATES = Object.keys(STATES_AND_DISTRICTS);

// ── Searchable & Typeable Autocomplete Combobox Component ──
interface SearchableComboboxProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}

const SearchableCombobox = memo(function SearchableCombobox({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  required,
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on typed input
  const filteredOptions = useMemo(() => {
    if (!value.trim()) return options;
    const q = value.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, value]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative space-y-1">
      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 text-blue-400" />
          {label} {required && <span className="text-red-400">*</span>}
        </span>
        <span className="text-[10px] text-slate-500 font-normal">Type or pick</span>
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          required={required}
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 pr-14 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
        />

        <div className="absolute right-1.5 flex items-center gap-0.5">
          {value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                onChange("");
                setIsOpen(true);
              }}
              className="p-1 text-slate-500 hover:text-slate-300 transition cursor-pointer rounded-md"
              title="Clear"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-200 transition cursor-pointer rounded-md"
            title="Toggle suggestions"
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Suggestions Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-1 divide-y divide-slate-800/60 backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = opt.toLowerCase() === value.trim().toLowerCase();
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs rounded-lg transition flex items-center justify-between cursor-pointer",
                    isSelected
                      ? "bg-blue-600/30 text-blue-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="p-2.5 text-center text-xs text-slate-400 space-y-1">
              <div className="text-[11px] text-slate-400">
                Not found in list? No problem:
              </div>
              <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 truncate">
                Will use "{value}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

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
  const [city, setCity] = useState(profile?.city || "Chennai");
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

  // Transfer Animation State: isRegister determines position of sliding overlay
  const isRegister = modalTab === "register";
  const isOtp = modalTab === "verify_otp";

  // Available districts dynamically determined based on selected/typed state
  const availableDistricts = useMemo(() => {
    // Check if the typed state matches any known state in our dictionary
    const matchKey = Object.keys(STATES_AND_DISTRICTS).find(
      (s) => s.toLowerCase() === state.trim().toLowerCase(),
    );
    if (matchKey) {
      return STATES_AND_DISTRICTS[matchKey];
    }
    // Default fallback to Tamil Nadu districts if nothing typed
    return STATES_AND_DISTRICTS["Tamil Nadu"];
  }, [state]);

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
      toast.error("Please fill in Church Name, Location, Email, and Password.");
      return;
    }

    const res = await signUpWithChurch({
      churchName: churchName.trim(),
      city: city.trim(),
      state: state.trim() || "Tamil Nadu",
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
    <div className="min-h-screen w-full bg-[#080b13] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-10 select-none relative overflow-x-hidden">
      {/* ── Dynamic Ambient Background Lighting ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[350px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[350px] rounded-full bg-blue-500/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      {/* ── Top Minimal Branding Header ── */}
      <header className="relative z-10 w-full flex items-center justify-center gap-2.5 pt-2 pb-4">
        <div className="h-8 w-8 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 p-1 shadow-md">
          <VersoLynLogo className="h-full w-full" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-white">VersoLyn</span>
        <span className="text-slate-600">•</span>
        <span className="text-xs font-semibold text-slate-400">Church Presentation Platform</span>
      </header>

      {/* ── Main Dual-Panel Sliding Transfer Console Card ── */}
      <main className="w-full flex-1 flex items-center justify-center z-10 my-auto py-2">
        {/* If OTP Verification Mode is active */}
        {isOtp ? (
          <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-2xl backdrop-blur-2xl p-7 sm:p-9 animate-in fade-in-0 zoom-in-95 duration-300">
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-2.5">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur-md animate-pulse" />
                  <div className="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-md">
                    <KeyRound className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Verify Church Email
                </h3>
                <p className="text-xs text-slate-400">
                  We've sent a 6-digit confirmation code to:
                  <br />
                  <span className="font-bold text-amber-300 text-sm tracking-wide">
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
                  className="w-full h-14 text-center tracking-[0.45em] text-3xl font-mono font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:outline-hidden focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
                />
                <p className="text-[11px] text-slate-500 text-center">
                  Please check your inbox or Spam folder if not received.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.trim().length < 6}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Verifying..." : "Verify Code & Enter VersoLyn"}
              </button>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
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
          </div>
        ) : (
          /* Dual-Panel Sliding Transfer Box */
          <div className="w-full max-w-4xl relative overflow-hidden rounded-3xl bg-slate-900/85 border border-slate-700/70 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(59,130,246,0.18)] backdrop-blur-2xl min-h-[610px] flex">
            {/* ── LEFT HALF: SIGN IN FORM CONTAINER ── */}
            <div
              className={cn(
                "w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-all duration-700 ease-in-out z-10",
                isRegister
                  ? "opacity-0 pointer-events-none md:translate-x-[-20%] absolute inset-0 md:static"
                  : "opacity-100 pointer-events-auto translate-x-0 relative",
              )}
            >
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Sign In
                </h2>
                <p className="text-xs text-slate-400">
                  Welcome back to VersoLyn Church Console.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-300 flex items-center gap-2">
                  <span className="font-bold text-red-400">Notice:</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Church / Operator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="churchoffice@gmail.com"
                    className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4 transition"
                    />
                    <span className="text-xs text-slate-300 font-medium">
                      Remember this device
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  {isLoading ? "Signing In..." : "Sign In & Enter"}
                </button>

                {/* Mobile switch toggle visible only on small screens */}
                <div className="md:hidden text-xs text-slate-400 text-center pt-3 border-t border-slate-800">
                  New church?{" "}
                  <button
                    type="button"
                    onClick={() => setModalTab("register")}
                    className="text-blue-400 font-bold hover:underline"
                  >
                    Register Church
                  </button>
                </div>
              </form>
            </div>

            {/* ── RIGHT HALF: REGISTER CHURCH FORM CONTAINER ── */}
            <div
              className={cn(
                "w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center transition-all duration-700 ease-in-out z-10 max-h-[640px] overflow-y-auto",
                !isRegister
                  ? "opacity-0 pointer-events-none md:translate-x-[20%] absolute inset-0 md:static"
                  : "opacity-100 pointer-events-auto translate-x-0 relative",
              )}
            >
              <div className="space-y-1 mb-4">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Register Church
                </h2>
                <p className="text-xs text-slate-400">
                  Create verified profile for your assembly.
                </p>
              </div>

              {error && (
                <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/25 p-2.5 text-xs text-red-300 flex items-center gap-2">
                  <span className="font-bold text-red-400">Notice:</span> {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                {/* Church Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Church className="h-3.5 w-3.5 text-blue-400" />
                    Church Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. Grace Fellowship / St. Paul's Church"
                    className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-inner"
                  />
                </div>

                {/* 1. STATE & 2. DISTRICT: TYPEABLE & SEARCHABLE AUTOCOMPLETE COMBOBOXES */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Searchable & Typeable State */}
                  <SearchableCombobox
                    label="State"
                    icon={MapPin}
                    required
                    value={state}
                    onChange={(val) => setState(val)}
                    options={ALL_STATES}
                    placeholder="Type or pick state..."
                  />

                  {/* Searchable & Typeable District */}
                  <SearchableCombobox
                    label="District / City"
                    icon={Navigation}
                    required
                    value={city}
                    onChange={(val) => setCity(val)}
                    options={availableDistricts}
                    placeholder="Type or pick district..."
                  />
                </div>

                {/* Pastor & Operator Names */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Pastor / Leader</label>
                    <input
                      type="text"
                      value={pastorName}
                      onChange={(e) => setPastorName(e.target.value)}
                      placeholder="Rev. John Samuel"
                      className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Operator</label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="Operator Name"
                      className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
                    />
                  </div>
                </div>

                {/* Real Official Church Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Official Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="churchoffice@gmail.com"
                    className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
                  />
                  <span className="text-[10px] text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    6-digit verification code will be sent to this email.
                  </span>
                </div>

                {/* Password & Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
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
                        placeholder="Min 6 chars"
                        className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 pr-8 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-blue-400" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full h-9 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition shadow-inner"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 transition"
                  />
                  <span className="text-[11px] text-slate-300">Remember this device</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isLoading ? "Sending Code..." : "Register & Verify"}
                </button>

                {/* Mobile switch toggle */}
                <div className="md:hidden text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setModalTab("login")}
                    className="text-blue-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>

            {/* ── THE SLIDING TRANSFER OVERLAY PANEL (DESKTOP) ── */}
            <div
              className={cn(
                "hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] z-20 shadow-2xl",
                isRegister ? "translate-x-0" : "translate-x-full",
              )}
            >
              {/* Vibrant Gradient Background with Light Burst */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-800 p-10 flex flex-col justify-between items-center text-center text-white overflow-hidden">
                {/* Decorative Glowing Rings */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-950/40 blur-2xl pointer-events-none" />

                {/* State 1: Prompt to Register (Shown when Sign In is active) */}
                <div
                  className={cn(
                    "my-auto space-y-5 transition-all duration-700 ease-in-out max-w-xs",
                    !isRegister
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 -translate-x-12 pointer-events-none absolute",
                  )}
                >
                  <div className="h-16 w-16 mx-auto rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center">
                    <Church className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      Hello, Church!
                    </h3>
                    <p className="text-xs text-blue-100/90 leading-relaxed">
                      Register your assembly once to unlock 17,000+ Tamil worship songs, dual-screen 4K projection, and cloud backups.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTab("register")}
                    className="cursor-pointer border-2 border-white/90 bg-white/10 hover:bg-white text-white hover:text-blue-950 font-bold px-7 py-2.5 rounded-full text-xs transition-all duration-300 shadow-lg hover:shadow-white/20 active:scale-95"
                  >
                    Register Church
                  </button>
                </div>

                {/* State 2: Prompt to Sign In (Shown when Register is active) */}
                <div
                  className={cn(
                    "my-auto space-y-5 transition-all duration-700 ease-in-out max-w-xs",
                    isRegister
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 translate-x-12 pointer-events-none absolute",
                  )}
                >
                  <div className="h-16 w-16 mx-auto rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center">
                    <VersoLynLogo className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      Welcome Back!
                    </h3>
                    <p className="text-xs text-blue-100/90 leading-relaxed">
                      Already have an account? Sign in to access your saved service playlists, Scripture cues, and mobile remote control.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalTab("login")}
                    className="cursor-pointer border-2 border-white/90 bg-white/10 hover:bg-white text-white hover:text-blue-950 font-bold px-7 py-2.5 rounded-full text-xs transition-all duration-300 shadow-lg hover:shadow-white/20 active:scale-95"
                  >
                    Sign In with Password
                  </button>
                </div>

                <div className="text-[11px] text-blue-200/80 font-medium">
                  VersoLyn Presentation System
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="relative z-10 w-full text-center text-xs text-slate-500 py-2">
        VersoLyn Church Presentation Software • Secure Sanctuary Platform
      </footer>
    </div>
  );
});
