-- ==============================================================================
-- VersoLyn (Vision Projector) — Supabase Database Schema Migration
-- Run this complete SQL script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ptoveluwyfotxyrsvthg/sql
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Churches Table (Stores Church organization details & location)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  pastor_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_churches_city ON public.churches (city);
CREATE INDEX IF NOT EXISTS idx_churches_name ON public.churches (church_name);

-- ==============================================================================
-- 3. Profiles Table (Linked to auth.users for Media Operators & Pastors)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  church_name TEXT,
  city TEXT,
  state TEXT,
  role TEXT DEFAULT 'operator', -- 'operator' | 'pastor' | 'media_team' | 'admin'
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_church_id ON public.profiles (church_id);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles (last_seen_at);

-- ==============================================================================
-- 4. App Usage & Activity Logs (Tracks active sessions, locations & duration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  church_name TEXT,
  city TEXT,
  state TEXT,
  device_info TEXT,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_usage_church ON public.app_usage_logs (church_name);
CREATE INDEX IF NOT EXISTS idx_app_usage_heartbeat ON public.app_usage_logs (last_heartbeat);

-- ==============================================================================
-- 5. Announcements & Ads Table (Allows displaying church notices / popups / ads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info' | 'feature' | 'alert' | 'ad'
  target_church TEXT DEFAULT 'all',
  action_label TEXT,
  action_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Insert a welcome announcement by default
INSERT INTO public.announcements (title, message, type, action_label, action_url, is_active)
VALUES (
  'Welcome to VersoLyn Presentation Software!',
  'Thank you for registering your church. VersoLyn provides high-performance offline Scripture, Tanglish lyrics, and projection scaling for worship services.',
  'info',
  'Learn More',
  'https://versolyn.vercel.app/shortcuts',
  true
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. Trigger: Automatically Create Profile on User Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_church_id UUID;
  v_church_name TEXT;
  v_city TEXT;
  v_state TEXT;
  v_full_name TEXT;
  v_phone TEXT;
BEGIN
  v_church_name := COALESCE(new.raw_user_meta_data->>'church_name', 'Independent Assembly');
  v_city := COALESCE(new.raw_user_meta_data->>'city', 'Unknown');
  v_state := new.raw_user_meta_data->>'state';
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_phone := new.raw_user_meta_data->>'phone';

  -- Check or create matching church record
  SELECT id INTO v_church_id FROM public.churches
  WHERE church_name = v_church_name AND city = v_city
  LIMIT 1;

  IF v_church_id IS NULL THEN
    INSERT INTO public.churches (church_name, city, state, contact_email, contact_phone, pastor_name)
    VALUES (v_church_name, v_city, v_state, new.email, v_phone, v_full_name)
    RETURNING id INTO v_church_id;
  END IF;

  -- Create profile record
  INSERT INTO public.profiles (
    id,
    church_id,
    full_name,
    email,
    phone,
    church_name,
    city,
    state,
    role
  )
  VALUES (
    new.id,
    v_church_id,
    v_full_name,
    new.email,
    v_phone,
    v_church_name,
    v_city,
    v_state,
    'operator'
  )
  ON CONFLICT (id) DO UPDATE SET
    church_id = EXCLUDED.church_id,
    full_name = EXCLUDED.full_name,
    church_name = EXCLUDED.church_name,
    city = EXCLUDED.city,
    last_seen_at = NOW(),
    updated_at = NOW();

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Churches: Anyone can read, authenticated & anon can insert new churches
CREATE POLICY "Public churches read" ON public.churches
  FOR SELECT USING (true);

CREATE POLICY "Allow church registration" ON public.churches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow church update" ON public.churches
  FOR UPDATE USING (true);

-- Profiles: Anyone can read profiles, users can update their own
CREATE POLICY "Public profiles read" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile insert" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- App Usage Logs: Anyone can insert/update heartbeat logs
CREATE POLICY "Allow heartbeat logging" ON public.app_usage_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow heartbeat update" ON public.app_usage_logs
  FOR UPDATE USING (true);

CREATE POLICY "Allow usage logs read" ON public.app_usage_logs
  FOR SELECT USING (true);

-- Announcements: Everyone can read active announcements
CREATE POLICY "Public announcements read" ON public.announcements
  FOR SELECT USING (is_active = true);
