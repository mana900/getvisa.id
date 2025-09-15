"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCountries, type Country } from "@/hooks/useCountries"
import { Loader2 } from "lucide-react"

interface CountrySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  triggerClassName?: string
  disabled?: boolean
}

export function CountrySelect({ 
  value, 
  onValueChange, 
  placeholder = "Select country",
  triggerClassName = "",
  disabled = false 
}: CountrySelectProps) {
  const { countries, loading, error } = useCountries()

  if (error) {
    // Fallback to a basic select with common countries if data fetch fails
    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="australia">Australia</SelectItem>
          <SelectItem value="canada">Canada</SelectItem>
          <SelectItem value="france">France</SelectItem>
          <SelectItem value="germany">Germany</SelectItem>
          <SelectItem value="italy">Italy</SelectItem>
          <SelectItem value="japan">Japan</SelectItem>
          <SelectItem value="spain">Spain</SelectItem>
          <SelectItem value="thailand">Thailand</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="usa">United States</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
      <SelectTrigger className={triggerClassName}>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading countries...</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {countries.map((country: Country) => (
          <SelectItem key={country.countryCode} value={country.countryCode}>
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.country}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}