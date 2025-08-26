const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample visa data to migrate
const sampleVisaData = [
  {
    country: 'Canada',
    country_code: 'canada',
    flag: '🇨🇦',
    visa_type: 'Business Single Entry',
    price: 185,
    processing_time: '10-15 business days',
    duration: '6 months',
    validity: '10 years',
    is_active: true,
    overview: {
      description: 'Perfect for business meetings, conferences, and short-term business activities in Canada.',
      features: ['Single entry allowed', 'Business activities permitted', 'Fast processing'],
      guaranteedDate: '30 November'
    },
    eligibility: [
      'Valid passport with 6+ months validity',
      'Proof of business purpose',
      'Financial documents',
      'No criminal record'
    ],
    timeline: [
      { step: 'Online Application', time: '30 minutes', description: 'Complete the online application form' },
      { step: 'Document Review', time: '5-7 days', description: 'We review your submitted documents' },
      { step: 'Processing', time: '3-5 days', description: 'Visa processing by Canadian authorities' },
      { step: 'Approval', time: '1-2 days', description: 'Receive your approved visa' }
    ],
    documents: [
      'Valid passport',
      'Business invitation letter', 
      'Financial proof',
      'Travel itinerary',
      'Passport photos'
    ],
    faqs: [
      {
        question: 'How long is this visa valid?',
        answer: 'The Business Single Entry visa is valid for 10 years from the date of issue.'
      },
      {
        question: 'Can I extend my stay?',
        answer: 'You can apply for an extension before your current stay expires.'
      }
    ]
  },
  {
    country: 'Thailand',
    country_code: 'thailand', 
    flag: '🇹🇭',
    visa_type: 'Tourist Visa',
    price: 45,
    processing_time: '3-5 business days',
    duration: '60 days',
    validity: '3 months',
    is_active: true,
    overview: {
      description: 'Perfect for tourism and leisure activities in Thailand.',
      features: ['Tourism activities', 'Cultural exploration', 'Beach destinations'],
      guaranteedDate: ''
    },
    eligibility: [
      'Valid passport with 6+ months validity',
      'Proof of accommodation',
      'Return flight ticket',
      'Financial proof'
    ],
    timeline: [
      { step: 'Online Application', time: '20 minutes', description: 'Submit online application' },
      { step: 'Processing', time: '2-3 days', description: 'Visa processing' },
      { step: 'Approval', time: '1 day', description: 'Receive approved visa' }
    ],
    documents: [
      'Valid passport',
      'Hotel booking',
      'Flight itinerary',
      'Bank statement'
    ],
    faqs: [
      {
        question: 'What activities are allowed?',
        answer: 'Tourism, sightseeing, visiting friends and family are allowed activities.'
      }
    ]
  }
]

async function migrateData() {
  console.log('🚀 Starting visa data migration...')

  try {
    const { data, error } = await supabase
      .from('visa_types')
      .insert(sampleVisaData)
      .select()

    if (error) {
      console.error('❌ Error inserting data:', error)
      return
    }

    console.log(`✅ Successfully migrated ${data?.length || 0} visa types!`)
    console.log('📋 Next steps:')
    console.log('1. Go to your Supabase dashboard → Authentication → Users')
    console.log('2. Sign up as a user in your app')
    console.log('3. Update user role to "admin" in the profiles table')
    console.log('4. Test the admin panel!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

migrateData()