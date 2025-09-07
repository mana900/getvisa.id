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
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: "url('/ocean-waves-meeting-beach-aerial-view.png')",
            }}
          ></div>
          <div className="relative z-10 px-8 py-16 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-8 md:mb-0">
              <h2 className="text-4xl font-bold mb-4">Travel without limit</h2>
              <p className="text-lg opacity-90">Find the right e-visa for your trip, easy apply in minutes.</p>
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
                  Find e-visa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold">getvisa.id</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>getvisa.id</strong> is the world's leading visa application for travelers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">PRODUCTS</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Get the app
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Visa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Passport
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Destination
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Visa pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Account
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/about" className="hover:text-gray-900">
                  About getvisa.id
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Get in touch
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">RESOURCES</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Help
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Legals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Policies
                </a>
              </li>
            </ul>
            <h3 className="font-semibold text-gray-900 mb-4 mt-8">EXPLORE</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Compare
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">PARTNER</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  For expert
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  For agency
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  For startup
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  For corporate
                </a>
              </li>
            </ul>
            <h3 className="font-semibold text-gray-900 mb-4 mt-8">FOLLOW US</h3>
            <div className="flex space-x-3">
              <Instagram className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>Copyright © 2024 getvisa.id Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-900">
              Privacy Policy
            </a>
            <span>&</span>
            <a href="#" className="hover:text-gray-900">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
