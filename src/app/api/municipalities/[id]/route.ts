import { NextRequest, NextResponse } from 'next/server'
import { getMunicipalityById, updateMunicipality, deleteMunicipality } from '@/lib/firestore/municipalities'

interface RouteParams {
  params: { id: string }
}

// GET single municipality
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const municipality = await getMunicipalityById(params.id)
    
    if (!municipality) {
      return NextResponse.json(
        { success: false, error: 'Municipality not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, municipality })
  } catch (error) {
    console.error('Failed to fetch municipality:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch municipality' },
      { status: 500 }
    )
  }
}

// PUT update municipality
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()
    await updateMunicipality(params.id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update municipality:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update municipality' },
      { status: 500 }
    )
  }
}

// DELETE municipality
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await deleteMunicipality(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete municipality:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete municipality' },
      { status: 500 }
    )
  }
}
