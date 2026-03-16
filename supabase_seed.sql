-- EdgeBet Football - Realistic Launch-Ready Seed Data
-- This script populates the database with realistic leagues, teams, matches, picks, and slips.

-- 0. Clean up existing data (Optional, but recommended for a fresh start)
TRUNCATE leagues, teams, matches, picks, slips, slip_items CASCADE;

-- 1. Seed Leagues
INSERT INTO leagues (id, name, country, logo_url, is_featured) VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Premier League', 'England', 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg', true),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'La Liga', 'Spain', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg', true),
  ('c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f', 'Champions League', 'Europe', 'https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2.svg', true),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Serie A', 'Italy', 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg', true),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bundesliga', 'Germany', 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', false);

-- 2. Seed Teams
-- Premier League
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('t1-arsenal', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Arsenal', 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'),
  ('t2-mancity', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Manchester City', 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'),
  ('t3-liverpool', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Liverpool', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'),
  ('t4-chelsea', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Chelsea', 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'),
  ('t5-manutd', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Manchester United', 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'),
  ('t6-tottenham', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Tottenham Hotspur', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg');

-- La Liga
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('t7-realmadrid', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'),
  ('t8-barcelona', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'),
  ('t9-atletico', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Atletico Madrid', 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg');

-- Bundesliga
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('t10-bayern', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bayern Munich', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg'),
  ('t11-dortmund', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Borussia Dortmund', 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg');

-- 3. Seed Matches (Upcoming 10-20 Matches)
INSERT INTO matches (id, league_id, home_team_id, away_team_id, kickoff_time, status, is_featured, premium_analysis, analysis_summary) VALUES
  ('m1', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't2-mancity', 't1-arsenal', NOW() + interval '5 hours', 'scheduled', true, true, 'Tactical analysis suggests a high-intensity transition game. Arsenal''s compact mid-block will test City''s rotational mobility. We expect City to exploit wide areas through half-space overloads, while Arsenal remains a significant threat on set-piece transitions.'),
  ('m2', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't3-liverpool', 't4-chelsea', NOW() + interval '8 hours', 'scheduled', true, true, 'Statistical modeling indicates a high probability of vertical play. Liverpool''s high-line press is optimized for Chelsea''s current buildup struggles. Defensive data points to vulnerability in Chelsea''s wide defensive transitions against elite pace.'),
  ('m3', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 't7-realmadrid', 't8-barcelona', NOW() + interval '24 hours', 'scheduled', true, true, 'El Clasico tactical preview: Real Madrid''s technical superiority in central progression versus Barcelona''s aggressive high line. Historical data suggests late-game volatility. Focus on individual brilliance in 1v1 situations in the final third.'),
  ('m4', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't5-manutd', 't6-tottenham', NOW() + interval '12 hours', 'scheduled', false, false, 'United host Spurs in a game projected for high transitional volume. Both sides show defensive inconsistencies in the secondary phase of play. Value identified in volume-based goal markets rather than outright result.'),
  ('m5', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 't10-bayern', 't11-dortmund', NOW() + interval '20 hours', 'scheduled', true, true, 'Bayern''s structural dominance at home remains a key data anchor. Dortmund''s high-line exploitation remains the primary tactical route for the hosts. Expect sustained pressure in the initial 20 minutes.'),
  ('m6', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't4-chelsea', 't2-mancity', NOW() + interval '3 days', 'scheduled', false, true, 'Manchester City''s possession-based control is expected to neutralize Chelsea''s transitional threats. Data suggests a lower-variance encounter with controlled tempo.'),
  ('m7', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't1-arsenal', 't3-liverpool', NOW() + interval '4 days', 'scheduled', true, true, 'A clash of styles: Arsenal''s positional rigidity versus Liverpool''s chaotic pressing. Performance metrics favor the home side in sustained positional play.'),
  ('m8', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 't8-barcelona', 't9-atletico', NOW() + interval '5 days', 'scheduled', false, false, 'Atletico''s low-block proficiency is expected to limit Barcelona''s central penetration. A high-discipline, low-scoring tactical setup is projected.'),
  ('m9', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't6-tottenham', 't1-arsenal', NOW() + interval '7 days', 'scheduled', true, true, 'North London Derby: High emotional variance combined with tactical intensity. Statistical trends strongly support goals for both sides based on recent high-press efficiency.'),
  ('m10', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 't5-manutd', 't3-liverpool', NOW() + interval '8 days', 'scheduled', true, true, 'Historical rivalry metrics suggest high card volume and transitional play. Liverpool''s technical floor is projected to provide the edge in late-game fatigue scenarios.');

-- 4. Seed Picks
-- m1: City vs Arsenal
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('p1', 'm1', '1X2', 'Home Win', null, 'Man City Win', 1.85, 8, 'low', 'City''s structural consistency at the Etihad provides a high technical floor. Haaland''s availability against Arsenal''s high line is the primary value driver.', false),
  ('p2', 'm1', 'BTTS', 'BTTS Yes', null, 'BTTS - Yes', 1.70, 7, 'medium', 'Both sides rank in the 95th percentile for Expected Goals (xG) created. Offensive efficiency outweighs defensive structure in this matchup.', false),
  ('p3', 'm1', 'Combo', 'Man City Win', 'Over 1.5', 'Man City Win + Over 1.5 Goals', 2.15, 9, 'medium', 'City''s home wins correlate 88% with the Over 1.5 market this season. Tactical setup favors a multi-goal margin.', true);

-- m2: Liverpool vs Chelsea
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('p4', 'm2', 'Over/Under', 'Over 2.5', null, 'Over 2.5 Goals', 1.65, 9, 'low', 'Liverpool''s verticality at Anfield combined with Chelsea''s defensive transition struggles creates high scoring variance.', false),
  ('p5', 'm2', 'Combo', 'Liverpool Win', 'BTTS Yes', 'Liverpool Win + BTTS Yes', 3.10, 6, 'high', 'Chelsea show proficiency in counter-attacking metrics but lack the sustained defensive discipline to secure a result at Anfield.', true);

-- m3: El Clasico
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('p6', 'm3', '1X2', 'Home Win', null, 'Real Madrid Win', 2.10, 7, 'medium', 'Real Madrid''s experience in high-leverage European fixtures provides a mental edge. Vinicius Jr. is projected to exploit Barcelona''s wide defensive gaps.', false),
  ('p7', 'm3', 'Combo', 'BTTS Yes', 'Over 2.5', 'BTTS Yes + Over 2.5 Goals', 1.95, 8, 'low', 'El Clasico metrics consistently point toward offensive dominance. Both squads prioritize attacking volume over defensive stability.', true);

-- m5: Der Klassiker
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('p8', 'm5', '1X2', 'Home Win', null, 'Bayern Munich Win', 1.55, 9, 'low', 'Bayern''s historical dominance at the Allianz Arena is backed by superior positional play data. Dortmund''s defensive organization remains inconsistent against elite movement.', false),
  ('p9', 'm5', '1st Half', 'Bayern Win', null, 'Bayern to Win 1st Half', 2.05, 7, 'medium', ' Bayern typically implement an aggressive high-press in the opening 20 minutes to disrupt Dortmund''s buildup.', true);

-- 5. Seed Slips
INSERT INTO slips (id, title, description, type, is_premium, total_odds, status) VALUES
  ('s1', 'Elite Daily Double', 'Disciplined double covering the primary European fixtures with high statistical backing.', 'safe', false, 2.87, 'pending'),
  ('s2', 'Aggressive Weekend Combo', 'High-variance combo selections targeting market inefficiencies in goal-based markets.', 'aggressive', true, 6.67, 'pending'),
  ('s3', 'European Giants Accumulator', 'Top-tier technical selections from the Premier League, La Liga, and Bundesliga.', 'combo', true, 5.92, 'pending');

-- 6. Seed Slip Items
-- s1: Safe Daily Double (City Win + Bayern Win)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('s1', 'p1', 0),
  ('s1', 'p8', 1);

-- s2: Aggressive Combo (City Win/O1.5 + Liverpool/BTTS)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('s2', 'p3', 0),
  ('s2', 'p5', 1);

-- s3: The Big Three (City Win/O1.5 + Real Win + Bayern Win)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('s3', 'p3', 0),
  ('s3', 'p6', 1),
  ('s3', 'p8', 2);

-- 7. Seed Recent Results (Past Slips/Picks)
INSERT INTO slips (id, title, description, type, is_premium, total_odds, status, created_at) VALUES
  ('s-past-1', 'Monday Safe Slip', 'Start the week with high-confidence low-risk picks.', 'safe', false, 1.95, 'won', NOW() - interval '2 days'),
  ('s-past-2', 'Midweek Champions League Special', 'Aggressive combo for the UCL knockout stage.', 'aggressive', true, 4.20, 'lost', NOW() - interval '3 days'),
  ('s-past-3', 'Tuesday Balanced Slip', 'Balanced risk-to-reward ratio for the mid-week fixtures.', 'balanced', false, 3.15, 'won', NOW() - interval '4 days');

-- Note: Profile and subscription records are created via triggers.
-- To test as admin, remember to update your profile role to 'admin' manually in the Supabase SQL editor.
