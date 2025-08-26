"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Mail, Globe, Shield } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "GetVisa.ID",
    siteDescription: "Your trusted partner for visa applications worldwide",
    adminEmail: "admin@getvisa.id",
    supportEmail: "support@getvisa.id",
    defaultCurrency: "USD",
    enableNotifications: true,
    enableRegistrations: true,
    enableMaintenanceMode: false,
    maxFileSize: "10",
    allowedFileTypes: "pdf,jpg,png,doc,docx",
    processingFee: "2.5",
    smtpServer: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: ""
  })

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // In a real app, this would save to the backend
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application settings and configurations</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select value={settings.defaultCurrency} onValueChange={(value) => updateSetting("defaultCurrency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting("siteDescription", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting("adminEmail", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtpServer">SMTP Server</Label>
              <Input
                id="smtpServer"
                value={settings.smtpServer}
                onChange={(e) => updateSetting("smtpServer", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => updateSetting("smtpPort", e.target.value)}
                placeholder="587"
              />
            </div>
            <div>
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => updateSetting("smtpUsername", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => updateSetting("smtpPassword", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting("maxFileSize", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="processingFee">Processing Fee (%)</Label>
              <Input
                id="processingFee"
                type="number"
                step="0.1"
                value={settings.processingFee}
                onChange={(e) => updateSetting("processingFee", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
            <Input
              id="allowedFileTypes"
              value={settings.allowedFileTypes}
              onChange={(e) => updateSetting("allowedFileTypes", e.target.value)}
              placeholder="pdf,jpg,png,doc,docx"
            />
          </div>
          
          {/* Toggle Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Send email notifications for important events</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">User Registrations</h4>
                <p className="text-sm text-gray-600">Allow new users to register accounts</p>
              </div>
              <Switch
                checked={settings.enableRegistrations}
                onCheckedChange={(checked) => updateSetting("enableRegistrations", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div>
                <h4 className="font-medium text-red-800">Maintenance Mode</h4>
                <p className="text-sm text-red-600">Put the site in maintenance mode</p>
              </div>
              <Switch
                checked={settings.enableMaintenanceMode}
                onCheckedChange={(checked) => updateSetting("enableMaintenanceMode", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}