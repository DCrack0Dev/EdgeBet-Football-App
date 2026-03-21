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

    // Reset subscription entry
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'free',
        current_period_end: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', authUser.id)

    if (error) {
      console.error('[FAKE_DOWNGRADE_ERROR]', error)
      return new NextResponse('Database error: Failed to downgrade', { status: 500 })
    }

    console.log(`[FAKE_DOWNGRADE] User ${authUser.id} reset to free (test mode)`)
    return NextResponse.json({ success: true, message: 'Reset to Free' })
  } catch (error: any) {
    console.error('[FAKE_DOWNGRADE_ERROR]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
