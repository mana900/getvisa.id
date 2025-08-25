"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Calendar, FileText, CheckCircle } from "lucide-react"

const allVisaOptions = [
  {
    country: "Japan",
    slug: "japan",
    flag: "🇯🇵",
    visaName: "Tourist Visa (Single Entry)",
    processTime: "5-7 business days",
    duration: "90 days",
    cost: "$45",
    description: "Perfect for tourism, visiting friends, or short business trips",
    requirements: ["Valid passport", "Photo", "Application form"],
    validity: "3 months from issue",
    entries: "Single entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "United Kingdom",
    slug: "uk",
    flag: "🇬🇧",
    visaName: "Standard Visitor Visa",
    processTime: "15-20 business days",
    duration: "180 days",
    cost: "$125",
    description: "For tourism, business visits, or visiting family and friends",
    requirements: ["Valid passport", "Financial proof", "Travel itinerary"],
    validity: "6 months from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 180,
  },
  {
    country: "Canada",
    slug: "canada",
    flag: "🇨🇦",
    visaName: "Electronic Travel Authorization",
    processTime: "1-3 business days",
    duration: "180 days",
    cost: "$7",
    description: "Quick electronic authorization for air travel to Canada",
    requirements: ["Valid passport", "Email address", "Credit card"],
    validity: "5 years or until passport expires",
    entries: "Multiple entry",
    category: "eVisa",
    maxStay: 180,
  },
  {
    country: "Australia",
    slug: "australia",
    flag: "🇦🇺",
    visaName: "Visitor Visa (Subclass 600)",
    processTime: "10-15 business days",
    duration: "90 days",
    cost: "$150",
    description: "For tourism, business visitor activities, or visiting family",
    requirements: ["Valid passport", "Health insurance", "Financial evidence"],
    validity: "12 months from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "India",
    slug: "india",
    flag: "🇮🇳",
    visaName: "e-Tourist Visa",
    processTime: "2-4 business days",
    duration: "60 days",
    cost: "$25",
    description: "Electronic visa for tourism, casual business, or medical visits",
    requirements: ["Valid passport", "Digital photo", "Return ticket"],
    validity: "365 days from issue",
    entries: "Double entry",
    category: "eVisa",
    maxStay: 60,
  },
  {
    country: "Thailand",
    slug: "thailand",
    flag: "🇹🇭",
    visaName: "Tourist Visa (TR)",
    processTime: "3-5 business days",
    duration: "60 days",
    cost: "$40",
    description: "Single entry visa for tourism and leisure activities",
    requirements: ["Valid passport", "Photo", "Flight booking"],
    validity: "3 months from issue",
    entries: "Single entry",
    category: "Tourism",
    maxStay: 60,
  },
  {
    country: "Singapore",
    slug: "singapore",
    flag: "🇸🇬",
    visaName: "Tourist Visa",
    processTime: "1-3 business days",
    duration: "30 days",
    cost: "$35",
    description: "For short-term tourism and business visits",
    requirements: ["Valid passport", "Photo", "Travel itinerary"],
    validity: "2 months from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 30,
  },
  {
    country: "South Korea",
    slug: "south-korea",
    flag: "🇰🇷",
    visaName: "Tourist Visa (C-3)",
    processTime: "5-7 business days",
    duration: "90 days",
    cost: "$60",
    description: "For tourism, transit, or short-term business activities",
    requirements: ["Valid passport", "Application form", "Financial proof"],
    validity: "3 months from issue",
    entries: "Single entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "Germany",
    slug: "germany",
    flag: "🇩🇪",
    visaName: "Schengen Tourist Visa",
    processTime: "10-15 business days",
    duration: "90 days",
    cost: "$85",
    description: "Access to 26 European countries in the Schengen area",
    requirements: ["Valid passport", "Travel insurance", "Hotel bookings"],
    validity: "6 months from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "France",
    slug: "france",
    flag: "🇫🇷",
    visaName: "Short-stay Schengen Visa",
    processTime: "10-15 business days",
    duration: "90 days",
    cost: "$85",
    description: "For tourism, business, or family visits in France and Schengen area",
    requirements: ["Valid passport", "Travel insurance", "Financial proof"],
    validity: "6 months from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "Brazil",
    slug: "brazil",
    flag: "🇧🇷",
    visaName: "Tourist Visa",
    processTime: "5-10 business days",
    duration: "90 days",
    cost: "$40",
    description: "For tourism and leisure activities in Brazil",
    requirements: ["Valid passport", "Photo", "Yellow fever certificate"],
    validity: "5 years from issue",
    entries: "Multiple entry",
    category: "Tourism",
    maxStay: 90,
  },
  {
    country: "China",
    slug: "china",
    flag: "🇨🇳",
    visaName: "Tourist Visa (L)",
    processTime: "4-7 business days",
    duration: "30 days",
    cost: "$140",
    description: "For sightseeing, visiting friends, or other tourism activities",
    requirements: ["Valid passport", "Photo", "Travel itinerary"],
    validity: "3 months from issue",
    entries: "Single entry",
    category: "Tourism",
    maxStay: 30,
  },
]

interface VisaOptionsProps {
  searchFilters?: {
    destination?: string
    passport?: string
    lengthOfStay?: string
  }
}

export default function VisaOptions({ searchFilters }: VisaOptionsProps) {
  const router = useRouter()
  const [displayedVisas, setDisplayedVisas] = useState(8) // Added state for load more functionality
  const [filteredVisas, setFilteredVisas] = useState(allVisaOptions)

  useEffect(() => {
    let filtered = allVisaOptions

    if (searchFilters?.destination) {
      filtered = filtered.filter(
        (visa) =>
          visa.country.toLowerCase().includes(searchFilters.destination!.toLowerCase()) ||
          visa.slug === searchFilters.destination,
      )
    }

    if (searchFilters?.lengthOfStay) {
      const requestedDays = Number.parseInt(searchFilters.lengthOfStay)
      filtered = filtered.filter((visa) => visa.maxStay >= requestedDays)
    }

    setFilteredVisas(filtered)
    setDisplayedVisas(8) // Reset display count when filters change
  }, [searchFilters])

  const handleCardClick = (slug: string) => {
    router.push(`/visa/${slug}`)
  }

  const handleLoadMore = () => {
    setDisplayedVisas((prev) => Math.min(prev + 8, filteredVisas.length))
  }

  const visasToShow = filteredVisas.slice(0, displayedVisas)
  const hasMoreVisas = displayedVisas < filteredVisas.length

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visasToShow.map((visa, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
              onClick={() => handleCardClick(visa.slug)}
            >
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{visa.flag}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{visa.country}</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {visa.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 leading-tight">{visa.visaName}</h4>
                  <span className="text-lg font-bold text-green-600 ml-2">{visa.cost}</span>
                </div>

                <p className="text-gray-600 text-xs leading-relaxed mb-4">{visa.description}</p>
              </div>

              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Process time</span>
                  </div>
                  <span className="font-medium text-gray-900">{visa.processTime}</span>
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

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Entries</span>
                  </div>
                  <span className="font-medium text-gray-900">{visa.entries}</span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">Requirements:</p>
                  <div className="flex flex-wrap gap-1">
                    {visa.requirements.map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full mt-4 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCardClick(visa.slug)
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
      </div>
    </section>
  )
}
