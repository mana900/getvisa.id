"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Globe, Bell, User } from "lucide-react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

interface HeaderProps {
  onSearchChange?: (filters: {
    destination: string
    passport: string
    lengthOfStay: string
  }) => void
}

export default function Header({ onSearchChange }: HeaderProps) {
  const { user, signOut } = useSupabaseAuth()
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
      router.push(`/visa/${destination}`)
    }
  }

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-white">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold">getvisa.id</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/countries" className="text-gray-700 hover:text-gray-900">
              Countries
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-200 transition-colors">
                    <span className="text-orange-600 font-medium text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                </Link>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <Link 
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative rounded-3xl mx-6 mb-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/canyon-background.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
        <div className="relative z-10 px-12 py-32 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Simplifying world travel
            <br />
            modernizing your visa
          </h1>
          <p className="text-lg mb-12 opacity-90">More than 100 countries are now giving out e-visas to travelers.</p>

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
                Find e-visa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
