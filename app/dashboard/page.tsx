"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Trash2, Upload } from "lucide-react"

const existingDocuments = [
  {
    id: "1",
    name: "passport-copy.pdf",
    size: 1024 * 1024 * 2,
    type: "PDF",
    status: "approved",
    category: "passport",
    uploadDate: "2024-01-20",
    applicant: "John Doe",
    application: "UK Tourist Visa",
  },
  {
    id: "2",
    name: "passport-photo.jpg",
    size: 1024 * 500,
    type: "JPG",
    status: "pending",
    category: "photo",
    uploadDate: "2024-01-20",
    applicant: "John Doe",
    application: "UK Tourist Visa",
  },
  {
    id: "3",
    name: "bank-statement.pdf",
    size: 1024 * 1024 * 3,
    type: "PDF",
    status: "rejected",
    category: "financial",
    uploadDate: "2024-01-19",
    applicant: "Jane Smith",
    application: "US Business Visa",
  },
  {
    id: "4",
    name: "employment-letter.pdf",
    size: 1024 * 1024 * 1.5,
    type: "PDF",
    status: "approved",
    category: "employment",
    uploadDate: "2024-01-18",
    applicant: "Mike Johnson",
    application: "Canada Work Visa",
  },
]

export default function DashboardPage() {
  const [documents, setDocuments] = useState(existingDocuments)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState("passport")

  const displayedDocuments = documents.filter((doc) => doc.category === selectedDocumentType)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    }
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
  }

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const toggleAllDocuments = () => {
    setSelectedDocuments((prev) =>
      prev.length === displayedDocuments.length ? [] : displayedDocuments.map((doc) => doc.id),
    )
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // Simulate upload process
      const fileId = Math.random().toString(36).substr(2, 9)
      setUploadingFiles((prev) => [...prev, fileId])

      // Simulate upload delay
      setTimeout(() => {
        const newDoc = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.name.split(".").pop()?.toUpperCase() || "FILE",
          status: "pending" as const,
          category: selectedDocumentType,
          uploadDate: new Date().toISOString().split("T")[0],
          applicant: "Current User",
          application: "New Application",
        }

        setDocuments((prev) => [newDoc, ...prev])
        setUploadingFiles((prev) => prev.filter((id) => id !== fileId))
      }, 2000)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const documentTypes = [
    { id: "passport", label: "Passport", icon: FileText },
    { id: "photo", label: "Photo", icon: FileText },
    { id: "financial", label: "Financial", icon: FileText },
    { id: "employment", label: "Employment", icon: FileText },
    { id: "travel", label: "Travel", icon: FileText },
  ]

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Document Type Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {documentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedDocumentType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDocumentType === type.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <type.icon className="w-4 h-4" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 transition-colors text-center ${
              isDragOver ? "border-purple-400 bg-purple-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  <span className="text-green-600 cursor-pointer" onClick={openFileDialog}>
                    Click to add
                  </span>{" "}
                  or drop here.
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF files only. Max. 10 MB each.</p>
              </div>
              {uploadingFiles.length > 0 && (
                <p className="text-sm text-purple-600">
                  Uploading {uploadingFiles.length} file{uploadingFiles.length > 1 ? "s" : ""}...
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={openFileDialog}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={uploadingFiles.length > 0}
            >
              {uploadingFiles.length > 0 ? "Uploading..." : "Add documents"}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-12 p-3">
                  <Checkbox
                    checked={selectedDocuments.length === displayedDocuments.length}
                    onCheckedChange={toggleAllDocuments}
                  />
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Document Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Size</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Uploaded Date</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Type of Document</th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {displayedDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => toggleDocumentSelection(doc.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="font-medium text-sm">{doc.name}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                  <td className="p-3 text-sm text-gray-600">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs capitalize">
                      {doc.category}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
