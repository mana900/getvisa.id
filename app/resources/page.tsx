"use client"

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Calendar, Clock, ArrowRight, BookOpen, Globe, FileText, MapPin } from 'lucide-react'

// Note: Metadata moved to layout.tsx for client component

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  featured_image_url: string
  featured_image_alt: string
  published_at: string
  word_count: number
}


export default function ResourcesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory))
    }
  }, [posts, selectedCategory])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?limit=50')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      id: 'visa-guides',
      name: 'Visa Guides',
      description: 'Step-by-step guides for visa applications',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'country-guides',
      name: 'Country Guides',
      description: 'Living, studying, and working abroad',
      icon: Globe,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'document-guides',
      name: 'Document Guides', 
      description: 'Requirements and preparation tips',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'travel-tips',
      name: 'Travel Tips',
      description: 'Insider tips for Indonesian travelers',
      icon: MapPin,
      color: 'bg-orange-100 text-orange-800'
    }
  ]

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.name || category.replace('-', ' ')
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadTime = (wordCount: number) => {
    const wordsPerMinute = 200
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      {/* Main Content */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl text-gray-900 leading-tight mb-6">
              Visa Resources & Guides
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-4xl">
              Expert guidance and comprehensive resources to help Indonesian travelers navigate visa applications successfully
            </p>
            
            {/* Category Filter Links */}
            <div className="flex flex-wrap gap-6 mb-12">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`font-medium border-b-2 transition-colors ${
                  selectedCategory === 'all' 
                    ? 'text-green-700 border-green-700' 
                    : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-gray-300'
                }`}
              >
                All Resources ({posts.length})
              </button>
              {categories.map((category) => {
                const categoryPosts = posts.filter(post => post.category === category.id)
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`font-medium border-b-2 transition-colors ${
                      selectedCategory === category.id 
                        ? 'text-green-700 border-green-700' 
                        : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-gray-300'
                    }`}
                  >
                    {category.name} ({categoryPosts.length})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Latest Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading articles...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">Check back soon for helpful visa guides and resources.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                    <Link href={`/resources/${post.slug}`}>
                      {post.featured_image_url && (
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <Image
                            src={post.featured_image_url}
                            alt={post.featured_image_alt || post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryName(post.category)}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 hover:text-green-700 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatReadTime(post.word_count)}
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Need Personal Assistance?
          </h3>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Our visa experts are here to help you with personalized guidance and application support.
          </p>
          <Button asChild className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg">
            <Link href="https://wa.me/6282199144554" target="_blank" rel="noopener noreferrer">
              Get Expert Help <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}