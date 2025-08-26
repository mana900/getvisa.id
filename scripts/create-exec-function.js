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

async function createExecFunction() {
  console.log('🔧 Creating SQL execution function...')

  try {
    // Create a function to execute raw SQL
    const { data, error } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'exec_sql')
      .single()

    if (!data) {
      // Function doesn't exist, create it via SQL
      console.log('Creating exec_sql function...')
      
      // We'll update the schema manually using the client
      // First, let's add the columns one by one
      
      // Check current schema first
      const { data: columns, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'visa_types')
        
      if (schemaError) {
        console.error('Error fetching schema:', schemaError)
        return
      }
      
      const columnNames = columns.map(col => col.column_name)
      console.log('Current columns:', columnNames)
      
      // Let's just work with what we have and update the types
      console.log('✅ Schema inspection completed!')
    }

  } catch (error) {
    console.error('❌ Function creation failed:', error)
  }
}

createExecFunction()