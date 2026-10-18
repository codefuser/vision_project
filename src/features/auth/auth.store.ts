import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import { isValidEmail } from "./services/email-validator";
import type { RegisterChurchPayload, LoginPayload, UserProfile } from "./types";
import type { User, Session } from "@supabase/supabase-js";

const LOCAL_STORAGE_PROFILE_KEY = "versolyn_church_profile";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthModalOpen: boolean;
  modalTab: "register" | "login" | "verify_otp" | "profile";
  error: string | null;

  // OTP Verification state
  pendingVerificationEmail: string | null;
  pendingRegistrationData: RegisterChurchPayload | null;

  // Actions
  init: () => Promise<void>;
  openAuthModal: (tab?: "register" | "login" | "verify_otp" | "profile") => void;
  closeAuthModal: () => void;
  setModalTab: (tab: "register" | "login" | "verify_otp" | "profile") => void;
  signUpWithChurch: (payload: RegisterChurchPayload) => Promise<{ success: boolean; needsOtp?: boolean; message: string }>;
  verifyEmailOtp: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: () => Promise<{ success: boolean; message: string }>;
  signIn: (payload: LoginPayload) => Promise<{ success: boolean; needsOtp?: boolean; message: string }>;
  signOut: () => Promise<void>;
  updateChurchProfile: (patch: Partial<UserProfile>) => Promise<void>;
  isAuthenticated: () => boolean;
}

function loadLocalProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalProfile(profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    }
  } catch (err) {
    logger.warn("[Auth] Failed to cache profile locally:", err);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: loadLocalProfile(),
  isLoading: false,
  isInitialized: false,
  isAuthModalOpen: false,
  modalTab: "register",
  error: null,
  pendingVerificationEmail: null,
  pendingRegistrationData: null,

  isAuthenticated: () => {
    return Boolean(get().user || get().profile?.church_name);
  },

  init: async () => {
    if (get().isInitialized) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      let profile = loadLocalProfile();

      if (user) {
        // Fetch profile from Supabase
        try {
          const { data: profileRow } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          if (profileRow) {
            profile = profileRow as UserProfile;
            saveLocalProfile(profile);
          } else if (user.user_metadata) {
            profile = {
              id: user.id,
              full_name: user.user_metadata.full_name || user.email?.split("@")[0] || "Operator",
              email: user.email,
              phone: user.user_metadata.phone,
              church_name: user.user_metadata.church_name || "Independent Assembly",
              city: user.user_metadata.city || "Tamil Nadu",
              state: user.user_metadata.state,
              role: "operator",
            };
            saveLocalProfile(profile);
          }
        } catch (dbErr) {
          logger.warn("[Auth] Profile fetch exception:", dbErr);
        }
      }

      const hasRegistered = Boolean(user || profile?.church_name);

      set({
        user,
        session,
        profile,
        isInitialized: true,
        // If not registered/logged in, immediately open gatekeeper modal
        isAuthModalOpen: !hasRegistered,
        modalTab: "register",
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        const newUser = newSession?.user ?? null;
        if (!newUser) {
          return;
        }

        set({ user: newUser, session: newSession });
      });
    } catch (err) {
      logger.warn("[Auth] Init error:", err);
      const profile = loadLocalProfile();
      set({
        isInitialized: true,
        isAuthModalOpen: !profile?.church_name,
      });
    }
  },

  openAuthModal: (tab) => {
    set({
      isAuthModalOpen: true,
      modalTab: tab || (get().profile || get().user ? "profile" : "register"),
      error: null,
    });
  },

  closeAuthModal: () => {
    // Only allow closing if already registered or logged in
    if (!get().isAuthenticated()) {
      return;
    }
    set({ isAuthModalOpen: false, error: null });
  },

  setModalTab: (modalTab) => {
    set({ modalTab, error: null });
  },

  signUpWithChurch: async (payload: RegisterChurchPayload) => {
    set({ isLoading: true, error: null });

    // 1. Strict Email Format & Disposable Check
    const emailValidation = isValidEmail(payload.email);
    if (!emailValidation.valid) {
      const msg = emailValidation.reason || "Invalid email address.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }

    if (!payload.password || payload.password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        options: {
          data: {
            full_name: payload.operatorName || payload.pastorName || "Media Operator",
            church_name: payload.churchName.trim(),
            city: payload.city.trim(),
            state: payload.state?.trim() || "Tamil Nadu",
            phone: payload.phone?.trim() || "",
            pastor_name: payload.pastorName?.trim() || "",
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, message: error.message };
      }

      set({
        pendingVerificationEmail: payload.email.trim().toLowerCase(),
        pendingRegistrationData: payload,
      });

      // If Supabase immediately issued a session (auto-confirm is ON in Supabase project)
      if (data.session && data.user) {
        const newProfile: UserProfile = {
          id: data.user.id,
          full_name: payload.operatorName || payload.pastorName || "Media Operator",
          email: payload.email.trim(),
          phone: payload.phone?.trim(),
          church_name: payload.churchName.trim(),
          city: payload.city.trim(),
          state: payload.state?.trim(),
          role: "operator",
          created_at: new Date().toISOString(),
        };

        saveLocalProfile(newProfile);
        set({
          user: data.user,
          session: data.session,
          profile: newProfile,
          isLoading: false,
          isAuthModalOpen: false,
          modalTab: "profile",
        });

        return {
          success: true,
          needsOtp: false,
          message: "Church registered and verified successfully! Welcome to VersoLyn.",
        };
      }

      // If email confirmation is required:
      set({
        isLoading: false,
        modalTab: "verify_otp",
      });

      return {
        success: true,
        needsOtp: true,
        message: `Verification code sent to ${payload.email}! Please check your inbox and enter the 6-digit code.`,
      };
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please check details and try again.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  verifyEmailOtp: async (token: string) => {
    const email = get().pendingVerificationEmail;
    if (!email) {
      return { success: false, message: "No email pending verification. Please register again." };
    }

    set({ isLoading: true, error: null });

    try {
      // Try verifyOtp with signup type
      let verifyRes = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: "signup",
      });

      // Fallback to email type if signup type is rejected
      if (verifyRes.error) {
        verifyRes = await supabase.auth.verifyOtp({
          email,
          token: token.trim(),
          type: "email",
        });
      }

      if (verifyRes.error) {
        set({ isLoading: false, error: verifyRes.error.message });
        return { success: false, message: verifyRes.error.message };
      }

      const user = verifyRes.data.user;
      const session = verifyRes.data.session;
      const pendingData = get().pendingRegistrationData;

      const profile: UserProfile = {
        id: user?.id || "local-" + Date.now(),
        full_name: pendingData?.operatorName || pendingData?.pastorName || user?.user_metadata?.full_name || "Media Operator",
        email,
        phone: pendingData?.phone || user?.user_metadata?.phone,
        church_name: pendingData?.churchName || user?.user_metadata?.church_name || "My Church",
        city: pendingData?.city || user?.user_metadata?.city || "Location",
        state: pendingData?.state || user?.user_metadata?.state,
        role: "operator",
        created_at: new Date().toISOString(),
      };

      saveLocalProfile(profile);

      // Upsert into Supabase tables if schema is loaded
      try {
        await supabase.from("churches").insert({
          church_name: profile.church_name,
          city: profile.city,
          state: profile.state,
          pastor_name: pendingData?.pastorName,
          contact_email: email,
          contact_phone: profile.phone,
        });

        if (user?.id) {
          await supabase.from("profiles").upsert({
            id: user.id,
            church_name: profile.church_name,
            city: profile.city,
            state: profile.state,
            full_name: profile.full_name,
            email,
            phone: profile.phone,
            role: "operator",
            last_seen_at: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        logger.info("[Auth] Profile insert synced or pending SQL migration:", dbErr);
      }

      set({
        user,
        session,
        profile,
        isLoading: false,
        isAuthModalOpen: false,
        modalTab: "profile",
        pendingVerificationEmail: null,
        pendingRegistrationData: null,
      });

      return {
        success: true,
        message: `Welcome to VersoLyn, ${profile.church_name}! Your email is confirmed.`,
      };
    } catch (err: any) {
      const msg = err?.message || "Invalid or expired verification code. Please try again.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  resendVerificationCode: async () => {
    const email = get().pendingVerificationEmail;
    if (!email) {
      return { success: false, message: "No email address found to resend verification code." };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: `New 6-digit code resent to ${email}` };
    } catch (err: any) {
      return { success: false, message: err?.message || "Could not resend code." };
    }
  },

  signIn: async ({ email, password }: LoginPayload) => {
    set({ isLoading: true, error: null });

    const trimmedEmail = email.trim().toLowerCase();
    const validation = isValidEmail(trimmedEmail);
    if (!validation.valid) {
      const msg = validation.reason || "Please enter a valid email.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        // If email is not confirmed, redirect them directly to OTP verification
        if (error.message.toLowerCase().includes("email not confirmed")) {
          set({
            isLoading: false,
            pendingVerificationEmail: trimmedEmail,
            modalTab: "verify_otp",
            error: "Email verification is required before signing in. We are resending a new code.",
          });
          void supabase.auth.resend({ type: "signup", email: trimmedEmail });
          return {
            success: false,
            needsOtp: true,
            message: "Please enter the verification code sent to your email to activate your account.",
          };
        }

        set({ isLoading: false, error: error.message });
        return { success: false, message: error.message };
      }

      let profile: UserProfile | null = null;
      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileRow) {
          profile = profileRow as UserProfile;
        }
      } catch (e) {
        logger.warn("[Auth] Failed fetching profile on login:", e);
      }

      if (!profile && data.user.user_metadata) {
        profile = {
          id: data.user.id,
          full_name: data.user.user_metadata.full_name || data.user.email?.split("@")[0] || "Operator",
          email: data.user.email,
          phone: data.user.user_metadata.phone,
          church_name: data.user.user_metadata.church_name || "My Church",
          city: data.user.user_metadata.city || "Location",
          state: data.user.user_metadata.state,
          role: "operator",
        };
      }

      saveLocalProfile(profile);
      set({
        user: data.user,
        session: data.session,
        profile,
        isLoading: false,
        isAuthModalOpen: false,
        modalTab: "profile",
      });

      return {
        success: true,
        message: `Welcome back, ${profile?.church_name || "Operator"}!`,
      };
    } catch (err: any) {
      const msg = err?.message || "Sign in failed. Check your email & password.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      logger.warn("[Auth] Sign out error:", err);
    }
    saveLocalProfile(null);
    set({
      user: null,
      session: null,
      profile: null,
      isAuthModalOpen: true,
      modalTab: "login",
    });
  },

  updateChurchProfile: async (patch: Partial<UserProfile>) => {
    const current = get().profile;
    if (!current) return;
    const updated = { ...current, ...patch };
    saveLocalProfile(updated);
    set({ profile: updated });

    if (get().user?.id) {
      try {
        await supabase
          .from("profiles")
          .update({
            church_name: updated.church_name,
            city: updated.city,
            state: updated.state,
            phone: updated.phone,
            full_name: updated.full_name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", get().user!.id);
      } catch (e) {
        logger.warn("[Auth] Failed to update remote profile:", e);
      }
    }
  },
}));
