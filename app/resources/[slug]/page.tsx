import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import BlogAnalytics from '@/components/BlogAnalytics'
import BlogCTA from '@/components/blog-cta'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  content_html: string
  excerpt: string
  category: string
  featured_image_url: string
  featured_image_alt: string
  published_at: string
  updated_at: string
  word_count: number
  meta_title?: string
  meta_description?: string
  target_keywords?: string[]
  schema_markup?: any
}

const categories = {
  'visa-guides': 'Visa Guides',
  'country-guides': 'Country Guides', 
  'document-guides': 'Document Guides',
  'travel-tips': 'Travel Tips'
} as const

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | GetVisa.ID Resources',
      description: 'The requested post could not be found.'
    }
  }

  return {
    title: post.meta_title || `${post.title} | GetVisa.ID Resources`,
    description: post.meta_description || post.excerpt,
    keywords: post.target_keywords?.join(', ') || `visa, ${post.category}, indonesia, travel`,
    authors: [{ name: 'GetVisa.ID Expert Team' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [{ 
        url: post.featured_image_url,
        alt: post.featured_image_alt || post.title
      }] : undefined,
      type: 'article',
      publishedTime: post.published_at,
      authors: ['GetVisa.ID'],
      section: post.category,
      tags: post.target_keywords
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : undefined
    },
    alternates: {
      canonical: `https://getvisa.id/resources/${post.slug}`
    }
  }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    // Use direct database query for both development and production
    // This avoids API route issues and is more efficient for SSG/SSR
    const { supabase } = await import('@/lib/supabase')
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching post from Supabase:', error)
      return null
    }

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Organization",
      "name": "GetVisa.ID",
      "url": "https://getvisa.id"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "GetVisa.ID",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getvisa.id/TextLogo-GreenCropped.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://getvisa.id/resources/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.target_keywords?.join(','),
    "about": {
      "@type": "Thing",
      "name": "Visa Services for Indonesians"
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadTime = (wordCount: number) => {
    const wordsPerMinute = 200
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const shareUrl = `https://getvisa.id/resources/${post.slug}`
  const categoryName = categories[post.category as keyof typeof categories] || post.category

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Blog Analytics Tracking */}
      <BlogAnalytics slug={post.slug} category={post.category} title={post.title} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(post)) }}
      />

      {/* Hero Section */}
      <section className="px-6 py-20" style={{ paddingTop: 'calc(5rem + 88px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <Button variant="outline" className="mb-6" asChild>
              <Link href="/resources">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Link>
            </Button>
            
            <div className="mb-6">
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                {categoryName}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatReadTime(post.word_count)}
                </span>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
                <Image
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={false}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <article className="w-full">
              {/* Enhanced Blog Content with Proper Typography */}
              <div 
                className="blog-content 
                  [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:my-8 [&>h1]:leading-tight
                  [&>h2]:text-3xl [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:my-6 [&>h2]:leading-tight
                  [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-800 [&>h3]:my-5 [&>h3]:leading-tight
                  [&>p]:text-lg [&>p]:leading-relaxed [&>p]:text-gray-600 [&>p]:my-4
                  [&>ul]:my-6 [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:space-y-2
                  [&>li]:text-lg [&>li]:leading-relaxed [&>li]:text-gray-600 [&>li]:ml-0
                  [&>strong]:font-semibold [&>strong]:text-gray-900
                  [&>a]:text-green-600 [&>a]:no-underline hover:[&>a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />

              {/* Keywords */}
              {post.target_keywords && post.target_keywords.length > 0 && (
                <div className="mt-16 pt-8 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.target_keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section with Contact Form */}
              <BlogCTA />
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}