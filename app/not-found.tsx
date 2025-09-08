import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Home, Search, FileText, ArrowLeft, Globe, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | GetVisa.ID',
  description: 'The page you are looking for could not be found. Find visa services, country guides, and document assistance for Indonesians traveling abroad.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://getvisa.id/404'
  }
}

export default function NotFound() {
  const popularPages = [
    {
      title: 'Visa Services',
      description: 'Find visa assistance for your destination',
      href: '/',
      icon: Globe
    },
    {
      title: 'Country Guides', 
      description: 'Comprehensive travel guides by country',
      href: '/countries',
      icon: FileText
    },
    {
      title: 'Blog & Resources',
      description: 'Latest visa guides and travel tips',
      href: '/resources',
      icon: Search
    },
    {
      title: 'Contact Support',
      description: 'Get help from our visa experts',
      href: '/contact',
      icon: MessageCircle
    }
  ]

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* 404 Hero Section */}
            <div className="mb-16">
              <div className="relative mb-8">
                {/* Decorative background elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div className="text-[20rem] font-black text-gray-900 select-none">
                    404
                  </div>
                </div>
                
                {/* Main 404 text */}
                <div className="relative z-10">
                  <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
                    404
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8"></div>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The page you're looking for might have been moved, deleted, or doesn't exist. 
                But don't worry – we can help you find what you need for your visa journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Go Back Home
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/resources">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Resources
                  </Link>
                </Button>
              </div>
            </div>

            {/* Popular Pages Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Popular Pages You Might Be Looking For
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularPages.map((page, index) => {
                  const Icon = page.icon
                  return (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{page.title}</h4>
                        <p className="text-sm text-gray-600 mb-4">{page.description}</p>
                        <Button variant="ghost" className="text-green-600 hover:text-green-700" asChild>
                          <Link href={page.href}>
                            Visit Page
                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Help Section */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Need Help Finding What You're Looking For?
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Our visa experts are here to help! Whether you're looking for specific country requirements, 
                  document guidance, or have questions about your visa application process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/contact">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/resources">
                      <FileText className="w-5 h-5 mr-2" />
                      Browse All Guides
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO-friendly links */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 mb-4">
                You might also be interested in:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/countries/australia" className="text-green-600 hover:underline">
                  Australia Visa
                </Link>
                <Link href="/countries/singapore" className="text-green-600 hover:underline">
                  Singapore Visa
                </Link>
                <Link href="/countries/japan" className="text-green-600 hover:underline">
                  Japan Visa
                </Link>
                <Link href="/countries/malaysia" className="text-green-600 hover:underline">
                  Malaysia Visa
                </Link>
                <Link href="/resources" className="text-green-600 hover:underline">
                  Visa Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "The requested page could not be found. Find visa services and travel guides for Indonesians.",
            "url": "https://getvisa.id/404",
            "isPartOf": {
              "@type": "WebSite",
              "name": "GetVisa.ID",
              "url": "https://getvisa.id"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://getvisa.id/?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </>
  )
}