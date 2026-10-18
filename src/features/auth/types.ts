export interface ChurchRecord {
  id: string;
  church_name: string;
  city: string;
  state?: string;
  country?: string;
  pastor_name?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  church_id?: string;
  full_name: string;
  email?: string;
  phone?: string;
  church_name: string;
  city: string;
  state?: string;
  role: "operator" | "pastor" | "media_team" | "admin";
  last_seen_at?: string;
  created_at?: string;
}

export interface RegisterChurchPayload {
  churchName: string;
  city: string;
  state: string;
  pastorName: string;
  operatorName: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AppUsageStats {
  sessionStartTime: number;
  lastHeartbeatTime: number;
  totalActiveMinutes: number;
  totalSessionsCount: number;
  churchName: string;
  city: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "feature" | "alert" | "ad";
  target_church?: string;
  action_label?: string;
  action_url?: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}
