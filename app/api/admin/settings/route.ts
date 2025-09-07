import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/settings
export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(settings || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/settings
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value, description } = body

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Check if setting already exists
    const { data: existingSetting } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single()

    if (existingSetting) {
      // Update existing setting
      const { data: updatedSetting, error } = await supabase
        .from('settings')
        .update({ 
          value, 
          description,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single()

      if (error) {
        console.error('Error updating setting:', error)
        return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
      }

      return NextResponse.json(updatedSetting)
    } else {
      // Create new setting
      const { data: newSetting, error } = await supabase
        .from('settings')
        .insert({ key, value, description })
        .select()
        .single()

      if (error) {
        console.error('Error creating setting:', error)
        return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 })
      }

      return NextResponse.json(newSetting)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}