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
  // Current database countries (lowercase full names)
  'australia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format', // Sydney Opera House
  'canada': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=entropy&auto=format', // Canada forest lake
  'china': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop&crop=entropy&auto=format', // China Great Wall
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&crop=entropy&auto=format', // Singapore Marina Bay
  'uae': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&crop=entropy&auto=format', // Dubai skyline
  
  // Alternative Canada URLs in case first one fails
  'canada_alt1': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&crop=entropy&auto=format', // Canada Banff
  'canada_alt2': 'https://images.unsplash.com/photo-1519832064-4d24ad9b66b9?w=400&h=300&fit=crop&crop=entropy&auto=format', // Canada Toronto
  
  // Additional countries for future use  
  'usa': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop&crop=entropy&auto=format', // New York skyline
  'united_states': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop&crop=entropy&auto=format', // New York skyline
  'uk': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=entropy&auto=format', // London Big Ben
  'united_kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=entropy&auto=format', // London Big Ben
  'germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop&crop=entropy&auto=format', // Germany Berlin
  'france': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=entropy&auto=format', // Paris Eiffel Tower
  'italy': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop&crop=entropy&auto=format', // Italy Colosseum
  'spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop&crop=entropy&auto=format', // Spain Barcelona
  'netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop&crop=entropy&auto=format', // Netherlands canals
  'switzerland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format', // Swiss Alps
  'norway': 'https://images.unsplash.com/photo-1464822759844-d150f4c0ca60?w=400&h=300&fit=crop&crop=entropy&auto=format', // Norway fjords
  'sweden': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=300&fit=crop&crop=entropy&auto=format', // Sweden Stockholm
  'denmark': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop&crop=entropy&auto=format', // Denmark Copenhagen
  'new_zealand': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=entropy&auto=format', // New Zealand landscape  
  'japan': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=300&fit=crop&crop=entropy&auto=format', // Japan Tokyo
  'south_korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=300&fit=crop&crop=entropy&auto=format', // South Korea Seoul
  'korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=300&fit=crop&crop=entropy&auto=format', // South Korea Seoul
  'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop&crop=entropy&auto=format', // Thailand Bangkok
  'vietnam': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop&crop=entropy&auto=format', // Vietnam Ha Long Bay
  'malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop&crop=entropy&auto=format', // Malaysia Kuala Lumpur
  'philippines': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=entropy&auto=format', // Philippines Palawan
  'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&crop=entropy&auto=format', // India Taj Mahal
  'sri_lanka': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop&crop=entropy&auto=format', // Sri Lanka temple
  'qatar': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop&crop=entropy&auto=format', // Qatar Doha
  'saudi_arabia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=entropy&auto=format', // Saudi Arabia
  'israel': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=entropy&auto=format', // Israel Jerusalem
  'turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop&crop=entropy&auto=format', // Turkey Istanbul
  'south_africa': 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=400&h=300&fit=crop&crop=entropy&auto=format', // South Africa Cape Town
  'southafrica': 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=400&h=300&fit=crop&crop=entropy&auto=format', // South Africa
  'za': 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea?w=400&h=300&fit=crop&crop=entropy&auto=format', // South Africa ISO code
  'egypt': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c2e?w=400&h=300&fit=crop&crop=entropy&auto=format', // Egypt pyramids
  'morocco': 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=300&fit=crop&crop=entropy&auto=format', // Morocco
  'kenya': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop&crop=entropy&auto=format', // Kenya safari
  'brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop&crop=entropy&auto=format', // Brazil Rio
  'argentina': 'https://images.unsplash.com/photo-1589909202802-8c50ba863a7d?w=400&h=300&fit=crop&crop=entropy&auto=format', // Argentina Buenos Aires
  'chile': 'https://images.unsplash.com/photo-1544827150-6855c55b5282?w=400&h=300&fit=crop&crop=entropy&auto=format', // Chile Patagonia
  'peru': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop&crop=entropy&auto=format', // Peru Machu Picchu
  
  'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=entropy&auto=format'
}

// Helper function to get country image with fallback
function getCountryImage(countryCode: string, countryName: string): string {
  // Special handling for Canada with multiple fallbacks
  if (countryCode === 'canada') {
    return countryImages['canada'] || countryImages['canada_alt1'] || countryImages['canada_alt2']
  }
  
  // First try exact country code match
  if (countryImages[countryCode]) {
    return countryImages[countryCode]
  }
  
  // Try common variations
  const variations = [
    countryCode.toLowerCase(),
    countryCode.replace(/\s+/g, '_').toLowerCase(),
    countryCode.replace(/\s+/g, '').toLowerCase(),
    countryName?.toLowerCase().replace(/\s+/g, '_')
  ]
  
  for (const variation of variations) {
    if (countryImages[variation]) {
      return countryImages[variation]
    }
  }
  
  // Use default fallback image
  return countryImages.default
}

// Helper function to get region from country code
function getRegion(countryCode: string): string {
  const regions: Record<string, string> = {
    // Current database countries
    'australia': 'Oceania',
    'canada': 'North America',
    'china': 'Asia',
    'singapore': 'Asia',
    'uae': 'Middle East',
    
    // Additional countries for future use
    'usa': 'North America',
    'united_states': 'North America',
    'uk': 'Europe',
    'united_kingdom': 'Europe', 
    'germany': 'Europe',
    'france': 'Europe',
    'italy': 'Europe',
    'spain': 'Europe',
    'netherlands': 'Europe',
    'switzerland': 'Europe',
    'norway': 'Europe',
    'sweden': 'Europe',
    'denmark': 'Europe',
    'turkey': 'Europe',
    'new_zealand': 'Oceania',
    'japan': 'Asia',
    'south_korea': 'Asia',
    'korea': 'Asia',
    'thailand': 'Asia',
    'vietnam': 'Asia',
    'malaysia': 'Asia',
    'philippines': 'Asia',
    'india': 'Asia',
    'sri_lanka': 'Asia',
    'qatar': 'Middle East',
    'saudi_arabia': 'Middle East',
    'israel': 'Middle East',
    'south_africa': 'Africa',
    'southafrica': 'Africa',
    'za': 'Africa',
    'egypt': 'Africa',
    'morocco': 'Africa',
    'kenya': 'Africa',
    'brazil': 'South America',
    'argentina': 'South America',
    'chile': 'South America',
    'peru': 'South America'
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
        const response = await fetch('/api/countries')
        if (response.ok) {
          const data = await response.json()
          setCountries(data.countries)
        } else {
          console.error('Failed to fetch countries from database, falling back to service')
          // Fallback to existing service
          const countriesData = await VisaService.getCountriesWithVisas()
          const activeCountries = countriesData.filter(country => country.activeCount > 0)
          setCountries(activeCountries)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Fallback to existing service
        try {
          const countriesData = await VisaService.getCountriesWithVisas()
          const activeCountries = countriesData.filter(country => country.activeCount > 0)
          setCountries(activeCountries)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
        }
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
      <section className="px-6 py-12 bg-white" style={{ paddingTop: 'calc(3rem + 88px)' }}>
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
          
          {/* Filter/Search Bar
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
          </div> */}


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
                    className="absolute inset-0 bg-cover bg-center country-image"
                    style={{ 
                      '--bg-image': `url(${country.image || getCountryImage(country.countryCode, country.country)})`,
                    } as React.CSSProperties}
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
                    {/* <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div> */}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {country.description || `Professional visa processing services for ${country.country}. Multiple visa types available with expert guidance.`}
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