import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User } from '@/types'

const COLLECTION = 'users'

// ============================================
// USER CRUD
// ============================================

export async function getUsers(): Promise<Omit<User, 'password'>[]> {
  const snapshot = await getDocs(collection(db, COLLECTION))
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = data
    return {
      id: doc.id,
      ...rest,
    }
  }) as Omit<User, 'password'>[]
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as User
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const q = query(collection(db, COLLECTION), where('username', '==', username), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, COLLECTION), where('email', '==', email), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as User
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function updateLastLogin(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    lastLogin: Timestamp.now(),
  })
}

export async function deleteUser(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}
