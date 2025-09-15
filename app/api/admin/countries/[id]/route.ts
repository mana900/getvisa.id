import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    const { id } = params

    const { data: country, error } = await supabase
      .from('countries')
      .select(`
        *,
        visa_types:visa_types(
          id,
          visa_type,
          price,
          processing_time,
          duration,
          validity,
          is_active
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching country:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch country' },
        { status: 500 }
      )
    }

    return NextResponse.json({ country })
  } catch (error) {
    console.error('Error in country GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    const { id } = params
    const body = await request.json()
    
    const { 
      country_code, 
      country_name, 
      description, 
      image_url, 
      region, 
      processing_info, 
      is_active,
      display_order
    } = body

    // Validate required fields
    if (!country_name || !region) {
      return NextResponse.json(
        { error: 'Country name and region are required' },
        { status: 400 }
      )
    }

    const { data: country, error } = await supabase
      .from('countries')
      .update({
        ...(country_code && { country_code: country_code.toLowerCase() }),
        country_name,
        description,
        image_url,
        region,
        processing_info,
        is_active,
        display_order
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating country:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        )
      }
      if (error.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'Country code already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to update country' },
        { status: 500 }
      )
    }

    return NextResponse.json({ country })
  } catch (error) {
    console.error('Error in country PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    const { id } = params

    // Check if country has visa types
    const { data: visaTypes, error: visaError } = await supabase
      .from('visa_types')
      .select('id')
      .eq('country_code', (await supabase.from('countries').select('country_code').eq('id', id).single()).data?.country_code)
      .limit(1)

    if (visaError && visaError.code !== 'PGRST116') {
      console.error('Error checking visa types:', visaError)
      return NextResponse.json(
        { error: 'Failed to check country dependencies' },
        { status: 500 }
      )
    }

    if (visaTypes && visaTypes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete country that has visa types. Please delete or reassign visa types first.' },
        { status: 409 }
      )
    }

    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting country:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to delete country' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Country deleted successfully' })
  } catch (error) {
    console.error('Error in country DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}