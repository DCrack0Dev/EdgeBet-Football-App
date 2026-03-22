-- Adds/updates leagues and teams without truncating existing data.
-- Safe to re-run.

-- Leagues (stable IDs)
INSERT INTO leagues (id, name, country, logo_url, is_featured) VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Premier League', 'England', 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg', true),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'La Liga', 'Spain', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg', true),
  ('d4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a', 'Serie A', 'Italy', 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg', true),
  ('e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a', 'Bundesliga', 'Germany', 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', false),
  ('f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b', 'Süper Lig', 'Turkey', null, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  logo_url = EXCLUDED.logo_url,
  is_featured = EXCLUDED.is_featured;

-- Teams: insert missing by (league_id, name)
WITH to_insert AS (
  SELECT 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'::uuid AS league_id, unnest(ARRAY[
    'Arsenal',
    'Aston Villa',
    'Bournemouth',
    'Brentford',
    'Brighton & Hove Albion',
    'Burnley',
    'Chelsea',
    'Crystal Palace',
    'Everton',
    'Fulham',
    'Liverpool',
    'Luton Town',
    'Manchester City',
    'Manchester United',
    'Newcastle United',
    'Nottingham Forest',
    'Sheffield United',
    'Tottenham Hotspur',
    'West Ham United',
    'Wolverhampton Wanderers'
  ]) AS name
  UNION ALL
  SELECT 'e5f6a1b2-c3d4-4e5f-cf6a-7b8c9d0e1f2a'::uuid, unnest(ARRAY[
    'Bayern Munich',
    'Borussia Dortmund',
    'RB Leipzig',
    'Bayer Leverkusen',
    'Union Berlin',
    'SC Freiburg',
    'Eintracht Frankfurt',
    'VfL Wolfsburg',
    'Borussia Mönchengladbach',
    'Werder Bremen',
    'FC Augsburg',
    'VfB Stuttgart',
    'FC Köln',
    'TSG Hoffenheim',
    'Mainz 05',
    'Heidenheim',
    'Darmstadt 98',
    'Bochum'
  ])
  UNION ALL
  SELECT 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e'::uuid, unnest(ARRAY[
    'Real Madrid',
    'Barcelona',
    'Atlético Madrid',
    'Sevilla',
    'Real Sociedad',
    'Real Betis',
    'Villarreal',
    'Athletic Bilbao',
    'Valencia',
    'Girona',
    'Osasuna',
    'Celta Vigo',
    'Getafe',
    'Mallorca',
    'Almería',
    'Cádiz',
    'Rayo Vallecano',
    'Granada',
    'Las Palmas',
    'Espanyol'
  ])
  UNION ALL
  SELECT 'd4e5f6a1-b2c3-4d4e-bf5a-6b7c8d9e0f1a'::uuid, unnest(ARRAY[
    'Inter Milan',
    'AC Milan',
    'Juventus',
    'Napoli',
    'Roma',
    'Lazio',
    'Atalanta',
    'Fiorentina',
    'Bologna',
    'Torino',
    'Sassuolo',
    'Udinese',
    'Monza',
    'Genoa',
    'Lecce',
    'Empoli',
    'Salernitana',
    'Cagliari',
    'Verona',
    'Frosinone'
  ])
  UNION ALL
  SELECT 'f6a1b2c3-d4e5-4f6a-af7b-8c9d0e1f2a3b'::uuid, unnest(ARRAY[
    'Galatasaray',
    'Fenerbahçe',
    'Beşiktaş',
    'Trabzonspor',
    'Başakşehir',
    'Adana Demirspor',
    'Kasımpaşa',
    'Sivasspor',
    'Antalyaspor',
    'Alanyaspor',
    'Gaziantep FK',
    'Hatayspor',
    'Kayserispor',
    'Konyaspor',
    'Rizespor',
    'Samsunspor',
    'Ankaragücü',
    'Pendikspor',
    'Fatih Karagümrük',
    'İstanbulspor'
  ])
)
INSERT INTO teams (league_id, name)
SELECT t.league_id, t.name
FROM to_insert t
WHERE NOT EXISTS (
  SELECT 1 FROM teams existing
  WHERE existing.league_id = t.league_id AND existing.name = t.name
);

