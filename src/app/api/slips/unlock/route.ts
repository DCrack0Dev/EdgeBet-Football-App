import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json().catch(() => ({}))
    const slipId = body?.slipId as string | undefined

    if (!slipId) return new NextResponse('Missing slipId', { status: 400 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscriptions(*)')
      .eq('id', user.id)
      .single()

    const isPremium =
      profile?.role === 'admin' ||
      profile?.subscriptions?.some((s: any) => s.status === 'premium' && (!s.current_period_end || new Date(s.current_period_end) > new Date()))

    if (isPremium) {
      return NextResponse.json({ unlocked: true, reason: 'premium' })
    }

    const { data: slip } = await supabase
      .from('slips')
      .select('id, is_premium, is_published')
      .eq('id', slipId)
      .single()

    if (!slip || !slip.is_published) return new NextResponse('Slip not found', { status: 404 })
    if (slip.is_premium) return new NextResponse('Premium slip requires Premium subscription', { status: 403 })

    const today = new Date()
    const unlockDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
      .toISOString()
      .slice(0, 10)

    const { count } = await supabase
      .from('slip_unlocks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('unlock_date', unlockDate)

    if ((count || 0) >= 1) {
      return new NextResponse('Daily unlock limit reached', { status: 429 })
    }

    const { error } = await supabase
      .from('slip_unlocks')
      .insert({ user_id: user.id, slip_id: slipId, unlock_date: unlockDate })

    if (error) {
      return new NextResponse(error.message, { status: 400 })
    }

    return NextResponse.json({ unlocked: true, reason: 'ad' })
  } catch (e: any) {
    return new NextResponse(e?.message || 'Internal Server Error', { status: 500 })
  }
}

