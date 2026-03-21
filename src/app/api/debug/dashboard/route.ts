import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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

    const sessionResult = await supabase.auth.getSession()
    const sessionUserId = sessionResult.data.session?.user?.id || null

    let profileResult: any = null
    if (sessionUserId) {
      profileResult = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', sessionUserId)
        .single()
    }

    return NextResponse.json({
      session: {
        hasSession: !!sessionResult.data.session,
        userId: sessionUserId,
        error: sessionResult.error?.message || null,
      },
      profile: profileResult
        ? {
            data: profileResult.data || null,
            error: profileResult.error?.message || null,
          }
        : null,
    })
  } catch (e: any) {
    return new NextResponse(e?.message || 'Internal Server Error', { status: 500 })
  }
}

