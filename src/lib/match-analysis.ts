export type Recommendation = {
  rank: number
  market: string
  selection: string
  probability: number
  confidence: number
  risk: 'low' | 'medium' | 'high'
  rationale: string[]
}

export type MatchAnalysis = {
  generatedAt: string
  dataSources: string[]
  factors: {
    form: { home: string; away: string; homePoints: number; awayPoints: number }
    h2h: { homeWins: number; draws: number; awayWins: number }
    goals: { homeAverage: number; awayAverage: number; expectedTotal: number }
    playerAvailability: { homeUnavailable: number; awayUnavailable: number }
    players: { home: PlayerSummary; away: PlayerSummary }
    news: { articles: number; homeSentiment: number; awaySentiment: number }
  }
  recommendations: Recommendation[]
}

type Fixture = any

type FormSummary = {
  points: number
  played: number
  goalsFor: number
  goalsAgainst: number
  wins: number
  draws: number
  losses: number
}

type PlayerSummary = {
  players: number
  appearances: number
  goals: number
  assists: number
  averageRating: number
  topScorer: string
}

const negativeWords = ['injury', 'injured', 'suspended', 'missing', 'doubt', 'crisis', 'loss', 'lost', 'defeat', 'poor', 'sack', 'ban']
const positiveWords = ['win', 'won', 'victory', 'boost', 'return', 'fit', 'unbeaten', 'confident', 'welcome', 'sign']

function emptyForm(): FormSummary {
  return { points: 0, played: 0, goalsFor: 0, goalsAgainst: 0, wins: 0, draws: 0, losses: 0 }
}

function summarizePlayers(response: Fixture[]): PlayerSummary {
  const summary: PlayerSummary = { players: 0, appearances: 0, goals: 0, assists: 0, averageRating: 0, topScorer: 'No player data' }
  let ratingTotal = 0
  let ratingCount = 0
  let topGoals = 0
  for (const item of response || []) {
    summary.players += 1
    for (const stat of item.statistics || []) {
      summary.appearances += Number(stat.games?.appearences || 0)
      summary.goals += Number(stat.goals?.total || 0)
      summary.assists += Number(stat.goals?.assists || 0)
      const rating = Number(stat.games?.rating)
      if (Number.isFinite(rating)) {
        ratingTotal += rating
        ratingCount += 1
      }
      if (Number(stat.goals?.total || 0) > topGoals) {
        topGoals = Number(stat.goals.total)
        summary.topScorer = item.player?.name || 'Unknown player'
      }
    }
  }
  summary.averageRating = ratingCount ? Number((ratingTotal / ratingCount).toFixed(2)) : 0
  return summary
}

function summarizeForm(fixtures: Fixture[], teamId: number): FormSummary {
  const summary = emptyForm()
  for (const item of fixtures || []) {
    const homeId = item.teams?.home?.id
    const isHome = homeId === teamId
    const scored = Number(isHome ? item.goals?.home : item.goals?.away)
    const conceded = Number(isHome ? item.goals?.away : item.goals?.home)
    if (!Number.isFinite(scored) || !Number.isFinite(conceded)) continue
    summary.played += 1
    summary.goalsFor += scored
    summary.goalsAgainst += conceded
    if (scored > conceded) {
      summary.wins += 1
      summary.points += 3
    } else if (scored === conceded) {
      summary.draws += 1
      summary.points += 1
    } else {
      summary.losses += 1
    }
  }
  return summary
}

function formLabel(form: FormSummary) {
  if (!form.played) return 'No recent results'
  return `${form.wins}W ${form.draws}D ${form.losses}L (${form.points}/${form.played * 3} pts)`
}

function sentiment(text: string) {
  const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean)
  const positive = words.filter((word) => positiveWords.includes(word)).length
  const negative = words.filter((word) => negativeWords.includes(word)).length
  return positive - negative
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value))
}

export function buildMatchAnalysis(input: {
  homeTeam: any
  awayTeam: any
  homeFormFixtures: Fixture[]
  awayFormFixtures: Fixture[]
  h2hFixtures: Fixture[]
  homeUnavailable: number
  awayUnavailable: number
  homePlayers: Fixture[]
  awayPlayers: Fixture[]
  news: Array<{ title?: string; description?: string }>
  generatedAt: string
}): MatchAnalysis {
  const homeId = Number(input.homeTeam?.provider_id)
  const awayId = Number(input.awayTeam?.provider_id)
  const homeForm = summarizeForm(input.homeFormFixtures, homeId)
  const awayForm = summarizeForm(input.awayFormFixtures, awayId)
  const homePlayers = summarizePlayers(input.homePlayers)
  const awayPlayers = summarizePlayers(input.awayPlayers)

  let homeWins = 0
  let awayWins = 0
  let draws = 0
  for (const item of input.h2hFixtures || []) {
    const winner = item.teams?.home?.winner
    const homeIsOurHome = item.teams?.home?.id === homeId
    if (winner === null || winner === undefined) continue
    if (winner) homeIsOurHome ? homeWins++ : awayWins++
    else homeIsOurHome ? awayWins++ : homeWins++
    if (item.goals?.home === item.goals?.away) {
      draws++
      if (winner) homeIsOurHome ? homeWins-- : awayWins--
      else homeIsOurHome ? awayWins-- : homeWins--
    }
  }

  const homeGoals = homeForm.played ? homeForm.goalsFor / homeForm.played : 1.2
  const awayGoals = awayForm.played ? awayForm.goalsFor / awayForm.played : 1.0
  const expectedTotal = homeGoals + awayGoals
  const newsScores = input.news.map((article) => sentiment(`${article.title || ''} ${article.description || ''}`))
  const homeNews = newsScores.filter((score) => score > 0).length - newsScores.filter((score) => score < 0).length
  const awayNews = input.news.filter((article) => `${article.title || ''} ${article.description || ''}`.toLowerCase().includes(String(input.awayTeam?.name || '').toLowerCase())).map((article) => sentiment(`${article.title || ''} ${article.description || ''}`)).reduce((sum, score) => sum + score, 0)
  const homeNewsForTeam = input.news.filter((article) => `${article.title || ''} ${article.description || ''}`.toLowerCase().includes(String(input.homeTeam?.name || '').toLowerCase())).map((article) => sentiment(`${article.title || ''} ${article.description || ''}`)).reduce((sum, score) => sum + score, 0)

  const formEdge = (homeForm.points / Math.max(1, homeForm.played * 3)) - (awayForm.points / Math.max(1, awayForm.played * 3))
  const h2hEdge = (homeWins - awayWins) / Math.max(1, homeWins + awayWins + draws)
  const availabilityEdge = (input.awayUnavailable - input.homeUnavailable) * 0.025
  const newsEdge = (homeNewsForTeam - awayNews) * 0.025
  const playerEdge = clamp((homePlayers.averageRating - awayPlayers.averageRating) * 0.06 + (homePlayers.goals - awayPlayers.goals) * 0.008, -0.12, 0.12)
  const homeEdge = clamp(0.5 + formEdge * 0.30 + h2hEdge * 0.12 + availabilityEdge + newsEdge + playerEdge + 0.04, 0.12, 0.82)
  const awayEdge = clamp(0.5 - formEdge * 0.30 - h2hEdge * 0.12 - availabilityEdge - newsEdge - playerEdge - 0.04, 0.08, 0.72)
  const drawProbability = clamp(1 - homeEdge - awayEdge, 0.08, 0.38)
  const total = homeEdge + awayEdge + drawProbability
  const homeProbability = Math.round((homeEdge / total) * 100)
  const awayProbability = Math.round((awayEdge / total) * 100)
  const drawPercent = 100 - homeProbability - awayProbability
  const homeName = input.homeTeam?.name || 'Home team'
  const awayName = input.awayTeam?.name || 'Away team'
  const homeOrDraw = homeProbability + drawPercent
  const awayOrDraw = awayProbability + drawPercent
  const over15 = clamp(Math.round(48 + (expectedTotal - 1.5) * 18), 45, 82)
  const resultSelection = homeProbability >= awayProbability && homeProbability >= drawPercent ? `${homeName} to win` : awayProbability >= homeProbability && awayProbability >= drawPercent ? `${awayName} to win` : 'Draw'
  const resultProbability = Math.max(homeProbability, awayProbability, drawPercent)
  const safeSelection = homeOrDraw >= awayOrDraw ? `${homeName} or Draw (1X)` : `${awayName} or Draw (X2)`
  const safeProbability = Math.max(homeOrDraw, awayOrDraw)
  const goalsSelection = expectedTotal >= 2.25 ? 'Over 1.5 goals' : 'Under 3.5 goals'
  const goalsProbability = expectedTotal >= 2.25 ? over15 : clamp(Math.round(72 - expectedTotal * 8), 50, 78)

  const rationale = [
    `Recent form: ${homeName} ${formLabel(homeForm)}; ${awayName} ${formLabel(awayForm)}.`,
    `H2H sample: ${homeWins} home-side wins, ${draws} draws, ${awayWins} away-side wins.`,
    `Expected goals from recent scoring rates: ${expectedTotal.toFixed(2)}.`,
    `Player production: ${homeName} ${homePlayers.goals} goals / ${homePlayers.assists} assists; ${awayName} ${awayPlayers.goals} goals / ${awayPlayers.assists} assists.`,
  ]
  if (input.homeUnavailable || input.awayUnavailable) rationale.push(`Unavailable players: ${homeName} ${input.homeUnavailable}, ${awayName} ${input.awayUnavailable}.`)
  if (input.news.length) rationale.push(`${input.news.length} recent news articles were included in the analysis.`)

  return {
    generatedAt: input.generatedAt,
    dataSources: ['API-Football fixtures', 'API-Football H2H', 'API-Football team form', 'API-Football injuries', 'NewsAPI'],
    factors: {
      form: { home: formLabel(homeForm), away: formLabel(awayForm), homePoints: homeForm.points, awayPoints: awayForm.points },
      h2h: { homeWins, draws, awayWins },
      goals: { homeAverage: Number(homeGoals.toFixed(2)), awayAverage: Number(awayGoals.toFixed(2)), expectedTotal: Number(expectedTotal.toFixed(2)) },
      playerAvailability: { homeUnavailable: input.homeUnavailable, awayUnavailable: input.awayUnavailable },
      players: { home: homePlayers, away: awayPlayers },
      news: { articles: input.news.length, homeSentiment: homeNews + homeNewsForTeam, awaySentiment: awayNews },
    },
    recommendations: [
      { rank: 1, market: 'Match result', selection: resultSelection, probability: resultProbability, confidence: clamp(Math.round(resultProbability / 10), 1, 9), risk: resultProbability >= 60 ? 'medium' : 'high', rationale },
      { rank: 2, market: 'Double chance', selection: safeSelection, probability: safeProbability, confidence: clamp(Math.round(safeProbability / 10), 1, 9), risk: 'low', rationale: [rationale[0], rationale[1], 'Double chance covers two match-result outcomes.'] },
      { rank: 3, market: 'Goals', selection: goalsSelection, probability: goalsProbability, confidence: clamp(Math.round(goalsProbability / 10), 1, 9), risk: goalsProbability >= 65 ? 'medium' : 'high', rationale: [rationale[0], rationale[2], 'Goals recommendation is based on recent scoring and conceding rates.'] },
    ],
  }
}
