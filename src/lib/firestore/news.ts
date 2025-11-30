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
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ProvincialNews } from '@/types'

const COLLECTION = 'provincial_news'

// ============================================
// PROVINCIAL NEWS CRUD
// ============================================

export async function getProvincialNews(publishedOnly = true): Promise<ProvincialNews[]> {
  let q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  )
  
  if (publishedOnly) {
    q = query(
      collection(db, COLLECTION),
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    )
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProvincialNews[]
}

export async function getFeaturedNews(limitCount = 5): Promise<ProvincialNews[]> {
  const q = query(
    collection(db, COLLECTION),
    where('published', '==', true),
    where('featured', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProvincialNews[]
}

export async function getNewsById(id: string): Promise<ProvincialNews | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as ProvincialNews
}

export async function getNewsBySlug(slug: string): Promise<ProvincialNews | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as ProvincialNews
}

export async function createNews(data: Omit<ProvincialNews, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateNews(id: string, data: Partial<ProvincialNews>): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function publishNews(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    published: true,
    publishedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function unpublishNews(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    published: false,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteNews(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}
