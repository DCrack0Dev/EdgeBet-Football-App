import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : ''

    if (!email || !password || !fullName) {
      return jsonError('Full name, email, and password are required.', 400)
    }

    if (password.length < 6) {
      return jsonError('Password must be at least 6 characters long.', 400)
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonError('Supabase is not configured on the server.', 500)
    }

    const response = NextResponse.json({ ok: true })
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${siteUrl.replace(/\/$/, '')}/api/auth/callback`,
      },
    })

    if (error) {
      return jsonError(error.message, 400)
    }

    return NextResponse.json({
      ok: true,
      requiresEmailConfirmation: !data.session,
    }, { headers: response.headers })
  } catch (error) {
    console.error('[AUTH_REGISTER_ERROR]', error)
    return jsonError('Registration failed. Please try again.', 500)
  }
}
