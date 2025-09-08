"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, X, Image as ImageIcon, Loader2, Search, ExternalLink } from 'lucide-react'
import { generateImageSearchQuery } from '@/lib/unsplash'

interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

interface ImageSelectorProps {
  value?: string
  altText?: string
  onImageChange?: (url: string) => void
  onAltTextChange?: (altText: string) => void
  placeholder?: string
  title?: string
  category?: string
}

export function ImageSelector({ 
  value, 
  altText = '', 
  onImageChange, 
  onAltTextChange,
  placeholder = "Select featured image",
  title = '',
  category = 'travel-tips'
}: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [suggestions, setSuggestions] = useState<UnsplashImage[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [customSearch, setCustomSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate suggestions when title changes
  useEffect(() => {
    if (title && title.length > 3) {
      generateSuggestions()
    }
  }, [title, category])

  const generateSuggestions = async () => {
    setLoadingSuggestions(true)
    try {
      const searchQuery = generateImageSearchQuery(title, category)
      const response = await fetch(`/api/unsplash/search?q=${encodeURIComponent(searchQuery)}&count=3`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      
      const data = await response.json()
      setSuggestions(data.images || [])
    } catch (error) {
      console.error('Error fetching image suggestions:', error)
      setSuggestions([])
    }
    setLoadingSuggestions(false)
  }

  const searchCustomImages = async () => {
    if (!customSearch.trim()) return
    
    setLoadingSuggestions(true)
    try {
      const response = await fetch(`/api/unsplash/search?q=${encodeURIComponent(customSearch)}&count=6`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      
      const data = await response.json()
      setSuggestions(data.images || [])
    } catch (error) {
      console.error('Error searching custom images:', error)
      setSuggestions([])
    }
    setLoadingSuggestions(false)
  }

  const selectUnsplashImage = (image: UnsplashImage) => {
    onImageChange?.(image.urls.regular)
    onAltTextChange?.(
      image.alt_description || 
      image.description || 
      `Photo by ${image.user.name} on Unsplash`
    )
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    setUploading(true)
    try {
      const compressedImage = await compressAndResizeImage(file)
      onImageChange?.(compressedImage)
      setUploading(false)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image')
      setUploading(false)
    }
  }

  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      const handleImageLoad = () => {
        try {
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 800
          const QUALITY = 0.85

          let { width, height } = img
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width)
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height)
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          let compressedDataUrl = canvas.toDataURL(mimeType, QUALITY)
          
          const finalSize = Math.round((compressedDataUrl.length * 3) / 4)
          const targetSize = 300 * 1024
          
          if (finalSize > targetSize && mimeType === 'image/jpeg') {
            const compressionRatio = targetSize / finalSize
            const newQuality = Math.max(0.4, QUALITY * compressionRatio)
            compressedDataUrl = canvas.toDataURL(mimeType, newQuality)
          }
          
          resolve(compressedDataUrl)
        } catch (error) {
          reject(error)
        }
      }

      img.onload = handleImageLoad
      img.onerror = () => reject(new Error('Failed to load image'))
      
      const objectUrl = URL.createObjectURL(file)
      img.src = objectUrl
      img.addEventListener('load', () => URL.revokeObjectURL(objectUrl), { once: true })
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    onImageChange?.('')
    onAltTextChange?.('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (value) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <img
              src={value}
              alt={altText || 'Featured image preview'}
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <Label htmlFor="alt-text">Image Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => onAltTextChange?.(e.target.value)}
              placeholder="Describe the image for accessibility and SEO"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for images (e.g., 'australia travel', 'visa passport')"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCustomImages()}
            />
            <Button onClick={searchCustomImages} disabled={loadingSuggestions}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {loadingSuggestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Finding perfect images...</span>
            </div>
          ) : (
            <>
              {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestions.map((image) => (
                    <Card key={image.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img
                          src={image.urls.small}
                          alt={image.alt_description || 'Suggested image'}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500 truncate">
                            by {image.user.name}
                          </p>
                          <a
                            href={image.links.html}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="w-full"
                          onClick={() => selectUnsplashImage(image)}
                        >
                          Select Image
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2">No suggestions yet</p>
                  <p className="text-sm">
                    {title ? 'Try searching for specific keywords above' : 'Add a title to get AI-powered image suggestions'}
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <Card className={`border-dashed border-2 transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}>
            <CardContent className="p-6">
              <div
                className="text-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {uploading ? 'Optimizing image for web...' : placeholder}
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 10MB • Auto-resized to 1200×800px max
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Processing...' : 'Choose Image'}
                </Button>
                {uploading && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3"></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileSelect(file)
          }
        }}
      />
    </div>
  )
}