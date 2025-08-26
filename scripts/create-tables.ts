import { supabaseAdmin } from '../lib/supabase'

async function createTables() {
  console.log('Creating database tables...')

  try {
    // First, let's create the profiles table
    console.log('Creating profiles table...')
    
    const profilesSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON profiles
        FOR SELECT USING (auth.uid() = id);
        
      CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON profiles
        FOR UPDATE USING (auth.uid() = id);
        
      CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `

    // Execute using a REST API call since direct SQL execution might be limited
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({ sql: profilesSQL })
    })

    if (response.ok) {
      console.log('✅ Profiles table created successfully')
    } else {
      const error = await response.text()
      console.log('❌ Profiles table creation failed:', error)
    }

    // Create visa_types table
    console.log('Creating visa_types table...')
    
    const visaTypesSQL = `
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
      
      ALTER TABLE visa_types ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Anyone can view active visa types" ON visa_types
        FOR SELECT USING (is_active = true);
        
      CREATE POLICY IF NOT EXISTS "Admins can manage visa types" ON visa_types
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
          )
        );
    `

    const visaResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({ sql: visaTypesSQL })
    })

    if (visaResponse.ok) {
      console.log('✅ Visa types table created successfully')
    } else {
      const error = await visaResponse.text()
      console.log('❌ Visa types table creation failed:', error)
    }

    console.log('Table creation process completed!')
    console.log('Please check your Supabase dashboard to verify the tables were created.')

  } catch (error) {
    console.error('Error creating tables:', error)
    console.log('\nIf this script fails, please run the SQL from database/schema.sql manually in your Supabase dashboard.')
  }
}

// Alternative: Use the PostgREST API to execute SQL
async function createTablesViaSQL() {
  console.log('Creating tables via SQL execution...')
  
  try {
    // Test if we can access the database
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (error) {
      console.error('Cannot access database:', error)
      return
    }

    console.log('Database connection successful!')
    
    // For now, let's just verify the connection and ask user to run SQL manually
    console.log('\n📋 Next steps:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of database/schema.sql')
    console.log('4. Execute the SQL script')
    console.log('5. Then run: npm run migrate-data')

  } catch (error) {
    console.error('Error:', error)
  }
}

if (require.main === module) {
  createTablesViaSQL()
}

export { createTables, createTablesViaSQL }