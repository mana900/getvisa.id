import { MetadataRoute } from 'next'

async function getPublishedPosts() {
  try {
    // Use direct database query to avoid API route issues
    const { supabase } = await import('@/lib/supabase')
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, category, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts for sitemap:', error)
      return []
    }

    return (posts || []).map((post) => ({
      slug: post.slug,
      category: post.category,
      updated_at: post.updated_at || post.published_at
    }))
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

async function getVisaTypes() {
  try {
    const { supabase } = await import('@/lib/supabase')
    const { data: visaTypes, error } = await supabase
      .from('visa_types')
      .select('country_code, country_name, updated_at')
      .order('country_code')

    if (error) {
      console.error('Error fetching visa types for sitemap:', error)
      return []
    }

    return visaTypes || []
  } catch (error) {
    console.error('Error fetching visa types for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://getvisa.id'
  
  // Get dynamic data
  const [posts, visaTypes] = await Promise.all([
    getPublishedPosts(),
    getVisaTypes()
  ])
  
  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ]

  // Dynamic blog post URLs
  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic visa service pages from database
  const visaServicePages: MetadataRoute.Sitemap = visaTypes.map((visa) => ({
    url: `${baseUrl}/visa/${visa.country_code.toLowerCase()}`,
    lastModified: new Date(visa.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Country-specific pages from database
  const countryPages: MetadataRoute.Sitemap = visaTypes.map((visa) => ({
    url: `${baseUrl}/countries/${visa.country_code.toLowerCase()}`,
    lastModified: new Date(visa.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Category-specific blog pages
  const categories = ['visa-guides', 'country-guides', 'document-guides', 'travel-tips']
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/resources/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...visaServicePages,
    ...countryPages,
    ...blogUrls,
    ...categoryPages
  ]
}