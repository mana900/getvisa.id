"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CountrySelect } from "@/components/ui/country-select"
import { Search, Globe, Instagram, Linkedin, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  const router = useRouter()
  const [destination, setDestination] = useState("")

  const handleDestinationChange = (value: string) => {
    setDestination(value)
  }

  const handleSearch = () => {
    if (destination) {
      router.push(`/visa/${destination}`)
    }
  }
  return (
    <footer className="bg-gray-100 px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Travel Without Limit Section */}
        <div className="relative bg-gradient-to-r from-teal-800 to-gray-600 rounded-3xl mb-8 md:mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-50 bg-beach-aerial"></div>
          <div className="relative z-10 px-4 md:px-8 py-12 md:py-16 flex flex-col items-center text-center md:text-left md:flex-row md:items-center md:gap-8">
            <div className="text-white mb-8 md:mb-0 md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel without limit</h2>
              <p className="text-base md:text-lg opacity-90">Find the right visa for your trip, easy apply in minutes.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 w-full md:w-1/2">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="space-y-2 flex-1">
                  <label className="flex items-center justify-center md:justify-start text-white text-sm font-medium">
                    <Globe className="w-4 h-4 mr-2" />
                    Your Destination
                  </label>
                  <CountrySelect
                    value={destination}
                    onValueChange={handleDestinationChange}
                    placeholder="Select country"
                    triggerClassName="w-full md:w-64 bg-white/20 border-white/30 text-white h-12"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-black hover:bg-gray-800 text-white h-12 px-6 md:px-8 w-full md:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find visa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-gray-900">
                  • Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-900">
                  • About Us
                </a>
              </li>
              <li>
                <a href="/countries" className="hover:text-gray-900">
                  • Countries
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  • FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  • Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://wa.me/6282199144554" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 break-words">
                  📲 WhatsApp: +62 821-9914-4554
                </a>
              </li>
              <li>
                <a href="mailto:visa@traviontravel.com" className="hover:text-gray-900 break-words">
                  📧 Email: visa@traviontravel.com
                </a>
              </li>
            </ul>
            <div className="mt-3 md:mt-4">
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                📍 <strong>Office (By Appointment Only):</strong><br />
                The Plaza Office Tower Building, Lt. 41,<br />
                Jl. MH Thamrin, Kav 28-30.<br />
                Jakarta 10350, Indonesia
              </p>
            </div>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4">Stay Connected</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Follow us:</p>
              <div className="flex space-x-3">
                <a href="https://www.instagram.com/getvisaid/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                </a>
                <a href="https://www.linkedin.com/company/travion-travel/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-600 space-y-4 md:space-y-0">
          <p className="text-center md:text-left">©️ 2025 GetVisa.ID by Travion | All Rights Reserved</p>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="hover:text-gray-900">
              Privacy Policy
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-gray-900">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
