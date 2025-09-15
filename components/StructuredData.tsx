'use client'

import { usePathname } from 'next/navigation'

interface StructuredDataProps {
  type?: 'organization' | 'service' | 'breadcrumb' | 'visa-service'
  data?: any
}

export default function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  const pathname = usePathname()

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GetVisa.ID",
    "alternateName": "GetVisa.ID by Travion",
    "url": "https://getvisa.id",
    "logo": "https://getvisa.id/TextLogo-GreenCropped.png",
    "description": "Professional visa processing services for Indonesian travelers. Expert guidance for 100+ destinations with 99% success rate.",
    "foundingDate": "2017",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Indonesia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Indonesian", "English"]
    },
    "sameAs": [
      "https://getvisa.id"
    ],
    "serviceType": "Visa Processing Services",
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    }
  })

  const getServiceSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Visa Processing Services",
    "provider": {
      "@type": "Organization",
      "name": "GetVisa.ID"
    },
    "description": "Complete visa application services including document preparation, embassy appointments, and expert guidance for international travel.",
    "serviceType": "Visa Processing",
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://getvisa.id",
      "serviceSmsNumber": "WhatsApp available"
    }
  })

  const getBreadcrumbSchema = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbList = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://getvisa.id"
      }
    ]

    let currentUrl = 'https://getvisa.id'
    pathSegments.forEach((segment, index) => {
      currentUrl += `/${segment}`
      let name = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Clean up segment names
      if (segment === 'visa') name = 'Visa Services'
      if (segment === 'countries') name = 'Countries'
      if (segment === 'resources') name = 'Resources'
      if (segment === 'about') name = 'About Us'
      
      breadcrumbList.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": currentUrl
      })
    })

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    }
  }

  const getVisaServiceSchema = (visaData: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${visaData.country} ${visaData.visa_type}`,
    "provider": {
      "@type": "Organization",
      "name": "GetVisa.ID"
    },
    "description": `Professional ${visaData.visa_type} processing for ${visaData.country}. Processing time: ${visaData.processing_time}. Duration: ${visaData.duration}.`,
    "serviceType": "Visa Processing",
    "offers": {
      "@type": "Offer",
      "price": visaData.price,
      "priceCurrency": "IDR",
      "availability": "https://schema.org/InStock"
    },
    "areaServed": {
      "@type": "Country", 
      "name": "Indonesia"
    }
  })

  const getSchema = () => {
    switch (type) {
      case 'organization':
        return getOrganizationSchema()
      case 'service':
        return getServiceSchema()
      case 'breadcrumb':
        return getBreadcrumbSchema()
      case 'visa-service':
        return data ? getVisaServiceSchema(data) : getServiceSchema()
      default:
        return getOrganizationSchema()
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema())
      }}
    />
  )
}