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

async function createAdminUser() {
  console.log('🔧 Creating admin user...')

  const adminEmail = 'admin@getvisa.id'
  const adminPassword = 'admin123'

  try {
    // Create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User'
      }
    })

    if (authError) {
      console.error('❌ Error creating user:', authError)
      return
    }

    console.log('✅ User created successfully!')

    // Update user role to admin
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('❌ Error updating user role:', profileError)
        return
      }

      console.log('✅ User role updated to admin!')
      console.log(`📧 Admin Email: ${adminEmail}`)
      console.log(`🔑 Admin Password: ${adminPassword}`)
      console.log('🚀 You can now login to the admin panel!')
    }

  } catch (error) {
    console.error('❌ Admin creation failed:', error)
  }
}

createAdminUser()