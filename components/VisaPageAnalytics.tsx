'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

interface VisaPageAnalyticsProps {
  country?: string
  visaType?: string
  price?: number
  processingTime?: string
  pageType: 'country_listing' | 'visa_detail'
}

export default function VisaPageAnalytics({ 
  country, 
  visaType, 
  price, 
  processingTime, 
  pageType 
}: VisaPageAnalyticsProps) {
  const params = useParams()
  
  useEffect(() => {
    // Track page performance metrics
    const trackPerformance = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        // Track page load time
        window.addEventListener('load', () => {
          const loadTime = performance.now()
          window.gtag('event', 'page_load_time', {
            event_category: 'performance',
            event_label: `${pageType}:${country || params.country}`,
            value: Math.round(loadTime),
          })
        })

        // Track user engagement time
        let startTime = Date.now()
        let maxScrollDepth = 0

        const trackEngagement = () => {
          const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
          )
          if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent
          }
        }

        const trackExitTime = () => {
          const timeSpent = Math.round((Date.now() - startTime) / 1000)
          window.gtag('event', 'visa_page_engagement', {
            event_category: 'engagement',
            event_label: `${pageType}:${country || params.country}${visaType ? `:${visaType}` : ''}`,
            value: timeSpent,
            custom_parameters: {
              max_scroll_depth: maxScrollDepth,
              visa_price: price,
              processing_time: processingTime
            }
          })
        }

        window.addEventListener('scroll', trackEngagement, { passive: true })
        window.addEventListener('beforeunload', trackExitTime)

        return () => {
          window.removeEventListener('scroll', trackEngagement)
          window.removeEventListener('beforeunload', trackExitTime)
        }
      }
    }

    trackPerformance()
  }, [country, visaType, price, processingTime, pageType, params.country])

  return null
}