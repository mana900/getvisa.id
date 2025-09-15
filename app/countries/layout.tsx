import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visa Services by Country | GetVisa.ID - 100+ Destinations',
  description: 'Browse visa services for 100+ countries. Professional visa processing for Australia, Canada, UK, USA, Schengen, and more. Fast, reliable service for Indonesian travelers.',
  alternates: {
    canonical: '/countries',
  },
  openGraph: {
    title: 'Visa Services by Country | GetVisa.ID',
    description: 'Browse visa services for 100+ countries. Professional visa processing for popular destinations worldwide.',
    url: 'https://getvisa.id/countries',
    images: [
      {
        url: '/TextLogo-GreenCropped.png',
        width: 1200,
        height: 630,
        alt: 'GetVisa.ID - Visa Services by Country',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visa Services by Country | GetVisa.ID',
    description: 'Browse visa services for 100+ countries. Professional visa processing for popular destinations worldwide.',
    images: ['/TextLogo-GreenCropped.png'],
  },
}

export default function CountriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}