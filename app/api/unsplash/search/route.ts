import { NextRequest, NextResponse } from 'next/server'
import { searchUnsplashImages } from '@/lib/unsplash'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const count = parseInt(searchParams.get('count') || '3')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    console.log(`Searching Unsplash for: "${query}"`)
    const images = await searchUnsplashImages(query, count)
    console.log(`Found ${images.length} images`)

    return NextResponse.json({ images, query })
  } catch (error) {
    console.error('Unsplash API error:', error)
    return NextResponse.json(
      { error: 'Failed to search images' }, 
      { status: 500 }
    )
  }
}