import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'
import dotenv from 'dotenv'

// Configure marked with safe defaults (same as lib/markdown.ts)
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
})

async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown.trim()) return ''
  
  try {
    return await marked(markdown)
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
  }
}

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function regenerateBlogHtml() {
  console.log('🔄 Starting blog HTML regeneration...')

  try {
    // Fetch all published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, content, content_html')
      .eq('status', 'published')

    if (error) {
      throw error
    }

    console.log(`📝 Found ${posts.length} published posts to process`)

    let updatedCount = 0
    let skippedCount = 0

    for (const post of posts) {
      console.log(`\n🔍 Processing: "${post.title}" (${post.id})`)

      // Extract markdown content from stored content
      let markdownContent = ''
      
      if (post.content?.content) {
        markdownContent = post.content.content
      } else if (typeof post.content === 'string') {
        markdownContent = post.content
      } else if (post.content_html) {
        console.log(`⚠️  Skipping "${post.title}" - no markdown content found, only HTML`)
        skippedCount++
        continue
      }

      if (!markdownContent.trim()) {
        console.log(`⚠️  Skipping "${post.title}" - empty content`)
        skippedCount++
        continue
      }

      // Generate new HTML using marked library
      const newHtml = await markdownToHtml(markdownContent)
      
      console.log(`✨ Generated new HTML (${newHtml.length} chars)`)

      // Update the post with new HTML
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          content_html: newHtml,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (updateError) {
        console.error(`❌ Failed to update "${post.title}":`, updateError.message)
        continue
      }

      console.log(`✅ Updated "${post.title}"`)
      updatedCount++
    }

    console.log(`\n🎉 Regeneration complete!`)
    console.log(`✅ Updated: ${updatedCount} posts`)
    console.log(`⚠️  Skipped: ${skippedCount} posts`)

  } catch (error) {
    console.error('❌ Error regenerating blog HTML:', error)
    process.exit(1)
  }
}

// Run the regeneration
regenerateBlogHtml()
  .then(() => {
    console.log('🏁 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })