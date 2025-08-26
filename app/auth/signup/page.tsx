"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const { signUp, loading } = useSupabaseAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    try {
      await signUp(formData)
      setSuccess('Account created successfully! Please check your email to verify your account.')
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </button>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create your GetVisa account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
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
                  placeholder="At least 6 characters"
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

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/auth/login')}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}