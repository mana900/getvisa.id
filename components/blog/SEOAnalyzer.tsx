"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react'

interface SEOAnalysis {
  wordCount: number
  keywordDensity: number
  internalLinks: number
  headingStructure: {
    h1: number
    h2: number
    h3: number
    hasH1: boolean
  }
  imageAltTags: {
    total: number
    withAlt: number
    missing: number
  }
  readabilityScore: number
}

interface SEOAnalyzerProps {
  content: string
  title: string
  keywords: string[]
  metaDescription?: string
}

export function SEOAnalyzer({ content, title, keywords, metaDescription }: SEOAnalyzerProps) {
  const analysis = useMemo(() => {
    return analyzeSEOContent(content, title, keywords, metaDescription)
  }, [content, title, keywords, metaDescription])

  const seoScore = calculateSEOScore(analysis, title, keywords, metaDescription)

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="w-5 h-5 text-blue-600" />
          SEO Analysis
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <Badge variant={seoScore >= 80 ? 'default' : seoScore >= 60 ? 'secondary' : 'destructive'}>
              {seoScore}/100
            </Badge>
          </div>
          <Progress value={seoScore} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SEOCheck 
          label="Word Count" 
          status={analysis.wordCount >= 300 ? 'good' : 'warning'}
          message={`${analysis.wordCount} words`}
          description={analysis.wordCount < 300 ? "Aim for at least 300 words for better SEO" : "Good word count for SEO"}
        />
        
        {keywords.length > 0 && (
          <SEOCheck 
            label="Keyword Density" 
            status={analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 3 ? 'good' : 'warning'}
            message={`${analysis.keywordDensity.toFixed(1)}% for main keyword`}
            description={
              analysis.keywordDensity < 0.5 
                ? "Consider using your main keyword more frequently" 
                : analysis.keywordDensity > 3 
                ? "Keyword density might be too high - avoid keyword stuffing"
                : "Good keyword density"
            }
          />
        )}
        
        <SEOCheck 
          label="Heading Structure" 
          status={analysis.headingStructure.h2 > 0 ? 'good' : 'warning'}
          message={`H2: ${analysis.headingStructure.h2}, H3: ${analysis.headingStructure.h3} (Title serves as H1)`}
          description={
            analysis.headingStructure.h2 === 0
              ? "Consider adding H2 subheadings to structure your content"
              : "Good heading structure with proper hierarchy"
          }
        />
        
        <SEOCheck 
          label="Title Length" 
          status={title.length >= 30 && title.length <= 60 ? 'good' : 'warning'}
          message={`${title.length} characters`}
          description={
            title.length < 30 
              ? "Title is too short - aim for 30-60 characters"
              : title.length > 60
              ? "Title might be too long - keep it under 60 characters"
              : "Good title length for search results"
          }
        />
        
        {metaDescription && (
          <SEOCheck 
            label="Meta Description" 
            status={metaDescription.length >= 120 && metaDescription.length <= 160 ? 'good' : 'warning'}
            message={`${metaDescription.length} characters`}
            description={
              metaDescription.length < 120 
                ? "Meta description is too short - aim for 120-160 characters"
                : metaDescription.length > 160
                ? "Meta description is too long - keep it under 160 characters"
                : "Good meta description length"
            }
          />
        )}
        
        {analysis.imageAltTags.total > 0 && (
          <SEOCheck 
            label="Image Alt Tags" 
            status={analysis.imageAltTags.missing === 0 ? 'good' : 'warning'}
            message={`${analysis.imageAltTags.withAlt}/${analysis.imageAltTags.total} images have alt text`}
            description={
              analysis.imageAltTags.missing > 0 
                ? `Add alt text to ${analysis.imageAltTags.missing} image${analysis.imageAltTags.missing > 1 ? 's' : ''}`
                : "All images have alt text"
            }
          />
        )}
        
        <SEOCheck 
          label="Readability" 
          status={analysis.readabilityScore >= 60 ? 'good' : 'warning'}
          message={`${analysis.readabilityScore} Flesch score`}
          description={
            analysis.readabilityScore >= 90 ? "Very easy to read"
            : analysis.readabilityScore >= 80 ? "Easy to read"
            : analysis.readabilityScore >= 70 ? "Fairly easy to read"  
            : analysis.readabilityScore >= 60 ? "Standard readability"
            : analysis.readabilityScore >= 50 ? "Fairly difficult to read"
            : "Difficult to read - consider simplifying"
          }
        />
      </CardContent>
    </Card>
  )
}

interface SEOCheckProps {
  label: string
  status: 'good' | 'warning' | 'error'
  message: string
  description?: string
}

function SEOCheck({ label, status, message, description }: SEOCheckProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-2">
          {getStatusIcon()}
          {label}
        </span>
      </div>
      <div className="text-xs text-gray-600">
        <div className="font-medium">{message}</div>
        {description && <div className="mt-1 text-gray-500">{description}</div>}
      </div>
    </div>
  )
}

function analyzeSEOContent(content: string, title: string, keywords: string[], metaDescription?: string): SEOAnalysis {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  
  // Extract text content for analysis
  const textContent = tempDiv.textContent || tempDiv.innerText || ''
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
  
  // Analyze keyword density
  let keywordDensity = 0
  if (keywords.length > 0 && words.length > 0) {
    const mainKeyword = keywords[0].toLowerCase()
    const keywordMatches = textContent.toLowerCase().split(mainKeyword).length - 1
    keywordDensity = (keywordMatches / words.length) * 100
  }
  
  // Analyze headings
  const h1Elements = tempDiv.querySelectorAll('h1')
  const h2Elements = tempDiv.querySelectorAll('h2')
  const h3Elements = tempDiv.querySelectorAll('h3')
  
  // Analyze images
  const images = tempDiv.querySelectorAll('img')
  const totalImages = images.length
  const imagesWithAlt = Array.from(images).filter(img => img.getAttribute('alt')).length
  
  // Calculate readability (simplified Flesch Reading Ease)
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const syllables = countSyllables(textContent)
  const readabilityScore = sentences > 0 && words.length > 0 
    ? 206.835 - (1.015 * (words.length / sentences)) - (84.6 * (syllables / words.length))
    : 0

  return {
    wordCount: words.length,
    keywordDensity,
    internalLinks: tempDiv.querySelectorAll('a').length, // Simplified
    headingStructure: {
      h1: h1Elements.length,
      h2: h2Elements.length,
      h3: h3Elements.length,
      hasH1: h1Elements.length > 0
    },
    imageAltTags: {
      total: totalImages,
      withAlt: imagesWithAlt,
      missing: totalImages - imagesWithAlt
    },
    readabilityScore: Math.max(0, Math.min(100, readabilityScore))
  }
}

function calculateSEOScore(analysis: SEOAnalysis, title: string, keywords: string[], metaDescription?: string): number {
  let score = 0
  
  // Word count (20 points)
  if (analysis.wordCount >= 300) score += 20
  else if (analysis.wordCount >= 150) score += 15
  else if (analysis.wordCount >= 100) score += 10
  else score += 5
  
  // Keyword density (20 points)
  if (keywords.length > 0) {
    if (analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 3) score += 20
    else if (analysis.keywordDensity > 0) score += 10
  }
  
  // Title length (15 points)
  if (title.length >= 30 && title.length <= 60) score += 15
  else if (title.length >= 20 && title.length <= 80) score += 10
  else score += 5
  
  // Meta description (15 points)
  if (metaDescription) {
    if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 15
    else if (metaDescription.length >= 100 && metaDescription.length <= 180) score += 10
    else score += 5
  }
  
  // Heading structure (15 points) - Title serves as H1, so we focus on H2+ structure
  if (analysis.headingStructure.h2 > 0) score += 15
  else score += 5 // Some points even without subheadings
  
  // Image alt tags (10 points)
  if (analysis.imageAltTags.total === 0) score += 10 // No images is fine
  else if (analysis.imageAltTags.missing === 0) score += 10
  else if (analysis.imageAltTags.withAlt > 0) score += 5
  
  // Readability (5 points)
  if (analysis.readabilityScore >= 60) score += 5
  else if (analysis.readabilityScore >= 40) score += 3
  
  return Math.min(100, score)
}

function countSyllables(text: string): number {
  // Simplified syllable counting
  const words = text.toLowerCase().split(/\s+/)
  let syllableCount = 0
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '')
    if (cleanWord.length === 0) continue
    
    // Count vowel groups
    const vowelMatches = cleanWord.match(/[aeiouy]+/g)
    let syllables = vowelMatches ? vowelMatches.length : 1
    
    // Subtract silent e
    if (cleanWord.endsWith('e')) syllables--
    
    // Ensure at least 1 syllable
    syllableCount += Math.max(1, syllables)
  }
  
  return syllableCount
}