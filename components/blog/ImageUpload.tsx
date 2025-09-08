"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value?: string
  altText?: string
  onImageChange?: (url: string) => void
  onAltTextChange?: (altText: string) => void
  placeholder?: string
}

export function ImageUpload({ 
  value, 
  altText = '', 
  onImageChange, 
  onAltTextChange,
  placeholder = "Upload featured image"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for original
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
          // Calculate optimal dimensions for web
          const MAX_WIDTH = 1200   // Good for desktop featured images
          const MAX_HEIGHT = 800   // Maintain reasonable height
          const QUALITY = 0.85     // High quality but compressed

          let { width, height } = img
          const originalSize = file.size
          
          // Calculate new dimensions while maintaining aspect ratio
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

          // Set canvas dimensions
          canvas.width = width
          canvas.height = height

          if (!ctx) {
            reject(new Error('Canvas context not available'))
            return
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height)
          
          // Determine optimal format (JPEG for photos, PNG for graphics with transparency)
          const mimeType = file.type === 'image/png' && hasTransparency(ctx, width, height) 
            ? 'image/png' 
            : 'image/jpeg'
          
          let compressedDataUrl = canvas.toDataURL(mimeType, QUALITY)
          
          // Check final size and adjust if needed
          const finalSize = Math.round((compressedDataUrl.length * 3) / 4) // Approximate bytes
          const targetSize = 300 * 1024 // 300KB target for web speed
          
          // If still too large, compress more aggressively
          if (finalSize > targetSize && mimeType === 'image/jpeg') {
            const compressionRatio = targetSize / finalSize
            const newQuality = Math.max(0.4, QUALITY * compressionRatio)
            compressedDataUrl = canvas.toDataURL(mimeType, newQuality)
          }

          console.log(`Image optimized: ${formatFileSize(originalSize)} → ${formatFileSize(Math.round((compressedDataUrl.length * 3) / 4))}, ${img.naturalWidth}×${img.naturalHeight} → ${width}×${height}`)
          
          resolve(compressedDataUrl)
        } catch (error) {
          reject(error)
        }
      }

      img.onload = handleImageLoad
      img.onerror = () => reject(new Error('Failed to load image'))
      
      // Create object URL and clean up after use
      const objectUrl = URL.createObjectURL(file)
      img.src = objectUrl
      
      // Clean up object URL after image loads
      img.addEventListener('load', () => URL.revokeObjectURL(objectUrl), { once: true })
    })
  }

  // Check if PNG has transparency
  const hasTransparency = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true // Found transparent pixel
    }
    return false
  }

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = () => {
    onImageChange?.('')
    onAltTextChange?.('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
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
      ) : (
        <Card className={`border-dashed border-2 transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}>
          <CardContent className="p-6">
            <div
              className="text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
                  PNG, JPG, GIF up to 10MB • Auto-resized to 1200×800px max • Compressed to ~300KB
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
                {uploading ? 'Optimizing...' : 'Choose Image'}
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
      )}
      
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