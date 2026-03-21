import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return new NextResponse('Missing Supabase env vars', { status: 500 })
  }

  const cookieStore = await cookies()
  const res = NextResponse.json({ ok: true })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options)
        }
      },
    },
  })

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  return NextResponse.json(
    { user: { id: data.user.id, email: data.user.email } },
    { status: 200 }
  )
}

