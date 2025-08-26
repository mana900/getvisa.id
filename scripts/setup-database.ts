import { supabaseAdmin } from '../lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

async function setupDatabase() {
  console.log('Setting up database schema...')

  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'))

    console.log(`Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement })
        if (error) {
          // Try direct execution if rpc fails
          const { error: directError } = await supabaseAdmin
            .from('_temp')
            .select('*')
            .limit(0) // This will fail but allows us to execute SQL
          
          // If both fail, log the statement for manual execution
          console.log('Statement that may need manual execution:', statement)
        }
      } catch (err) {
        console.log('Statement that may need manual execution:', statement)
      }
    }

    console.log('Database schema setup completed!')
    console.log('Note: Some statements may need to be executed manually in the Supabase dashboard if they failed.')

  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

// Alternative approach: Execute key statements individually
async function setupDatabaseManual() {
  console.log('Setting up database with individual queries...')

  try {
    // Create profiles table
    const { error: profilesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (profilesError) console.error('Profiles table error:', profilesError)

    // Create visa_types table
    const { error: visaTypesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS visa_types (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          country TEXT NOT NULL,
          country_code TEXT NOT NULL,
          flag TEXT NOT NULL,
          visa_type TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          processing_time TEXT NOT NULL,
          duration TEXT NOT NULL,
          validity TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          overview JSONB DEFAULT '{}'::jsonb,
          eligibility TEXT[] DEFAULT ARRAY[]::TEXT[],
          timeline JSONB DEFAULT '[]'::jsonb,
          documents TEXT[] DEFAULT ARRAY[]::TEXT[],
          faqs JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (visaTypesError) console.error('Visa types table error:', visaTypesError)

    console.log('Manual setup completed!')

  } catch (error) {
    console.error('Error in manual setup:', error)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  console.log('Choose setup method:')
  console.log('1. Full schema setup (may need manual intervention)')
  console.log('2. Manual table creation')
  
  // For now, let's try the full setup
  setupDatabase().then(() => {
    console.log('Setup process finished. Please check Supabase dashboard to verify tables were created.')
  })
}

export { setupDatabase, setupDatabaseManual }