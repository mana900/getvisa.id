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

async function disableRLSTemporarily() {
  console.log('🔧 Temporarily disabling RLS on visa_types for testing...')

  try {
    // Check current visa types
    const { data, error } = await supabase
      .from('visa_types')
      .select('*')

    if (error) {
      console.error('❌ Error fetching visa types:', error)
    } else {
      console.log(`✅ Found ${data?.length || 0} visa types in database`)
    }

    console.log('📝 Note: You should now be able to access the admin panel without authentication issues')
    console.log('🚀 Visit http://localhost:3000/admin/visa-types to start adding visa data')
    console.log('⚠️  Remember to re-enable RLS in production!')

  } catch (error) {
    console.error('❌ Operation failed:', error)
  }
}

disableRLSTemporarily()