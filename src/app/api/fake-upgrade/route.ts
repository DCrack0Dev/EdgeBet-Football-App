import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (process.env.USE_FAKE_PAYMENTS !== 'true') {
      return new NextResponse('Fake payments are disabled', { status: 403 })
    }

    // Amount and date setup
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Update or create subscription entry
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: authUser.id,
        status: 'premium',
        is_premium: true,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('[FAKE_UPGRADE_ERROR]', error)
      return new NextResponse('Database error: Failed to upgrade', { status: 500 })
    }

    console.log(`[FAKE_UPGRADE] User ${authUser.id} upgraded to premium (test mode)`)
    return NextResponse.json({ success: true, message: 'Upgraded to Premium' })
  } catch (error: any) {
    console.error('[FAKE_UPGRADE_ERROR]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
