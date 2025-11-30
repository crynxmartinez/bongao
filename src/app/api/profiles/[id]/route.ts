import { NextRequest, NextResponse } from 'next/server'
import { getProfileById, updateProfile, deleteProfile } from '@/lib/firestore/profiles'

interface RouteParams {
  params: { id: string }
}

// GET single profile
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const profile = await getProfileById(params.id)
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT update profile
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    await updateProfile(params.id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE profile
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteProfile(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete profile' },
      { status: 500 }
    )
  }
}
