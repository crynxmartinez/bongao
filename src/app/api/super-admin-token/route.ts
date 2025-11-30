import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getSession } from '@/lib/auth'
import { randomBytes } from 'crypto'

// POST generate one-time super admin login token
export async function POST(request: NextRequest) {
  try {
    // Verify current user is super admin
    const session = await getSession()
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!body.municipalityId) {
      return NextResponse.json(
        { success: false, error: 'Municipality ID is required' },
        { status: 400 }
      )
    }

    // Generate random token
    const token = randomBytes(32).toString('hex')
    
    // Store token in Firestore with expiration (5 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)

    await addDoc(collection(db, 'super_admin_tokens'), {
      token,
      municipalityId: body.municipalityId,
      superAdminId: session.user.id,
      superAdminName: session.user.name,
      used: false,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: Timestamp.now(),
    })

    return NextResponse.json({ 
      success: true, 
      token,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Failed to generate super admin token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}
