"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { VisaService } from "@/lib/services/visa-service"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"

const countryOptions = [
  { code: "afghanistan", name: "Afghanistan", flag: "🇦🇫" },
  { code: "albania", name: "Albania", flag: "🇦🇱" },
  { code: "algeria", name: "Algeria", flag: "🇩🇿" },
  { code: "andorra", name: "Andorra", flag: "🇦🇩" },
  { code: "angola", name: "Angola", flag: "🇦🇴" },
  { code: "argentina", name: "Argentina", flag: "🇦🇷" },
  { code: "armenia", name: "Armenia", flag: "🇦🇲" },
  { code: "australia", name: "Australia", flag: "🇦🇺" },
  { code: "austria", name: "Austria", flag: "🇦🇹" },
  { code: "azerbaijan", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "bahamas", name: "Bahamas", flag: "🇧🇸" },
  { code: "bahrain", name: "Bahrain", flag: "🇧🇭" },
  { code: "bangladesh", name: "Bangladesh", flag: "🇧🇩" },
  { code: "barbados", name: "Barbados", flag: "🇧🇧" },
  { code: "belarus", name: "Belarus", flag: "🇧🇾" },
  { code: "belgium", name: "Belgium", flag: "🇧🇪" },
  { code: "belize", name: "Belize", flag: "🇧🇿" },
  { code: "benin", name: "Benin", flag: "🇧🇯" },
  { code: "bhutan", name: "Bhutan", flag: "🇧🇹" },
  { code: "bolivia", name: "Bolivia", flag: "🇧🇴" },
  { code: "bosnia", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "botswana", name: "Botswana", flag: "🇧🇼" },
  { code: "brazil", name: "Brazil", flag: "🇧🇷" },
  { code: "brunei", name: "Brunei", flag: "🇧🇳" },
  { code: "bulgaria", name: "Bulgaria", flag: "🇧🇬" },
  { code: "burkina-faso", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "burundi", name: "Burundi", flag: "🇧🇮" },
  { code: "cambodia", name: "Cambodia", flag: "🇰🇭" },
  { code: "cameroon", name: "Cameroon", flag: "🇨🇲" },
  { code: "canada", name: "Canada", flag: "🇨🇦" },
  { code: "cape-verde", name: "Cape Verde", flag: "🇨🇻" },
  { code: "chad", name: "Chad", flag: "🇹🇩" },
  { code: "chile", name: "Chile", flag: "🇨🇱" },
  { code: "china", name: "China", flag: "🇨🇳" },
  { code: "colombia", name: "Colombia", flag: "🇨🇴" },
  { code: "comoros", name: "Comoros", flag: "🇰🇲" },
  { code: "congo", name: "Congo", flag: "🇨🇬" },
  { code: "costa-rica", name: "Costa Rica", flag: "🇨🇷" },
  { code: "croatia", name: "Croatia", flag: "🇭🇷" },
  { code: "cuba", name: "Cuba", flag: "🇨🇺" },
  { code: "cyprus", name: "Cyprus", flag: "🇨🇾" },
  { code: "czech-republic", name: "Czech Republic", flag: "🇨🇿" },
  { code: "denmark", name: "Denmark", flag: "🇩🇰" },
  { code: "djibouti", name: "Djibouti", flag: "🇩🇯" },
  { code: "dominica", name: "Dominica", flag: "🇩🇲" },
  { code: "dominican-republic", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "ecuador", name: "Ecuador", flag: "🇪🇨" },
  { code: "egypt", name: "Egypt", flag: "🇪🇬" },
  { code: "el-salvador", name: "El Salvador", flag: "🇸🇻" },
  { code: "estonia", name: "Estonia", flag: "🇪🇪" },
  { code: "ethiopia", name: "Ethiopia", flag: "🇪🇹" },
  { code: "fiji", name: "Fiji", flag: "🇫🇯" },
  { code: "finland", name: "Finland", flag: "🇫🇮" },
  { code: "france", name: "France", flag: "🇫🇷" },
  { code: "gabon", name: "Gabon", flag: "🇬🇦" },
  { code: "gambia", name: "Gambia", flag: "🇬🇲" },
  { code: "georgia", name: "Georgia", flag: "🇬🇪" },
  { code: "germany", name: "Germany", flag: "🇩🇪" },
  { code: "ghana", name: "Ghana", flag: "🇬🇭" },
  { code: "greece", name: "Greece", flag: "🇬🇷" },
  { code: "grenada", name: "Grenada", flag: "🇬🇩" },
  { code: "guatemala", name: "Guatemala", flag: "🇬🇹" },
  { code: "guinea", name: "Guinea", flag: "🇬🇳" },
  { code: "guinea-bissau", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "guyana", name: "Guyana", flag: "🇬🇾" },
  { code: "haiti", name: "Haiti", flag: "🇭🇹" },
  { code: "honduras", name: "Honduras", flag: "🇭🇳" },
  { code: "hungary", name: "Hungary", flag: "🇭🇺" },
  { code: "iceland", name: "Iceland", flag: "🇮🇸" },
  { code: "india", name: "India", flag: "🇮🇳" },
  { code: "indonesia", name: "Indonesia", flag: "🇮🇩" },
  { code: "iran", name: "Iran", flag: "🇮🇷" },
  { code: "iraq", name: "Iraq", flag: "🇮🇶" },
  { code: "ireland", name: "Ireland", flag: "🇮🇪" },
  { code: "israel", name: "Israel", flag: "🇮🇱" },
  { code: "italy", name: "Italy", flag: "🇮🇹" },
  { code: "jamaica", name: "Jamaica", flag: "🇯🇲" },
  { code: "japan", name: "Japan", flag: "🇯🇵" },
  { code: "jordan", name: "Jordan", flag: "🇯🇴" },
  { code: "kazakhstan", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "kenya", name: "Kenya", flag: "🇰🇪" },
  { code: "kuwait", name: "Kuwait", flag: "🇰🇼" },
  { code: "kyrgyzstan", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "laos", name: "Laos", flag: "🇱🇦" },
  { code: "latvia", name: "Latvia", flag: "🇱🇻" },
  { code: "lebanon", name: "Lebanon", flag: "🇱🇧" },
  { code: "lesotho", name: "Lesotho", flag: "🇱🇸" },
  { code: "liberia", name: "Liberia", flag: "🇱🇷" },
  { code: "libya", name: "Libya", flag: "🇱🇾" },
  { code: "lithuania", name: "Lithuania", flag: "🇱🇹" },
  { code: "luxembourg", name: "Luxembourg", flag: "🇱🇺" },
  { code: "madagascar", name: "Madagascar", flag: "🇲🇬" },
  { code: "malawi", name: "Malawi", flag: "🇲🇼" },
  { code: "malaysia", name: "Malaysia", flag: "🇲🇾" },
  { code: "maldives", name: "Maldives", flag: "🇲🇻" },
  { code: "mali", name: "Mali", flag: "🇲🇱" },
  { code: "malta", name: "Malta", flag: "🇲🇹" },
  { code: "mauritania", name: "Mauritania", flag: "🇲🇷" },
  { code: "mauritius", name: "Mauritius", flag: "🇲🇺" },
  { code: "mexico", name: "Mexico", flag: "🇲🇽" },
  { code: "moldova", name: "Moldova", flag: "🇲🇩" },
  { code: "monaco", name: "Monaco", flag: "🇲🇨" },
  { code: "mongolia", name: "Mongolia", flag: "🇲🇳" },
  { code: "montenegro", name: "Montenegro", flag: "🇲🇪" },
  { code: "morocco", name: "Morocco", flag: "🇲🇦" },
  { code: "mozambique", name: "Mozambique", flag: "🇲🇿" },
  { code: "myanmar", name: "Myanmar", flag: "🇲🇲" },
  { code: "namibia", name: "Namibia", flag: "🇳🇦" },
  { code: "nauru", name: "Nauru", flag: "🇳🇷" },
  { code: "nepal", name: "Nepal", flag: "🇳🇵" },
  { code: "netherlands", name: "Netherlands", flag: "🇳🇱" },
  { code: "new-zealand", name: "New Zealand", flag: "🇳🇿" },
  { code: "nicaragua", name: "Nicaragua", flag: "🇳🇮" },
  { code: "niger", name: "Niger", flag: "🇳🇪" },
  { code: "nigeria", name: "Nigeria", flag: "🇳🇬" },
  { code: "north-korea", name: "North Korea", flag: "🇰🇵" },
  { code: "north-macedonia", name: "North Macedonia", flag: "🇲🇰" },
  { code: "norway", name: "Norway", flag: "🇳🇴" },
  { code: "oman", name: "Oman", flag: "🇴🇲" },
  { code: "pakistan", name: "Pakistan", flag: "🇵🇰" },
  { code: "palau", name: "Palau", flag: "🇵🇼" },
  { code: "panama", name: "Panama", flag: "🇵🇦" },
  { code: "papua-new-guinea", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "paraguay", name: "Paraguay", flag: "🇵🇾" },
  { code: "peru", name: "Peru", flag: "🇵🇪" },
  { code: "philippines", name: "Philippines", flag: "🇵🇭" },
  { code: "poland", name: "Poland", flag: "🇵🇱" },
  { code: "portugal", name: "Portugal", flag: "🇵🇹" },
  { code: "qatar", name: "Qatar", flag: "🇶🇦" },
  { code: "romania", name: "Romania", flag: "🇷🇴" },
  { code: "russia", name: "Russia", flag: "🇷🇺" },
  { code: "rwanda", name: "Rwanda", flag: "🇷🇼" },
  { code: "samoa", name: "Samoa", flag: "🇼🇸" },
  { code: "san-marino", name: "San Marino", flag: "🇸🇲" },
  { code: "saudi-arabia", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "senegal", name: "Senegal", flag: "🇸🇳" },
  { code: "serbia", name: "Serbia", flag: "🇷🇸" },
  { code: "seychelles", name: "Seychelles", flag: "🇸🇨" },
  { code: "sierra-leone", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "singapore", name: "Singapore", flag: "🇸🇬" },
  { code: "slovakia", name: "Slovakia", flag: "🇸🇰" },
  { code: "slovenia", name: "Slovenia", flag: "🇸🇮" },
  { code: "solomon-islands", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "somalia", name: "Somalia", flag: "🇸🇴" },
  { code: "south-africa", name: "South Africa", flag: "🇿🇦" },
  { code: "south-korea", name: "South Korea", flag: "🇰🇷" },
  { code: "south-sudan", name: "South Sudan", flag: "🇸🇸" },
  { code: "spain", name: "Spain", flag: "🇪🇸" },
  { code: "sri-lanka", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "sudan", name: "Sudan", flag: "🇸🇩" },
  { code: "suriname", name: "Suriname", flag: "🇸🇷" },
  { code: "sweden", name: "Sweden", flag: "🇸🇪" },
  { code: "switzerland", name: "Switzerland", flag: "🇨🇭" },
  { code: "syria", name: "Syria", flag: "🇸🇾" },
  { code: "taiwan", name: "Taiwan", flag: "🇹🇼" },
  { code: "tajikistan", name: "Tajikistan", flag: "🇹🇯" },
  { code: "tanzania", name: "Tanzania", flag: "🇹🇿" },
  { code: "thailand", name: "Thailand", flag: "🇹🇭" },
  { code: "togo", name: "Togo", flag: "🇹🇬" },
  { code: "tonga", name: "Tonga", flag: "🇹🇴" },
  { code: "trinidad-tobago", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "tunisia", name: "Tunisia", flag: "🇹🇳" },
  { code: "turkey", name: "Turkey", flag: "🇹🇷" },
  { code: "turkmenistan", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "tuvalu", name: "Tuvalu", flag: "🇹🇻" },
  { code: "uganda", name: "Uganda", flag: "🇺🇬" },
  { code: "ukraine", name: "Ukraine", flag: "🇺🇦" },
  { code: "uae", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "usa", name: "United States", flag: "🇺🇸" },
  { code: "uruguay", name: "Uruguay", flag: "🇺🇾" },
  { code: "uzbekistan", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "vanuatu", name: "Vanuatu", flag: "🇻🇺" },
  { code: "vatican", name: "Vatican City", flag: "🇻🇦" },
  { code: "venezuela", name: "Venezuela", flag: "🇻🇪" },
  { code: "vietnam", name: "Vietnam", flag: "🇻🇳" },
  { code: "yemen", name: "Yemen", flag: "🇾🇪" },
  { code: "zambia", name: "Zambia", flag: "🇿🇲" },
  { code: "zimbabwe", name: "Zimbabwe", flag: "🇿🇼" },
]

export default function AddVisaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCountry = searchParams.get('country')

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

  const [isDraft, setIsDraft] = useState(false)

  // Pre-fill country if coming from a specific country page
  useEffect(() => {
    if (preselectedCountry) {
      const country = countryOptions.find(c => c.code === preselectedCountry)
      if (country) {
        setFormData(prev => ({
          ...prev,
          country: country.name,
          countryCode: country.code,
          flag: country.flag
        }))
      }
    }
  }, [preselectedCountry])

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
      const newVisa = await VisaService.createVisaType({
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
      })
      
      alert('Visa type created successfully!')
      router.push('/admin/visa-types')
    } catch (error) {
      console.error('Error creating visa type:', error)
      alert('Error creating visa type. Please try again.')
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Visa Type</h1>
          <p className="text-gray-600">Create a new visa type with custom details</p>
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
                  <SelectContent className="max-h-[200px]">
                    <div className="sticky top-0 bg-white p-2 border-b">
                      <Input
                        placeholder="Search countries..."
                        className="h-8"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase()
                          const items = document.querySelectorAll('[data-country-item]')
                          items.forEach((item) => {
                            const countryName = item.getAttribute('data-country-name')?.toLowerCase()
                            if (countryName?.includes(searchTerm)) {
                              (item as HTMLElement).style.display = 'flex'
                            } else {
                              (item as HTMLElement).style.display = 'none'
                            }
                          })
                        }}
                      />
                    </div>
                    {countryOptions.map((country) => (
                      <SelectItem 
                        key={country.code} 
                        value={country.code}
                        data-country-item="true"
                        data-country-name={country.name}
                      >
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
              <Label htmlFor="guaranteedDate">Guaranteed Completion (Days)</Label>
              <Input
                id="guaranteedDate"
                type="number"
                value={formData.guaranteedDate}
                onChange={(e) => updateField("guaranteedDate", e.target.value)}
                placeholder="14"
                min="1"
                max="365"
              />
              <p className="text-sm text-gray-500 mt-1">
                Number of days from application to completion
              </p>
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
            Create Visa Type
          </Button>
        </div>
      </form>
    </div>
  )
}