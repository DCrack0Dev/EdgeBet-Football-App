import { NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase-server'
import { buildMatchAnalysis } from '@/lib/match-analysis'

const API_BASE = 'https://v3.football.api-sports.io'
const RAPIDAPI_BASE = 'https://api-football-v1.p.rapidapi.com/v3'

type ProviderPayload = { response?: any[]; errors?: Record<string, string> }

async function providerGet(path: string, credentials: { apiKey: string; rapidApi: boolean }): Promise<any[]> {
  const response = await fetch(`${credentials.rapidApi ? RAPIDAPI_BASE : API_BASE}${path}`, {
    headers: credentials.rapidApi
      ? { 'x-rapidapi-key': credentials.apiKey, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com' }
      : { 'x-apisports-key': credentials.apiKey },
    cache: 'no-store',
  })
  const payload = await response.json() as ProviderPayload
  if (!response.ok || payload.errors && Object.keys(payload.errors).length) {
    throw new Error(Object.values(payload.errors || {}).join(', ') || `API-Football returned HTTP ${response.status}`)
  }
  return Array.isArray(payload.response) ? payload.response : []
}

function parseMetadata(value: unknown) {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return parsed?.source === 'api-football' ? parsed : null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Only administrators can analyze matches.' }, { status: 403 })

    const body = await request.json().catch(() => ({}))
    if (!body.matchId || typeof body.matchId !== 'string') return NextResponse.json({ error: 'A match is required.' }, { status: 400 })

    const rapidApiKey = process.env.RAPIDAPI_KEY
    const directApiKey = process.env.API_FOOTBALL_KEY
    const apiKey = rapidApiKey || directApiKey
    if (!apiKey) return NextResponse.json({ error: 'Configure RAPIDAPI_KEY (preferred) or API_FOOTBALL_KEY on the server.' }, { status: 503 })
    const credentials = { apiKey, rapidApi: Boolean(rapidApiKey) }

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*, league:leagues(*), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
      .eq('id', body.matchId)
      .single()
    if (matchError || !match) return NextResponse.json({ error: 'Match not found.' }, { status: 404 })

    const metadata = parseMetadata(match.analysis_summary)
    if (!metadata?.fixtureId || !metadata.homeTeamId || !metadata.awayTeamId) {
      return NextResponse.json({ error: 'This match was not imported from API-Football, so it has no provider IDs to analyze.' }, { status: 422 })
    }

    const season = metadata.season || new Date(match.kickoff_time).getUTCFullYear()
    const [homeFormFixtures, awayFormFixtures, h2hFixtures, injuries, homePlayers, awayPlayers] = await Promise.all([
      providerGet(`/fixtures?team=${metadata.homeTeamId}&last=5`, credentials),
      providerGet(`/fixtures?team=${metadata.awayTeamId}&last=5`, credentials),
      providerGet(`/fixtures/headtohead?h2h=${metadata.homeTeamId}-${metadata.awayTeamId}&last=10`, credentials),
      providerGet(`/injuries?fixture=${metadata.fixtureId}`, credentials),
      providerGet(`/players?team=${metadata.homeTeamId}&season=${season}`, credentials),
      providerGet(`/players?team=${metadata.awayTeamId}&season=${season}`, credentials),
    ])

    let news: Array<{ title?: string; description?: string }> = []
    if (process.env.NEWS_API_KEY) {
      const query = encodeURIComponent(`"${match.home_team?.name}" OR "${match.away_team?.name}"`)
      const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`, { cache: 'no-store' })
      const newsPayload = await newsResponse.json().catch(() => ({}))
      if (newsResponse.ok && Array.isArray(newsPayload.articles)) news = newsPayload.articles
    }

    const homeUnavailable = injuries.filter((item) => item.team?.id === Number(metadata.homeTeamId)).length
    const awayUnavailable = injuries.filter((item) => item.team?.id === Number(metadata.awayTeamId)).length
    const analysis = buildMatchAnalysis({
      homeTeam: { ...match.home_team, provider_id: Number(metadata.homeTeamId) },
      awayTeam: { ...match.away_team, provider_id: Number(metadata.awayTeamId) },
      homeFormFixtures,
      awayFormFixtures,
      h2hFixtures,
      homeUnavailable,
      awayUnavailable,
      homePlayers,
      awayPlayers,
      news,
      generatedAt: new Date().toISOString(),
    })

    const storedSummary = JSON.stringify({ ...metadata, analysis })
    const admin = createAdminClient()
    const { error: updateError } = await admin.from('matches').update({ analysis_summary: storedSummary }).eq('id', body.matchId)
    if (updateError) throw updateError

    return NextResponse.json({ matchId: body.matchId, analysis })
  } catch (error) {
    console.error('Match analysis failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Match analysis failed.' }, { status: 500 })
  }
}
