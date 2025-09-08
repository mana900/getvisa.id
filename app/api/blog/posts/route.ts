import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/blog/posts - Public API for published posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || 'all'
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, featured_image_alt, category, published_at, word_count', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply category filter
    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: posts, error, count } = await query

    if (error) {
      console.error('Error fetching published blog posts:', error)
      return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}