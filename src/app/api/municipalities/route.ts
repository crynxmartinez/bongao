import { NextRequest, NextResponse } from 'next/server'
import { getMunicipalities, createMunicipality } from '@/lib/firestore/municipalities'

// GET all municipalities
export async function GET() {
  try {
    const municipalities = await getMunicipalities()
    return NextResponse.json({ success: true, municipalities })
  } catch (error) {
    console.error('Failed to fetch municipalities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch municipalities' },
      { status: 500 }
    )
  }
}

// POST create new municipality
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const id = await createMunicipality({
      ...body,
      isActive: body.isActive ?? true,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Failed to create municipality:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create municipality' },
      { status: 500 }
    )
  }
}
