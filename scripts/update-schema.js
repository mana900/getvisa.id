const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateSchema() {
  console.log('🔄 Updating database schema...')

  try {
    // Add the new columns to visa_types table
    const alterQueries = [
      'ALTER TABLE visa_types ADD COLUMN IF NOT EXISTS guaranteed_date TEXT;',
      'ALTER TABLE visa_types ADD COLUMN IF NOT EXISTS description TEXT;', 
      'ALTER TABLE visa_types ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT ARRAY[]::TEXT[];',
      'ALTER TABLE visa_types DROP COLUMN IF EXISTS overview;'
    ]

    for (const query of alterQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.error(`❌ Error executing query: ${query}`, error)
      } else {
        console.log(`✅ Executed: ${query}`)
      }
    }

    console.log('✅ Schema update completed!')

  } catch (error) {
    console.error('❌ Schema update failed:', error)
  }
}

updateSchema()