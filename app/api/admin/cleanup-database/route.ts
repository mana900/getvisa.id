import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST() {
  try {
    console.log('Starting database cleanup...')
    
    // Execute cleanup SQL commands one by one
    const cleanupCommands = [
      'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users',
      'DROP FUNCTION IF EXISTS handle_new_user()',
      'DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles',
      'DROP POLICY IF EXISTS "Users can view their own profile" ON profiles',
      'DROP POLICY IF EXISTS "Users can update their own profile" ON profiles',
      'DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles',
      'DROP TABLE IF EXISTS profiles CASCADE'
    ]

    for (const command of cleanupCommands) {
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: command })
        if (error) {
          console.log(`Skipping command (expected): ${command}`, error.message)
        } else {
          console.log(`Executed: ${command}`)
        }
      } catch (err) {
        console.log(`Skipping command (expected): ${command}`, err)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database cleanup completed' 
    })
    
  } catch (error: any) {
    console.error('Error during cleanup:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}