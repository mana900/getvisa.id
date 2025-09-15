"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Country {
  id?: number
  country_code: string
  country_name: string
  description: string
  image_url: string
  region: string
  processing_info: string
  is_active: boolean
  display_order: number
}

interface CountryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  country: Country | null
  onSave: (country: Omit<Country, 'id'>) => Promise<void>
}

const regions = [
  'Asia',
  'Europe', 
  'North America',
  'South America',
  'Africa',
  'Oceania',
  'Middle East'
]

export default function CountryDialog({ open, onOpenChange, country, onSave }: CountryDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Omit<Country, 'id'>>({
    country_code: '',
    country_name: '',
    description: '',
    image_url: '',
    region: '',
    processing_info: '',
    is_active: true,
    display_order: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingImages, setIsSearchingImages] = useState(false)
  const [imageOptions, setImageOptions] = useState<Array<{ id: string, url: string, fullUrl?: string, description: string }>>([])
  const [showImageOptions, setShowImageOptions] = useState(false)

  useEffect(() => {
    // Reset image search state when dialog opens/closes
    setShowImageOptions(false)
    setImageOptions([])
    
    if (country) {
      setFormData({
        country_code: country.country_code,
        country_name: country.country_name,
        description: country.description || '',
        image_url: country.image_url || '',
        region: country.region,
        processing_info: country.processing_info || '',
        is_active: country.is_active,
        display_order: country.display_order || 0
      })
    } else {
      setFormData({
        country_code: '',
        country_name: '',
        description: '',
        image_url: '',
        region: '',
        processing_info: '',
        is_active: true,
        display_order: 0
      })
    }
  }, [country, open])

  const handleSearchImages = async () => {
    if (!formData.country_name) return
    
    setIsSearchingImages(true)
    try {
      const query = `${formData.country_name} travel tourism landmark`
      const response = await fetch(`/api/unsplash/search?q=${encodeURIComponent(query)}&count=6`)
      if (response.ok) {
        const data = await response.json()
        const mappedOptions = data.images.map((img: any) => ({
          id: img.id,
          url: img.urls.small, // For display in grid
          fullUrl: img.urls.regular, // For saving
          description: img.alt_description || img.description || `${formData.country_name} travel photo`
        }))
        setImageOptions(mappedOptions)
        setShowImageOptions(true)
        toast({
          title: "Images found",
          description: `Found ${mappedOptions.length} images to choose from`,
        })
      } else {
        toast({
          title: "Search failed",
          description: "Unable to search for images. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error searching images:', error)
      toast({
        title: "Search error",
        description: "An error occurred while searching for images",
        variant: "destructive",
      })
    } finally {
      setIsSearchingImages(false)
    }
  }

  const handleSelectImage = (imageId: string) => {
    const selectedImage = imageOptions.find(img => img.id === imageId)
    if (selectedImage) {
      // Use the full quality URL for saving
      setFormData({ ...formData, image_url: (selectedImage as any).fullUrl || selectedImage.url })
      toast({
        title: "Image selected",
        description: "Country image updated successfully",
      })
    }
    setShowImageOptions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(formData)
      toast({
        title: "Success",
        description: country ? "Country updated successfully" : "Country created successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving country:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save country",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{country ? 'Edit Country' : 'Add New Country'}</DialogTitle>
          <DialogDescription>
            {country ? 'Update the country information below.' : 'Add a new country to the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country_code">Country Code *</Label>
              <Input
                id="country_code"
                value={formData.country_code}
                onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                placeholder="e.g., australia, canada"
                required
              />
            </div>
            <div>
              <Label htmlFor="country_name">Country Name *</Label>
              <Input
                id="country_name"
                value={formData.country_name}
                onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                placeholder="e.g., Australia, Canada"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="region">Region *</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Country description for the countries page..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearchImages}
                disabled={isSearchingImages || !formData.country_name}
                className="px-3"
              >
                {isSearchingImages ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Country preview"
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            
            {/* Image Options */}
            {showImageOptions && imageOptions.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm">Choose from Unsplash:</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imageOptions.map((option) => (
                    <div
                      key={option.id}
                      className="relative cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSelectImage(option.id)}
                    >
                      <img
                        src={option.url}
                        alt={option.description}
                        className="w-full h-20 object-cover rounded border"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageOptions(false)}
                  className="mt-2"
                >
                  Hide options
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="processing_info">Processing Information</Label>
            <Textarea
              id="processing_info"
              value={formData.processing_info}
              onChange={(e) => setFormData({ ...formData, processing_info: e.target.value })}
              placeholder="General processing information for this country..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Country'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}