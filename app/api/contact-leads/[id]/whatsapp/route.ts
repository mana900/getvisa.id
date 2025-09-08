import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = getSupabaseAdmin()
    const leadId = parseInt(params.id)
    
    if (isNaN(leadId)) {
      return NextResponse.json(
        { error: 'Invalid lead ID' },
        { status: 400 }
      )
    }

    // Update the lead to mark WhatsApp as clicked
    const { data: lead, error } = await supabase
      .from('contact_leads')
      .update({ 
        whatsapp_clicked: true,
        whatsapp_clicked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact lead:', error)
      return NextResponse.json(
        { error: 'Failed to update contact information' },
        { status: 500 }
      )
    }

    if (!lead) {
      return NextResponse.json(
        { error: 'Contact lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp click tracked successfully'
    })
  } catch (error) {
    console.error('Error in WhatsApp tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}