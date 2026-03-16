-- Normalization: Create Enums for better data integrity
DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE result_status_enum AS ENUM ('pending', 'won', 'lost', 'void');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status_enum AS ENUM ('free', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status_enum AS ENUM ('scheduled', 'live', 'finished', 'postponed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE slip_type_enum AS ENUM ('safe', 'balanced', 'aggressive', 'combo', 'btts', 'overunder', 'halftime');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status subscription_status_enum DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Leagues Table
CREATE TABLE IF NOT EXISTS leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  logo_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status match_status_enum DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  premium_analysis BOOLEAN DEFAULT FALSE,
  analysis_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Picks Table (Supports single and combo markets)
CREATE TABLE IF NOT EXISTS picks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  selection_type TEXT NOT NULL, -- e.g., '1X2', 'Combo', 'BTTS'
  market_primary TEXT NOT NULL, -- e.g., 'Home Win'
  market_secondary TEXT, -- e.g., 'Over 1.5' (nullable for single markets)
  display_label TEXT NOT NULL, -- e.g., 'Home Win + Over 1.5'
  odds DECIMAL(10, 2) NOT NULL,
  confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 10),
  risk_level risk_level_enum NOT NULL,
  analyst_reason TEXT,
  premium_only BOOLEAN DEFAULT FALSE,
  result_status result_status_enum DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Pick Results Table
CREATE TABLE IF NOT EXISTS pick_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  actual_outcome TEXT,
  result_summary TEXT,
  settled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Slips Table
CREATE TABLE IF NOT EXISTS slips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type slip_type_enum NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  total_odds DECIMAL(10, 2),
  status result_status_enum DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Slip Items Table (Many-to-Many between Slips and Picks)
CREATE TABLE IF NOT EXISTS slip_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slip_id UUID REFERENCES slips(id) ON DELETE CASCADE NOT NULL,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(slip_id, pick_id)
);

-- 10. Saved Picks Table
CREATE TABLE IF NOT EXISTS saved_picks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, pick_id)
);

-- 11. Saved Slips Table (Added for completeness)
CREATE TABLE IF NOT EXISTS saved_slips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  slip_id UUID REFERENCES slips(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, slip_id)
);

-- 12. Notifications Table
DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('new_slip', 'premium_slip', 'result_update', 'subscription', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type_enum NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_kickoff ON matches(kickoff_time);
CREATE INDEX IF NOT EXISTS idx_matches_league ON matches(league_id);
CREATE INDEX IF NOT EXISTS idx_picks_match ON picks(match_id);
CREATE INDEX IF NOT EXISTS idx_picks_status ON picks(result_status);
CREATE INDEX IF NOT EXISTS idx_slips_status ON slips(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_picks_user ON saved_picks(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_slips_user ON saved_slips(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pick_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE slip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Improved RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view leagues" ON leagues;
CREATE POLICY "Anyone can view leagues" ON leagues FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can view matches" ON matches;
CREATE POLICY "Anyone can view matches" ON matches FOR SELECT USING (true);

-- Improved Content Access Policies (Using roles and sub status)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_premium() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid() AND status = 'premium')
  OR public.is_admin();
$$ LANGUAGE sql SECURITY DEFINER;

DROP POLICY IF EXISTS "View picks access" ON picks;
CREATE POLICY "View picks access" ON picks FOR SELECT USING (
  NOT premium_only OR public.is_premium()
);

DROP POLICY IF EXISTS "View slips access" ON slips;
CREATE POLICY "View slips access" ON slips FOR SELECT USING (
  (is_published AND (NOT is_premium OR public.is_premium()))
  OR public.is_admin()
);

-- Management Policies (Admin Only)
CREATE POLICY "Admins manage leagues" ON leagues FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage teams" ON teams FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage matches" ON matches FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage picks" ON picks FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage slips" ON slips FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage slip_items" ON slip_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins manage pick_results" ON pick_results FOR ALL USING (public.is_admin());

-- User Management
CREATE POLICY "Users manage saved picks" ON saved_picks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage saved slips" ON saved_slips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Automated Trigger for New Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
