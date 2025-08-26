const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addColumns() {
  console.log('Adding columns to documents table...');
  
  try {
    // Add rejection_reason column
    const { data: data1, error: error1 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;'
    });
    
    if (error1) {
      console.log('Error adding rejection_reason:', error1);
    } else {
      console.log('✅ Added rejection_reason column');
    }

    // Add reviewed_at column  
    const { data: data2, error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;'
    });
    
    if (error2) {
      console.log('Error adding reviewed_at:', error2);
    } else {
      console.log('✅ Added reviewed_at column');
    }

    // Add reviewed_by column
    const { data: data3, error: error3 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);'
    });
    
    if (error3) {
      console.log('Error adding reviewed_by:', error3);
    } else {
      console.log('✅ Added reviewed_by column');
    }

    console.log('🎉 Database schema update complete!');
    
  } catch (error) {
    console.error('❌ Failed to update schema:', error);
  }
}

addColumns();