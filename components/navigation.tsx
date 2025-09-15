"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe, Bell, Menu, X } from "lucide-react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

export default function Navigation() {
  const { user, signOut } = useSupabaseAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsMobileMenuOpen(false)
        setIsAnimating(false)
      }, 300)
    } else {
      setIsMobileMenuOpen(true)
    }
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className="relative z-30 flex items-center justify-between p-6 bg-white">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image 
              src="/TextLogo-GreenCropped.png" 
              alt="GetVisa.ID Logo" 
              width={140} 
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/countries" className="text-gray-700 hover:text-gray-900">
              Countries
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-gray-900">
              Resources
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
            <>
              <Link 
                href="/auth/login"
                className="hidden md:inline text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign in
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </nav>

      {(isMobileMenuOpen || isAnimating) && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div 
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
              isMobileMenuOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={toggleMobileMenu} 
          />
          <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen && !isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <Image 
                    src="/TextLogo-GreenCropped.png" 
                    alt="GetVisa.ID Logo" 
                    width={120} 
                    height={32}
                    className="h-6 w-auto"
                  />
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="flex flex-col flex-1 p-6 space-y-1">
                <Link 
                  href="/countries" 
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-4 px-4 rounded-lg transition-colors text-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  Countries
                </Link>
                <Link 
                  href="/resources" 
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-4 px-4 rounded-lg transition-colors text-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  Resources
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-4 px-4 rounded-lg transition-colors text-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
              </div>
              
              {/* Bottom Sign In */}
              {!user && (
                <div className="p-6 border-t border-gray-100">
                  <Link 
                    href="/auth/login"
                    className="block w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-center transition-colors font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}