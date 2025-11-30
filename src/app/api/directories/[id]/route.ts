import { NextRequest, NextResponse } from 'next/server'
import { getDirectoryById, updateDirectory, deleteDirectory } from '@/lib/firestore/directories'

interface RouteParams {
  params: { id: string }
}

// GET single directory
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const directory = await getDirectoryById(params.id)
    
    if (!directory) {
      return NextResponse.json(
        { success: false, error: 'Directory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, directory })
  } catch (error) {
    console.error('Failed to fetch directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch directory' },
      { status: 500 }
    )
  }
}

// PUT update directory
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    
    await updateDirectory(params.id, body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update directory' },
      { status: 500 }
    )
  }
}

// DELETE directory
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteDirectory(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete directory' },
      { status: 500 }
    )
  }
}
