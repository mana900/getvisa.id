"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Calendar, FileText, CheckCircle } from "lucide-react"
import { VisaType } from "@/lib/types/database"
import { formatIDR } from "@/lib/utils/currency"
import { trackApplicationStart, trackVisaCardClick } from "@/lib/gtag"


interface VisaOptionsProps {
  searchFilters?: {
    destination?: string
    passport?: string
    lengthOfStay?: string
  }
}

export default function VisaOptions({ searchFilters }: VisaOptionsProps) {
  const router = useRouter()
  const [displayedVisas, setDisplayedVisas] = useState(9)
  const [filteredVisas, setFilteredVisas] = useState<VisaType[]>([])
  const [allVisaOptions, setAllVisaOptions] = useState<VisaType[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch visa types from database
  useEffect(() => {
    const fetchVisaTypes = async () => {
      try {
        const response = await fetch('/api/admin/visa-types')
        if (response.ok) {
          const visaTypes = await response.json()
          setAllVisaOptions(visaTypes.filter((visa: VisaType) => visa.is_active))
        } else {
          console.error('Failed to fetch visa types')
          // Fallback to dummy data if API fails
          setAllVisaOptions([])
        }
      } catch (error) {
        console.error('Error fetching visa types:', error)
        // Fallback to empty array if API fails
        setAllVisaOptions([])
      } finally {
        setLoading(false)
      }
    }

    fetchVisaTypes()
  }, [])

  // Filter visas based on search filters
  useEffect(() => {
    let filtered = allVisaOptions

    if (searchFilters?.destination) {
      filtered = filtered.filter(
        (visa) =>
          visa.country_code.toLowerCase() === searchFilters.destination!.toLowerCase() ||
          visa.country.toLowerCase().includes(searchFilters.destination!.toLowerCase())
      )
    }

    if (searchFilters?.lengthOfStay) {
      const requestedDays = Number.parseInt(searchFilters.lengthOfStay)
      // We'll need to parse the duration field to compare
      // For now, show all since duration format may vary
      filtered = filtered
    }

    setFilteredVisas(filtered)
    setDisplayedVisas(9) // Reset display count when filters change
  }, [searchFilters, allVisaOptions])

  const handleCardClick = (countryCode: string, visaType?: string) => {
    // Track visa application start and card click in Google Analytics
    trackApplicationStart(countryCode)
    if (visaType) {
      trackVisaCardClick(countryCode, visaType, 'home_page')
    }
    router.push(`/visa/${countryCode}`)
  }

  const handleLoadMore = () => {
    setDisplayedVisas((prev) => Math.min(prev + 9, filteredVisas.length))
  }

  const visasToShow = filteredVisas.slice(0, displayedVisas)
  const hasMoreVisas = displayedVisas < filteredVisas.length

  if (loading) {
    return (
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading visa options...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Visa options</h2>
            <p className="text-gray-600">Find the right visa for you, apply in just minutes.</p>
            <p className="text-sm text-gray-500 mt-1">
              Showing {visasToShow.length} of {filteredVisas.length} visa options
            </p>
          </div>
        </div>

        {filteredVisas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No visa options found.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters or contact an admin to add visa types.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visasToShow.map((visa, index) => (
                <div
                  key={visa.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full"
                  onClick={() => handleCardClick(visa.country_code, visa.visa_type)}
                >
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">{visa.flag}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{visa.country}</h3>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          Visa
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 leading-tight">{visa.visa_type}</h4>
                      <span className="text-lg font-bold text-green-600 ml-2">{formatIDR(visa.price)}</span>
                    </div>

                    <div className="h-16 mb-4">
                      <p className="text-gray-600 text-xs leading-5 line-clamp-3">
                        {visa.overview?.description ?
                          visa.overview.description.length > 150
                            ? visa.overview.description.substring(0, 150).replace(/\s+\S*$/, '') + '...'
                            : visa.overview.description
                          : 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Process time</span>
                        </div>
                        <span className="font-medium text-gray-900 text-right ml-2">{visa.processing_time}</span>
                      </div>

                      <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Stay Duration</span>
                        </div>
                        <span className="font-medium text-gray-900 text-right ml-2">{visa.duration}</span>
                      </div>

                      <div className="flex items-start justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Validity</span>
                        </div>
                        <span className="font-medium text-gray-900 text-right ml-2">{visa.validity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(visa.country_code, visa.visa_type)
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreVisas && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Load more visas ({filteredVisas.length - displayedVisas} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
