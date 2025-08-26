"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Trash2, Upload, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/toast-container"


export default function DashboardPage() {
  const { user } = useSupabaseAuth()
  const { toasts, showToast, removeToast } = useToast()
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const [selectedDocumentType, setSelectedDocumentType] = useState("passport")
  const [currentApplication, setCurrentApplication] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deletingDocs, setDeletingDocs] = useState<string[]>([])

  const displayedDocuments = documents

  // Fetch current application and documents on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return
      
      try {
        // Fetch current application
        const appResponse = await fetch(`/api/applications/current?userEmail=${encodeURIComponent(user.email)}`)
        if (appResponse.ok) {
          const appData = await appResponse.json()
          setCurrentApplication(appData.application)
          setCurrentUser(appData.user)
        }

        // Fetch user's documents
        const docsResponse = await fetch(`/api/documents/user?userEmail=${encodeURIComponent(user.email)}`)
        if (docsResponse.ok) {
          const docsData = await docsResponse.json()
          setDocuments(docsData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.email])

  // Function to refresh documents list
  const refreshDocuments = async () => {
    if (!user?.email) return
    
    try {
      const docsResponse = await fetch(`/api/documents/user?userEmail=${encodeURIComponent(user.email)}`)
      if (docsResponse.ok) {
        const docsData = await docsResponse.json()
        setDocuments(docsData)
      }
    } catch (error) {
      console.error('Failed to refresh documents:', error)
    }
  }

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

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !currentApplication || !currentUser) {
      showToast('Please wait for application to load before uploading files.', 'error')
      return
    }

    Array.from(files).forEach(async (file) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      setUploadingFiles((prev) => [...prev, fileId])

      try {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', selectedDocumentType)
        formData.append('userId', currentUser.id)
        formData.append('applicationId', currentApplication.id)

        // Upload file to server
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Refresh documents list from server to get the latest data
          await refreshDocuments()
          showToast('File uploaded successfully!', 'success')
        } else {
          console.error('Upload failed:', result.error)
          showToast(`Upload failed: ${result.error}`, 'error')
        }
      } catch (error) {
        console.error('Upload error:', error)
        showToast('Upload failed: Network error', 'error')
      } finally {
        setUploadingFiles((prev) => prev.filter((id) => id !== fileId))
      }
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

  const handleDeleteDocument = async (doc: any) => {
    if (!currentUser?.id) return
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)
    if (!confirmDelete) return
    
    setDeletingDocs(prev => [...prev, doc.id])
    
    try {
      const response = await fetch(`/api/documents/${doc.id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id
        }),
      })

      if (response.ok) {
        // Remove document from local state
        setDocuments(prev => prev.filter(d => d.id !== doc.id))
        // Also remove from selected documents if it was selected
        setSelectedDocuments(prev => prev.filter(id => id !== doc.id))
        showToast('Document deleted successfully!', 'success')
      } else {
        const error = await response.json()
        showToast(`Failed to delete document: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      showToast('Failed to delete document: Network error', 'error')
    } finally {
      setDeletingDocs(prev => prev.filter(id => id !== doc.id))
    }
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
                <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Loading documents...
                  </td>
                </tr>
              ) : displayedDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No documents uploaded yet. Upload your first document above.
                  </td>
                </tr>
              ) : (
                displayedDocuments.map((doc) => (
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
                      <button 
                        className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/documents/${doc.id}/view`)
                            if (response.ok) {
                              const data = await response.json()
                              window.open(data.url, '_blank')
                            } else {
                              showToast('Failed to view document', 'error')
                            }
                          } catch (error) {
                            showToast('Failed to view document', 'error')
                          }
                        }}
                        title="Click to view document"
                      >
                        {doc.name}
                      </button>
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
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </Badge>
                      {doc.status === 'rejected' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-orange-50"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const reason = doc.rejectionReason || 'No specific reason provided'
                            const reviewedAt = doc.reviewedAt ? new Date(doc.reviewedAt).toLocaleString() : 'Unknown'
                            showToast(`Document: ${doc.name}\n\nREJECTED\n\nReason: ${reason}\n\nReviewed at: ${reviewedAt}\n\nYou can delete this document and upload a new one.`, 'error', 8000)
                          }}
                          title="View rejection reason"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/documents/${doc.id}/view`)
                            if (response.ok) {
                              const data = await response.json()
                              const link = document.createElement('a')
                              link.href = data.url
                              link.download = data.filename || doc.name
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            } else {
                              alert('Failed to download document')
                            }
                          } catch (error) {
                            alert('Failed to download document')
                          }
                        }}
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteDocument(doc)}
                        disabled={deletingDocs.includes(doc.id)}
                        title="Delete document"
                      >
                        {deletingDocs.includes(doc.id) ? (
                          <AlertCircle className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
