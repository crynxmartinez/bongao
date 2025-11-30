import { NextRequest, NextResponse } from 'next/server'
import { getProfiles, createProfile } from '@/lib/firestore/profiles'

// GET all profiles
export async function GET() {
  try {
    const profiles = await getProfiles()
    return NextResponse.json({ success: true, profiles })
  } catch (error) {
    console.error('Failed to fetch profiles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

// POST create new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, and slug are required' },
        { status: 400 }
      )
    }

    const id = await createProfile({
      ...body,
      isActive: body.isActive ?? true,
    })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Failed to create profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}
