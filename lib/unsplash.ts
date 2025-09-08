interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

interface UnsplashResponse {
  results: UnsplashImage[]
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

// Mock images for development/demo when API key is not available
const getMockImages = (query: string, count: number): UnsplashImage[] => {
  const mockImages: UnsplashImage[] = [
    {
      id: 'mock-1',
      urls: {
        small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
      },
      alt_description: 'Beautiful landscape with mountains and lake',
      description: 'Scenic mountain landscape perfect for travel content',
      user: {
        name: 'Demo User',
        username: 'demouser'
      },
      links: {
        html: 'https://unsplash.com/photos/demo'
      }
    },
    {
      id: 'mock-2', 
      urls: {
        small: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
        regular: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
        full: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'
      },
      alt_description: 'Modern city skyline at sunset',
      description: 'Urban cityscape with skyscrapers',
      user: {
        name: 'Demo User',
        username: 'demouser'
      },
      links: {
        html: 'https://unsplash.com/photos/demo'
      }
    },
    {
      id: 'mock-3',
      urls: {
        small: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
        regular: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', 
        full: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
      },
      alt_description: 'Tropical beach with crystal clear water',
      description: 'Paradise beach destination',
      user: {
        name: 'Demo User',
        username: 'demouser'
      },
      links: {
        html: 'https://unsplash.com/photos/demo'
      }
    }
  ]
  
  return mockImages.slice(0, count)
}

export async function searchUnsplashImages(query: string, count: number = 3): Promise<UnsplashImage[]> {
  // If no API key is configured, return mock images for development
  if (!UNSPLASH_ACCESS_KEY) {
    console.log(`No Unsplash API key configured, returning mock images for query: "${query}"`)
    return getMockImages(query, count)
  }

  try {
    console.log(`Making request to Unsplash API with query: "${query}"`)
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    console.log(`Unsplash API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Unsplash API error response:', errorText)
      // Fallback to mock images on API error
      console.log('Falling back to mock images due to API error')
      return getMockImages(query, count)
    }

    const data: UnsplashResponse = await response.json()
    console.log(`Unsplash API returned ${data.results?.length || 0} results`)
    return data.results || []
  } catch (error) {
    console.error('Error searching Unsplash images:', error)
    // Fallback to mock images on error
    return getMockImages(query, count)
  }
}

export function generateImageSearchQuery(title: string, category: string): string {
  // Extract key terms from title and combine with category
  const cleanTitle = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  const categoryKeywords = {
    'visa-guides': 'passport travel document official',
    'country-guides': 'travel destination landscape culture',
    'document-guides': 'document paper official form',
    'travel-tips': 'travel vacation journey adventure'
  }

  // For country-specific content, extract country name
  const countries = ['australia', 'singapore', 'malaysia', 'thailand', 'japan', 'korea', 'china', 'india', 'usa', 'uk', 'canada', 'germany', 'france', 'italy', 'spain']
  const foundCountry = countries.find(country => cleanTitle.includes(country))
  
  if (foundCountry) {
    return `${foundCountry} travel tourism landmark`
  }
  
  // Use category keywords + first few words of title
  const titleWords = cleanTitle.split(' ').slice(0, 3).join(' ')
  const categoryKeys = categoryKeywords[category as keyof typeof categoryKeywords] || 'travel business'
  
  return `${titleWords} ${categoryKeys}`.trim()
}