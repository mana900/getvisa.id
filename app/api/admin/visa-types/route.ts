import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// Server-side Supabase client with service role key
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// GET - Get all visa types
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('visa_types')
      .select('*')
      .order('country', { ascending: true })

    if (error) {
      console.error('Error fetching visa types:', error)
      return NextResponse.json({ error: 'Failed to fetch visa types' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new visa type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('visa_types')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating visa type:', error)
      return NextResponse.json({ error: 'Failed to create visa type' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update visa type
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Visa ID is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('visa_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating visa type:', error)
      return NextResponse.json({ error: 'Failed to update visa type' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}