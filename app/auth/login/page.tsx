"use client"

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'
import LoginForm from '@/components/login-form'

function LoginContent() {
  const { user } = useSupabaseAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  if (user) {
    return null // Will redirect
  }

  return <LoginForm redirectTo={redirectTo} />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}