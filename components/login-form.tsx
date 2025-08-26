"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const { signIn, loading } = useSupabaseAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await signIn(formData.email, formData.password)
      router.push(redirectTo)
    } catch (error: any) {
      setError(error.message || 'Invalid email or password')
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign in to GetVisa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/auth/signup')}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}