"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/toast-container"
import { SimpleEditor } from "@/components/blog/SimpleEditor"
import { SEOAnalyzer } from "@/components/blog/SEOAnalyzer"
import { InternalLinkSuggester } from "@/components/blog/InternalLinkSuggester"
import { ImageSelector } from "@/components/blog/ImageSelector"
import { autoGenerateFields } from "@/lib/auto-seo"
import { markdownToHtml } from "@/lib/markdown"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    featured_image_url: '',
    featured_image_alt: '',
    target_keywords: [] as string[],
    status: 'draft'
  })
  const [contentMarkdown, setContentMarkdown] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [keywordInput, setKeywordInput] = useState('')

  // Auto-generate fields from title and content
  const handleTitleChange = (title: string) => {
    if (title && post.category && contentMarkdown) {
      const autoFields = autoGenerateFields(title, contentMarkdown, post.category)
      setPost(prev => ({ 
        ...prev, 
        title, 
        slug: autoFields.slug,
        excerpt: prev.excerpt || autoFields.excerpt,
        meta_title: prev.meta_title || autoFields.metaTitle,
        meta_description: prev.meta_description || autoFields.metaDescription,
        target_keywords: prev.target_keywords.length === 0 ? autoFields.keywords : prev.target_keywords
      }))
    } else {
      setPost(prev => ({ ...prev, title }))
    }
  }

  const handleContentChange = (content: string) => {
    setContentMarkdown(content)
    setContentHtml(markdownToHtml(content))
    
    // Auto-generate fields if we have title and category
    if (post.title && post.category && content) {
      const autoFields = autoGenerateFields(post.title, content, post.category)
      setPost(prev => ({ 
        ...prev,
        excerpt: prev.excerpt || autoFields.excerpt,
        meta_title: prev.meta_title || autoFields.metaTitle,
        meta_description: prev.meta_description || autoFields.metaDescription,
        target_keywords: prev.target_keywords.length === 0 ? autoFields.keywords : prev.target_keywords
      }))
    }
  }

  const handleCategoryChange = (category: string) => {
    setPost(prev => ({ ...prev, category }))
    
    // Auto-generate fields if we have title and content
    if (post.title && contentMarkdown && category) {
      const autoFields = autoGenerateFields(post.title, contentMarkdown, category)
      setPost(prev => ({ 
        ...prev,
        category,
        excerpt: prev.excerpt || autoFields.excerpt,
        meta_title: prev.meta_title || autoFields.metaTitle,
        meta_description: prev.meta_description || autoFields.metaDescription,
        target_keywords: prev.target_keywords.length === 0 ? autoFields.keywords : prev.target_keywords
      }))
    }
  }

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !post.target_keywords.includes(keywordInput.trim())) {
      setPost(prev => ({
        ...prev,
        target_keywords: [...prev.target_keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setPost(prev => ({
      ...prev,
      target_keywords: prev.target_keywords.filter(k => k !== keyword)
    }))
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!post.title || !post.slug || !contentMarkdown || !post.category || !post.excerpt) {
      showToast('Please fill in all required fields: Title, Category, Content, and Excerpt', 'error')
      return
    }

    try {
      setSaving(true)
      
      const postData = {
        ...post,
        content: { type: 'markdown', content: contentMarkdown },
        content_html: contentHtml,
        status,
        author_id: null // TODO: Get from auth context
      }

      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      const data = await response.json()

      if (response.ok) {
        showToast(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success')
        router.push('/admin/blog/posts')
      } else {
        showToast(`Error: ${data.error}`, 'error')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      showToast('Error saving post. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/blog/posts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-gray-600">Write and publish a new blog post</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (contentMarkdown) {
                        const autoFields = autoGenerateFields(post.title || 'Untitled', contentMarkdown, post.category || 'visa-guides')
                        setPost(prev => ({ ...prev, excerpt: autoFields.excerpt }))
                      }
                    }}
                    disabled={!contentMarkdown}
                  >
                    Auto-generate
                  </Button>
                </div>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description for search engines and post previews (will auto-generate from content)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content *</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleEditor
                value={contentMarkdown}
                onChange={handleContentChange}
                placeholder="Start writing your blog post..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* SEO Analysis */}
          <SEOAnalyzer 
            content={contentHtml}
            title={post.title}
            keywords={post.target_keywords}
            metaDescription={post.meta_description || post.excerpt}
          />
          
          {/* Internal Link Suggestions */}
          <InternalLinkSuggester 
            content={contentHtml}
            onSuggestLink={(text, url, title) => {
              // TODO: Implement auto-linking in editor
              console.log('Suggested link:', { text, url, title })
            }}
          />
          {/* Category & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={post.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa-guides">Visa Guides</SelectItem>
                    <SelectItem value="country-guides">Country Guides</SelectItem>
                    <SelectItem value="document-guides">Document Guides</SelectItem>
                    <SelectItem value="travel-tips">Travel Tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageSelector
                value={post.featured_image_url}
                altText={post.featured_image_alt}
                onImageChange={(url) => setPost(prev => ({ ...prev, featured_image_url: url }))}
                onAltTextChange={(altText) => setPost(prev => ({ ...prev, featured_image_alt: altText }))}
                placeholder="Select featured image for your blog post"
                title={post.title}
                category={post.category}
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SEO Settings</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (post.title && contentMarkdown && post.category) {
                      const autoFields = autoGenerateFields(post.title, contentMarkdown, post.category)
                      setPost(prev => ({
                        ...prev,
                        meta_title: autoFields.metaTitle,
                        meta_description: autoFields.metaDescription,
                        target_keywords: autoFields.keywords
                      }))
                    }
                  }}
                  disabled={!post.title || !contentMarkdown || !post.category}
                >
                  Auto-generate All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={post.meta_title}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Custom title for search engines (auto-generated if empty)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current length: {post.meta_title.length} chars (optimal: 50-60)
                </p>
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={post.meta_description}
                  onChange={(e) => setPost(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Custom description for search engines (auto-generated if empty)"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current length: {post.meta_description.length} chars (optimal: 150-160)
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Target Keywords</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (post.title && contentMarkdown && post.category) {
                        const autoFields = autoGenerateFields(post.title, contentMarkdown, post.category)
                        setPost(prev => ({ ...prev, target_keywords: autoFields.keywords }))
                      }
                    }}
                    disabled={!post.title || !contentMarkdown}
                  >
                    Auto-generate
                  </Button>
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword manually"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
                  />
                  <Button type="button" onClick={handleKeywordAdd} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.target_keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                      onClick={() => handleKeywordRemove(keyword)}
                      title="Click to remove"
                    >
                      {keyword} ×
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}