"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    <footer className="bg-gray-100 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Travel Without Limit Section */}
        <div className="relative bg-gradient-to-r from-teal-800 to-gray-600 rounded-3xl mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-50 bg-beach-aerial"></div>
          <div className="relative z-10 px-8 py-16 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Travel without limit</h2>
              <p className="text-lg opacity-90">Find the right visa for your trip, easy apply in minutes.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="space-y-2">
                  <label className="flex items-center text-white text-sm font-medium">
                    <Globe className="w-4 h-4 mr-2" />
                    Your Destination
                  </label>
                  <Select value={destination} onValueChange={handleDestinationChange}>
                    <SelectTrigger className="w-64 bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="thailand">Thailand</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                      <SelectItem value="japan">Japan</SelectItem>
                      <SelectItem value="germany">Germany</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="italy">Italy</SelectItem>
                      <SelectItem value="spain">Spain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} className="bg-black hover:bg-gray-800 text-white h-12 px-8 mt-6">
                  <Search className="w-5 h-5 mr-2" />
                  Find visa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
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
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://wa.me/6282199144554" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                  📲 WhatsApp: +62 821-9914-4554
                </a>
              </li>
              <li>
                <a href="mailto:visa@traviontravel.com" className="hover:text-gray-900">
                  📧 Email: visa@traviontravel.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                📍 <strong>Office (By Appointment Only):</strong><br />
                The Plaza Office Tower Building, Lt. 41,<br />
                Jl. MH Thamrin, Kav 28-30.<br />
                Jakarta 10350, Indonesia
              </p>
            </div>
          </div>


          {/* Stay Connected */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Connected</h3>
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
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>©️ 2025 GetVisa.ID by Travion | All Rights Reserved</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-gray-900">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
