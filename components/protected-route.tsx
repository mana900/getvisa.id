"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login with current path as redirect parameter
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }
      
      if (requireAdmin && user?.user_metadata?.role !== 'admin') {
        router.push('/dashboard') // Redirect non-admin users to dashboard
        return
      }
    }
  }, [user, loading, router, requireAdmin, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (requireAdmin && user?.user_metadata?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}