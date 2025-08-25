"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, ImageIcon, X, Check, AlertCircle, Eye } from "lucide-react"

interface DocumentFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  url?: string
  category: string
}

interface DocumentUploadProps {
  requiredDocuments: Array<{
    category: string
    name: string
    description: string
    required: boolean
    acceptedTypes: string[]
    maxSize: number
  }>
  onDocumentsChange: (documents: DocumentFile[]) => void
  existingDocuments?: DocumentFile[]
}

export default function DocumentUpload({
  requiredDocuments,
  onDocumentsChange,
  existingDocuments = [],
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>(existingDocuments)
  const [selectedCategory, setSelectedCategory] = useState<string>(requiredDocuments[0]?.category || "")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!selectedCategory) return

      const newDocuments = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading" as const,
        progress: 0,
        category: selectedCategory,
      }))

      setDocuments((prev) => [...prev, ...newDocuments])

      // Simulate upload progress
      newDocuments.forEach((doc) => {
        simulateUpload(doc.id)
      })

      onDocumentsChange([...documents, ...newDocuments])
    },
    [selectedCategory, documents, onDocumentsChange],
  )

  const simulateUpload = (docId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, status: "completed", progress: 100, url: `/uploads/${doc.name}` } : doc,
          ),
        )
      } else {
        setDocuments((prev) => prev.map((doc) => (doc.id === docId ? { ...doc, progress } : doc)))
      }
    }, 200)
  }

  const removeDocument = (docId: string) => {
    const updatedDocs = documents.filter((doc) => doc.id !== docId)
    setDocuments(updatedDocs)
    onDocumentsChange(updatedDocs)
  }

  const currentCategoryDocs = documents.filter((doc) => doc.category === selectedCategory)
  const currentRequirement = requiredDocuments.find((req) => req.category === selectedCategory)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      currentRequirement?.acceptedTypes.reduce(
        (acc, type) => {
          acc[type] = []
          return acc
        },
        {} as Record<string, string[]>,
      ) || {},
    maxSize: currentRequirement?.maxSize || 10 * 1024 * 1024, // 10MB default
    multiple: true,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Categories */}
      <div className="flex flex-wrap gap-2">
        {requiredDocuments.map((req) => {
          const categoryDocs = documents.filter((doc) => doc.category === req.category)
          const isComplete = req.required ? categoryDocs.length > 0 : true

          return (
            <button
              key={req.category}
              onClick={() => setSelectedCategory(req.category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === req.category
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{req.name}</span>
                {req.required && <span className="text-red-500">*</span>}
                {isComplete && <Check className="w-4 h-4 text-green-600" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Current Category Info */}
      {currentRequirement && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">{currentRequirement.name}</h3>
          <p className="text-sm text-blue-700 mb-2">{currentRequirement.description}</p>
          <div className="text-xs text-blue-600">
            <p>Accepted formats: {currentRequirement.acceptedTypes.join(", ")}</p>
            <p>Maximum size: {formatFileSize(currentRequirement.maxSize)}</p>
          </div>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-orange-400 bg-orange-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-orange-600">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop files here, or <span className="text-orange-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                {currentRequirement ? `Upload ${currentRequirement.name.toLowerCase()}` : "Select a category first"}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Uploaded Documents */}
      {currentCategoryDocs.length > 0 && (
        <Card className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">
            Uploaded {currentRequirement?.name} ({currentCategoryDocs.length})
          </h3>
          <div className="space-y-3">
            {currentCategoryDocs.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 text-gray-400">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  {doc.status === "uploading" && <Progress value={doc.progress} className="mt-2 h-1" />}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(doc.status)}
                  {doc.status === "completed" && doc.url && (
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upload Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total documents: {documents.length}</span>
          <span className="text-gray-600">
            Required documents: {requiredDocuments.filter((req) => req.required).length}
          </span>
        </div>
        <div className="mt-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                Completed: {documents.filter((doc) => doc.status === "completed").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">
                Uploading: {documents.filter((doc) => doc.status === "uploading").length}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
