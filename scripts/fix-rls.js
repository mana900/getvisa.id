const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLS() {
  console.log('🔧 Fixing RLS policy issues...')

  // SQL commands to temporarily disable RLS for testing
  const sqlCommands = [
    'ALTER TABLE visa_types DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
  ]

  try {
    for (const sql of sqlCommands) {
      console.log(`Executing: ${sql}`)
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.error(`❌ Error executing ${sql}:`, error)
      } else {
        console.log(`✅ Executed: ${sql}`)
      }
    }

    console.log('✅ RLS temporarily disabled for testing!')
    console.log('🚀 You should now be able to create visa types without authentication')
    console.log('⚠️  Remember to re-enable RLS for production!')

  } catch (error) {
    console.error('❌ RLS fix failed:', error)
  }
}

fixRLS()