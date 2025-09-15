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

export const trackContactConsultantClick = (
  country: string, 
  visaType: string, 
  method: 'whatsapp' | 'phone' | 'email' = 'whatsapp',
  price?: number,
  leadId?: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Enhanced tracking with conversion attribution
    window.gtag('event', 'contact_consultant', {
      event_category: 'lead_generation',
      event_label: `${country}:${visaType}:${method}`,
      value: price || 0,
      currency: price ? 'IDR' : undefined,
      custom_parameters: {
        contact_method: method,
        visa_country: country,
        visa_type: visaType,
        visa_price: price,
        lead_id: leadId,
        conversion_stage: 'whatsapp_redirect'
      }
    })
  }
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

// GA4 Standard Conversion Events for Lead Generation
// 
// 🎯 SETUP INSTRUCTIONS FOR GOOGLE ANALYTICS 4:
// 1. In GA4, go to Admin > Events > Create Event
// 2. Mark 'generate_lead' and 'submit_lead_form' as conversion events
// 3. Set up conversion goals with these events for proper attribution
// 4. These events include currency and value for ROI tracking
//
export const trackLeadGeneration = (
  country: string, 
  visaType: string, 
  price: number, 
  leadId: string,
  currency: string = 'IDR'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventData = {
      currency: currency,
      value: price,
      content_id: leadId,
      content_category: 'visa_application',
      content_type: 'lead_form',
      item_id: `${country.toLowerCase()}_${visaType.replace(/\s+/g, '_').toLowerCase()}`,
      item_name: `${visaType} - ${country}`,
      item_category: 'visa_services',
      country: country,
      visa_type: visaType,
      lead_source: 'visa_detail_page',
      method: 'contact_form'
    }
    
    // Send GA4 generate_lead event (standard conversion event)
    window.gtag('event', 'generate_lead', eventData)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 GA4 Conversion: generate_lead', eventData)
    }
  }
}

export const trackConversionFormSubmit = (
  country: string,
  visaType: string, 
  price: number,
  userName: string,
  leadId?: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventData = {
      event_category: 'conversion',
      event_label: `${country}:${visaType}`,
      value: price,
      currency: 'IDR',
      custom_parameters: {
        visa_country: country,
        visa_type: visaType,
        visa_price: price,
        lead_id: leadId,
        user_provided_name: !!userName,
        conversion_stage: 'form_completed'
      }
    }
    
    // Send custom conversion event for form submission
    window.gtag('event', 'submit_lead_form', eventData)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 GA4 Conversion: submit_lead_form', eventData)
    }
  }
}