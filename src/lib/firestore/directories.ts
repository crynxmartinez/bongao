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
import type { Directory, DirectoryPerson } from '@/types'

const COLLECTION = 'directories'

// ============================================
// DIRECTORY CRUD
// ============================================

export async function getDirectories(): Promise<Directory[]> {
  const q = query(
    collection(db, COLLECTION),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Directory[]
}

export async function getDirectoriesByCategory(category: Directory['category']): Promise<Directory[]> {
  const q = query(
    collection(db, COLLECTION),
    where('isActive', '==', true),
    where('category', '==', category),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Directory[]
}

export async function getDirectoryById(id: string): Promise<Directory | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Directory
}

export async function getDirectoryBySlug(slug: string): Promise<Directory | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Directory
}

export async function createDirectory(data: Omit<Directory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateDirectory(id: string, data: Partial<Directory>): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteDirectory(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

// ============================================
// DIRECTORY PEOPLE SUBCOLLECTION
// ============================================

export async function getDirectoryPeople(directoryId: string): Promise<DirectoryPerson[]> {
  const q = query(
    collection(db, COLLECTION, directoryId, 'people'),
    where('isActive', '==', true),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    directoryId,
    ...doc.data(),
  })) as DirectoryPerson[]
}

export async function addDirectoryPerson(
  directoryId: string,
  data: Omit<DirectoryPerson, 'id' | 'directoryId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, directoryId, 'people'), data)
  return docRef.id
}

export async function updateDirectoryPerson(
  directoryId: string,
  personId: string,
  data: Partial<DirectoryPerson>
): Promise<void> {
  const docRef = doc(db, COLLECTION, directoryId, 'people', personId)
  await updateDoc(docRef, data)
}

export async function deleteDirectoryPerson(directoryId: string, personId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, directoryId, 'people', personId)
  await deleteDoc(docRef)
}
