import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addDisplayOrderColumn() {
  try {
    console.log('Adding display_order column to visa_types table...')

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'database', 'add-display-order.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('Error adding display_order column:', error)
      return
    }

    console.log('✅ Successfully added display_order column and updated existing records')
    console.log('✅ Created indexes for better performance')

  } catch (error) {
    console.error('Error running migration:', error)
  }
}

addDisplayOrderColumn()