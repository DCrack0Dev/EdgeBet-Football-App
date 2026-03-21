import { createClient } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Database Types (Normalized) ---

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      leagues: {
        Row: League;
        Insert: Omit<League, 'id' | 'created_at'>;
        Update: Partial<Omit<League, 'id' | 'created_at'>>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'created_at'>;
        Update: Partial<Omit<Team, 'id' | 'created_at'>>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, 'id' | 'created_at'>;
        Update: Partial<Omit<Match, 'id' | 'created_at'>>;
      };
      picks: {
        Row: Pick;
        Insert: Omit<Pick, 'id' | 'created_at'>;
        Update: Partial<Omit<Pick, 'id' | 'created_at'>>;
      };
      pick_results: {
        Row: PickResult;
        Insert: Omit<PickResult, 'id' | 'created_at'>;
        Update: Partial<Omit<PickResult, 'id' | 'created_at'>>;
      };
      slips: {
        Row: Slip;
        Insert: Omit<Slip, 'id' | 'created_at'>;
        Update: Partial<Omit<Slip, 'id' | 'created_at'>>;
      };
      slip_items: {
        Row: SlipItem;
        Insert: Omit<SlipItem, 'id' | 'created_at'>;
        Update: Partial<Omit<SlipItem, 'id' | 'created_at'>>;
      };
    };
  };
};

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  // Relationships
  subscriptions?: Subscription[];
};

export type Subscription = {
  id: string;
  user_id: string;
  status: 'free' | 'premium';
  is_premium: boolean;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  peach_customer_id?: string;
  peach_registration_id?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
};

export type League = {
  id: string;
  name: string;
  country?: string;
  logo_url?: string;
  created_at: string;
};

export type Team = {
  id: string;
  league_id: string;
  name: string;
  logo_url?: string;
  created_at: string;
};

export type Match = {
  id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  kickoff_time: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  home_score?: number;
  away_score?: number;
  created_at: string;
  // Relationships
  league?: League;
  home_team?: Team;
  away_team?: Team;
};

export type Pick = {
  id: string;
  match_id: string;
  selection_type: string;
  market_primary: string;
  market_secondary?: string;
  display_label: string;
  odds: number;
  confidence_score: number;
  risk_level: 'low' | 'medium' | 'high';
  analyst_reason?: string;
  premium_only: boolean;
  result_status: 'pending' | 'won' | 'lost' | 'void';
  created_by?: string;
  created_at: string;
  // Relationships
  match?: Match;
  results?: PickResult[];
};

export type PickResult = {
  id: string;
  pick_id: string;
  actual_outcome?: string;
  result_summary?: string;
  settled_at?: string;
  created_at: string;
};

export type Slip = {
  id: string;
  title: string;
  description?: string;
  type: 'safe' | 'balanced' | 'aggressive' | 'combo';
  is_premium: boolean;
  total_odds: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  created_by?: string;
  created_at: string;
  // Relationships
  items?: Pick[];
};

export type SlipItem = {
  id: string;
  slip_id: string;
  pick_id: string;
  created_at: string;
};
