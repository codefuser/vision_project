import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { RegisterChurchPayload, LoginPayload, UserProfile } from "./types";
import type { User, Session } from "@supabase/supabase-js";

const LOCAL_STORAGE_PROFILE_KEY = "versolyn_church_profile";
const LOCAL_STORAGE_STATS_KEY = "versolyn_usage_stats";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthModalOpen: boolean;
  modalTab: "register" | "login" | "profile";
  error: string | null;

  // Actions
  init: () => Promise<void>;
  openAuthModal: (tab?: "register" | "login" | "profile") => void;
  closeAuthModal: () => void;
  setModalTab: (tab: "register" | "login" | "profile") => void;
  signUpWithChurch: (payload: RegisterChurchPayload) => Promise<{ success: boolean; message: string }>;
  signIn: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  quickRegister: (payload: RegisterChurchPayload) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  updateChurchProfile: (patch: Partial<UserProfile>) => Promise<void>;
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

  init: async () => {
    if (get().isInitialized) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;

      let profile = loadLocalProfile();

      if (user) {
        // Try fetching user profile from database
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
            // Synthesize from metadata if profile row not created yet
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
          logger.warn("[Auth] Could not fetch profile from table, using local/metadata:", dbErr);
        }
      }

      set({
        user,
        session,
        profile,
        isInitialized: true,
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        const newUser = newSession?.user ?? null;
        if (!newUser) {
          set({ user: null, session: null });
          return;
        }

        set({ user: newUser, session: newSession });
      });
    } catch (err) {
      logger.warn("[Auth] Init error:", err);
      set({ isInitialized: true });
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
    set({ isAuthModalOpen: false, error: null });
  },

  setModalTab: (modalTab) => {
    set({ modalTab, error: null });
  },

  signUpWithChurch: async (payload: RegisterChurchPayload) => {
    set({ isLoading: true, error: null });
    try {
      const password = payload.password || "VersoLyn@" + Math.random().toString(36).slice(-6);

      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password,
        options: {
          data: {
            full_name: payload.operatorName || payload.pastorName || "Media Operator",
            church_name: payload.churchName,
            city: payload.city,
            state: payload.state,
            phone: payload.phone,
            pastor_name: payload.pastorName,
          },
        },
      });

      if (error) {
        set({ isLoading: false, error: error.message });
        return { success: false, message: error.message };
      }

      const user = data.user;
      const newProfile: UserProfile = {
        id: user?.id || "local-" + Date.now(),
        full_name: payload.operatorName || payload.pastorName || "Media Operator",
        email: payload.email,
        phone: payload.phone,
        church_name: payload.churchName,
        city: payload.city,
        state: payload.state,
        role: "operator",
        created_at: new Date().toISOString(),
      };

      // Also upsert church into churches table directly if table exists
      try {
        await supabase.from("churches").insert({
          church_name: payload.churchName,
          city: payload.city,
          state: payload.state,
          pastor_name: payload.pastorName,
          contact_email: payload.email,
          contact_phone: payload.phone,
        });
      } catch (churchErr) {
        logger.info("[Auth] Note: direct churches table insert skipped or pending migration:", churchErr);
      }

      saveLocalProfile(newProfile);
      set({
        user,
        session: data.session,
        profile: newProfile,
        isLoading: false,
        modalTab: "profile",
      });

      return {
        success: true,
        message: data.session
          ? "Church registered & signed in successfully!"
          : "Registration received! Check email if confirmation is required.",
      };
    } catch (err: any) {
      const msg = err?.message || "Registration failed. Please try again.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  signIn: async ({ email, password }: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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
        modalTab: "profile",
      });

      return { success: true, message: `Welcome back, ${profile?.full_name || "Operator"}!` };
    } catch (err: any) {
      const msg = err?.message || "Sign in failed. Check your email & password.";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  quickRegister: async (payload: RegisterChurchPayload) => {
    set({ isLoading: true, error: null });
    try {
      const profile: UserProfile = {
        id: "local-" + Date.now(),
        full_name: payload.operatorName || payload.pastorName || "Media Operator",
        email: payload.email,
        phone: payload.phone,
        church_name: payload.churchName,
        city: payload.city,
        state: payload.state,
        role: "operator",
        created_at: new Date().toISOString(),
      };

      saveLocalProfile(profile);

      // Attempt background church log to Supabase
      try {
        await supabase.from("churches").insert({
          church_name: payload.churchName,
          city: payload.city,
          state: payload.state,
          pastor_name: payload.pastorName,
          contact_email: payload.email,
          contact_phone: payload.phone,
        });
      } catch (err) {
        logger.warn("[Auth] Background church logging error (pending table creation):", err);
      }

      set({
        profile,
        isLoading: false,
        modalTab: "profile",
      });

      return { success: true, message: `Church "${payload.churchName}" registered locally & synced!` };
    } catch (err: any) {
      const msg = err?.message || "Quick registration failed.";
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
    set({ user: null, session: null, isAuthModalOpen: false });
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
