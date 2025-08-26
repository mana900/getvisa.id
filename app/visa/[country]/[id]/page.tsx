"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, FileText, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VisaService } from "@/lib/services/visa-service"
import type { VisaType } from "@/lib/types/database"

export default function VisaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const country = params.country as string
  const visaId = params.id as string

  const [visa, setVisa] = useState<VisaType | null>(null)
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

  // Fetch visa data from database
  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const visaData = await VisaService.getVisaById(visaId)
        console.log('Fetched visa data:', visaData)
        setVisa(visaData)
      } catch (error) {
        console.error('Error fetching visa:', error)
        setVisa(null)
      } finally {
        setLoading(false)
      }
    }

    if (visaId) {
      fetchVisa()
    }
  }, [visaId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa details...</p>
        </div>
      </div>
    )
  }

  if (!visa || visa.country_code !== country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Visa not found</h1>
          <p className="text-gray-600 mb-4">The requested visa type could not be found.</p>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href={`/visa/${country}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {visa.country} visas
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
              {visa.flag}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {visa.country} - {visa.visa_type}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {visa.processing_time}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {visa.duration}
                </div>
                <div className="text-2xl font-bold text-green-600">${visa.price}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">{visa.overview?.description}</p>
              
              {visa.overview?.features?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {visa.overview?.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {visa.overview?.guaranteedDate && calculateCompletionDate(visa.overview.guaranteedDate) && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mt-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      If you apply today, your visa will be ready by: <span className="font-bold text-lg text-green-900">{calculateCompletionDate(visa.overview.guaranteedDate)}</span>
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Eligibility Requirements */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Eligibility</h2>
              <ul className="space-y-3">
                {visa.eligibility?.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Application Timeline */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-6">
                {visa.timeline?.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.step}</h3>
                      <p className="text-sm text-gray-600 mb-1">{step.time}</p>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Required Documents */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Documents</h2>
              <ul className="space-y-3">
                {visa.documents?.map((document, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{document}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            {visa.faqs?.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQs</h2>
                <div className="space-y-6">
                  {visa.faqs?.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">${visa.price}</div>
                <div className="text-gray-500 mb-4">Processing time: {visa.processing_time}</div>
                <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Apply Now
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stay Duration</span>
                  <span className="font-semibold">{visa.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visa Validity</span>
                  <span className="font-semibold">{visa.validity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-semibold">{visa.processing_time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}