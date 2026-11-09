import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { initiatePeachCheckout } from '@/lib/peach'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    const entityId = process.env.PEACH_ENTITY_ID

    if (!entityId || !siteUrl) {
      console.error('[PEACH_ERROR] Peach or site URL configuration is missing')
      return new NextResponse('Configuration error: Missing Entity ID', { status: 500 })
    }

    // Amount for Premium - in Stripe it was process.env.STRIPE_PREMIUM_PRICE_ID
    // For Peach, we use the actual amount. I'll use a hardcoded value or an env var.
    const amount = process.env.PEACH_PREMIUM_AMOUNT || '199.00'
    const currency = process.env.PEACH_CURRENCY || 'ZAR'
    const nonce = crypto.randomBytes(16).toString('hex')
    const merchantTransactionId = `sub_${authUser.id}_${Date.now()}`

    const checkoutParams: any = {
      'authentication.entityId': entityId,
      amount: amount,
      currency,
      nonce: nonce,
      merchantTransactionId: merchantTransactionId,
      shopperResultUrl: `${siteUrl}/dashboard?success=true`,
      cancelUrl: `${siteUrl}/subscription?canceled=true`,
      notificationUrl: `${siteUrl}/api/peach/webhook`,
      paymentType: 'DB',
      createRegistration: 'true',
      'customer.email': authUser.email,
      'customer.givenName': authUser.user_metadata?.full_name?.split(' ')[0] || 'User',
      'customer.surname': authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Customer',
    }

    const checkoutResponse = await initiatePeachCheckout(checkoutParams)

    if (checkoutResponse.redirectUrl) {
      return NextResponse.json({ url: checkoutResponse.redirectUrl })
    } else {
      console.error('[PEACH_ERROR] No redirect URL in response', checkoutResponse)
      return new NextResponse('Failed to initiate checkout', { status: 500 })
    }
  } catch (error: any) {
    console.error('[PEACH_ERROR]', error)
    return new NextResponse(error.message, { status: 500 })
  }
}
