import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * Primary Supabase Client (User's database for Auth, Churches, Profiles, Usage Tracking & Realtime)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Public Worship Catalog Fallback Client (For Songs & Scripture when not present in local/custom Supabase)
 */
const PUBLIC_CATALOG_URL = "https://opygyrrmtfvwwatxqhft.supabase.co";
const PUBLIC_CATALOG_KEY = "sb_publishable_nFY3m45q59Q0_cgZ4lbztA_mUKq7Ls6";

export const catalogSupabase = createClient(PUBLIC_CATALOG_URL, PUBLIC_CATALOG_KEY);
