import { supabase } from '../lib/supabase'
import { visaTypes } from '../lib/visa-types'
import type { VisaTypeInsert } from '../lib/types/database'

async function migrateVisaData() {
  console.log('Starting visa data migration...')

  try {
    // Convert mock data to Supabase format
    const supabaseVisaData: VisaTypeInsert[] = visaTypes.map((visa: any) => ({
      country: visa.country,
      country_code: visa.countryCode,
      flag: visa.flag,
      visa_type: visa.visaType,
      price: visa.price,
      processing_time: visa.processingTime,
      duration: visa.duration,
      validity: visa.validity,
      is_active: visa.isActive,
      overview: {
        description: visa.overview.description,
        features: visa.overview.features,
        guaranteedDate: visa.overview.guaranteedDate
      },
      eligibility: visa.eligibility,
      timeline: visa.timeline,
      documents: visa.documents,
      faqs: visa.faqs
    }))

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('visa_types')
      .insert(supabaseVisaData)
      .select()

    if (error) {
      console.error('Error inserting visa data:', error)
      return
    }

    console.log(`Successfully migrated ${data?.length || 0} visa types`)

    // Create admin user profile (you'll need to sign up first in your app)
    console.log('Migration complete!')
    console.log('Next steps:')
    console.log('1. Run the SQL schema in your Supabase dashboard')
    console.log('2. Sign up as admin user in your app')
    console.log('3. Update the user role to "admin" in the profiles table')

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateVisaData()
}

export { migrateVisaData }