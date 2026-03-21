import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  return new NextResponse('Stripe webhooks are disabled. Use Fake Mode for testing.', { status: 410 })
}
