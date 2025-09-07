const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createSettingsTable() {
  try {
    console.log('Creating settings table...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'create-settings-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql })
    
    if (error) {
      console.error('Error creating settings table:', error)
      
      // If exec_sql function doesn't exist, try direct execution
      if (error.message && error.message.includes('function exec_sql')) {
        console.log('Trying direct SQL execution...')
        
        // Split SQL into individual statements
        const statements = sql.split(';').filter(stmt => stmt.trim())
        
        for (const statement of statements) {
          if (statement.trim()) {
            console.log('Executing:', statement.trim().substring(0, 50) + '...')
            const { error: stmtError } = await supabase.from('_').select('1')
            // This is a workaround - we'll need to use a different approach
          }
        }
      }
      
      process.exit(1)
    }
    
    console.log('Settings table created successfully!')
    
    // Test the table by inserting/updating a setting
    console.log('Testing settings functionality...')
    
    const { data: testData, error: testError } = await supabase
      .from('settings')
      .upsert({
        key: 'test_setting',
        value: 'test_value',
        description: 'Test setting for verification'
      })
      .select()
    
    if (testError) {
      console.error('Error testing settings table:', testError)
    } else {
      console.log('Settings table test successful:', testData)
      
      // Clean up test setting
      await supabase.from('settings').delete().eq('key', 'test_setting')
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createSettingsTable()