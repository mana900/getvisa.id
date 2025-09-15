import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About GetVisa.ID | Professional Visa Services Since 2017',
  description: 'Learn about GetVisa.ID by Travion. 7+ years of expertise, 99% approval rate, 1500+ visas processed. Your trusted partner for visa applications worldwide.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About GetVisa.ID | Professional Visa Services Since 2017',
    description: '7+ years of expertise, 99% approval rate, 1500+ visas processed. Your trusted partner for visa applications worldwide.',
    url: 'https://getvisa.id/about',
    images: [
      {
        url: '/TextLogo-GreenCropped.png',
        width: 1200,
        height: 630,
        alt: 'GetVisa.ID - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About GetVisa.ID | Professional Visa Services Since 2017',
    description: '7+ years of expertise, 99% approval rate, 1500+ visas processed. Your trusted partner for visa applications worldwide.',
    images: ['/TextLogo-GreenCropped.png'],
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}