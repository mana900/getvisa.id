import { Metadata } from 'next'
import { VisaService } from '@/lib/services/visa-service'
import { formatIDR } from '@/lib/utils/currency'

interface Props {
  params: { 
    country: string
    id: string 
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Use static metadata based on URL parameters to avoid build-time fetch issues
  const countryName = params.country.charAt(0).toUpperCase() + params.country.slice(1).toLowerCase()
  
  const title = `${countryName} Visa Application | GetVisa.ID - Professional Processing`
  const description = `Apply for ${countryName} visa with professional processing services. Expert guidance, fast processing, and high success rate for Indonesian travelers.`
  
  return {
    title,
    description,
    alternates: {
      canonical: `/visa/${params.country}/${params.id}`,
    },
    openGraph: {
      title: `${countryName} Visa Application | GetVisa.ID`,
      description,
      url: `https://getvisa.id/visa/${params.country}/${params.id}`,
      images: [
        {
          url: '/TextLogo-GreenCropped.png',
          width: 1200,
          height: 630,
          alt: `${countryName} Visa Application - GetVisa.ID`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${countryName} Visa Application | GetVisa.ID`,
      description,
      images: ['/TextLogo-GreenCropped.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function VisaDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}