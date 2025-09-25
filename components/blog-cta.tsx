"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, User, Phone } from "lucide-react"
import { SettingsService } from "@/lib/services/settings-service"
import {
  trackContactConsultantClick,
  trackWhatsAppMessageSent,
  trackLeadGeneration,
  trackConversionFormSubmit
} from "@/lib/gtag"

export default function BlogCTA() {
  const [userName, setUserName] = useState<string>("")
  const [userPhone, setUserPhone] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if form is valid
  const isFormValid = userName.trim().length > 0 && userPhone.trim().length > 0

  // Handle contact form submission
  const handleContactSubmit = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Get WhatsApp settings
      const [whatsappNumber, messageTemplate] = await Promise.all([
        SettingsService.getWhatsAppNumber(),
        SettingsService.getWhatsAppMessageTemplate()
      ])

      // Submit contact lead
      const response = await fetch('/api/contact-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.trim(),
          phone: userPhone.trim(),
          source: 'blog_cta'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Track lead generation conversion
        if (result.leadId) {
          trackLeadGeneration(
            'Blog CTA',
            'General Inquiry',
            0,
            result.leadId.toString()
          )

          trackConversionFormSubmit(
            'Blog CTA',
            'General Inquiry',
            0,
            userName.trim(),
            result.leadId.toString()
          )

          // Track the WhatsApp click
          await fetch(`/api/contact-leads/${result.leadId}/whatsapp`, {
            method: 'POST',
          })
        }

        // Generate personalized message
        const personalizedMessage = `Hi! I'm ${userName.trim()} and I'm interested in visa services. My phone number is ${userPhone.trim()}. ${messageTemplate.replace('{countryName}', 'various countries').replace('{visaType}', 'visa consultation')}`

        // Clean WhatsApp number (remove any non-digits except +)
        const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '')

        // Validate WhatsApp number
        if (!cleanNumber || cleanNumber.length < 10) {
          console.error('Invalid WhatsApp number:', whatsappNumber)
          alert('WhatsApp configuration error. Please contact support.')
          return
        }

        // Truncate message if too long (WhatsApp has URL length limits)
        let truncatedMessage = personalizedMessage
        if (personalizedMessage.length > 1000) {
          truncatedMessage = personalizedMessage.substring(0, 997) + '...'
        }

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(truncatedMessage)}`

        // Track analytics
        trackContactConsultantClick(
          'Blog CTA',
          'General Inquiry',
          'whatsapp',
          0,
          result.leadId?.toString()
        )
        trackWhatsAppMessageSent('Blog CTA', 'General Inquiry')

        // Mobile-optimized WhatsApp redirect
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        // Add small delay to ensure form submission is complete
        setTimeout(() => {
          if (isMobile) {
            // For mobile devices, use direct location.href for better compatibility
            window.location.href = whatsappUrl
          } else {
            // For desktop, use window.open with fallback
            const newWindow = window.open(whatsappUrl, '_blank')
            // If popup is blocked, fallback to location.href
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
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

  return (
    <Card className="mt-16 bg-green-50 border-green-200">
      <CardContent className="p-8 text-center">
        <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          Need Expert Help with Your Visa?
        </h3>
        <p className="text-green-700 mb-6 max-w-2xl mx-auto">
          Our experienced team can guide you through every step of your visa application process.
          Get personalized assistance and increase your chances of approval.
        </p>

        {/* Contact Form */}
        <div className="max-w-md mx-auto space-y-4 mb-6">
          <div className="text-left">
            <Label htmlFor="blog-name" className="text-sm font-medium text-gray-700">
              Full Name *
            </Label>
            <div className="mt-1 relative">
              <Input
                id="blog-name"
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="pl-10 bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="text-left">
            <Label htmlFor="blog-phone" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <div className="mt-1 relative">
              <Input
                id="blog-phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="pl-10 bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleContactSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {isSubmitting ? (
              <>
                <MessageCircle className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Consultant
              </>
            )}
          </Button>
          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-100" asChild>
            <a href="/resources">Read More Guides</a>
          </Button>
        </div>

        {!isFormValid && (
          <p className="text-xs text-gray-500 mt-2">
            Please enter your name and phone number to continue
          </p>
        )}
      </CardContent>
    </Card>
  )
}