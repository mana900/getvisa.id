const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

// Use service role key which bypasses RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testWithServiceKey() {
  console.log('🧪 Testing visa type insertion with service key (bypasses RLS)...')

  const testVisa = {
    country: 'Thailand',
    country_code: 'thailand',
    flag: '🇹🇭',
    visa_type: 'Tourist Visa (TR)',
    price: 45,
    processing_time: '3-5 business days',
    duration: '60 days',
    validity: '3 months',
    is_active: true,
    overview: {
      description: 'Thailand Tourist Visa allows visitors to enter Thailand for tourism purposes.',
      features: ['Electronic visa', 'No appointment required', 'No physical documents'],
      guaranteedDate: '25 October'
    },
    eligibility: ['Valid passport with at least 6 months validity', 'Proof of accommodation in Thailand'],
    timeline: [
      { step: 'Application Submission', time: '5 minutes', description: 'Complete online application form' },
      { step: 'Document Review', time: '1-2 days', description: 'Our team reviews your documents' }
    ],
    documents: ['Passport copy (main page)', 'Recent passport-sized photograph'],
    faqs: [
      {
        question: 'How long is the visa valid?',
        answer: 'The Thailand Tourist Visa is valid for 3 months from the date of issue.'
      }
    ]
  }

  try {
    const { data, error } = await supabase
      .from('visa_types')
      .insert(testVisa)
      .select()
      .single()

    if (error) {
      console.error('❌ Insert error:', error)
    } else {
      console.log('✅ Test insert successful with service key!')
      console.log('Created visa ID:', data.id)
      console.log('This confirms the database schema is working correctly.')
      console.log('The issue is with RLS policies when using the anon key from the client.')
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testWithServiceKey()