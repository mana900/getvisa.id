"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Testimonial {
  id: number
  name: string
  date: string
  rating: number
  review: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

interface TestimonialDialogProps {
  isOpen: boolean
  onClose: (shouldRefresh?: boolean) => void
  testimonial: Testimonial | null
}

export default function TestimonialDialog({ isOpen, onClose, testimonial }: TestimonialDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    rating: 5,
    review: '',
    is_featured: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isEditing = testimonial !== null

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        date: testimonial.date,
        rating: testimonial.rating,
        review: testimonial.review,
        is_featured: testimonial.is_featured
      })
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        review: '',
        is_featured: false
      })
    }
  }, [testimonial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = isEditing 
        ? `/api/admin/testimonials/${testimonial.id}`
        : '/api/admin/testimonials'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save testimonial')
      }

      const data = await response.json()
      
      toast({
        title: "Success",
        description: data.message || `Testimonial ${isEditing ? 'updated' : 'created'} successfully`
      })

      onClose(true) // Close dialog and refresh data
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save testimonial",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStarSelector = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 hover:scale-110 transition-transform ${
              star <= formData.rating 
                ? "text-yellow-400" 
                : "text-gray-300 hover:text-yellow-200"
            }`}
            onClick={() => handleChange('rating', star)}
          >
            <Star
              className={`w-6 h-6 ${
                star <= formData.rating ? "fill-current" : ""
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
        </span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the testimonial details below.'
              : 'Add a new customer testimonial to showcase on your website.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            {renderStarSelector()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Review *</Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => handleChange('review', e.target.value)}
              placeholder="Share your experience with our visa services..."
              rows={4}
              required
            />
            <p className="text-xs text-gray-500">
              {formData.review.length} characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleChange('is_featured', checked)}
            />
            <Label htmlFor="featured" className="text-sm font-medium">
              Feature on homepage
            </Label>
            <p className="text-xs text-gray-500">
              Featured testimonials are displayed on the main page
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Testimonial' : 'Create Testimonial')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}