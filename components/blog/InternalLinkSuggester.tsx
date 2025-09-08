"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link2, ExternalLink } from 'lucide-react'

interface LinkSuggestion {
  text: string
  url: string
  type: 'visa-service' | 'blog-post' | 'page'
  title: string
  category?: string
}

interface InternalLinkSuggesterProps {
  content: string
  currentPostId?: string
  onSuggestLink: (text: string, url: string, title: string) => void
}

export function InternalLinkSuggester({ content, currentPostId, onSuggestLink }: InternalLinkSuggesterProps) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const contentText = useMemo(() => {
    // Extract text from HTML content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    return tempDiv.textContent || tempDiv.innerText || ''
  }, [content])

  useEffect(() => {
    if (contentText.length > 50) {
      generateLinkSuggestions()
    }
  }, [contentText])

  const generateLinkSuggestions = async () => {
    setLoading(true)
    try {
      const suggestions = await findLinkOpportunities(contentText, currentPostId)
      setSuggestions(suggestions.slice(0, 10)) // Limit to 10 suggestions
    } catch (error) {
      console.error('Error generating link suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLink = (suggestion: LinkSuggestion) => {
    onSuggestLink(suggestion.text, suggestion.url, suggestion.title)
    // Remove this suggestion after using it
    setSuggestions(prev => prev.filter(s => s !== suggestion))
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link2 className="w-5 h-5 text-green-600" />
          Link Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Finding link opportunities...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              No link suggestions available. Add more content to see opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={
                        suggestion.type === 'visa-service' ? 'bg-blue-50 text-blue-700' :
                        suggestion.type === 'blog-post' ? 'bg-green-50 text-green-700' :
                        'bg-gray-50 text-gray-700'
                      }>
                        {suggestion.type === 'visa-service' ? 'Service' :
                         suggestion.type === 'blog-post' ? 'Article' : 'Page'}
                      </Badge>
                      {suggestion.category && (
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate" title={suggestion.title}>
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Anchor: "{suggestion.text}"
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAddLink(suggestion)}
                    className="ml-2 flex-shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {suggestions.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">
                  💡 Click the link icon to automatically add internal links to your content.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mock function - in a real implementation, this would query your database
async function findLinkOpportunities(contentText: string, currentPostId?: string): Promise<LinkSuggestion[]> {
  const suggestions: LinkSuggestion[] = []
  
  // Common visa-related keywords to look for
  const visaKeywords = [
    { keyword: 'tourist visa', url: '/visa/us/tourist', title: 'US Tourist Visa Application', type: 'visa-service' as const },
    { keyword: 'schengen visa', url: '/visa/schengen/tourist', title: 'Schengen Visa Application', type: 'visa-service' as const },
    { keyword: 'student visa', url: '/visa/uk/student', title: 'UK Student Visa Application', type: 'visa-service' as const },
    { keyword: 'work visa', url: '/visa/canada/work', title: 'Canada Work Visa Application', type: 'visa-service' as const },
    { keyword: 'visa application', url: '/', title: 'Professional Visa Services', type: 'page' as const },
    { keyword: 'visa requirements', url: '/resources/document-guides', title: 'Visa Requirements Guide', type: 'blog-post' as const, category: 'document-guides' },
    { keyword: 'passport renewal', url: '/resources/document-guides/passport-renewal-indonesia', title: 'Indonesian Passport Renewal Guide', type: 'blog-post' as const, category: 'document-guides' },
    { keyword: 'bank statement', url: '/resources/document-guides/bank-statements-visa', title: 'Bank Statement Requirements for Visa', type: 'blog-post' as const, category: 'document-guides' },
    { keyword: 'visa interview', url: '/resources/travel-tips/visa-interview-tips', title: 'Visa Interview Tips and Preparation', type: 'blog-post' as const, category: 'travel-tips' },
    { keyword: 'living in australia', url: '/resources/country-guides/living-in-australia', title: 'Complete Guide to Living in Australia', type: 'blog-post' as const, category: 'country-guides' },
    { keyword: 'studying in uk', url: '/resources/country-guides/studying-in-uk', title: 'Study in UK: Complete Guide for Indonesians', type: 'blog-post' as const, category: 'country-guides' },
    { keyword: 'working in germany', url: '/resources/country-guides/working-in-germany', title: 'Working in Germany: Opportunities and Requirements', type: 'blog-post' as const, category: 'country-guides' }
  ]
  
  const lowerContent = contentText.toLowerCase()
  
  // Find keyword matches in content
  for (const item of visaKeywords) {
    if (lowerContent.includes(item.keyword.toLowerCase())) {
      // Find the exact text match for anchor text
      const regex = new RegExp(`\\b${item.keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi')
      const match = contentText.match(regex)
      
      if (match) {
        suggestions.push({
          text: match[0],
          url: item.url,
          title: item.title,
          type: item.type,
          category: item.category
        })
      }
    }
  }
  
  // Remove duplicates and sort by relevance
  const uniqueSuggestions = suggestions.reduce((acc, current) => {
    const exists = acc.find(item => item.url === current.url)
    if (!exists) {
      acc.push(current)
    }
    return acc
  }, [] as LinkSuggestion[])
  
  // Prioritize visa services, then blog posts, then pages
  return uniqueSuggestions.sort((a, b) => {
    const priority = { 'visa-service': 3, 'blog-post': 2, 'page': 1 }
    return priority[b.type] - priority[a.type]
  })
}