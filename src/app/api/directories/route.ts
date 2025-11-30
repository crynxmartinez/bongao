import { NextRequest, NextResponse } from 'next/server'
import { getDirectories, createDirectory } from '@/lib/firestore/directories'

// GET all directories
export async function GET() {
  try {
    const directories = await getDirectories()
    return NextResponse.json({ success: true, directories })
  } catch (error) {
    console.error('Failed to fetch directories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch directories' },
      { status: 500 }
    )
  }
}

// POST create new directory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const id = await createDirectory({
      ...body,
      isActive: body.isActive ?? true,
      order: body.order ?? 0,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Failed to create directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create directory' },
      { status: 500 }
    )
  }
}
