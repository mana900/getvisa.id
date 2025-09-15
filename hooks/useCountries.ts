import { useState, useEffect, useMemo } from 'react'
import { VisaService } from '@/lib/services/visa-service'

export interface Country {
  country: string
  countryCode: string
  flag: string
  count: number
  activeCount: number
}

interface UseCountriesReturn {
  countries: Country[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useCountries = (): UseCountriesReturn => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await VisaService.getCountriesWithVisas()
      // Only show countries with active visas
      const activeCountries = data.filter(country => country.activeCount > 0)
      setCountries(activeCountries)
    } catch (err) {
      console.error('Error fetching countries:', err)
      setError('Failed to load countries')
      // Fallback to empty array instead of hardcoded data
      setCountries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    countries,
    loading,
    error,
    refetch: fetchCountries
  }), [countries, loading, error])

  return returnValue
}