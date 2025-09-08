import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/blog/posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category') || 'all'
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: posts, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
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

// POST /api/admin/blog/posts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      content_html,
      excerpt,
      meta_title,
      meta_description,
      featured_image_url,
      featured_image_alt,
      category,
      target_keywords,
      status = 'draft',
      author_id
    } = body

    console.log('Creating blog post:', { title, slug, category, status })

    // Validate required fields
    if (!title || !slug || !content || !content_html || !excerpt || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, slug, content, content_html, excerpt, category' 
      }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingPost) {
      return NextResponse.json({ 
        error: 'A post with this slug already exists' 
      }, { status: 400 })
    }

    const postData: any = {
      title,
      slug,
      content,
      content_html,
      excerpt,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt,
      featured_image_url,
      featured_image_alt,
      category,
      target_keywords: target_keywords || [],
      status,
      author_id,
      word_count: content_html ? content_html.split(/\s+/).length : 0,
      published_at: status === 'published' ? new Date().toISOString() : null
    }

    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json({ 
        error: `Failed to create blog post: ${error.message}` 
      }, { status: 500 })
    }

    console.log('Blog post created successfully:', newPost.id)
    return NextResponse.json(newPost)
  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: `Internal server error: ${errorMessage}` 
    }, { status: 500 })
  }
}