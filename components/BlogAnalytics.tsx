'use client'

import { useEffect } from 'react'
import { trackBlogView } from '@/lib/gtag'

interface BlogAnalyticsProps {
  slug: string
  category: string
  title: string
}

export default function BlogAnalytics({ slug, category, title }: BlogAnalyticsProps) {
  useEffect(() => {
    // Track blog post view
    trackBlogView(slug, category)

    // Track scroll depth
    let maxScroll = 0
    const trackScrollDepth = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: `${category}:${slug}`,
            value: scrollPercent,
            custom_parameters: {
              blog_title: title,
              scroll_depth: scrollPercent
            }
          })
        }
      }
    }

    // Track time on page
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'time_on_page', {
          event_category: 'engagement',
          event_label: `${category}:${slug}`,
          value: timeSpent,
          custom_parameters: {
            blog_title: title,
            time_spent_seconds: timeSpent
          }
        })
      }
    }

    window.addEventListener('scroll', trackScrollDepth)
    window.addEventListener('beforeunload', trackTimeOnPage)

    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }, [slug, category, title])

  return null
}