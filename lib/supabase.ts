import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Client for server-side operations (only available server-side)
export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should not be used on the client side')
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }

  return createClient<Database>(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}