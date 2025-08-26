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

async function clearData() {
  console.log('🧹 Clearing existing data...')

  try {
    // Delete all visa_types
    const { error } = await supabase
      .from('visa_types')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (error) {
      console.error('❌ Error clearing data:', error)
      return
    }

    console.log('✅ Successfully cleared all visa types data!')

  } catch (error) {
    console.error('❌ Clear operation failed:', error)
  }
}

clearData()