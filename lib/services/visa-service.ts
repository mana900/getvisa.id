import { supabase } from '../supabase'
import type { VisaType, VisaTypeInsert, VisaTypeUpdate } from '../types/database'

export class VisaService {
  // Get all visa types
  static async getAllVisaTypes(): Promise<VisaType[]> {
    try {
      const response = await fetch('/api/admin/visa-types')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch visa types')
      }
      
      return result || []
    } catch (error) {
      console.error('Error fetching visa types:', error)
      throw new Error('Failed to fetch visa types')
    }
  }

  // Get active visa types only
  static async getActiveVisaTypes(): Promise<VisaType[]> {
    const { data, error } = await supabase
      .from('visa_types')
      .select('*')
      .eq('is_active', true)
      .order('country', { ascending: true })

    if (error) {
      console.error('Error fetching active visa types:', error)
      throw new Error('Failed to fetch active visa types')
    }

    return data || []
  }

  // Get visa types by country
  static async getVisaTypesByCountry(countryCode: string): Promise<VisaType[]> {
    try {
      const response = await fetch('/api/admin/visa-types')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch visa types')
      }
      
      // Filter by country code and active status
      const filteredVisas = result.filter((visa: VisaType) => 
        visa.country_code === countryCode && visa.is_active
      )
      
      return filteredVisas || []
    } catch (error) {
      console.error('Error fetching visa types by country:', error)
      throw new Error('Failed to fetch visa types by country')
    }
  }

  // Get single visa type by ID
  static async getVisaById(id: string): Promise<VisaType | null> {
    try {
      const response = await fetch('/api/admin/visa-types')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch visa types')
      }
      
      // Find visa by ID
      const visa = result.find((visa: VisaType) => visa.id === id)
      return visa || null
    } catch (error) {
      console.error('Error fetching visa by ID:', error)
      throw new Error('Failed to fetch visa')
    }
  }

  // Create new visa type
  static async createVisaType(visaData: VisaTypeInsert): Promise<VisaType> {
    try {
      const response = await fetch('/api/admin/visa-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visaData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create visa type')
      }
      
      return result
    } catch (error) {
      console.error('Error creating visa type:', error)
      throw new Error('Failed to create visa type')
    }
  }

  // Update visa type
  static async updateVisaType(id: string, updates: VisaTypeUpdate): Promise<VisaType> {
    try {
      const response = await fetch(`/api/admin/visa-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update visa type')
      }
      
      return result
    } catch (error) {
      console.error('Error updating visa type:', error)
      throw new Error('Failed to update visa type')
    }
  }

  // Delete visa type
  static async deleteVisaType(id: string): Promise<void> {
    const { error } = await supabase
      .from('visa_types')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting visa type:', error)
      throw new Error('Failed to delete visa type')
    }
  }

  // Get countries with visas
  static async getCountriesWithVisas() {
    try {
      const response = await fetch('/api/admin/visa-types')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch visa types')
      }

      // Group by country and count visas
      const countriesMap = new Map()
      
      result?.forEach((visa: VisaType) => {
        const key = visa.country_code
        if (!countriesMap.has(key)) {
          countriesMap.set(key, {
            country: visa.country,
            countryCode: visa.country_code,
            flag: visa.flag,
            count: 0,
            activeCount: 0
          })
        }
        const country = countriesMap.get(key)
        country.count += 1
        if (visa.is_active) {
          country.activeCount += 1
        }
      })

      return Array.from(countriesMap.values()).sort((a, b) => a.country.localeCompare(b.country))
    } catch (error) {
      console.error('Error fetching countries:', error)
      throw new Error('Failed to fetch countries')
    }
  }

  // Search visa types
  static async searchVisaTypes(query: string): Promise<VisaType[]> {
    const { data, error } = await supabase
      .from('visa_types')
      .select('*')
      .or(`country.ilike.%${query}%,visa_type.ilike.%${query}%`)
      .eq('is_active', true)
      .order('country', { ascending: true })

    if (error) {
      console.error('Error searching visa types:', error)
      throw new Error('Failed to search visa types')
    }

    return data || []
  }
}