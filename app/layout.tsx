import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SupabaseAuthProvider } from '@/components/supabase-auth-provider'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'
import './globals.css'

export const metadata: Metadata = {
  title: 'GetVisa.ID - Professional Visa Services for Indonesians | Visa Application Platform',
  description: 'Fast, reliable visa services for 100+ destinations. Expert visa processing, document guidance, and embassy support for Indonesian travelers. 99% success rate.',
  generator: 'Next.js',
  metadataBase: new URL('https://getvisa.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GetVisa.ID - Professional Visa Services for Indonesians',
    description: 'Fast, reliable visa services for 100+ destinations. Expert visa processing, document guidance, and embassy support.',
    url: 'https://getvisa.id',
    siteName: 'GetVisa.ID',
    images: [
      {
        url: '/TextLogo-GreenCropped.png',
        width: 1200,
        height: 630,
        alt: 'GetVisa.ID - Professional Visa Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetVisa.ID - Professional Visa Services for Indonesians',
    description: 'Fast, reliable visa services for 100+ destinations. Expert visa processing, document guidance, and embassy support.',
    images: ['/TextLogo-GreenCropped.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <GoogleAnalytics />
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/TextLogo-GreenCropped.png"
          as="image"
          type="image/png"
        />
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Font optimization - fonts will be automatically optimized by Next.js */}
      </head>
      <body className={GeistSans.className}>
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
        <StructuredData type="organization" />
        <StructuredData type="service" />
        <StructuredData type="breadcrumb" />
      </body>
    </html>
  )
}
