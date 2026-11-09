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
    const email = body?.email as string | undefined
    const password = body?.password as string | undefined

    if (!email || !password) {
      return jsonError('Missing email or password.', 400)
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonError('Supabase is not configured on the server.', 500)
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
      return jsonError(error.message, 401)
    }

    return res
  } catch (e: any) {
    console.error('[AUTH_LOGIN_ERROR]', e)
    return jsonError('Login failed. Please try again.', 500)
  }
}
