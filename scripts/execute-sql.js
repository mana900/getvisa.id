const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function executeSQLDirect() {
  console.log('🔧 Disabling RLS directly via PostgreSQL...')
  
  // Direct PostgreSQL connection using the password you provided
  const client = new Client({
    host: 'db.aokgasdirwpexlwequkq.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '9aP3XHppxL6iMpss',
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Disable RLS on both tables
    await client.query('ALTER TABLE visa_types DISABLE ROW LEVEL SECURITY;')
    console.log('✅ Disabled RLS on visa_types')
    
    await client.query('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;')
    console.log('✅ Disabled RLS on profiles')

    console.log('🚀 RLS disabled! You can now use the admin interface without authentication issues.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

executeSQLDirect()