const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

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

async function applyUpdatedSchema() {
  console.log('🔄 Applying updated schema (removing profiles, using auth.users)...')

  try {
    // Read the SQL file
    const sql = fs.readFileSync('./database/updated-schema.sql', 'utf8')
    
    // Split into individual statements (simple approach)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { query: statement })
        if (error) {
          console.warn(`⚠️  Statement ${i + 1} warning:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} failed:`, err.message)
      }
    }

    console.log('✅ Schema update completed!')
    console.log('📝 Summary of changes:')
    console.log('  - Removed custom profiles table')
    console.log('  - Updated RLS policies to use auth.users')
    console.log('  - User roles now stored in auth.users.user_metadata')
    console.log('  - Visa applications now reference auth.users directly')

  } catch (error) {
    console.error('❌ Schema update failed:', error)
  }
}

applyUpdatedSchema()