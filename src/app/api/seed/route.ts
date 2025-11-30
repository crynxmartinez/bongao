import { NextResponse } from 'next/server'
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { hashPassword } from '@/lib/auth'

// This endpoint creates the initial admin user
// Should only be run once during initial setup
// All other data should be added through the CMS
export async function GET() {
  try {
    // Check if users already exist
    const usersSnapshot = await getDocs(collection(db, 'users'))
    if (!usersSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists.',
      })
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123')
    await addDoc(collection(db, 'users'), {
      username: 'admin',
      email: 'admin@tawi-tawi.gov.ph',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'SUPER_ADMIN',
      municipalityId: null,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully. Please change the password after first login.',
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
