import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const page = parseInt(searchParams.get('page') || '1')
    const active_only = searchParams.get('active_only') === 'true'
    const with_active_visas = searchParams.get('with_active_visas') === 'true'
    const limitNum = parseInt(limit || '50')
    const offset = (page - 1) * limitNum

    // First get countries
    let countriesQuery = supabase
      .from('countries')
      .select('*')
      .order('display_order', { ascending: true })
      .order('country_name', { ascending: true })

    if (active_only) {
      countriesQuery = countriesQuery.eq('is_active', true)
    }

    if (limit) {
      countriesQuery = countriesQuery.limit(limitNum).range(offset, offset + limitNum - 1)
    }

    const { data: countries, error } = await countriesQuery

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      )
    }

    // Get visa types for all countries
    const { data: visaTypes, error: visaError } = await supabase
      .from('visa_types')
      .select('id, visa_type, is_active, country_code')

    if (visaError) {
      console.error('Error fetching visa types:', visaError)
    }

    // Join countries with their visa types
    const countriesWithVisaTypes = countries?.map(country => {
      const countryVisaTypes = visaTypes?.filter(visa => visa.country_code === country.country_code) || []
      return {
        ...country,
        visa_types: countryVisaTypes
      }
    }) || []

    // Filter countries with active visa types if requested
    const filteredCountries = with_active_visas 
      ? countriesWithVisaTypes.filter(country => 
          country.visa_types.some(visa => visa.is_active)
        )
      : countriesWithVisaTypes

    // Get total count for pagination
    let countQuery = supabase
      .from('countries')
      .select('id', { count: 'exact' })
    
    if (active_only) {
      countQuery = countQuery.eq('is_active', true)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error getting count:', countError)
    }

    return NextResponse.json({ 
      countries: filteredCountries,
      totalCount: with_active_visas ? filteredCountries.length : (count || 0),
      currentPage: page,
      totalPages: with_active_visas ? 1 : Math.ceil((count || 0) / limitNum)
    })
  } catch (error) {
    console.error('Error in countries GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    
    const { 
      country_code, 
      country_name, 
      description, 
      image_url, 
      region, 
      processing_info, 
      is_active = true,
      display_order = 0
    } = body

    // Validate required fields
    if (!country_code || !country_name || !region) {
      return NextResponse.json(
        { error: 'Country code, name, and region are required' },
        { status: 400 }
      )
    }

    const { data: country, error } = await supabase
      .from('countries')
      .insert([{
        country_code: country_code.toLowerCase(),
        country_name,
        description,
        image_url,
        region,
        processing_info,
        is_active,
        display_order
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating country:', error)
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'Country code already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create country' },
        { status: 500 }
      )
    }

    return NextResponse.json({ country }, { status: 201 })
  } catch (error) {
    console.error('Error in countries POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}