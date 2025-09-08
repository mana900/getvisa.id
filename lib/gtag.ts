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

// Enhanced visa detail page tracking
export const trackVisaDetailView = (country: string, visaType: string, price: number) => {
  event({
    action: 'view_visa_details',
    category: 'visa_application',
    label: `${country}:${visaType}`,
    value: price,
  })
}

export const trackApplyNowClick = (country: string, visaType: string, price: number) => {
  event({
    action: 'click_apply_now',
    category: 'conversion',
    label: `${country}:${visaType}`,
    value: price,
  })
}

export const trackContactConsultantClick = (country: string, visaType: string, method: 'whatsapp' | 'phone' | 'email' = 'whatsapp') => {
  event({
    action: 'contact_consultant',
    category: 'lead_generation',
    label: `${country}:${visaType}:${method}`,
  })
}

export const trackPriceView = (country: string, visaType: string, price: number) => {
  event({
    action: 'view_price',
    category: 'pricing',
    label: `${country}:${visaType}`,
    value: price,
  })
}

export const trackProcessingTimeView = (country: string, visaType: string, processingTime: string) => {
  event({
    action: 'view_processing_time',
    category: 'visa_information',
    label: `${country}:${visaType}:${processingTime}`,
  })
}

export const trackRequirementsView = (country: string, visaType: string, section: string) => {
  event({
    action: 'view_requirements',
    category: 'visa_information',
    label: `${country}:${visaType}:${section}`,
  })
}

export const trackVisaCardClick = (country: string, visaType: string, source: 'country_page' | 'home_page' | 'search_results') => {
  event({
    action: 'click_visa_card',
    category: 'navigation',
    label: `${country}:${visaType}`,
  })
}

export const trackGuaranteedDateView = (country: string, visaType: string, guaranteedDate: string) => {
  event({
    action: 'view_guaranteed_date',
    category: 'visa_information',
    label: `${country}:${visaType}:${guaranteedDate}`,
  })
}

export const trackFeatureClick = (country: string, visaType: string, feature: string) => {
  event({
    action: 'click_feature',
    category: 'visa_information',
    label: `${country}:${visaType}:${feature}`,
  })
}

export const trackBackButtonClick = (from: string, to: string) => {
  event({
    action: 'click_back_button',
    category: 'navigation',
    label: `${from}_to_${to}`,
  })
}

export const trackWhatsAppMessageSent = (country: string, visaType: string) => {
  event({
    action: 'whatsapp_message_sent',
    category: 'lead_generation',
    label: `${country}:${visaType}`,
  })
}