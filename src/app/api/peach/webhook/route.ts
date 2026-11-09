import { verifyPeachWebhookSignature } from '@/lib/peach'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase credentials for webhook handler')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  
  const timestamp = headerList.get('x-webhook-timestamp') || ''
  const webhookId = headerList.get('x-webhook-id') || ''
  const signature = headerList.get('x-webhook-signature') || ''
  const secretToken = process.env.PEACH_SECRET_TOKEN

  if (!secretToken) {
    console.error('[PEACH_WEBHOOK] PEACH_SECRET_TOKEN is not set')
    return new NextResponse('Configuration Error', { status: 500 })
  }

  // Peach Checkout sends initial config as JSON, subsequent as form-urlencoded
  // But the signature verification usually applies to the raw body
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (!siteUrl) {
    return new NextResponse('Configuration Error', { status: 500 })
  }
  const webhookUrl = `${siteUrl}/api/peach/webhook`

  const isValid = verifyPeachWebhookSignature(
    timestamp,
    webhookId,
    webhookUrl,
    body,
    signature,
    secretToken
  )

  if (!isValid) {
    console.error(`[PEACH_WEBHOOK] Signature verification failed`)
    return new NextResponse('Webhook Error: Invalid Signature', { status: 401 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Parse the body
  const params = new URLSearchParams(body)
  const result = params.get('result.code')
  const status = params.get('status')
  const merchantTransactionId = params.get('merchantTransactionId')
  const registrationId = params.get('registrationId')
  const amount = params.get('amount')
  const currency = params.get('currency')

  const expectedAmount = process.env.PEACH_PREMIUM_AMOUNT || '199.00'
  const expectedCurrency = process.env.PEACH_CURRENCY || 'ZAR'
  if (amount !== expectedAmount || currency !== expectedCurrency) {
    console.error(`[PEACH_WEBHOOK] Unexpected amount or currency: ${amount} ${currency}`)
    return new NextResponse('Webhook Error: Invalid payment details', { status: 400 })
  }

  console.log(`[PEACH_WEBHOOK] Received event: ${status} for ${merchantTransactionId}`)

  // Result codes starting with 000.000 or 000.100 or 000.300 are successful
  const isSuccessful = result?.startsWith('000.000') || result?.startsWith('000.100') || result?.startsWith('000.300') || status === 'successful'

  try {
    if (isSuccessful && merchantTransactionId) {
      // Extract userId from merchantTransactionId (we set it as sub_{userId}_{timestamp})
      const userId = merchantTransactionId.split('_')[1]

      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
        console.error('[PEACH_WEBHOOK] No userId in merchantTransactionId')
        return new NextResponse('Missing userId in transaction ID', { status: 400 })
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (!profile) {
        return new NextResponse('Unknown user', { status: 400 })
      }

      // Update subscription in Supabase
      // We'll set the status to premium and store the registrationId for recurring
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          status: 'premium',
          peach_registration_id: registrationId,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      if (error) throw error
      console.log(`[PEACH_WEBHOOK] Subscription activated for user: ${userId}`)
    } else if (status === 'cancelled' || status === 'uncertain') {
        // Handle cancellation if needed
        console.log(`[PEACH_WEBHOOK] Transaction ${status} for ${merchantTransactionId}`)
    }
  } catch (error: any) {
    console.error(`[PEACH_WEBHOOK_ERROR] ${error.message}`, error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }

  return new NextResponse(null, { status: 200 })
}
