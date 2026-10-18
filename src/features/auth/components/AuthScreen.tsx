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
  KeyRound,
  RotateCw,
  Edit2,
  Check,
  Eye,
  EyeOff,
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
  "Tiruppur",
  "Sivaganga",
  "Tenkasi",
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

  // Determine current active tab
  const currentTab = modalTab === "verify_otp" ? "verify_otp" : modalTab === "register" ? "register" : "login";

  return (
    <div className="min-h-screen w-full bg-[#090d16] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-8 select-none relative overflow-x-hidden">
      {/* Subtle formal ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center z-10 my-auto py-6">
        {/* Formal Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 space-y-2">
          <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/15 border border-slate-700/80 bg-slate-900 p-1">
            <VersoLynLogo className="h-full w-full" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              VersoLyn
            </h1>
            <p className="text-xs font-medium text-slate-400 tracking-wide mt-0.5">
              Church Presentation Software
            </p>
          </div>
        </div>

        {/* Central Formal Card */}
        <div
          className={cn(
            "w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/60 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 ease-in-out",
            currentTab === "register" ? "max-w-xl" : "max-w-md",
          )}
        >
          {/* Smooth Segmented Tab Switcher */}
          <div className="relative mb-6 p-1 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center">
            {/* Sliding Tab Buttons */}
            <button
              type="button"
              onClick={() => setModalTab("login")}
              className={cn(
                "relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer text-center",
                currentTab === "login"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setModalTab("register")}
              className={cn(
                "relative z-10 flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer text-center",
                currentTab === "register"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40",
              )}
            >
              Register Church
            </button>
            {currentTab === "verify_otp" && (
              <button
                type="button"
                onClick={() => setModalTab("verify_otp")}
                className="relative z-10 flex-1 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Verify Email
              </button>
            )}
          </div>

          {/* Inline Error Notice */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/25 p-3 text-xs text-red-300 flex items-center gap-2">
              <span className="font-bold text-red-400">Notice:</span> {error}
            </div>
          )}

          {/* TAB 1: SIGN IN (Formal & Fast) */}
          {currentTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="space-y-3.5">
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
                    placeholder="name@church.org"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
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
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-300">
                      Remember this device
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
              >
                <ArrowRight className="h-4 w-4" />
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800/80">
                New church?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  Register Church
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER CHURCH (Formal & Clean) */}
          {currentTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Church Name */}
                <div className="space-y-1.5 sm:col-span-2">
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
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* City / District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
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
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <datalist id="tn-districts-list">
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Tamil Nadu"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Pastor / Leader Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Pastor / Senior Leader
                  </label>
                  <input
                    type="text"
                    value={pastorName}
                    onChange={(e) => setPastorName(e.target.value)}
                    placeholder="e.g. Rev. John Samuel"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Media Operator Name
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Official Church Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-400" />
                    Official / Personal Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="churchoffice@gmail.com"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>Real email required. A 6-digit confirmation code will be sent to your inbox.</span>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
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
                      className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-xs text-slate-300">
                  Remember this device (Auto-login on future visits)
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  {isLoading ? "Sending Verification Code..." : "Register Church & Verify Email"}
                </button>
              </div>

              <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800/80">
                Already registered previously?{" "}
                <button
                  type="button"
                  onClick={() => setModalTab("login")}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: VERIFY OTP (Formal & Clean) */}
          {currentTab === "verify_otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in-50 duration-200">
              <div className="text-center space-y-2">
                <div className="flex h-11 w-11 mx-auto items-center justify-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">
                  Enter Verification Code
                </h3>
                <p className="text-xs text-slate-400">
                  We sent a 6-digit confirmation code to:
                  <br />
                  <span className="font-semibold text-slate-200 tracking-wide">
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
                  className="w-full h-13 text-center tracking-[0.5em] text-2xl font-mono font-bold rounded-xl border border-slate-700 bg-slate-950/70 text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                />
                <p className="text-[11px] text-slate-500 text-center">
                  Check your inbox or Spam folder if not received.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.trim().length < 6}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isLoading ? "Verifying..." : "Verify Code & Enter VersoLyn"}
              </button>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setModalTab("register")}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <RotateCw className="h-3 w-3" />
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Formal Minimal Footer */}
      <footer className="relative z-10 w-full text-center text-xs text-slate-500 py-3">
        VersoLyn Church Presentation Software • Secure Local & Cloud Platform
      </footer>
    </div>
  );
});
