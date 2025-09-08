"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, Edit, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import TestimonialDialog from "./components/TestimonialDialog"

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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const { toast } = useToast()

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (!response.ok) throw new Error('Failed to fetch testimonials')
      
      const data = await response.json()
      setTestimonials(data.testimonials)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete testimonial')

      toast({
        title: "Success",
        description: "Testimonial deleted successfully"
      })

      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTestimonial(null)
    setIsDialogOpen(true)
  }

  const handleDialogClose = (shouldRefresh: boolean = false) => {
    setIsDialogOpen(false)
    setEditingTestimonial(null)
    if (shouldRefresh) {
      fetchTestimonials()
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading testimonials...</div>
        </div>
      </div>
    )
  }

  const featuredCount = testimonials.filter(t => t.is_featured).length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-gray-600 mt-1">
            Manage customer testimonials displayed on your website
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first customer testimonial.</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>
                      {new Date(testimonial.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {renderStars(testimonial.rating)}
                  {testimonial.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 text-sm line-clamp-4">
                  {testimonial.review}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TestimonialDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        testimonial={editingTestimonial}
      />
    </div>
  )
}