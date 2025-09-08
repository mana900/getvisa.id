"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Globe } from "lucide-react"
import { trackVisaSearch } from "@/lib/gtag"

interface HeroBannerProps {
  onSearchChange?: (filters: {
    destination: string
    passport: string
    lengthOfStay: string
  }) => void
}

export default function HeroBanner({ onSearchChange }: HeroBannerProps) {
  const router = useRouter()
  const [destination, setDestination] = useState("")
  const [passport, setPassport] = useState("")
  const [lengthOfStay, setLengthOfStay] = useState("")

  const handleDestinationChange = (value: string) => {
    console.log("[v0] Destination selected:", value)
    setDestination(value)
    onSearchChange?.({
      destination: value,
      passport,
      lengthOfStay,
    })
  }

  const handlePassportChange = (value: string) => {
    console.log("[v0] Passport selected:", value)
    setPassport(value)
    onSearchChange?.({
      destination,
      passport: value,
      lengthOfStay,
    })
  }

  const handleLengthChange = (value: string) => {
    console.log("[v0] Length of stay selected:", value)
    setLengthOfStay(value)
    onSearchChange?.({
      destination,
      passport,
      lengthOfStay: value,
    })
  }

  const handleSearch = () => {
    if (destination) {
      // Track visa search in Google Analytics
      trackVisaSearch(destination)
      router.push(`/visa/${destination}`)
    }
  }

  return (
    <div className="relative rounded-3xl mx-6 mb-6 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-hero-canyon"></div>
      <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
      <div className="relative z-10 px-12 py-32 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Simplifying visas for
          <br />
          Indonesians Everywhere
        </h1>
        <p className="text-lg mb-12 opacity-90">Fast, reliable, and hassle-free visa services for 100+ destinations.</p>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="flex items-center text-gray-700 text-sm font-medium">
                <Globe className="w-4 h-4 mr-2" />
                Your Destination
              </label>
              <Select value={destination} onValueChange={handleDestinationChange}>
                <SelectTrigger className="bg-gray-50 border-0 w-full text-gray-900">
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
            <Button onClick={handleSearch} className="bg-black hover:bg-gray-800 text-white h-12 px-8">
              <Search className="w-5 h-5 mr-2" />
              Find visa
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}