import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Resources & Guides | GetVisa.ID - Expert Travel Advice',
  description: 'Comprehensive visa guides, country information, document requirements, and travel tips for Indonesians. Expert resources to help you navigate visa applications successfully.',
  keywords: 'visa guide, indonesia visa, tourist visa, visa requirements, document guide, travel tips, visa application',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Visa Resources & Guides | GetVisa.ID',
    description: 'Comprehensive visa guides and resources for Indonesian travelers',
    type: 'website',
    url: 'https://getvisa.id/resources',
    images: [
      {
        url: '/TextLogo-GreenCropped.png',
        width: 1200,
        height: 630,
        alt: 'GetVisa.ID - Visa Resources & Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visa Resources & Guides | GetVisa.ID',
    description: 'Comprehensive visa guides and resources for Indonesian travelers',
    images: ['/TextLogo-GreenCropped.png'],
  },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}