"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Contact, Phone, User, Globe, MessageSquare, Calendar, CheckCircle, Clock } from "lucide-react"

interface ContactLead {
  id: number
  name: string
  phone: string
  country: string
  visa_type: string
  visa_id: string | null
  price: number | null
  whatsapp_clicked: boolean
  whatsapp_clicked_at: string | null
  source: string
  created_at: string
  updated_at: string
}

export default function ContactLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    whatsappClicked: 0,
    conversionRate: 0
  })

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/contact-leads?limit=100')
      if (!response.ok) throw new Error('Failed to fetch leads')
      
      const data = await response.json()
      setLeads(data.leads)
      
      // Calculate stats
      const total = data.leads.length
      const whatsappClicked = data.leads.filter((lead: ContactLead) => lead.whatsapp_clicked).length
      const conversionRate = total > 0 ? Math.round((whatsappClicked / total) * 100) : 0
      
      setStats({ total, whatsappClicked, conversionRate })
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading contact leads...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Leads</h1>
          <p className="text-gray-600 mt-1">
            Manage customer contact information from visa detail pages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Contact className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.whatsappClicked}</div>
            <p className="text-xs text-muted-foreground">
              Clicked WhatsApp button
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Form to WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Contact className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contact leads yet</h3>
            <p className="text-gray-600 mb-4">Contact leads will appear here when users fill out forms on visa detail pages.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Leads</CardTitle>
            <CardDescription>
              Latest customer inquiries from visa detail pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-gray-900">Contact</th>
                    <th className="pb-2 font-medium text-gray-900">Visa Interest</th>
                    <th className="pb-2 font-medium text-gray-900">Price</th>
                    <th className="pb-2 font-medium text-gray-900">Status</th>
                    <th className="pb-2 font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {lead.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">{lead.country}</div>
                          <div className="text-sm text-gray-500">{lead.visa_type}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(lead.price)}
                        </div>
                      </td>
                      <td className="py-4">
                        {lead.whatsapp_clicked ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Contacted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(lead.created_at)}
                        </div>
                        {lead.whatsapp_clicked && lead.whatsapp_clicked_at && (
                          <div className="text-xs text-green-600">
                            WhatsApp: {formatDate(lead.whatsapp_clicked_at)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}