import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function cleanupDatabase() {
  try {
    console.log('Starting database cleanup...')
    
    // Drop the profiles-related trigger and function
    await supabase.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP FUNCTION IF EXISTS handle_new_user();
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
        DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
        DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
        DROP TABLE IF EXISTS profiles CASCADE;
      `
    })
    
    console.log('Database cleanup completed successfully!')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

cleanupDatabase()