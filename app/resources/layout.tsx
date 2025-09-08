import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Resources & Guides | GetVisa.ID',
  description: 'Comprehensive visa guides, country information, document requirements, and travel tips for Indonesians. Expert resources to help you navigate visa applications successfully.',
  keywords: 'visa guide, indonesia visa, tourist visa, visa requirements, document guide, travel tips, visa application',
  openGraph: {
    title: 'Visa Resources & Guides | GetVisa.ID',
    description: 'Comprehensive visa guides and resources for Indonesian travelers',
    type: 'website',
    url: 'https://getvisa.id/resources'
  }
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}