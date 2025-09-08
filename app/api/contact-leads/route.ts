import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    
    const { name, phone, country, visa_type, visa_id, price, source = 'visa_detail_page' } = body

    // Validation
    if (!name || !phone || !country || !visa_type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, country, visa_type' },
        { status: 400 }
      )
    }

    // Basic phone validation (should be numeric and reasonable length)
    const phoneRegex = /^[\+\-\s\(\)0-9]{8,20}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const leadData = {
      name: name.trim(),
      phone: phone.trim(),
      country: country.trim(),
      visa_type: visa_type.trim(),
      visa_id: visa_id || null,
      price: price || null,
      source: source.trim(),
      whatsapp_clicked: false
    }

    const { data: lead, error } = await supabase
      .from('contact_leads')
      .insert(leadData)
      .select()
      .single()

    if (error) {
      console.error('Error creating contact lead:', error)
      return NextResponse.json(
        { error: 'Failed to save contact information' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        leadId: lead.id,
        message: 'Contact information saved successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in contact leads POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}