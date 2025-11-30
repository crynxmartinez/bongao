import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import bcrypt from 'bcryptjs'

// GET all municipal admins
export async function GET() {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'MUNICIPAL_ADMIN')
    )
    const snapshot = await getDocs(q)
    
    const admins = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        municipalityId: data.municipalityId,
        username: data.username,
        email: data.email,
        name: data.name,
      }
    })

    return NextResponse.json({ success: true, admins })
  } catch (error) {
    console.error('Failed to fetch municipal admins:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch municipal admins' },
      { status: 500 }
    )
  }
}

// POST create new municipal admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.municipalityId || !body.username || !body.password || !body.email || !body.name) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const usernameQuery = query(
      collection(db, 'users'),
      where('username', '==', body.username)
    )
    const usernameSnapshot = await getDocs(usernameQuery)
    if (!usernameSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Check if municipality already has an admin
    const municipalityQuery = query(
      collection(db, 'users'),
      where('municipalityId', '==', body.municipalityId),
      where('role', '==', 'MUNICIPAL_ADMIN')
    )
    const municipalitySnapshot = await getDocs(municipalityQuery)
    if (!municipalitySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'This municipality already has an admin' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Create admin user
    const docRef = await addDoc(collection(db, 'users'), {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      name: body.name,
      role: 'MUNICIPAL_ADMIN',
      municipalityId: body.municipalityId,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      message: 'Municipal admin created successfully'
    })
  } catch (error) {
    console.error('Failed to create municipal admin:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create municipal admin' },
      { status: 500 }
    )
  }
}
