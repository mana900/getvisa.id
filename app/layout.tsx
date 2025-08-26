import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SupabaseAuthProvider } from '@/components/supabase-auth-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'GetVisa.ID - Visa Application Platform',
  description: 'Your trusted partner for visa applications worldwide',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
