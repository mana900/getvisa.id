"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType, RegisterData, validateCredentials } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('auth-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('auth-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const validatedUser = validateCredentials(email, password)
      if (validatedUser) {
        setUser(validatedUser)
        localStorage.setItem('auth-user', JSON.stringify(validatedUser))
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would make an API call
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      
      setUser(newUser)
      localStorage.setItem('auth-user', JSON.stringify(newUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth-user')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}