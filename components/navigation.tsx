"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Bell } from "lucide-react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

export default function Navigation() {
  const { user, signOut } = useSupabaseAuth()

  return (
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
  )
}