import { Metadata } from 'next'
import { VisaService } from '@/lib/services/visa-service'

interface Props {
  params: { 
    country: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Since we can't reliably fetch data at build time, use static metadata with country name
  const countryName = params.country.charAt(0).toUpperCase() + params.country.slice(1).toLowerCase()
  
  const title = `${countryName} Visa Services | GetVisa.ID - Professional Visa Processing`
  const description = `Professional ${countryName} visa services with expert processing. Fast, reliable visa applications for Indonesian travelers. Multiple visa types available.`
  
  return {
    title,
    description,
    alternates: {
      canonical: `/visa/${params.country}`,
    },
    openGraph: {
      title: `${countryName} Visa Services | GetVisa.ID`,
      description,
      url: `https://getvisa.id/visa/${params.country}`,
      images: [
        {
          url: '/TextLogo-GreenCropped.png',
          width: 1200,
          height: 630,
          alt: `${countryName} Visa Services - GetVisa.ID`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${countryName} Visa Services | GetVisa.ID`,
      description,
      images: ['/TextLogo-GreenCropped.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function CountryVisaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}