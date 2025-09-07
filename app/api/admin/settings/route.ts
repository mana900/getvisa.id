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

    console.log('Received settings request:', { key, value, description })

    if (!key || value === undefined || value === null) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Check if setting already exists
    const { data: existingSetting, error: checkError } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine for new settings
      console.error('Error checking existing setting:', checkError)
      return NextResponse.json({ 
        error: `Database error while checking setting: ${checkError.message}` 
      }, { status: 500 })
    }

    if (existingSetting) {
      // Update existing setting
      console.log('Updating existing setting:', key)
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
        return NextResponse.json({ 
          error: `Failed to update setting: ${error.message}` 
        }, { status: 500 })
      }

      console.log('Setting updated successfully:', updatedSetting)
      return NextResponse.json(updatedSetting)
    } else {
      // Create new setting
      console.log('Creating new setting:', key)
      const { data: newSetting, error } = await supabase
        .from('settings')
        .insert({ key, value, description })
        .select()
        .single()

      if (error) {
        console.error('Error creating setting:', error)
        return NextResponse.json({ 
          error: `Failed to create setting: ${error.message}` 
        }, { status: 500 })
      }

      console.log('Setting created successfully:', newSetting)
      return NextResponse.json(newSetting)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: `Internal server error: ${errorMessage}` 
    }, { status: 500 })
  }
}