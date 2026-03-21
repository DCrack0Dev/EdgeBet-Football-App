import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return res
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          res.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register') || 
                     req.nextUrl.pathname.startsWith('/forgot-password') || 
                     req.nextUrl.pathname.startsWith('/reset-password')

  // If user is logged in and tries to access an auth page, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Protect dashboard routes (excluding public access to slips/analysis if needed)
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/profile') ||
                          req.nextUrl.pathname.startsWith('/saved') ||
                          req.nextUrl.pathname.startsWith('/subscription')

  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/dashboard/:path*', 
    '/profile/:path*',
    '/saved/:path*',
    '/subscription/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ],
}
