import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createServerClient()

    const sessionResult = await supabase.auth.getSession()
    const userId = sessionResult.data.session?.user?.id || null

    const profileResult = userId
      ? await supabase
          .from('profiles')
          .select('id, email, role, subscriptions(*)')
          .eq('id', userId)
          .single()
      : null

    const featuredSlipsResult = await supabase
      .from('slips')
      .select('id, title, type, is_published, is_premium, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(10)

    const latestPicksResult = await supabase
      .from('picks')
      .select('id, selection_type, premium_only, result_status, created_at')
      .eq('result_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(8)

    const upcomingMatchesResult = await supabase
      .from('matches')
      .select('id, kickoff_time, status, created_at')
      .eq('status', 'scheduled')
      .gte('kickoff_time', new Date().toISOString())
      .order('kickoff_time', { ascending: true })
      .limit(5)

    const allPicksResult = await supabase
      .from('picks')
      .select('result_status, odds, created_at')
      .neq('result_status', 'pending')

    return NextResponse.json({
      session: {
        hasSession: !!sessionResult.data.session,
        userId,
        error: sessionResult.error?.message || null,
      },
      profile: profileResult
        ? { data: profileResult.data || null, error: profileResult.error?.message || null }
        : null,
      featuredSlips: {
        count: featuredSlipsResult.data?.length ?? null,
        error: featuredSlipsResult.error?.message || null,
      },
      latestPicks: {
        count: latestPicksResult.data?.length ?? null,
        error: latestPicksResult.error?.message || null,
      },
      upcomingMatches: {
        count: upcomingMatchesResult.data?.length ?? null,
        error: upcomingMatchesResult.error?.message || null,
      },
      allPicks: {
        count: allPicksResult.data?.length ?? null,
        error: allPicksResult.error?.message || null,
      },
    })
  } catch (e: any) {
    return new NextResponse(e?.message || 'Internal Server Error', { status: 500 })
  }
}

