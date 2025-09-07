"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Star } from "lucide-react"
import { VisaService } from "@/lib/services/visa-service"

// Country photos mapping for popular destinations
const countryImages = {
  'US': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'CA': 'https://images.unsplash.com/photo-1503614472-8c93d56cd601?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'AU': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'JP': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'DE': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'FR': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'IT': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'ES': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'NL': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'CH': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'SG': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'TH': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop&crop=entropy&auto=format',
  'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=entropy&auto=format'
}

// Helper function to get region from country code
function getRegion(countryCode: string): string {
  const regions: Record<string, string> = {
    'US': 'North America',
    'CA': 'North America',
    'UK': 'Europe', 
    'DE': 'Europe',
    'FR': 'Europe',
    'IT': 'Europe',
    'ES': 'Europe',
    'NL': 'Europe',
    'CH': 'Europe',
    'AU': 'Oceania',
    'JP': 'Asia',
    'SG': 'Asia',
    'TH': 'Asia'
  }
  return regions[countryCode] || 'Other'
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'hard':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCountries() {
      try {
        const countriesData = await VisaService.getCountriesWithVisas()
        // Filter only countries with active visas
        const activeCountries = countriesData.filter(country => country.activeCount > 0)
        setCountries(activeCountries)
      } catch (error) {
        console.error('Error fetching countries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading countries...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Visa Information by Country
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore visa requirements, processing times, and fees for destinations worldwide. 
              Get expert guidance for your next international journey.
            </p>
          </div>
          
          {/* Filter/Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full md:w-80 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
              <option>Oceania</option>
            </select>
            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, index) => (
              <Link 
                key={country.countryCode}
                href={`/visa/${country.countryCode}`}
                className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 p-4 hover:scale-[1.02] cursor-pointer"
              >
                {/* Card Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${countryImages[country.countryCode as keyof typeof countryImages] || countryImages.default})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl">{country.flag}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{country.country}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Professional visa processing services for {country.country}. Multiple visa types available with expert guidance.
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Available</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{country.activeCount} visa types</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Region</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{getRegion(country.countryCode)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Processing</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-green-100 text-green-700"
                      >
                        Available
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}

                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}