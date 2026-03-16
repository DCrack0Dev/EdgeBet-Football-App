-- Normalization: Create Enums for better data integrity
CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE result_status_enum AS ENUM ('pending', 'won', 'lost', 'void');
CREATE TYPE subscription_status_enum AS ENUM ('free', 'premium');
CREATE TYPE match_status_enum AS ENUM ('scheduled', 'live', 'finished', 'postponed');

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Subscriptions Table (Normalized out of profiles)
CREATE TABLE subscriptions (
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
CREATE TABLE leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Teams Table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Matches Table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status match_status_enum DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Picks Table (Supports single and combo markets)
CREATE TABLE picks (
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
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Admin reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Pick Results Table (Stores the outcome data for each pick)
CREATE TABLE pick_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  actual_outcome TEXT, -- e.g., 'Home 2-1 Away'
  result_summary TEXT, -- Brief reason for win/loss
  settled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Slips Table
CREATE TABLE slips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('safe', 'balanced', 'aggressive', 'combo')),
  is_premium BOOLEAN DEFAULT FALSE,
  total_odds DECIMAL(10, 2),
  status result_status_enum DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Admin reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Slip Items Table (Many-to-Many between Slips and Picks)
CREATE TABLE slip_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slip_id UUID REFERENCES slips(id) ON DELETE CASCADE NOT NULL,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(slip_id, pick_id)
);

-- 10. Saved Picks Table
CREATE TABLE saved_picks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pick_id UUID REFERENCES picks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, pick_id)
);

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

-- Updated RLS Policies
-- Profiles: Users can view and update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Leagues, Teams, Matches: Everyone can view
CREATE POLICY "Anyone can view leagues" ON leagues FOR SELECT USING (true);
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Anyone can view matches" ON matches FOR SELECT USING (true);

-- Picks: 
-- 1. Anyone can view non-premium picks
-- 2. Premium users can view all picks
-- 3. Admins can view all picks
CREATE POLICY "View picks access" ON picks FOR SELECT USING (
  NOT premium_only OR 
  (SELECT status FROM subscriptions WHERE user_id = auth.uid()) = 'premium' OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Slips: Similar logic to Picks
CREATE POLICY "View slips access" ON slips FOR SELECT USING (
  NOT is_premium OR 
  (SELECT status FROM subscriptions WHERE user_id = auth.uid()) = 'premium' OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Saved Picks: Users can manage their own
CREATE POLICY "Users can manage own saved picks" ON saved_picks FOR ALL USING (auth.uid() = user_id);

-- Admin policies:
CREATE POLICY "Admins can manage everything" ON leagues FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage teams everything" ON teams FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage matches everything" ON matches FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage picks everything" ON picks FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage slips everything" ON slips FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage subscriptions everything" ON subscriptions FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Automated Trigger for New Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Create default free subscription
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
