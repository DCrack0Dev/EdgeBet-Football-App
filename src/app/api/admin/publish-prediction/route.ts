import { NextResponse } from 'next/server'
import { createAdminClient, createServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Only administrators can publish predictions.' }, { status: 403 })

    const body = await request.json().catch(() => ({}))
    const recommendation = body.recommendation
    if (!body.matchId || !recommendation?.selection || !recommendation?.probability) {
      return NextResponse.json({ error: 'A match and recommendation are required.' }, { status: 400 })
    }

    const probability = Number(recommendation.probability)
    if (!Number.isFinite(probability) || probability < 1 || probability > 99) {
      return NextResponse.json({ error: 'The recommendation probability is invalid.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: match, error: matchError } = await admin
      .from('matches')
      .select('id, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name), kickoff_time')
      .eq('id', body.matchId)
      .single()
    if (matchError || !match) return NextResponse.json({ error: 'Match not found.' }, { status: 404 })

    const estimatedOdds = Number((100 / probability).toFixed(2))
    const rationale = Array.isArray(recommendation.rationale) ? recommendation.rationale.join(' ') : 'Generated from the explainable pre-match analysis engine.'
    const analystReason = `Pre-match analysis (${new Date().toISOString()}): ${rationale} Model probability: ${probability}%. This is an analytical estimate, not a guarantee.`

    const { data: pick, error: pickError } = await admin.from('picks').insert({
      match_id: body.matchId,
      selection_type: recommendation.market || 'Analysis',
      market_primary: recommendation.selection,
      market_secondary: null,
      display_label: recommendation.selection,
      odds: estimatedOdds,
      confidence_score: Math.max(1, Math.min(10, Number(recommendation.confidence) || Math.round(probability / 10))),
      risk_level: ['low', 'medium', 'high'].includes(recommendation.risk) ? recommendation.risk : 'medium',
      analyst_reason: analystReason,
      premium_only: Boolean(body.premiumOnly),
      result_status: 'pending',
      created_by: session.user.id,
    }).select().single()
    if (pickError || !pick) throw pickError || new Error('Could not create pick.')

    let slipId = body.slipId as string | undefined
    if (!slipId) {
      const homeName = (match.home_team as any)?.[0]?.name
      const awayName = (match.away_team as any)?.[0]?.name
      const title = typeof body.newSlipTitle === 'string' && body.newSlipTitle.trim() ? body.newSlipTitle.trim() : `Daily Analysis — ${new Date(match.kickoff_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      const description = typeof body.newSlipDescription === 'string' && body.newSlipDescription.trim()
        ? body.newSlipDescription.trim()
        : `Pre-match analysis slip for ${homeName || 'Home'} vs ${awayName || 'Away'}. Selections are ranked from form, H2H, player data, injuries and news.`
      const { data: slip, error: slipError } = await admin.from('slips').insert({
        title,
        description,
        type: 'combo',
        is_premium: Boolean(body.premiumOnly),
        is_published: true,
        total_odds: estimatedOdds,
        status: 'pending',
        created_by: session.user.id,
      }).select('id').single()
      if (slipError || !slip) throw slipError || new Error('Could not create slip.')
      slipId = slip.id
    } else {
      const { data: existingSlip, error: existingSlipError } = await admin.from('slips').select('id').eq('id', slipId).single()
      if (existingSlipError || !existingSlip) return NextResponse.json({ error: 'Selected slip was not found.' }, { status: 404 })
    }

    const { error: itemError } = await admin.from('slip_items').insert({ slip_id: slipId, pick_id: pick.id })
    if (itemError) throw itemError

    const { data: items, error: itemsError } = await admin
      .from('slip_items')
      .select('pick:picks(odds)')
      .eq('slip_id', slipId)
    if (itemsError) throw itemsError
    const totalOdds = (items || []).reduce((total: number, item: any) => total * Number(item.pick?.odds || 1), 1)
    const { error: totalError } = await admin.from('slips').update({ total_odds: Number(totalOdds.toFixed(2)) }).eq('id', slipId)
    if (totalError) throw totalError

    return NextResponse.json({ pickId: pick.id, slipId, estimatedOdds, totalOdds: Number(totalOdds.toFixed(2)) })
  } catch (error) {
    console.error('Prediction publishing failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Prediction publishing failed.' }, { status: 500 })
  }
}
