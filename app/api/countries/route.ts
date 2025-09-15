import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Fetch countries
    const { data: countries, error } = await supabase
      .from('countries')
      .select(`
        id,
        country_code,
        country_name,
        description,
        image_url,
        region,
        processing_info,
        display_order
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('country_name', { ascending: true })

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      )
    }

    // Fetch visa types
    const { data: visaTypes, error: visaError } = await supabase
      .from('visa_types')
      .select('id, is_active, country_code')

    if (visaError) {
      console.error('Error fetching visa types:', visaError)
    }

    // Transform data to match the expected format
    const transformedCountries = countries.map(country => {
      const countryVisaTypes = visaTypes?.filter(visa => visa.country_code === country.country_code) || []
      const activeCount = countryVisaTypes.filter(visa => visa.is_active).length
      const totalCount = countryVisaTypes.length
      
      return {
        countryCode: country.country_code,
        country: country.country_name,
        description: country.description || `Explore ${country.country_name} with our visa services.`,
        image: country.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=entropy&auto=format',
        region: country.region,
        processingInfo: country.processing_info || 'Contact us for processing information.',
        totalCount,
        activeCount,
        difficulty: totalCount > 3 ? 'Easy' : totalCount > 1 ? 'Medium' : 'Hard' // Simple logic for difficulty
      }
    }).filter(country => country.activeCount > 0) // Only show countries with active visa types

    return NextResponse.json({ countries: transformedCountries })
  } catch (error) {
    console.error('Error in countries GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}