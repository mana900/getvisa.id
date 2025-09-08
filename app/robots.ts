import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getvisa.id'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/admin/*',
          '/dashboard/*',
          '/api/*'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}