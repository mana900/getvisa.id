const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  console.log('🧪 Testing visa type insertion...')

  const testVisa = {
    country: 'Test Country',
    country_code: 'test',
    flag: '🏁',
    visa_type: 'Test Visa',
    price: 100,
    processing_time: '5 days',
    duration: '30 days',
    validity: '1 year',
    is_active: true,
    overview: {
      description: 'Test description',
      features: ['Test feature'],
      guaranteedDate: '30 December'
    },
    eligibility: ['Test eligibility'],
    timeline: [{ step: 'Test step', time: '1 hour', description: 'Test description' }],
    documents: ['Test document'],
    faqs: [{ question: 'Test question?', answer: 'Test answer' }]
  }

  try {
    const { data, error } = await supabase
      .from('visa_types')
      .insert(testVisa)
      .select()
      .single()

    if (error) {
      console.error('❌ Insert error:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
    } else {
      console.log('✅ Test insert successful!')
      console.log('Created visa:', data)
      
      // Clean up test data
      await supabase.from('visa_types').delete().eq('id', data.id)
      console.log('🧹 Test data cleaned up')
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testInsert()