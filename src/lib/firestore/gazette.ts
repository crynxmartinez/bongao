import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Gazette } from '@/types'

const COLLECTION = 'gazette'

// ============================================
// GAZETTE CRUD
// ============================================

export async function getGazettes(): Promise<Gazette[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('year', 'desc'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Gazette[]
}

export async function getGazettesByYear(year: number): Promise<Gazette[]> {
  const q = query(
    collection(db, COLLECTION),
    where('year', '==', year),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Gazette[]
}

export async function getGazettesByType(type: Gazette['type']): Promise<Gazette[]> {
  const q = query(
    collection(db, COLLECTION),
    where('type', '==', type),
    orderBy('year', 'desc'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Gazette[]
}

export async function getGazetteById(id: string): Promise<Gazette | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Gazette
}

export async function createGazette(data: Omit<Gazette, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function deleteGazette(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

// Get unique years for filtering
export async function getGazetteYears(): Promise<number[]> {
  const gazettes = await getGazettes()
  const years = [...new Set(gazettes.map((g) => g.year))]
  return years.sort((a, b) => b - a)
}
