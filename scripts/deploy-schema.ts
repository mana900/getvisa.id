import * as fs from 'fs'
import * as path from 'path'

async function deploySchema() {
  console.log('🚀 Deploying database schema to Supabase...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase environment variables')
    return
  }
  
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Schema file loaded successfully')
    
    // Execute the SQL using Supabase's REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      },
      body: JSON.stringify({ query: schema })
    })
    
    if (response.ok) {
      console.log('✅ Database schema deployed successfully!')
    } else {
      const errorText = await response.text()
      console.log('⚠️  API call failed:', response.status, errorText)
      console.log('\n📋 Manual deployment required:')
      console.log('1. Go to https://supabase.com/dashboard/project/aokgasdirwpexlwequkq/sql')
      console.log('2. Copy and paste the contents of database/schema.sql')
      console.log('3. Click "Run" to execute the schema')
    }
    
  } catch (error) {
    console.error('❌ Error deploying schema:', error)
    console.log('\n📋 Manual deployment required:')
    console.log('1. Go to https://supabase.com/dashboard/project/aokgasdirwpexlwequkq/sql')
    console.log('2. Copy and paste the contents of database/schema.sql')
    console.log('3. Click "Run" to execute the schema')
  }
}

// Run if called directly
if (require.main === module) {
  deploySchema()
}

export { deploySchema }