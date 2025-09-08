import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const featured_only = searchParams.get('featured_only') === 'true'

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (featured_only) {
      query = query.eq('is_featured', true)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: testimonials, error } = await query

    if (error) {
      console.error('Error fetching testimonials:', error)
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      )
    }

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error in testimonials GET:', error)
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
    
    const { name, date, rating, review, is_featured = false } = body

    // Validation
    if (!name || !rating || !review) {
      return NextResponse.json(
        { error: 'Missing required fields: name, rating, review' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonialData = {
      name: name.trim(),
      date: date || new Date().toISOString().split('T')[0],
      rating: parseInt(rating),
      review: review.trim(),
      is_featured: Boolean(is_featured)
    }

    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      return NextResponse.json(
        { error: 'Failed to create testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { testimonial, message: 'Testimonial created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in testimonials POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}