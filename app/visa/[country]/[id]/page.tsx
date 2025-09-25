"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, FileText, Shield, CheckCircle, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VisaService } from "@/lib/services/visa-service"
import { SettingsService } from "@/lib/services/settings-service"
import type { VisaType } from "@/lib/types/database"
import { formatIDR } from "@/lib/utils/currency"
import { 
  trackVisaDetailView, 
  trackApplyNowClick, 
  trackContactConsultantClick, 
  trackPriceView,
  trackProcessingTimeView,
  trackBackButtonClick,
  trackWhatsAppMessageSent,
  trackLeadGeneration,
  trackConversionFormSubmit
} from "@/lib/gtag"
import VisaPageAnalytics from "@/components/VisaPageAnalytics"

export default function VisaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const country = params.country as string
  const visaId = params.id as string

  const [visa, setVisa] = useState<VisaType | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState<string>("")
  const [messageTemplate, setMessageTemplate] = useState<string>("")
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [userName, setUserName] = useState<string>("")
  const [userPhone, setUserPhone] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [leadId, setLeadId] = useState<number | null>(null)
  
  // Mobile drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerAnimating, setIsDrawerAnimating] = useState(false)

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

  // Handle contact form submission
  const handleContactSubmit = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.trim(),
          phone: userPhone.trim(),
          country: visa?.country,
          visa_type: visa?.visa_type,
          visa_id: visaId,
          price: visa?.price,
          source: 'visa_detail_page'
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setLeadId(result.leadId)
        
        // 🎯 CONVERSION TRACKING - Track lead generation conversion immediately after successful form submission
        if (result.leadId && visa?.country && visa?.visa_type && visa?.price) {
          // Track GA4 standard generate_lead conversion event
          trackLeadGeneration(
            visa.country,
            visa.visa_type, 
            visa.price,
            result.leadId.toString()
          )
          
          // Track custom form submission conversion
          trackConversionFormSubmit(
            visa.country,
            visa.visa_type,
            visa.price,
            userName.trim(),
            result.leadId.toString()
          )
        }
        
        // Track the WhatsApp click
        if (result.leadId) {
          await fetch(`/api/contact-leads/${result.leadId}/whatsapp`, {
            method: 'POST',
          })
        }
        
        // Generate personalized message
        let personalizedMessage = `Hi! I'm ${userName.trim()} and I'm interested in the ${visa?.visa_type} for ${visa?.country}. My phone number is ${userPhone.trim()}. ${messageTemplate.replace('{countryName}', visa?.country || '').replace('{visaType}', visa?.visa_type || '')}`

        // Truncate message if too long (WhatsApp has URL length limits)
        if (personalizedMessage.length > 1000) {
          personalizedMessage = personalizedMessage.substring(0, 997) + '...'
        }

        // Clean WhatsApp number (remove any non-digits except +)
        const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '')

        // Validate WhatsApp number
        if (!cleanNumber || cleanNumber.length < 10) {
          console.error('Invalid WhatsApp number:', whatsappNumber)
          alert('WhatsApp configuration error. Please contact support.')
          return
        }

        // Create WhatsApp URL - try both wa.me and api.whatsapp.com for better mobile compatibility
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(personalizedMessage)}`
        const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(personalizedMessage)}`

        // Track existing analytics with enhanced parameters for better attribution
        trackContactConsultantClick(
          visa?.country || '',
          visa?.visa_type || '',
          'whatsapp',
          visa?.price,
          result.leadId?.toString()
        )
        trackWhatsAppMessageSent(visa?.country || '', visa?.visa_type || '')

        // Debug information
        console.log('WhatsApp redirect debug:', {
          originalNumber: whatsappNumber,
          cleanNumber,
          whatsappUrl,
          messageLength: personalizedMessage.length,
          userAgent: navigator.userAgent
        })

        // Mobile-optimized WhatsApp redirect
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        // Add small delay to ensure form submission is complete
        setTimeout(() => {
          if (isMobile) {
            // For mobile devices, use direct location.href for better compatibility
            console.log('Mobile detected - using location.href')
            window.location.href = whatsappUrl
          } else {
            // For desktop, use window.open with fallback
            console.log('Desktop detected - using window.open')
            const newWindow = window.open(whatsappUrl, '_blank')
            // If popup is blocked, fallback to location.href
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
              console.log('Popup blocked - fallback to location.href')
              window.location.href = whatsappUrl
            }
          }
        }, 100)
      } else {
        console.error('Error submitting contact info:', result.error)
        alert('There was an error. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting contact info:', error)
      alert('There was an error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form is valid
  const isFormValid = userName.trim().length > 0 && userPhone.trim().length > 0

  // Toggle drawer
  const toggleDrawer = () => {
    if (isDrawerOpen) {
      setIsDrawerAnimating(true)
      setTimeout(() => {
        setIsDrawerOpen(false)
        setIsDrawerAnimating(false)
      }, 300)
    } else {
      setIsDrawerOpen(true)
    }
  }

  // Handle drawer form submission
  const handleDrawerSubmit = async () => {
    await handleContactSubmit()
    // Close drawer after successful submission
    if (isFormValid) {
      toggleDrawer()
    }
  }

  // Handle body scroll lock for drawer
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  // Fetch visa data and settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visaData, whatsappNum, msgTemplate] = await Promise.all([
          VisaService.getVisaById(visaId),
          SettingsService.getWhatsAppNumber(),
          SettingsService.getWhatsAppMessageTemplate()
        ])
        
        console.log('Fetched visa data:', visaData)
        setVisa(visaData)
        setWhatsappNumber(whatsappNum)
        setMessageTemplate(msgTemplate)
        
        // Track visa detail view
        if (visaData) {
          trackVisaDetailView(visaData.country, visaData.visa_type, visaData.price)
          trackPriceView(visaData.country, visaData.visa_type, visaData.price)
          trackProcessingTimeView(visaData.country, visaData.visa_type, visaData.processing_time)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setVisa(null)
      } finally {
        setLoading(false)
      }
    }

    if (visaId) {
      fetchData()
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
      {/* Analytics Tracking */}
      <VisaPageAnalytics 
        country={visa.country}
        visaType={visa.visa_type}
        price={visa.price}
        processingTime={visa.processing_time}
        pageType="visa_detail" 
      />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <Link href={`/visa/${country}`}>
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => trackBackButtonClick('visa_detail', 'country_page')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {visa.country} visas
            </Button>
          </Link>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                {visa.flag}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold leading-tight">
                  {visa.country} - {visa.visa_type}
                </h1>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="text-xs text-gray-600">Processing</div>
                <div className="text-sm font-semibold">{visa.processing_time}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                  <Calendar className="w-3 h-3" />
                </div>
                <div className="text-xs text-gray-600">Duration</div>
                <div className="text-sm font-semibold">{visa.duration}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 mb-1">Price</div>
                <div className="text-lg font-bold text-green-600">{formatIDR(visa.price)}</div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-4">
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
                <div className="text-2xl font-bold text-green-600">{formatIDR(visa.price)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 pb-24 md:pb-16">
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

            {/* Application Timeline - Only show if timeline exists and has entries */}
            {visa.timeline && visa.timeline.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Timeline</h2>
                <div className="space-y-6">
                  {visa.timeline.map((step, index) => (
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
            )}

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
                <div className="text-3xl font-bold text-green-600 mb-2">{formatIDR(visa.price)}</div>
                <div className="text-gray-500 mb-6">Processing time: {visa.processing_time}</div>
                
                {/* Contact Form */}
                <div className="space-y-4 mb-6">
                  <div className="text-left">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+62 812 3456 7890"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>



                <Button
                  onClick={handleContactSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isFormValid
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Connecting...' : 'Contact Consultant'}
                </Button>

                {!isFormValid && (
                  <p className="text-xs text-gray-500 mt-2">
                    Please enter your name and phone number to continue
                  </p>
                )}
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

               {/* Money-back Policy */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">We have a money-back policy</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
              If your visa application is unsuccessful, we’ll refund 100% of your money. 
                      </p>
                    </div>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-green-600">{formatIDR(visa.price)}</div>
            <div className="text-xs text-gray-500">{visa.processing_time}</div>
          </div>
          <Button 
            onClick={toggleDrawer}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {(isDrawerOpen || isDrawerAnimating) && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
              isDrawerOpen && !isDrawerAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={toggleDrawer} 
          />
          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-in-out max-h-[85vh] ${
            isDrawerOpen && !isDrawerAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Drawer Handle */}
              <div className="flex justify-center py-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Drawer Header */}
              <div className="px-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                    {visa.flag}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{visa.country} - {visa.visa_type}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{visa.processing_time}</span>
                      <span>•</span>
                      <span className="font-bold text-green-600">{formatIDR(visa.price)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">Quick Application</h4>
                  <p className="text-sm text-gray-600">Get started by providing your details below</p>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="drawer-name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="drawer-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="drawer-phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="drawer-phone"
                        type="tel"
                        placeholder="+62 812 3456 7890"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-medium">{visa.processing_time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{visa.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Validity</span>
                    <span className="font-medium">{visa.validity}</span>
                  </div>
                </div>
              </div>



                <Button
                  onClick={handleDrawerSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium transition-colors ${
                    isFormValid 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Connecting...' : 'Contact Consultant'}
                </Button>
                
                {!isFormValid && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please enter your name and phone number to continue
                  </p>
                )}

              {/* Drawer Footer */}
              <div className="p-6 pb-8 border-t border-gray-100">
                {/* Money-back Policy */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">We have a money-back policy</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
If your visa application is unsuccessful, we’ll refund 100% of your money.                 </p>
                    </div>
                  </div>
                </div>





                
                {/* Safari bottom padding for home indicator */}
                <div className="h-6"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}