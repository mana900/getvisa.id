export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-3WPDTSE2VQ'

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer: Record<string, any>[]
  }
}

// Log the pageview with their URL
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// Log specific events happening
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined events for common visa application actions
export const trackVisaSearch = (country: string) => {
  event({
    action: 'search_visa',
    category: 'visa_application',
    label: country,
  })
}

export const trackApplicationStart = (visaType: string) => {
  event({
    action: 'start_application',
    category: 'visa_application',
    label: visaType,
  })
}

export const trackDocumentUpload = (documentType: string) => {
  event({
    action: 'upload_document',
    category: 'document_management',
    label: documentType,
  })
}

export const trackBlogView = (blogSlug: string, category: string) => {
  event({
    action: 'view_blog_post',
    category: 'content_engagement',
    label: `${category}:${blogSlug}`,
  })
}

export const trackContactSubmit = () => {
  event({
    action: 'submit_contact_form',
    category: 'lead_generation',
  })
}