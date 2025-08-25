"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, Lock } from "lucide-react"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    nationality: "US",
    address: "123 Main Street, New York, NY 10001",
    emergencyContactName: "Jane Doe",
    emergencyContactPhone: "+1 (555) 987-6543",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const updateProfile = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const updatePassword = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Saving profile:", profileData)
    // Handle profile save
  }

  const handlePasswordReset = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }
    console.log("Resetting password")
    // Handle password reset
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    alert("Password updated successfully")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => updateProfile("firstName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => updateProfile("lastName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => updateProfile("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={profileData.phone} onChange={(e) => updateProfile("phone", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => updateProfile("dateOfBirth", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Select value={profileData.nationality} onValueChange={(value) => updateProfile("nationality", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">🇺🇸 United States</SelectItem>
                <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="AU">🇦🇺 Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={profileData.address}
            onChange={(e) => updateProfile("address", e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="emergencyContactName">Name</Label>
            <Input
              id="emergencyContactName"
              value={profileData.emergencyContactName}
              onChange={(e) => updateProfile("emergencyContactName", e.target.value)}
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyContactPhone">Phone Number</Label>
            <Input
              id="emergencyContactPhone"
              value={profileData.emergencyContactPhone}
              onChange={(e) => updateProfile("emergencyContactPhone", e.target.value)}
              placeholder="Emergency contact phone"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Password & Security</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => updatePassword("currentPassword", e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => updatePassword("newPassword", e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => updatePassword("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordReset}
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
