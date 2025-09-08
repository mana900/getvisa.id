import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/admin/blog/posts/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      console.error('Error fetching blog post:', error)
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/blog/posts/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      status
    } = body

    console.log('Updating blog post:', params.id, { title, status })

    // Validate required fields
    if (!title || !slug || !content || !content_html || !excerpt || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, slug, content, content_html, excerpt, category' 
      }, { status: 400 })
    }

    // Check if slug already exists (excluding current post)
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', params.id)
      .single()

    if (existingPost) {
      return NextResponse.json({ 
        error: 'A post with this slug already exists' 
      }, { status: 400 })
    }

    const updateData: any = {
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
      word_count: content_html ? content_html.split(/\s+/).length : 0,
      updated_at: new Date().toISOString()
    }

    // Set published_at if status is being changed to published
    if (status === 'published') {
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('published_at')
        .eq('id', params.id)
        .single()
      
      if (!currentPost?.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json({ 
        error: `Failed to update blog post: ${error.message}` 
      }, { status: 500 })
    }

    console.log('Blog post updated successfully:', updatedPost.id)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: `Internal server error: ${errorMessage}` 
    }, { status: 500 })
  }
}

// DELETE /api/admin/blog/posts/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json({ 
        error: `Failed to delete blog post: ${error.message}` 
      }, { status: 500 })
    }

    console.log('Blog post deleted successfully:', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: `Internal server error: ${errorMessage}` 
    }, { status: 500 })
  }
}