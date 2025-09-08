// Auto-generate SEO fields from content

export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and HTML tags
  const cleanText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Remove links, keep text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  // Get first meaningful sentence or paragraph
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0)
  let excerpt = sentences[0]?.trim() || ''

  // If first sentence is too short, add more
  if (excerpt.length < 80 && sentences.length > 1) {
    excerpt = sentences.slice(0, 2).join('. ') + '.'
  }

  // Truncate if too long
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength - 3) + '...'
  }

  return excerpt || cleanText.substring(0, maxLength - 3) + '...'
}

export function generateMetaTitle(title: string, category: string): string {
  const categoryMap: Record<string, string> = {
    'visa-guides': 'Visa Guide',
    'country-guides': 'Country Guide', 
    'document-guides': 'Document Guide',
    'travel-tips': 'Travel Tips'
  }

  const categoryLabel = categoryMap[category] || 'Guide'
  
  // If title already mentions the category, don't add it
  const lowerTitle = title.toLowerCase()
  const lowerCategory = categoryLabel.toLowerCase()
  
  if (lowerTitle.includes(lowerCategory) || lowerTitle.includes(category.replace('-', ' '))) {
    return `${title} | GetVisa.ID`
  }
  
  return `${title} - ${categoryLabel} | GetVisa.ID`
}

export function generateMetaDescription(excerpt: string, category: string): string {
  const categoryMap: Record<string, string> = {
    'visa-guides': 'Complete visa application guide',
    'country-guides': 'Everything you need to know about living, working, or studying abroad', 
    'document-guides': 'Step-by-step document preparation guide',
    'travel-tips': 'Expert travel advice for Indonesian travelers'
  }

  const prefix = categoryMap[category] || 'Expert guide'
  
  // If excerpt is too short, enhance it
  if (excerpt.length < 120) {
    return `${prefix}: ${excerpt} Get professional visa assistance from GetVisa.ID.`
  }
  
  return excerpt
}

export function extractKeywords(title: string, content: string, category: string): string[] {
  const keywords = new Set<string>()
  
  // Add category-based keywords
  const categoryKeywords: Record<string, string[]> = {
    'visa-guides': ['visa', 'visa application', 'visa requirements', 'visa process'],
    'country-guides': ['living abroad', 'expat life', 'immigration', 'relocation'],
    'document-guides': ['documents', 'requirements', 'paperwork', 'visa documents'],
    'travel-tips': ['travel', 'travel tips', 'international travel', 'travel advice']
  }
  
  categoryKeywords[category]?.forEach(keyword => keywords.add(keyword))
  
  // Extract keywords from title
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
  
  titleWords.forEach(word => keywords.add(word))
  
  // Extract country names and visa types
  const countries = ['usa', 'united states', 'uk', 'united kingdom', 'canada', 'australia', 'germany', 'france', 'japan', 'singapore', 'schengen']
  const visaTypes = ['tourist', 'student', 'work', 'business', 'transit', 'family']
  
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  
  countries.forEach(country => {
    if (lowerTitle.includes(country) || lowerContent.includes(country)) {
      keywords.add(country)
    }
  })
  
  visaTypes.forEach(type => {
    if (lowerTitle.includes(type) || lowerContent.includes(type)) {
      keywords.add(`${type} visa`)
    }
  })
  
  // Add "indonesian" if not present but implied
  if (lowerContent.includes('indonesia') || lowerTitle.includes('indonesia')) {
    keywords.add('indonesian')
  }
  
  return Array.from(keywords).slice(0, 8) // Limit to 8 keywords
}

export function generateSlug(title: string): string {
  return title
    .trim() // Remove leading/trailing whitespace first
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60) // Limit length
    .replace(/-$/, '') // Remove trailing hyphen after substring
}

export function autoGenerateFields(
  title: string, 
  content: string, 
  category: string
) {
  return {
    excerpt: generateExcerpt(content),
    metaTitle: generateMetaTitle(title, category),
    metaDescription: generateMetaDescription(generateExcerpt(content), category),
    keywords: extractKeywords(title, content, category),
    slug: generateSlug(title)
  }
}