"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { VisaType } from "@/lib/types/database"
import { VisaService } from "@/lib/services/visa-service"
import { ArrowLeft, Edit, Trash2, Eye, CheckCircle, FileText, Clock, DollarSign } from "lucide-react"
import { formatIDR } from "@/lib/utils/currency"

export default function VisaDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const visaId = params.id as string

  const [visa, setVisa] = useState<VisaType | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch visa data from database
  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const response = await fetch('/api/admin/visa-types')
        if (response.ok) {
          const visaTypes = await response.json()
          const foundVisa = visaTypes.find((v: VisaType) => v.id === visaId)
          setVisa(foundVisa || null)
        }
      } catch (error) {
        console.error('Error fetching visa:', error)
        setVisa(null)
      } finally {
        setLoading(false)
      }
    }

    if (visaId) {
      fetchVisa()
    }
  }, [visaId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa details...</p>
        </div>
      </div>
    )
  }

  if (!visa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Visa not found</h1>
          <Button onClick={() => router.push('/admin/visa-types')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Visa Types
          </Button>
        </div>
      </div>
    )
  }

  const toggleVisaStatus = async () => {
    try {
      const updatedVisa = await VisaService.updateVisaType(visa.id, { is_active: !visa.is_active })
      setVisa(updatedVisa)
    } catch (error) {
      console.error('Error updating visa status:', error)
      alert('Error updating visa status')
    }
  }

  const handleDelete = async () => {
    try {
      await VisaService.deleteVisaType(visa.id)
      alert('Visa type deleted successfully!')
      router.push('/admin/visa-types')
    } catch (error) {
      console.error('Error deleting visa type:', error)
      alert('Error deleting visa type')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visa Details</h1>
            <p className="text-gray-600">View and manage visa type information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/visa-types/${visa.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/visa/${visa.country_code}/${visa.id}`} target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{visa.flag}</div>
              <div>
                <CardTitle className="text-2xl">{visa.country} - {visa.visa_type}</CardTitle>
                <p className="text-gray-600">Created {new Date(visa.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={visa.is_active}
                onCheckedChange={toggleVisaStatus}
              />
              <Badge variant={visa.is_active ? "default" : "secondary"}>
                {visa.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-lg font-bold text-green-600">{formatIDR(visa.price)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="text-lg font-semibold">{visa.processing_time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Stay Duration</p>
                <p className="text-lg font-semibold">{visa.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Validity</p>
                <p className="text-lg font-semibold">{visa.validity}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{visa.overview?.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {visa.overview?.features?.map((feature, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {visa.overview?.guaranteedDate && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 font-medium">
                  Guaranteed completion date: {visa.overview?.guaranteedDate}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {visa.eligibility?.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {visa.timeline?.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.step}</h3>
                  <p className="text-sm text-gray-600 mb-1">{step.time}</p>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {visa.documents?.map((document, index) => (
              <div key={index} className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{document}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {visa.faqs?.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Visa Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Are you sure you want to delete "{visa.visa_type}" for {visa.country}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}