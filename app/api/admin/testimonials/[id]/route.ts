import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const testimonialId = parseInt(params.id)
    
    if (isNaN(testimonialId)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      )
    }

    const { name, date, rating, review, is_featured } = body

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

    const updateData = {
      name: name.trim(),
      date: date || new Date().toISOString().split('T')[0],
      rating: parseInt(rating),
      review: review.trim(),
      is_featured: Boolean(is_featured),
      updated_at: new Date().toISOString()
    }

    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', testimonialId)
      .select()
      .single()

    if (error) {
      console.error('Error updating testimonial:', error)
      return NextResponse.json(
        { error: 'Failed to update testimonial' },
        { status: 500 }
      )
    }

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      testimonial,
      message: 'Testimonial updated successfully'
    })
  } catch (error) {
    console.error('Error in testimonials PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = getSupabaseAdmin()
    const testimonialId = parseInt(params.id)
    
    if (isNaN(testimonialId)) {
      return NextResponse.json(
        { error: 'Invalid testimonial ID' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonialId)

    if (error) {
      console.error('Error deleting testimonial:', error)
      return NextResponse.json(
        { error: 'Failed to delete testimonial' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Testimonial deleted successfully'
    })
  } catch (error) {
    console.error('Error in testimonials DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}