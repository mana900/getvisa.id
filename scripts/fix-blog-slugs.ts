import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixBlogSlugs() {
  console.log('🔧 Fixing blog post slugs...')

  try {
    // Fetch all blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status')

    if (error) {
      throw error
    }

    console.log(`📝 Found ${posts.length} posts to check`)

    let fixedCount = 0
    let skippedCount = 0

    for (const post of posts) {
      console.log(`\n🔍 Checking: "${post.title}"`)
      console.log(`   Current slug: "${post.slug}"`)
      
      // Clean the slug
      const cleanSlug = post.slug.trim().toLowerCase()
      
      if (post.slug !== cleanSlug) {
        console.log(`   ✨ Fixing slug to: "${cleanSlug}"`)
        
        // Update the post with clean slug
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ 
            slug: cleanSlug,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id)

        if (updateError) {
          console.error(`   ❌ Failed to update "${post.title}":`, updateError.message)
          continue
        }

        console.log(`   ✅ Fixed slug for "${post.title}"`)
        fixedCount++
      } else {
        console.log(`   ✓ Slug already clean`)
        skippedCount++
      }
    }

    console.log(`\n🎉 Slug cleanup complete!`)
    console.log(`✅ Fixed: ${fixedCount} posts`)
    console.log(`✓ Already clean: ${skippedCount} posts`)

  } catch (error) {
    console.error('❌ Error fixing blog slugs:', error)
    process.exit(1)
  }
}

// Run the fix
fixBlogSlugs()
  .then(() => {
    console.log('🏁 Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })