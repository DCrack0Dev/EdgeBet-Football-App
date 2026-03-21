import { NextResponse } from 'next/server'

export async function POST() {
  return new NextResponse('Stripe webhooks are disabled. Use Fake Mode for testing.', { status: 410 })
}
