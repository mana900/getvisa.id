"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { VisaType } from "@/lib/types/database"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"

const countryOptions = [
  { code: "canada", name: "Canada", flag: "🇨🇦" },
  { code: "thailand", name: "Thailand", flag: "🇹🇭" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "usa", name: "United States", flag: "🇺🇸" },
  { code: "australia", name: "Australia", flag: "🇦🇺" },
  { code: "japan", name: "Japan", flag: "🇯🇵" },
  { code: "germany", name: "Germany", flag: "🇩🇪" },
  { code: "france", name: "France", flag: "🇫🇷" },
  { code: "italy", name: "Italy", flag: "🇮🇹" },
  { code: "spain", name: "Spain", flag: "🇪🇸" },
]

export default function EditVisaPage() {
  const router = useRouter()
  const params = useParams()
  const visaId = params.id as string

  const [visa, setVisa] = useState<VisaType | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    country: "",
    countryCode: "",
    flag: "",
    visaType: "",
    price: "",
    processingTime: "",
    duration: "",
    validity: "",
    isActive: true,
    description: "",
    features: [""],
    guaranteedDate: "",
    eligibility: [""],
    timeline: [{ step: "", time: "", description: "" }],
    documents: [""],
    faqs: [{ question: "", answer: "" }],
  })

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

  // Initialize form data with existing visa data
  useEffect(() => {
    if (visa) {
      setFormData({
        country: visa.country,
        countryCode: visa.country_code,
        flag: visa.flag,
        visaType: visa.visa_type,
        price: visa.price.toString(),
        processingTime: visa.processing_time,
        duration: visa.duration,
        validity: visa.validity,
        isActive: visa.is_active,
        description: visa.overview?.description || "",
        features: visa.overview?.features?.length > 0 ? visa.overview.features : [""],
        guaranteedDate: visa.overview?.guaranteedDate || "",
        eligibility: visa.eligibility?.length > 0 ? visa.eligibility : [""],
        timeline: visa.timeline?.length > 0 ? visa.timeline : [{ step: "", time: "", description: "" }],
        documents: visa.documents?.length > 0 ? visa.documents : [""],
        faqs: visa.faqs?.length > 0 ? visa.faqs : [{ question: "", answer: "" }],
      })
    }
  }, [visa])

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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateArrayField = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: any, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], field === 'timeline' ? { step: "", time: "", description: "" } : field === 'faqs' ? { question: "", answer: "" } : ""]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }))
  }

  const handleCountryChange = (countryCode: string) => {
    const country = countryOptions.find(c => c.code === countryCode)
    if (country) {
      setFormData(prev => ({
        ...prev,
        country: country.name,
        countryCode: country.code,
        flag: country.flag
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.country || !formData.visaType || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const updateData = {
        country: formData.country,
        country_code: formData.countryCode,
        flag: formData.flag,
        visa_type: formData.visaType,
        price: parseFloat(formData.price),
        processing_time: formData.processingTime,
        duration: formData.duration,
        validity: formData.validity,
        is_active: formData.isActive,
        overview: {
          description: formData.description,
          features: formData.features.filter(f => f.trim() !== ''),
          guaranteedDate: formData.guaranteedDate
        },
        eligibility: formData.eligibility.filter(e => e.trim() !== ''),
        timeline: formData.timeline.filter(t => t.step.trim() !== ''),
        documents: formData.documents.filter(d => d.trim() !== ''),
        faqs: formData.faqs.filter(faq => faq.question.trim() !== '' && faq.answer.trim() !== '')
      }

      const response = await fetch(`/api/admin/visa-types`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: visa.id, ...updateData }),
      })
      
      if (response.ok) {
        alert('Visa type updated successfully!')
        router.push('/admin/visa-types')
      } else {
        const error = await response.text()
        alert(`Error updating visa type: ${error}`)
      }
    } catch (error) {
      alert('Error updating visa type')
      console.error('Update error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Visa Type</h1>
          <p className="text-gray-600">Update visa type details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.countryCode} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visaType">Visa Type Name * <span className="text-sm text-gray-500">(Free text - name it as you like)</span></Label>
                <Input
                  id="visaType"
                  value={formData.visaType}
                  onChange={(e) => updateField("visaType", e.target.value)}
                  placeholder="e.g., Business Multi Entry, Tourist Single Entry, Transit Visa"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="185"
                  required
                />
              </div>
              <div>
                <Label htmlFor="processingTime">Processing Time</Label>
                <Input
                  id="processingTime"
                  value={formData.processingTime}
                  onChange={(e) => updateField("processingTime", e.target.value)}
                  placeholder="10-15 business days"
                />
              </div>
              <div>
                <Label htmlFor="duration">Stay Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  placeholder="6 months"
                />
              </div>
              <div>
                <Label htmlFor="validity">Visa Validity</Label>
                <Input
                  id="validity"
                  value={formData.validity}
                  onChange={(e) => updateField("validity", e.target.value)}
                  placeholder="10 years"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <Label>Active (visible to customers)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Description & Features */}
        <Card>
          <CardHeader>
            <CardTitle>Description & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Detailed description of this visa type..."
                rows={4}
              />
            </div>

            <div>
              <Label>Key Features</Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateArrayField("features", index, e.target.value)}
                    placeholder="e.g., Multiple entries allowed"
                  />
                  {formData.features.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("features", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("features")} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div>
              <Label htmlFor="guaranteedDate">Guaranteed Completion Date</Label>
              <Input
                id="guaranteedDate"
                value={formData.guaranteedDate}
                onChange={(e) => updateField("guaranteedDate", e.target.value)}
                placeholder="30 November"
              />
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Requirements</Label>
              {formData.eligibility.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={requirement}
                    onChange={(e) => updateArrayField("eligibility", index, e.target.value)}
                    placeholder="e.g., Valid passport with 6+ months validity"
                  />
                  {formData.eligibility.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("eligibility", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("eligibility")} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Documents</Label>
              {formData.documents.map((document, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={document}
                    onChange={(e) => updateArrayField("documents", index, e.target.value)}
                    placeholder="e.g., Valid passport"
                  />
                  {formData.documents.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("documents", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("documents")} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Timeline Steps</Label>
              {formData.timeline.map((step, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg">
                  <div>
                    <Label>Step Name</Label>
                    <Input
                      value={step.step}
                      onChange={(e) => updateArrayField("timeline", index, { ...step, step: e.target.value })}
                      placeholder="e.g., Online Application"
                    />
                  </div>
                  <div>
                    <Label>Time Required</Label>
                    <Input
                      value={step.time}
                      onChange={(e) => updateArrayField("timeline", index, { ...step, time: e.target.value })}
                      placeholder="e.g., 30 minutes"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={step.description}
                      onChange={(e) => updateArrayField("timeline", index, { ...step, description: e.target.value })}
                      placeholder="e.g., Complete the online form"
                    />
                  </div>
                  {formData.timeline.length > 1 && (
                    <div className="md:col-span-3 flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("timeline", index)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Step
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("timeline")} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Timeline Step
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>FAQs</Label>
              {formData.faqs.map((faq, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 mt-4 p-4 border rounded-lg">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateArrayField("faqs", index, { ...faq, question: e.target.value })}
                      placeholder="e.g., How long is the visa valid?"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateArrayField("faqs", index, { ...faq, answer: e.target.value })}
                      placeholder="Provide a detailed answer..."
                      rows={3}
                    />
                  </div>
                  {formData.faqs.length > 1 && (
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("faqs", index)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove FAQ
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("faqs")} className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Update Visa Type
          </Button>
        </div>
      </form>
    </div>
  )
}