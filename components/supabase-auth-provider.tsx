"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { AuthService } from "@/lib/services/auth-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.user_metadata?.role === 'admin'

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      await AuthService.signIn({ email, password })
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      setLoading(true)
      await AuthService.signUp(data)
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await AuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getCurrentSession()
        if (session?.user) {
          setUser(session.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider")
  }
  return context
}