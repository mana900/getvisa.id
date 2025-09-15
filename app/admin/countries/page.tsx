"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Plus, MoreHorizontal, Edit, Trash2, Eye, MapPin, Image } from "lucide-react"
import CountryDialog from "./components/CountryDialog"
import { useToast } from "@/hooks/use-toast"

interface Country {
  id: number
  country_code: string
  country_name: string
  description: string | null
  image_url: string | null
  region: string
  processing_info: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  visa_types?: Array<{
    id: number
    visa_type: string
    price: number
    processing_time: string
    duration: string
    validity: string
    is_active: boolean
  }>
  activeVisaCount?: number
}

export default function CountriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    regions: 0
  })

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/admin/countries?with_active_visas=true')
      if (!response.ok) throw new Error('Failed to fetch countries')
      
      const data = await response.json()
      
      // Calculate active visa counts for each country
      const countriesWithCounts = data.countries.map((country: Country) => ({
        ...country,
        activeVisaCount: country.visa_types ? country.visa_types.filter(vt => vt.is_active).length : 0
      }))
      
      setCountries(countriesWithCounts)
      
      // Calculate stats
      const total = countriesWithCounts.length
      const active = countriesWithCounts.filter((country: Country) => country.is_active).length
      const regions = new Set(countriesWithCounts.map((country: Country) => country.region)).size
      
      setStats({ total, active, regions })
    } catch (error) {
      console.error('Error fetching countries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch countries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const handleSaveCountry = async (countryData: Omit<Country, 'id'>) => {
    try {
      const url = selectedCountry 
        ? `/api/admin/countries/${selectedCountry.id}`
        : '/api/admin/countries'
      
      const method = selectedCountry ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countryData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save country')
      }

      await fetchCountries()
    } catch (error) {
      console.error('Error saving country:', error)
      throw error
    }
  }

  const handleDeleteCountry = async (country: Country) => {
    if (!confirm(`Are you sure you want to delete ${country.country_name}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/countries/${country.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete country')
      }

      toast({
        title: "Success",
        description: "Country deleted successfully",
      })

      await fetchCountries()
    } catch (error) {
      console.error('Error deleting country:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete country",
        variant: "destructive",
      })
    }
  }

  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country)
    setDialogOpen(true)
  }

  const handleAddCountry = () => {
    setSelectedCountry(null)
    setDialogOpen(true)
  }

  const handleViewVisaTypes = (countryCode: string) => {
    router.push(`/admin/visa-types?country=${countryCode}`)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading countries...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Countries</h1>
          <p className="text-gray-600 mt-1">
            Manage countries and their visa types
          </p>
        </div>
        <Button onClick={handleAddCountry}>
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Countries</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total - stats.active} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.regions}</div>
            <p className="text-xs text-muted-foreground">
              Geographic regions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countries Table */}
      {countries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No countries yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first country.</p>
            <Button onClick={handleAddCountry}>
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Countries List</CardTitle>
            <CardDescription>
              Manage your countries and their visa types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-gray-900">Country</th>
                    <th className="pb-2 font-medium text-gray-900">Description</th>
                    <th className="pb-2 font-medium text-gray-900">Region</th>
                    <th className="pb-2 font-medium text-gray-900">Visa Types</th>
                    <th className="pb-2 font-medium text-gray-900">Status</th>
                    <th className="pb-2 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country) => (
                    <tr key={country.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          {country.image_url ? (
                            <div 
                              className="w-12 h-8 rounded bg-cover bg-center border"
                              style={{ backgroundImage: `url(${country.image_url})` }}
                            />
                          ) : (
                            <div className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center">
                              <Image className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{country.country_name}</div>
                            <div className="text-sm text-gray-500">{country.country_code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 max-w-xs">
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {country.description || 'No description available'}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">{country.region}</Badge>
                      </td>
                      <td className="py-4">
                        <span className="font-medium text-gray-900">
                          {country.activeVisaCount || 0} active
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge variant={country.is_active ? "default" : "secondary"}>
                          {country.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCountry(country)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCountry(country)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <CountryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        country={selectedCountry}
        onSave={handleSaveCountry}
      />
    </div>
  )
}