import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[STRIPE_WEBHOOK] STRIPE_WEBHOOK_SECRET is not set')
    return new NextResponse('Configuration Error', { status: 500 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (error: any) {
    console.error(`[STRIPE_WEBHOOK] Signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const eventData = event.data.object as any

  console.log(`[STRIPE_WEBHOOK] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = eventData
        const subscriptionId = session.subscription as string
        const userId = session.metadata.userId

        if (!userId) {
          console.error('[STRIPE_WEBHOOK] No userId in metadata')
          return new NextResponse('Missing userId in metadata', { status: 400 })
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            status: 'premium',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

        if (error) throw error
        console.log(`[STRIPE_WEBHOOK] Subscription activated for user: ${userId}`)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = eventData
        const status = subscription.status === 'active' ? 'premium' : 'free'
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        console.log(`[STRIPE_WEBHOOK] Subscription updated: ${subscription.id} -> ${status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = eventData
        
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'free',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        console.log(`[STRIPE_WEBHOOK] Subscription deleted: ${subscription.id}`)
        break
      }

      case 'invoice.paid': {
        const invoice = eventData
        if (invoice.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
            const { error } = await supabaseAdmin
              .from('subscriptions')
              .update({
                status: 'premium',
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', invoice.subscription)
            
            if (error) throw error
            console.log(`[STRIPE_WEBHOOK] Invoice paid, subscription renewed: ${invoice.subscription}`)
          } catch (err: any) {
            console.error(`[STRIPE_WEBHOOK_ERROR] Failed to handle invoice.paid: ${err.message}`)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = eventData
        if (invoice.subscription) {
          try {
            const { error } = await supabaseAdmin
              .from('subscriptions')
              .update({
                status: 'free',
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', invoice.subscription)
            
            if (error) throw error
            console.log(`[STRIPE_WEBHOOK] Payment failed for subscription: ${invoice.subscription}`)
          } catch (err: any) {
            console.error(`[STRIPE_WEBHOOK_ERROR] Failed to handle invoice.payment_failed: ${err.message}`)
          }
        }
        break
      }
    }
  } catch (error: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR] ${error.message}`, error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }

  return new NextResponse(null, { status: 200 })
}
