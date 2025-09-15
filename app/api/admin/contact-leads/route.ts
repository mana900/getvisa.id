import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const page = parseInt(searchParams.get('page') || '1')
    const limitNum = parseInt(limit || '50')
    const offset = (page - 1) * limitNum

    let query = supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limitNum).range(offset, offset + limitNum - 1)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching contact leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contact leads' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('contact_leads')
      .select('id', { count: 'exact' })

    if (countError) {
      console.error('Error getting count:', countError)
    }

    return NextResponse.json({ 
      leads,
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limitNum)
    })
  } catch (error) {
    console.error('Error in contact leads GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('contact_leads')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      console.error('Error deleting contact lead:', error)
      return NextResponse.json(
        { error: 'Failed to delete contact lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Contact lead deleted successfully' 
    })
  } catch (error) {
    console.error('Error in contact leads DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}