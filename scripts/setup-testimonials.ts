import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupTestimonialsTable() {
  console.log('🔧 Setting up testimonials table...')

  try {
    // Check if table already exists
    const { data: tableExists } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (tableExists !== null) {
      console.log('✅ Testimonials table already exists, skipping creation')
    } else {
      console.log('⚠️  Testimonials table does not exist')
      console.log('📝 Please run this SQL in your Supabase SQL editor:')
      console.log(`
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
CREATE POLICY "testimonials_select_policy" ON testimonials
FOR SELECT USING (true);

-- Create policy for admin access
DROP POLICY IF EXISTS "testimonials_admin_policy" ON testimonials;
CREATE POLICY "testimonials_admin_policy" ON testimonials
FOR ALL USING (true);
      `)
      console.log('After running the SQL, restart this script to populate sample data.')
      return
    }

    console.log('✅ Testimonials table created successfully')

    // Insert sample data from the current testimonials component
    const sampleTestimonials = [
      {
        name: "Jeannie Grant",
        date: "2023-06-01",
        rating: 5,
        review: "A thorough report was done on our financial situation of what insurance covers etc existing. Better deals were found. These were processed on our behalf, which took a lot of stress away. Updates were given as required and outstanding responses chased after.",
        is_featured: true
      },
      {
        name: "Derval Russell",
        date: "2023-11-09",
        rating: 5,
        review: "I have been a client of GetVisa.ID for 8 years now and have always found the advice provided by our consultant excellent. They always take the time to explain things really clearly to me and ensures I understand and am well informed and therefore able to make appropriate decisions.",
        is_featured: true
      },
      {
        name: "Claire Watson",
        date: "2023-10-12",
        rating: 5,
        review: "Claire consistently demonstrates thorough knowledge and understanding of visa requirements and provides excellent customer service. She takes time to explain complex visa processes clearly and makes the entire application stress-free.",
        is_featured: true
      },
      {
        name: "Michael Chen",
        date: "2023-09-15",
        rating: 5,
        review: "Outstanding service from start to finish. GetVisa.ID made my visa application process seamless and stress-free. The team was professional, responsive, and kept me informed throughout the entire process.",
        is_featured: true
      },
      {
        name: "Sarah Johnson",
        date: "2023-08-22",
        rating: 5,
        review: "I was impressed by the efficiency and professionalism of GetVisa.ID. They handled all the paperwork and made sure everything was submitted correctly and on time. Highly recommended for anyone needing visa services.",
        is_featured: true
      },
      {
        name: "Ahmad Rahman",
        date: "2023-07-18",
        rating: 5,
        review: "Exceptional service! The team at GetVisa.ID went above and beyond to ensure my visa application was successful. Their attention to detail and customer service is unmatched.",
        is_featured: true
      },
      {
        name: "Lisa Thompson",
        date: "2023-06-25",
        rating: 5,
        review: "GetVisa.ID saved me so much time and stress. Their expertise in visa requirements is evident, and they made the whole process straightforward. I couldn't be happier with the service.",
        is_featured: true
      }
    ]

    const { error: insertError } = await supabase
      .from('testimonials')
      .insert(sampleTestimonials)

    if (insertError) {
      console.error('❌ Error inserting sample testimonials:', insertError)
      return
    }

    console.log('✅ Sample testimonials inserted successfully')
    console.log('🎉 Testimonials setup complete!')

  } catch (error) {
    console.error('❌ Error setting up testimonials table:', error)
    process.exit(1)
  }
}

// Run the setup
setupTestimonialsTable()
  .then(() => {
    console.log('🏁 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })