import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Fetch countries
    const { data: allCountries, error } = await supabase
      .from('countries')
      .select(`
        id,
        country_code,
        country_name,
        description,
        image_url,
        region,
        processing_info,
        display_order,
        is_active
      `)
      .order('display_order', { ascending: true })
      .order('country_name', { ascending: true })

    // Filter active countries in application code to avoid Supabase cache issues
    const countries = allCountries?.filter(c => c.is_active === true) || []

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      )
    }


    // Fetch visa types with flag information
    const { data: visaTypes, error: visaError } = await supabase
      .from('visa_types')
      .select('id, is_active, country_code, flag')

    if (visaError) {
      console.error('Error fetching visa types:', visaError)
    }

    // Transform data to match the expected format and deduplicate by country name
    const countryMap = new Map()

    countries.forEach(country => {
      const countryVisaTypes = visaTypes?.filter(visa => visa.country_code === country.country_code) || []
      const activeCount = countryVisaTypes.filter(visa => visa.is_active).length
      const totalCount = countryVisaTypes.length

      // Skip countries with no active visa types
      if (activeCount === 0) {
        return
      }

      // Get the flag from the first visa type for this country
      const flag = countryVisaTypes.length > 0 ? countryVisaTypes[0].flag : '🌍'

      const transformedCountry = {
        countryCode: country.country_code,
        country: country.country_name,
        flag,
        description: country.description || `Explore ${country.country_name} with our visa services.`,
        image: country.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=entropy&auto=format',
        region: country.region,
        processingInfo: country.processing_info || 'Contact us for processing information.',
        totalCount,
        activeCount,
        count: totalCount,
        difficulty: totalCount > 3 ? 'Easy' : totalCount > 1 ? 'Medium' : 'Hard' // Simple logic for difficulty
      }

      // If duplicate country name, keep the one with more active visas
      const existing = countryMap.get(country.country_name)
      if (!existing || existing.activeCount < activeCount) {
        countryMap.set(country.country_name, transformedCountry)
      }
    })

    const transformedCountries = Array.from(countryMap.values())

    return NextResponse.json({ countries: transformedCountries })
  } catch (error) {
    console.error('Error in countries GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}