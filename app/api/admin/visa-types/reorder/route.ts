import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { visaIds, countryCode } = await request.json()

    if (!visaIds || !Array.isArray(visaIds) || !countryCode) {
      return NextResponse.json(
        { error: 'Invalid visa IDs or country code provided' },
        { status: 400 }
      )
    }

    // Update display_order for each visa type
    const updatePromises = visaIds.map(async (visaId: string, index: number) => {
      const { error } = await supabase
        .from('visa_types')
        .update({ display_order: index + 1 })
        .eq('id', visaId)
        .eq('country_code', countryCode)

      if (error) {
        throw error
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error reordering visa types:', error)
    return NextResponse.json(
      { error: 'Failed to reorder visa types' },
      { status: 500 }
    )
  }
}