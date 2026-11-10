import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createAdminClient, createServerClient } from '@/lib/supabase-server'

const API_URL = 'https://v3.football.api-sports.io/fixtures'

function stableUuid(namespace: string, id: number | string) {
  const hex = createHash('sha1').update(`${namespace}:${id}`).digest('hex').slice(0, 32)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')}${hex.slice(18, 20)}-${hex.slice(20, 32)}`
}

function isValidDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
}

function mapStatus(status: string) {
  if (['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(status)) return 'finished'
  if (['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(status)) return 'live'
  if (['PST', 'CANC', 'ABD', 'SUSP', 'INT'].includes(status)) return 'postponed'
  return 'scheduled'
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only administrators can sync fixtures.' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    if (!isValidDate(body.date)) {
      return NextResponse.json({ error: 'Choose a valid fixture date in YYYY-MM-DD format.' }, { status: 400 })
    }

    const apiKey = process.env.API_FOOTBALL_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API_FOOTBALL_KEY is not configured on the server.' }, { status: 503 })
    }

    const apiResponse = await fetch(`${API_URL}?date=${body.date}&timezone=UTC`, {
      headers: { 'x-apisports-key': apiKey },
      cache: 'no-store',
    })
    const payload = await apiResponse.json().catch(() => null)

    if (!apiResponse.ok || payload?.errors && Object.keys(payload.errors).length > 0) {
      const providerError = payload?.errors ? Object.values(payload.errors).join(', ') : `Provider returned HTTP ${apiResponse.status}`
      return NextResponse.json({ error: `Fixture provider error: ${providerError}` }, { status: 502 })
    }

    const fixtures = Array.isArray(payload?.response) ? payload.response : []
    if (fixtures.length === 0) {
      return NextResponse.json({ date: body.date, synced: 0, message: 'No fixtures were returned for this date.' })
    }

    const admin = createAdminClient()
    let synced = 0

    for (const item of fixtures) {
      const league = item.league
      const home = item.teams?.home
      const away = item.teams?.away
      const fixture = item.fixture

      if (!league?.id || !home?.id || !away?.id || !fixture?.id || !fixture?.date) continue

      const leagueId = stableUuid('league', league.id)
      const homeTeamId = stableUuid('team', home.id)
      const awayTeamId = stableUuid('team', away.id)
      const matchId = stableUuid('fixture', fixture.id)

      const { error: leagueError } = await admin.from('leagues').upsert({
        id: leagueId,
        name: league.name,
        country: league.country || null,
        logo_url: league.logo || null,
      }, { onConflict: 'id' })
      if (leagueError) throw leagueError

      const { error: teamsError } = await admin.from('teams').upsert([
        { id: homeTeamId, league_id: leagueId, name: home.name, logo_url: home.logo || null },
        { id: awayTeamId, league_id: leagueId, name: away.name, logo_url: away.logo || null },
      ], { onConflict: 'id' })
      if (teamsError) throw teamsError

      const { error: matchError } = await admin.from('matches').upsert({
        id: matchId,
        league_id: leagueId,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        kickoff_time: fixture.date,
        status: mapStatus(fixture.status?.short),
        home_score: item.goals?.home ?? null,
        away_score: item.goals?.away ?? null,
        is_featured: false,
        premium_analysis: false,
        analysis_summary: JSON.stringify({
          source: 'api-football',
          fixtureId: fixture.id,
          leagueId: league.id,
          season: league.season,
          homeTeamId: home.id,
          awayTeamId: away.id,
        }),
      }, { onConflict: 'id' })
      if (matchError) throw matchError

      synced += 1
    }

    return NextResponse.json({ date: body.date, synced, message: `Synced ${synced} fixtures.` })
  } catch (error) {
    console.error('Fixture sync failed:', error)
    return NextResponse.json({ error: 'Fixture sync failed. Check the server logs for details.' }, { status: 500 })
  }
}
