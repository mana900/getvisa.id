"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, FileText, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VisaService } from "@/lib/services/visa-service"
import type { VisaType } from "@/lib/types/database"
import { formatIDR } from "@/lib/utils/currency"
import { trackVisaCardClick, trackBackButtonClick } from "@/lib/gtag"
import VisaPageAnalytics from "@/components/VisaPageAnalytics"

export default function CountryVisaPage() {
  const params = useParams()
  const router = useRouter()
  const country = params.country as string

  const [countryVisas, setCountryVisas] = useState<VisaType[]>([])
  const [countryInfo, setCountryInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to calculate completion date
  const calculateCompletionDate = (days: string | number) => {
    if (!days) return null
    
    const daysNumber = typeof days === 'string' ? parseInt(days, 10) : days
    if (isNaN(daysNumber) || daysNumber <= 0) return null
    
    const today = new Date()
    const completionDate = new Date(today)
    completionDate.setDate(today.getDate() + daysNumber)
    
    return completionDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Fetch visa types for this country from database
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        console.log('Fetching data for country:', country)
        
        // Get visa types for this country
        const visas = await VisaService.getVisaTypesByCountry(country)
        console.log('Found visas for', country, ':', visas)
        setCountryVisas(visas)

        // Get country info from countries with visas
        const countries = await VisaService.getCountriesWithVisas()
        console.log('All countries:', countries)
        const info = countries.find(c => c.countryCode === country)
        console.log('Country info for', country, ':', info)
        setCountryInfo(info)
      } catch (error) {
        console.error('Error fetching country data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (country) {
      fetchCountryData()
    }
  }, [country])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa options...</p>
        </div>
      </div>
    )
  }

  if (!countryInfo || countryVisas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No visas found</h1>
          <p className="text-gray-600 mb-4">No visa types are available for this country.</p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Analytics Tracking */}
      <VisaPageAnalytics 
        country={countryInfo?.countryName || country} 
        pageType="country_listing" 
      />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              trackBackButtonClick('country_page', 'home')
              router.push("/")
            }} 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
              {countryInfo.flag}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {countryInfo.country} Visa
              </h1>
              <p className="text-gray-600">
                {countryInfo.activeCount} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visa Cards Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {countryVisas.map((visa) => (
            <div
              key={visa.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
              onClick={() => {
                trackVisaCardClick(visa.country, visa.visa_type, 'country_page')
                router.push(`/visa/${country}/${visa.id}`)
              }}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{countryInfo.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{countryInfo.country}</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Visa
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 leading-tight">{visa.visa_type}</h4>
                  <span className="text-lg font-bold text-green-600 ml-2">{formatIDR(visa.price)}</span>
                </div>

                <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
                  {visa.overview?.description}
                </p>
              </div>

              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Process time</span>
                  </div>
                  <span className="font-medium text-gray-900">{visa.processing_time}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium text-gray-900">{visa.duration}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Validity</span>
                  </div>
                  <span className="font-medium text-gray-900">{visa.validity}</span>
                </div>

                {visa.overview?.guaranteedDate && calculateCompletionDate(visa.overview.guaranteedDate) && (
                  <div className="flex items-center justify-between text-sm bg-green-50 p-2 rounded-md border border-green-200">
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-xs">Ready by</span>
                    </div>
                    <span className="font-medium text-green-800 text-xs">
                      {calculateCompletionDate(visa.overview.guaranteedDate)}
                    </span>
                  </div>
                )}

                {visa.overview?.features?.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-2">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {visa.overview?.features?.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="w-full mt-4 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    trackVisaCardClick(visa.country, visa.visa_type, 'country_page')
                    router.push(`/visa/${country}/${visa.id}`)
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}