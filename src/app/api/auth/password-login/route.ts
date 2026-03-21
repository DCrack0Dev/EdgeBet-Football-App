import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = body?.email as string | undefined
    const password = body?.password as string | undefined

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 })
    }

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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return new NextResponse(error.message, { status: 401 })
    }

    return res
  } catch (e: any) {
    return new NextResponse(e?.message || 'Internal Server Error', { status: 500 })
  }
}
