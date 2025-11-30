import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { getUserByUsername, updateLastLogin } from '@/lib/firestore/users'
import type { User, Session } from '@/types'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const COOKIE_NAME = 'tawi-tawi-session'

// ============================================
// PASSWORD HASHING
// ============================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// ============================================
// JWT TOKEN MANAGEMENT
// ============================================

export async function createToken(user: Omit<User, 'password'>): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  
  return token
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as Session
  } catch {
    return null
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export async function createSession(user: Omit<User, 'password'>): Promise<void> {
  const token = await createToken(user)
  const cookieStore = await cookies()
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// ============================================
// LOGIN / LOGOUT
// ============================================

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string; user?: Omit<User, 'password'> }> {
  try {
    const user = await getUserByUsername(username)
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    if (!user.isActive) {
      return { success: false, error: 'Account is disabled' }
    }
    
    const isValid = await verifyPassword(password, user.password || '')
    
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    // Update last login
    await updateLastLogin(user.id)
    
    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    
    // Create session
    await createSession(userWithoutPassword)
    
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logout(): Promise<void> {
  await destroySession()
}

// ============================================
// AUTH CHECK HELPERS
// ============================================

export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

export async function requireRole(allowedRoles: User['role'][]): Promise<Session> {
  const session = await requireAuth()
  
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Forbidden')
  }
  
  return session
}

export function canAccessMunicipality(session: Session, municipalityId: string): boolean {
  if (session.user.role === 'SUPER_ADMIN' || session.user.role === 'PROVINCIAL_ADMIN') {
    return true
  }
  
  if (session.user.role === 'MUNICIPAL_ADMIN') {
    return session.user.municipalityId === municipalityId
  }
  
  return false
}
