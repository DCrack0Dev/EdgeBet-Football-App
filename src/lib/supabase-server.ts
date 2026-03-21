import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE) {
       // Return a dummy client during build to prevent crash
       const dummyResult = { data: null, error: null, count: 0 };
       const dummyChain = {
         select: () => dummyChain,
         eq: () => dummyChain,
         neq: () => dummyChain,
         order: () => dummyChain,
         limit: () => dummyChain,
         single: async () => dummyResult,
         maybeSingle: async () => dummyResult,
         then: (cb: any) => Promise.resolve(cb(dummyResult))
       } as any;

       return {
         auth: { 
           getSession: async () => ({ data: { session: null }, error: null }), 
           getUser: async () => ({ data: { user: null }, error: null }) 
         },
         from: () => dummyChain
       } as any
    }
    throw new Error('Missing Supabase environment variables for server-side initialization.')
  }

  return createServerComponentClient({ cookies })
}

// Admin client for server-side only (using service role key)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE) {
       // Use placeholders during build or dev if missing
       return createClient(supabaseUrl || 'https://placeholder.co', serviceRoleKey || 'key')
    }
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for admin client.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
