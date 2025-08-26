"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Download, Filter, ExternalLink, Check, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/toast-container"

interface DocumentWithUser {
  id: string
  name: string
  size: number
  type: string
  status: "approved" | "pending" | "rejected"
  category: string
  uploadDate: string
  applicant: string
  application: string
  userId: string
  userEmail: string
  rejectionReason?: string
  reviewedAt?: string
  reviewedBy?: string
}

export default function AdminDocumentsPage() {
  const { user } = useSupabaseAuth()
  const { toasts, showToast, removeToast } = useToast()
  const [documents, setDocuments] = useState<DocumentWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [reviewingDoc, setReviewingDoc] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [docToReject, setDocToReject] = useState<DocumentWithUser | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/admin/documents')
        if (response.ok) {
          const documentsData = await response.json()
          setDocuments(documentsData)
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.application.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

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

  const handleViewDocument = async (document: DocumentWithUser) => {
    console.log('View button clicked for document:', document.name)
    
    try {
      // Get the secure viewing URL from the API
      const response = await fetch(`/api/documents/${document.id}/view`)
      
      if (response.ok) {
        const data = await response.json()
        // Open the document in a new tab
        window.open(data.url, '_blank')
      } else {
        const error = await response.json()
        showToast(`Failed to open document: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error opening document:', error)
      showToast('Failed to open document: Network error', 'error')
    }
  }

  const handleDownloadDocument = async (document: DocumentWithUser) => {
    console.log('Download button clicked for document:', document.name)
    
    try {
      // Get the secure viewing URL from the API
      const response = await fetch(`/api/documents/${document.id}/view`)
      
      if (response.ok) {
        const data = await response.json()
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a')
        link.href = data.url
        link.download = data.filename || document.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const error = await response.json()
        showToast(`Failed to download document: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      showToast('Failed to download document: Network error', 'error')
    }
  }

  const handleApproveDocument = async (document: DocumentWithUser) => {
    if (!user?.id) return
    
    setReviewingDoc(document.id)
    
    try {
      const response = await fetch(`/api/documents/${document.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          reviewedBy: user.id
        }),
      })

      if (response.ok) {
        // Update the document in local state
        setDocuments(prev => prev.map(doc => 
          doc.id === document.id 
            ? { ...doc, status: 'approved' }
            : doc
        ))
        showToast('Document approved successfully!', 'success')
      } else {
        const error = await response.json()
        showToast(`Failed to approve document: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error approving document:', error)
      showToast('Failed to approve document: Network error', 'error')
    } finally {
      setReviewingDoc(null)
    }
  }

  const handleRejectDocument = async () => {
    if (!user?.id || !docToReject || !rejectionReason.trim()) return
    
    setReviewingDoc(docToReject.id)
    
    try {
      const response = await fetch(`/api/documents/${docToReject.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: rejectionReason.trim(),
          reviewedBy: user.id
        }),
      })

      if (response.ok) {
        // Update the document in local state
        setDocuments(prev => prev.map(doc => 
          doc.id === docToReject.id 
            ? { ...doc, status: 'rejected' }
            : doc
        ))
        const result = await response.json()
        showToast(`Document rejected successfully!\nReason: ${rejectionReason}`, 'success')
        setShowRejectModal(false)
        setDocToReject(null)
        setRejectionReason('')
      } else {
        const error = await response.json()
        showToast(`Failed to reject document: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error rejecting document:', error)
      showToast('Failed to reject document: Network error', 'error')
    } finally {
      setReviewingDoc(null)
    }
  }

  const openRejectModal = (document: DocumentWithUser) => {
    setDocToReject(document)
    setShowRejectModal(true)
    setRejectionReason('')
  }

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "passport", label: "Passport" },
    { value: "photo", label: "Photo" },
    { value: "financial", label: "Financial" },
    { value: "employment", label: "Employment" },
    { value: "travel", label: "Travel" },
  ]

  const statusTypes = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents Management</h1>
        <p className="text-gray-600">View and manage all uploaded documents across all users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>All Documents ({filteredDocuments.length})</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search documents, users, or applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Document</th>
                  <th className="text-left p-3 font-medium text-gray-600">User</th>
                  <th className="text-left p-3 font-medium text-gray-600">Type</th>
                  <th className="text-left p-3 font-medium text-gray-600">Category</th>
                  <th className="text-left p-3 font-medium text-gray-600">Size</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Upload Date</th>
                  <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Loading documents...
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4 text-gray-600" />
                          </div>
                          <button 
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline max-w-48 truncate text-left"
                            onClick={() => handleViewDocument(doc)}
                            title="Click to view document"
                          >
                            {doc.name}
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-gray-900">{doc.applicant}</div>
                          <div className="text-xs text-gray-500">{doc.userEmail}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {doc.category}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{formatFileSize(doc.size)}</td>
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
                                showToast(`Document: ${doc.name}\n\nREJECTED\n\nReason: ${reason}\n\nReviewed at: ${reviewedAt}`, 'info', 8000)
                              }}
                              title="View rejection reason"
                            >
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDownloadDocument(doc)
                            }}
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          
                          {/* Review buttons - only show for pending documents */}
                          {doc.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleApproveDocument(doc)
                                }}
                                disabled={reviewingDoc === doc.id}
                                title="Approve document"
                              >
                                {reviewingDoc === doc.id ? (
                                  <AlertCircle className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  openRejectModal(doc)
                                }}
                                disabled={reviewingDoc === doc.id}
                                title="Reject document"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason Modal */}
      {showRejectModal && docToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reject Document</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              You are about to reject <strong>{docToReject.name}</strong>. 
              Please provide a reason for rejection:
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection (e.g., Document is unclear, Missing required information, etc.)"
              className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              maxLength={500}
            />
            
            <div className="text-right text-sm text-gray-500 mb-4">
              {rejectionReason.length}/500 characters
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRejectModal(false)
                  setDocToReject(null)
                  setRejectionReason('')
                }}
                disabled={reviewingDoc === docToReject.id}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRejectDocument}
                disabled={!rejectionReason.trim() || reviewingDoc === docToReject.id}
              >
                {reviewingDoc === docToReject.id ? 'Rejecting...' : 'Reject Document'}
              </Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}