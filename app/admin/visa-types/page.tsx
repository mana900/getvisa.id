"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { VisaService } from "@/lib/services/visa-service"
import { Search, Plus, Edit, Trash2, Eye, ChevronDown, ChevronRight } from "lucide-react"
import { formatIDR } from "@/lib/utils/currency"

export default function VisaTypesPage() {
  const [allVisaTypes, setAllVisaTypes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCountries, setExpandedCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load visa types from Supabase
  useEffect(() => {
    const loadVisaTypes = async () => {
      try {
        const visas = await VisaService.getAllVisaTypes()
        setAllVisaTypes(visas)
      } catch (error) {
        console.error('Error loading visa types:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVisaTypes()
  }, [])

  // Get countries from loaded visa types
  const countries = allVisaTypes.reduce((acc, visa) => {
    const existingCountry = acc.find(c => c.countryCode === visa.country_code)
    if (existingCountry) {
      existingCountry.count++
      if (visa.is_active) existingCountry.activeCount++
    } else {
      acc.push({
        country: visa.country,
        countryCode: visa.country_code,
        flag: visa.flag,
        count: 1,
        activeCount: visa.is_active ? 1 : 0
      })
    }
    return acc
  }, [] as any[])

  // Filter visas by search query
  const filteredVisaTypes = allVisaTypes.filter(visa =>
    visa.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visa.visa_type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group filtered visas by country
  const groupedVisas = filteredVisaTypes.reduce((acc, visa) => {
    if (!acc[visa.country_code]) {
      acc[visa.country_code] = []
    }
    acc[visa.country_code].push(visa)
    return acc
  }, {} as Record<string, typeof allVisaTypes>)

  const toggleVisaStatus = async (id: string) => {
    try {
      const visa = allVisaTypes.find(v => v.id === id)
      if (visa) {
        await VisaService.updateVisaType(id, { is_active: !visa.is_active })
        setAllVisaTypes(prev => 
          prev.map(v => 
            v.id === id 
              ? { ...v, is_active: !v.is_active }
              : v
          )
        )
      }
    } catch (error) {
      console.error('Error updating visa status:', error)
      alert('Error updating visa status')
    }
  }

  const toggleCountryExpansion = (countryCode: string) => {
    setExpandedCountries(prev => 
      prev.includes(countryCode)
        ? prev.filter(c => c !== countryCode)
        : [...prev, countryCode]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visa Types Management</h1>
          <p className="text-gray-600">Manage visa types and their configurations</p>
        </div>
        <Link href="/admin/visa-types/add">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Visa Type
          </Button>
        </Link>
      </div>


      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Visa Types by Country</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search countries or visa types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {countries.map((country) => {
              const countryVisas = groupedVisas[country.countryCode] || []
              const isExpanded = expandedCountries.includes(country.countryCode)
              
              // Skip countries with no matching visas in search
              if (searchQuery && countryVisas.length === 0) {
                return null
              }

              return (
                <Collapsible
                  key={country.countryCode}
                  open={isExpanded}
                  onOpenChange={() => toggleCountryExpansion(country.countryCode)}
                >
                  <Card className="border-l-4 border-l-blue-500">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{country.flag}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{country.country}</h4>
                              <p className="text-sm text-gray-600">
                                {country.activeCount} active of {country.count} total visa types
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Link href={`/admin/visa-types/add?country=${country.countryCode}`}>
                              <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Visa
                              </Button>
                            </Link>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {countryVisas.map((visa) => (
                            <Card key={visa.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{visa.visa_type}</h4>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={visa.is_active}
                                        onCheckedChange={() => toggleVisaStatus(visa.id)}
                                        size="sm"
                                      />
                                      <Badge variant={visa.is_active ? "default" : "secondary"} className="text-xs">
                                        {visa.is_active ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                  <div>
                                    <p className="text-gray-600">Price</p>
                                    <p className="font-semibold text-green-600">{formatIDR(visa.price)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Processing</p>
                                    <p className="font-semibold">{visa.processing_time}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Duration</p>
                                    <p className="font-semibold">{visa.duration}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Validity</p>
                                    <p className="font-semibold">{visa.validity}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t">
                                  <div className="flex items-center space-x-2">
                                    <Link href={`/admin/visa-types/${visa.id}`}>
                                      <Button variant="outline" size="sm">
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                      </Button>
                                    </Link>
                                    <Link href={`/admin/visa-types/${visa.id}/edit`}>
                                      <Button variant="outline" size="sm">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-300">
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Updated {new Date(visa.updated_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}