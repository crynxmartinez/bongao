import { NextRequest, NextResponse } from 'next/server'
import { getNewsById, updateNews, deleteNews, toggleFeatured } from '@/lib/firestore/news'

interface RouteParams {
  params: { id: string }
}

// GET single news
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const news = await getNewsById(params.id)
    
    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, news })
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// PUT update news
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    // If updating content, regenerate excerpt
    if (body.content && !body.excerpt) {
      const plainText = body.content.replace(/<[^>]*>/g, '')
      body.excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '')
    }

    await updateNews(params.id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

// PATCH toggle featured
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    if (typeof body.featured === 'boolean') {
      await toggleFeatured(params.id, body.featured)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle featured' },
      { status: 500 }
    )
  }
}

// DELETE news
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteNews(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
