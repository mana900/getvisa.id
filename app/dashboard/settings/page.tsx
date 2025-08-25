"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Shield, Globe, Save } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    marketingEmails: false,
    language: "en",
    timezone: "UTC-5",
    twoFactorAuth: false,
    dataSharing: false,
  })

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Handle settings save
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive updates about your applications via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotifications" className="text-base font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive important updates via text message</p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="applicationUpdates" className="text-base font-medium">
                Application Status Updates
              </Label>
              <p className="text-sm text-gray-600">Get notified when your application status changes</p>
            </div>
            <Switch
              id="applicationUpdates"
              checked={settings.applicationUpdates}
              onCheckedChange={(checked) => updateSetting("applicationUpdates", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingEmails" className="text-base font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-gray-600">Receive promotional offers and travel tips</p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => updateSetting("marketingEmails", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Language & Region
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twoFactorAuth" className="text-base font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
            />
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline">Change Password</Button>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dataSharing" className="text-base font-medium">
                Data Sharing
              </Label>
              <p className="text-sm text-gray-600">Allow us to share anonymized data for service improvement</p>
            </div>
            <Switch
              id="dataSharing"
              checked={settings.dataSharing}
              onCheckedChange={(checked) => updateSetting("dataSharing", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
