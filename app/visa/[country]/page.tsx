"use client"

import { useState } from "react"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Calendar, FileText, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock visa data - in a real app, this would come from an API or database
const visaData = {
  thailand: {
    country: "Thailand",
    flag: "🇹🇭",
    visaType: "Tourist Visa (TR)",
    price: 45,
    processingTime: "3-5 business days",
    duration: "60 days",
    validity: "3 months",
    overview: {
      description:
        "Thailand Tourist Visa allows visitors to enter Thailand for tourism purposes. This single-entry visa is perfect for travelers planning to explore Thailand's beautiful beaches, temples, and vibrant culture.",
      features: ["Electronic visa", "No appointment required", "No physical documents"],
      guaranteedDate: "25 October",
    },
    eligibility: [
      "Valid passport with at least 6 months validity",
      "Proof of accommodation in Thailand",
      "Return flight ticket",
      "Bank statement showing sufficient funds",
      "Passport-sized photograph",
    ],
    timeline: [
      { step: "Application Submission", time: "5 minutes", description: "Complete online application form" },
      { step: "Document Review", time: "1-2 days", description: "Our team reviews your documents" },
      { step: "Embassy Processing", time: "2-3 days", description: "Embassy processes your application" },
      { step: "Visa Delivery", time: "Same day", description: "Receive your visa via email" },
    ],
    documents: [
      "Passport copy (main page)",
      "Recent passport-sized photograph",
      "Flight itinerary",
      "Hotel booking confirmation",
      "Bank statement (last 3 months)",
      "Travel insurance (recommended)",
    ],
    faqs: [
      {
        question: "How long is the visa valid?",
        answer:
          "The Thailand Tourist Visa is valid for 3 months from the date of issue, allowing a stay of up to 60 days.",
      },
      {
        question: "Can I extend my stay?",
        answer:
          "Yes, you can extend your stay for an additional 30 days at any immigration office in Thailand for a fee of 1,900 THB.",
      },
      {
        question: "Is travel insurance required?",
        answer:
          "While not mandatory, travel insurance is highly recommended and may be required by some airlines or hotels.",
      },
    ],
  },
  // Add more countries as needed
  uk: {
    country: "United Kingdom",
    flag: "🇬🇧",
    visaType: "Standard Visitor Visa",
    price: 115,
    processingTime: "15-20 business days",
    duration: "6 months",
    validity: "10 years",
    overview: {
      description:
        "UK Standard Visitor Visa allows you to visit the UK for tourism, business, or to see family and friends. This visa is suitable for short-term visits.",
      features: ["Multiple entry allowed", "Online application", "Biometric appointment required"],
      guaranteedDate: "15 November",
    },
    eligibility: [
      "Valid passport",
      "Proof of funds to support your stay",
      "Evidence of accommodation",
      "Return travel arrangements",
      "No criminal record",
    ],
    timeline: [
      { step: "Online Application", time: "30 minutes", description: "Complete the online form" },
      { step: "Biometric Appointment", time: "1 day", description: "Attend biometric appointment" },
      { step: "Processing", time: "15-20 days", description: "UKVI processes your application" },
      { step: "Decision", time: "1 day", description: "Receive visa decision" },
    ],
    documents: [
      "Current passport",
      "Previous passports",
      "Bank statements",
      "Employment letter",
      "Travel itinerary",
      "Accommodation proof",
    ],
    faqs: [
      {
        question: "How long can I stay?",
        answer: "You can stay for up to 6 months on a Standard Visitor Visa.",
      },
      {
        question: "Can I work on this visa?",
        answer:
          "No, you cannot work on a Standard Visitor Visa. It is only for tourism, business meetings, or visiting family.",
      },
    ],
  },
}

export default function VisaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState("regular")

  const country = params.country as string
  const visa = visaData[country as keyof typeof visaData]

  if (!visa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Visa not found</h1>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    )
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility" },
    { id: "timeline", label: "Timeline" },
    { id: "documents", label: "Documents" },
    { id: "faqs", label: "FAQs" },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to visas
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
              {visa.flag}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {visa.country} {visa.visaType}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {visa.processingTime}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {visa.duration} stay
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />${visa.price}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation */}
            <div className="border-b border-gray-200 mb-6 sticky top-0 bg-gray-50 z-10 py-4">
              <nav className="flex space-x-8">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-orange-300 transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-12">
              {/* Overview Section */}
              <section id="overview" className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>

                <div className="flex gap-2 mb-6">
                  {visa.overview.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">
                      Submit documents today for guaranteed completion on {visa.overview.guaranteedDate}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{visa.overview.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold">{visa.processingTime.split(" ")[0]}</div>
                    <div className="text-sm text-gray-600">Time needed to process your application once submitted.</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold">{visa.duration.split(" ")[0]}</div>
                    <div className="text-sm text-gray-600">Maximum stay period for each visit.</div>
                  </div>
                </div>
              </section>

              {/* Eligibility Section */}
              <section id="eligibility" className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Eligibility Requirements</h2>
                <div className="space-y-3">
                  {visa.eligibility.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Timeline Section */}
              <section id="timeline" className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Application Timeline</h2>
                <div className="space-y-6">
                  {visa.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.step}</h3>
                        <p className="text-sm text-gray-600 mb-1">{step.time}</p>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Documents Section */}
              <section id="documents" className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Required Documents</h2>
                <div className="space-y-3">
                  {visa.documents.map((document, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{document}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs Section */}
              <section id="faqs" className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {visa.faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select type:</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visaType"
                      value="regular"
                      checked={selectedType === "regular"}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="text-orange-500"
                    />
                    <div>
                      <div className="font-medium">Regular</div>
                      <div className="text-sm text-gray-600">Processing time from {visa.processingTime}</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">${visa.price}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="font-medium">We have money-back guarantee</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    We have 99% approval rating. Refer to our refund policy for more information.
                  </p>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Apply Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
