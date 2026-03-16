import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, subscriptions(*)')
      .eq('id', authUser.id)
      .single()

    const subscription = profile?.subscriptions?.[0]

    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')

    if (!priceId) {
      console.error('[STRIPE_ERROR] STRIPE_PREMIUM_PRICE_ID is not set')
      return new NextResponse('Configuration error: Missing Price ID', { status: 500 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: subscription?.stripe_customer_id || undefined,
      customer_email: subscription?.stripe_customer_id ? undefined : authUser.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/subscription?canceled=true`,
      metadata: {
        userId: authUser.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('[STRIPE_ERROR]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
