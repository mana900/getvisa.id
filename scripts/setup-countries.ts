#!/usr/bin/env tsx

import { getSupabaseAdmin } from '../lib/supabase'

async function setupCountries() {
  console.log('Setting up countries table...')
  
  const supabase = getSupabaseAdmin()
  
  try {
    // Check if countries table exists and has data
    const { data: existingCountries, error } = await supabase
      .from('countries')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Countries table does not exist or is not accessible.')
      console.log('Please run the SQL setup script first:')
      console.log('sql/countries-setup.sql')
      return
    }

    if (existingCountries && existingCountries.length > 0) {
      console.log('Countries table already has data. Skipping initial setup.')
      console.log('You can manage countries through the admin panel at /admin/countries')
      return
    }

    console.log('Countries table is empty. The SQL setup script should populate it automatically.')
    console.log('If countries are missing, please run the SQL setup script:')
    console.log('sql/countries-setup.sql')
    
    // Check if countries were created
    const { data: countries, error: fetchError } = await supabase
      .from('countries')
      .select('country_name')
      .eq('is_active', true)

    if (fetchError) {
      console.error('Error fetching countries:', fetchError)
      return
    }

    if (countries && countries.length > 0) {
      console.log(`✅ Found ${countries.length} countries in database:`)
      countries.forEach(country => {
        console.log(`  - ${country.country_name}`)
      })
    } else {
      console.log('⚠️  No countries found. Please run the SQL setup script.')
    }

  } catch (error) {
    console.error('Error setting up countries:', error)
  }
}

if (require.main === module) {
  setupCountries()
    .then(() => {
      console.log('Countries setup completed.')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Setup failed:', error)
      process.exit(1)
    })
}

export default setupCountries