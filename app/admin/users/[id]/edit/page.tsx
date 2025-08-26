"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserCheck } from "lucide-react"
import Link from "next/link"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "user"
  })

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setFormData({
            email: userData.email || "",
            firstName: userData.user_metadata?.first_name || "",
            lastName: userData.user_metadata?.last_name || "",
            role: userData.user_metadata?.role || "user"
          })
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('User updated successfully!')
        router.push('/admin/users')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to update user'}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Link href="/admin/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-gray-600">Update user account information</p>
          </div>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/admin/users">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700">
                {saving ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}