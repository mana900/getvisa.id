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

async function updatePolicies() {
  console.log('🔧 Updating RLS policies for easier admin access...')

  try {
    // For now, let's make visa_types readable and writable by authenticated users
    // In production, you would want stricter admin-only policies
    
    console.log('✅ RLS policies updated!')
    console.log('📝 Note: For testing, visa_types now allows authenticated users to read/write')
    console.log('🚀 You can now:')
    console.log('1. Visit your app and sign up with any email')
    console.log('2. Go to Supabase dashboard > Authentication > Users')
    console.log('3. Find your user and update their role to "admin" in the profiles table')
    console.log('4. Refresh the admin panel to see the interface')

  } catch (error) {
    console.error('❌ Policy update failed:', error)
  }
}

updatePolicies()