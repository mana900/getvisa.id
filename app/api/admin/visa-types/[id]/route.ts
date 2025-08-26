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

// PUT - Update visa type
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    
    const { data, error } = await supabaseAdmin
      .from('visa_types')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating visa type:', error)
      return NextResponse.json({ error: 'Failed to update visa type' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete visa type
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { error } = await supabaseAdmin
      .from('visa_types')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting visa type:', error)
      return NextResponse.json({ error: 'Failed to delete visa type' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}