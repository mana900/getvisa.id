import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://getvisa.id'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/countries',
          '/resources', 
          '/visa/*',
          '/resources/*',
          '/countries/*'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/',
          '/api/*',
          '/admin/',
          '/admin/*',
          '/_next/',
          '/_next/*',
          '/*.json$',
          '/*.map$',
          '/404'
        ],
      },
      // Special rules for search engines
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/countries',
          '/resources',
          '/visa/*', 
          '/resources/*',
          '/countries/*'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/',
          '/api/*'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/countries',
          '/resources',
          '/visa/*',
          '/resources/*', 
          '/countries/*'
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/',
          '/api/*'
        ],
        crawlDelay: 1,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}