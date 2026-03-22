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
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bundesliga', 'Germany', 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', false),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Süper Lig', 'Turkey', null, false);

-- 2. Seed Teams
-- Premier League
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Arsenal', 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'),
  ('22222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Manchester City', 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'),
  ('33333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Liverpool', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'),
  ('44444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Chelsea', 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'),
  ('55555555-5555-5555-5555-555555555555', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Manchester United', 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'),
  ('66666666-6666-6666-6666-666666666666', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Tottenham Hotspur', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg');

INSERT INTO teams (league_id, name) VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Aston Villa'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Bournemouth'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Brentford'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Brighton & Hove Albion'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Burnley'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Crystal Palace'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Everton'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Fulham'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Luton Town'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Newcastle United'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Nottingham Forest'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Sheffield United'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'West Ham United'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Wolverhampton Wanderers');

-- La Liga
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('77777777-7777-7777-7777-777777777777', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'),
  ('88888888-8888-8888-8888-888888888888', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'),
  ('99999999-9999-9999-9999-999999999999', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Atlético Madrid', 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg');

INSERT INTO teams (league_id, name) VALUES
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Sevilla'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Real Sociedad'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Real Betis'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Villarreal'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Athletic Bilbao'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Valencia'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Girona'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Osasuna'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Celta Vigo'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Getafe'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Mallorca'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Almería'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Cádiz'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Rayo Vallecano'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Granada'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Las Palmas'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Espanyol');

-- Bundesliga
INSERT INTO teams (id, league_id, name, logo_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bayern Munich', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg'),
  ('00000000-0000-0000-0000-000000000002', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Borussia Dortmund', 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg');

INSERT INTO teams (league_id, name) VALUES
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'RB Leipzig'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bayer Leverkusen'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Union Berlin'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'SC Freiburg'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Eintracht Frankfurt'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'VfL Wolfsburg'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Borussia Mönchengladbach'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Werder Bremen'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'FC Augsburg'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'VfB Stuttgart'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'FC Köln'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'TSG Hoffenheim'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Mainz 05'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Heidenheim'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Darmstadt 98'),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bochum');

-- Serie A
INSERT INTO teams (league_id, name) VALUES
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Inter Milan'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'AC Milan'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Juventus'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Napoli'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Roma'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Lazio'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Atalanta'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Fiorentina'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Bologna'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Torino'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Sassuolo'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Udinese'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Monza'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Genoa'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Lecce'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Empoli'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Salernitana'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Cagliari'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Verona'),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Frosinone');

-- Turkish Süper Lig
INSERT INTO teams (league_id, name) VALUES
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Galatasaray'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Fenerbahçe'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Beşiktaş'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Trabzonspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Başakşehir'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Adana Demirspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Kasımpaşa'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Sivasspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Antalyaspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Alanyaspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Gaziantep FK'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Hatayspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Kayserispor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Konyaspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Rizespor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Samsunspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Ankaragücü'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Pendikspor'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Fatih Karagümrük'),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'İstanbulspor');

-- 3. Seed Matches (Upcoming 10-20 Matches)
INSERT INTO matches (id, league_id, home_team_id, away_team_id, kickoff_time, status, is_featured, premium_analysis, analysis_summary) VALUES
  ('00000000-0000-0000-0000-000000000011', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() + interval '5 hours', 'scheduled', true, true, 'Tactical analysis suggests a high-intensity transition game. Arsenal''s compact mid-block will test City''s rotational mobility. We expect City to exploit wide areas through half-space overloads, while Arsenal remains a significant threat on set-piece transitions.'),
  ('00000000-0000-0000-0000-000000000012', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', NOW() + interval '8 hours', 'scheduled', true, true, 'Statistical modeling indicates a high probability of vertical play. Liverpool''s high-line press is optimized for Chelsea''s current buildup struggles. Defensive data points to vulnerability in Chelsea''s wide defensive transitions against elite pace.'),
  ('00000000-0000-0000-0000-000000000013', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', NOW() + interval '24 hours', 'scheduled', true, true, 'El Clasico tactical preview: Real Madrid''s technical superiority in central progression versus Barcelona''s aggressive high line. Historical data suggests late-game volatility. Focus on individual brilliance in 1v1 situations in the final third.'),
  ('00000000-0000-0000-0000-000000000014', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', NOW() + interval '12 hours', 'scheduled', false, false, 'United host Spurs in a game projected for high transitional volume. Both sides show defensive inconsistencies in the secondary phase of play. Value identified in volume-based goal markets rather than outright result.'),
  ('00000000-0000-0000-0000-000000000015', 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NOW() + interval '20 hours', 'scheduled', true, true, 'Bayern''s structural dominance at home remains a key data anchor. Dortmund''s high-line exploitation remains the primary tactical route for the hosts. Expect sustained pressure in the initial 20 minutes.'),
  ('00000000-0000-0000-0000-000000000016', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() + interval '3 days', 'scheduled', false, true, 'Manchester City''s possession-based control is expected to neutralize Chelsea''s transitional threats. Data suggests a lower-variance encounter with controlled tempo.'),
  ('00000000-0000-0000-0000-000000000017', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', NOW() + interval '4 days', 'scheduled', true, true, 'A clash of styles: Arsenal''s positional rigidity versus Liverpool''s chaotic pressing. Performance metrics favor the home side in sustained positional play.'),
  ('00000000-0000-0000-0000-000000000018', 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', '88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', NOW() + interval '5 days', 'scheduled', false, false, 'Atletico''s low-block proficiency is expected to limit Barcelona''s central penetration. A high-discipline, low-scoring tactical setup is projected.'),
  ('00000000-0000-0000-0000-000000000019', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', NOW() + interval '7 days', 'scheduled', true, true, 'North London Derby: High emotional variance combined with tactical intensity. Statistical trends strongly support goals for both sides based on recent high-press efficiency.'),
  ('00000000-0000-0000-0000-000000000020', 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', NOW() + interval '8 days', 'scheduled', true, true, 'Historical rivalry metrics suggest high card volume and transitional play. Liverpool''s technical floor is projected to provide the edge in late-game fatigue scenarios.');

-- 4. Seed Picks
-- m1: City vs Arsenal
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000011', '1X2', 'Home Win', null, 'Man City Win', 1.85, 8, 'low', 'City''s structural consistency at the Etihad provides a high technical floor. Haaland''s availability against Arsenal''s high line is the primary value driver.', false),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000011', 'BTTS', 'BTTS Yes', null, 'BTTS - Yes', 1.70, 7, 'medium', 'Both sides rank in the 95th percentile for Expected Goals (xG) created. Offensive efficiency outweighs defensive structure in this matchup.', false),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000011', 'Combo', 'Man City Win', 'Over 1.5', 'Man City Win + Over 1.5 Goals', 2.15, 9, 'medium', 'City''s home wins correlate 88% with the Over 1.5 market this season. Tactical setup favors a multi-goal margin.', true);

-- m2: Liverpool vs Chelsea
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000012', 'Over/Under', 'Over 2.5', null, 'Over 2.5 Goals', 1.65, 9, 'low', 'Liverpool''s verticality at Anfield combined with Chelsea''s defensive transition struggles creates high scoring variance.', false),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000012', 'Combo', 'Liverpool Win', 'BTTS Yes', 'Liverpool Win + BTTS Yes', 3.10, 6, 'high', 'Chelsea show proficiency in counter-attacking metrics but lack the sustained defensive discipline to secure a result at Anfield.', true);

-- m3: El Clasico
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000013', '1X2', 'Home Win', null, 'Real Madrid Win', 2.10, 7, 'medium', 'Real Madrid''s experience in high-leverage European fixtures provides a mental edge. Vinicius Jr. is projected to exploit Barcelona''s wide defensive gaps.', false),
  ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000013', 'Combo', 'BTTS Yes', 'Over 2.5', 'BTTS Yes + Over 2.5 Goals', 1.95, 8, 'low', 'El Clasico metrics consistently point toward offensive dominance. Both squads prioritize attacking volume over defensive stability.', true);

-- m5: Der Klassiker
INSERT INTO picks (id, match_id, selection_type, market_primary, market_secondary, display_label, odds, confidence_score, risk_level, analyst_reason, premium_only) VALUES
  ('00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000015', '1X2', 'Home Win', null, 'Bayern Munich Win', 1.55, 9, 'low', 'Bayern''s historical dominance at the Allianz Arena is backed by superior positional play data. Dortmund''s defensive organization remains inconsistent against elite movement.', false),
  ('00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000015', '1st Half', 'Bayern Win', null, 'Bayern to Win 1st Half', 2.05, 7, 'medium', ' Bayern typically implement an aggressive high-press in the opening 20 minutes to disrupt Dortmund''s buildup.', true);

-- 5. Seed Slips
INSERT INTO slips (id, title, description, type, is_premium, total_odds, status) VALUES
  ('00000000-0000-0000-0000-000000000501', 'Elite Daily Double', 'Disciplined double covering the primary European fixtures with high statistical backing.', 'safe', false, 2.87, 'pending'),
  ('00000000-0000-0000-0000-000000000502', 'Aggressive Weekend Combo', 'High-variance combo selections targeting market inefficiencies in goal-based markets.', 'aggressive', true, 6.67, 'pending'),
  ('00000000-0000-0000-0000-000000000503', 'European Giants Accumulator', 'Top-tier technical selections from the Premier League, La Liga, and Bundesliga.', 'combo', true, 5.92, 'pending');

-- 6. Seed Slip Items
-- s1: Safe Daily Double (City Win + Bayern Win)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000101', 0),
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000108', 1);

-- s2: Aggressive Combo (City Win/O1.5 + Liverpool/BTTS)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000103', 0),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000105', 1);

-- s3: The Big Three (City Win/O1.5 + Real Win + Bayern Win)
INSERT INTO slip_items (slip_id, pick_id, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000103', 0),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000106', 1),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000108', 2);

-- 7. Seed Recent Results (Past Slips/Picks)
INSERT INTO slips (id, title, description, type, is_premium, total_odds, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000504', 'Monday Safe Slip', 'Start the week with high-confidence low-risk picks.', 'safe', false, 1.95, 'won', NOW() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000505', 'Midweek Champions League Special', 'Aggressive combo for the UCL knockout stage.', 'aggressive', true, 4.20, 'lost', NOW() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000506', 'Tuesday Balanced Slip', 'Balanced risk-to-reward ratio for the mid-week fixtures.', 'balanced', false, 3.15, 'won', NOW() - interval '4 days');

-- Note: Profile and subscription records are created via triggers.
