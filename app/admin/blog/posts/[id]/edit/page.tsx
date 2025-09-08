"use client"

import { useState, useEffect } from "react"
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

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  meta_title: string
  meta_description: string
  featured_image_url: string
  featured_image_alt: string
  target_keywords: string[]
  status: 'draft' | 'published' | 'archived'
  content: any
  content_html: string
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [contentMarkdown, setContentMarkdown] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  
  const [keywordInput, setKeywordInput] = useState('')

  useEffect(() => {
    loadPost()
  }, [params.id])

  const loadPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/blog/posts/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setPost(data)
        // Extract content for editing - Novel will handle both JSON and HTML
        const storedContent = data.content?.content || data.content || ''
        setContentMarkdown(storedContent)
        setContentHtml(data.content_html || '')
      } else {
        showToast(`Error loading post: ${data.error}`, 'error')
        router.push('/admin/blog/posts')
      }
    } catch (error) {
      console.error('Error loading post:', error)
      showToast('Error loading post', 'error')
      router.push('/admin/blog/posts')
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    if (!post) return
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    setPost(prev => prev ? { ...prev, title, slug } : null)
  }

  const handleKeywordAdd = () => {
    if (!post) return
    
    if (keywordInput.trim() && !post.target_keywords.includes(keywordInput.trim())) {
      setPost(prev => prev ? {
        ...prev,
        target_keywords: [...prev.target_keywords, keywordInput.trim()]
      } : null)
      setKeywordInput('')
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    if (!post) return
    
    setPost(prev => prev ? {
      ...prev,
      target_keywords: prev.target_keywords.filter(k => k !== keyword)
    } : null)
  }

  const handleSave = async (status?: 'draft' | 'published' | 'archived') => {
    if (!post) return
    
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
        status: status || post.status
      }

      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      const data = await response.json()

      if (response.ok) {
        setPost(data)
        showToast(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`, 'success')
        if (status) {
          router.push('/admin/blog/posts')
        }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!post) {
    return <div>Post not found</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600">Update your blog post</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave()}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          {post.status !== 'published' && (
            <Button 
              onClick={() => handleSave('published')}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          )}
          {post.status === 'published' && (
            <Button 
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              Unpublish
            </Button>
          )}
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
                  onChange={(e) => setPost(prev => prev ? { ...prev, slug: e.target.value } : null)}
                  placeholder="url-friendly-slug"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                  placeholder="Brief description for search engines and post previews"
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
                onChange={(content) => {
                  setContentMarkdown(content)
                  setContentHtml(markdownToHtml(content))
                }}
                placeholder="Edit your blog post..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* SEO Analysis */}
          <SEOAnalyzer 
            content={contentHtml}
            title={post?.title || ''}
            keywords={post?.target_keywords || []}
            metaDescription={post?.meta_description || post?.excerpt}
          />
          
          {/* Internal Link Suggestions */}
          <InternalLinkSuggester 
            content={contentHtml}
            currentPostId={post?.id}
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
                <Select value={post.category} onValueChange={(value) => setPost(prev => prev ? { ...prev, category: value } : null)}>
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
              <div>
                <Label>Status</Label>
                <Select value={post.status} onValueChange={(value) => setPost(prev => prev ? { ...prev, status: value as any } : null)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
                onImageChange={(url) => setPost(prev => prev ? { ...prev, featured_image_url: url } : null)}
                onAltTextChange={(altText) => setPost(prev => prev ? { ...prev, featured_image_alt: altText } : null)}
                placeholder="Select featured image for your blog post"
                title={post.title || ''}
                category={post.category || 'travel-tips'}
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={post.meta_title}
                  onChange={(e) => setPost(prev => prev ? { ...prev, meta_title: e.target.value } : null)}
                  placeholder="Custom title for search engines"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={post.meta_description}
                  onChange={(e) => setPost(prev => prev ? { ...prev, meta_description: e.target.value } : null)}
                  placeholder="Custom description for search engines"
                  rows={3}
                />
              </div>
              <div>
                <Label>Target Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
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
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 cursor-pointer"
                      onClick={() => handleKeywordRemove(keyword)}
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