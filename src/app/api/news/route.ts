import { NextRequest, NextResponse } from 'next/server'
import { getProvincialNews, createNews } from '@/lib/firestore/news'

// GET all news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publishedOnly = searchParams.get('published') !== 'false'
    
    const news = await getProvincialNews(publishedOnly)
    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// POST create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.bannerImage || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title, banner image, and content are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100)
    }

    // Generate excerpt if not provided
    if (!body.excerpt) {
      // Strip HTML and get first 160 characters
      const plainText = body.content.replace(/<[^>]*>/g, '')
      body.excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '')
    }

    const id = await createNews({
      ...body,
      featured: body.featured ?? false,
      published: body.published ?? false,
      publishedAt: body.published ? new Date().toISOString() : null,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Failed to create news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
