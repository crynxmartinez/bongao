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
import type {
  Municipality,
  MunicipalityOfficial,
  Barangay,
  MunicipalityService,
  TourismSpot,
  MunicipalityNews,
  MunicipalityImage,
} from '@/types'

const COLLECTION = 'municipalities'

// ============================================
// MUNICIPALITY CRUD
// ============================================

export async function getMunicipalities(): Promise<Municipality[]> {
  // Simple query without compound index requirement
  const snapshot = await getDocs(collection(db, COLLECTION))
  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Municipality[]
  
  // Filter and sort in memory
  results = results.filter(m => m.isActive !== false)
  results.sort((a, b) => a.name.localeCompare(b.name))
  
  return results
}

export async function getMunicipalityById(id: string): Promise<Municipality | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Municipality
}

export async function getMunicipalityBySlug(slug: string): Promise<Municipality | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, ...docSnap.data() } as Municipality
}

export async function createMunicipality(data: Omit<Municipality, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateMunicipality(id: string, data: Partial<Municipality>): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteMunicipality(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

// ============================================
// OFFICIALS SUBCOLLECTION
// ============================================

export async function getMunicipalityOfficials(municipalityId: string): Promise<MunicipalityOfficial[]> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'officials'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as MunicipalityOfficial[]
}

export async function addMunicipalityOfficial(
  municipalityId: string,
  data: Omit<MunicipalityOfficial, 'id' | 'municipalityId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'officials'), data)
  return docRef.id
}

export async function updateMunicipalityOfficial(
  municipalityId: string,
  officialId: string,
  data: Partial<MunicipalityOfficial>
): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'officials', officialId)
  await updateDoc(docRef, data)
}

export async function deleteMunicipalityOfficial(municipalityId: string, officialId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'officials', officialId)
  await deleteDoc(docRef)
}

// ============================================
// BARANGAYS SUBCOLLECTION
// ============================================

export async function getBarangays(municipalityId: string): Promise<Barangay[]> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'barangays'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as Barangay[]
}

export async function addBarangay(
  municipalityId: string,
  data: Omit<Barangay, 'id' | 'municipalityId' | 'createdAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'barangays'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateBarangay(
  municipalityId: string,
  barangayId: string,
  data: Partial<Barangay>
): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'barangays', barangayId)
  await updateDoc(docRef, data)
}

export async function deleteBarangay(municipalityId: string, barangayId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'barangays', barangayId)
  await deleteDoc(docRef)
}

// ============================================
// SERVICES SUBCOLLECTION
// ============================================

export async function getMunicipalityServices(municipalityId: string): Promise<MunicipalityService[]> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'services'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as MunicipalityService[]
}

export async function addMunicipalityService(
  municipalityId: string,
  data: Omit<MunicipalityService, 'id' | 'municipalityId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'services'), data)
  return docRef.id
}

export async function updateMunicipalityService(
  municipalityId: string,
  serviceId: string,
  data: Partial<MunicipalityService>
): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'services', serviceId)
  await updateDoc(docRef, data)
}

export async function deleteMunicipalityService(municipalityId: string, serviceId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'services', serviceId)
  await deleteDoc(docRef)
}

// ============================================
// TOURISM SUBCOLLECTION
// ============================================

export async function getTourismSpots(municipalityId: string): Promise<TourismSpot[]> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'tourism'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as TourismSpot[]
}

export async function addTourismSpot(
  municipalityId: string,
  data: Omit<TourismSpot, 'id' | 'municipalityId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'tourism'), data)
  return docRef.id
}

export async function updateTourismSpot(
  municipalityId: string,
  spotId: string,
  data: Partial<TourismSpot>
): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'tourism', spotId)
  await updateDoc(docRef, data)
}

export async function deleteTourismSpot(municipalityId: string, spotId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'tourism', spotId)
  await deleteDoc(docRef)
}

// ============================================
// NEWS SUBCOLLECTION
// ============================================

export async function getMunicipalityNews(municipalityId: string, publishedOnly = true): Promise<MunicipalityNews[]> {
  let q = query(
    collection(db, COLLECTION, municipalityId, 'news'),
    orderBy('createdAt', 'desc')
  )
  
  if (publishedOnly) {
    q = query(
      collection(db, COLLECTION, municipalityId, 'news'),
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    )
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as MunicipalityNews[]
}

export async function getMunicipalityNewsBySlug(
  municipalityId: string,
  slug: string
): Promise<MunicipalityNews | null> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'news'),
    where('slug', '==', slug),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const docSnap = snapshot.docs[0]
  return { id: docSnap.id, municipalityId, ...docSnap.data() } as MunicipalityNews
}

export async function addMunicipalityNews(
  municipalityId: string,
  data: Omit<MunicipalityNews, 'id' | 'municipalityId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'news'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateMunicipalityNews(
  municipalityId: string,
  newsId: string,
  data: Partial<MunicipalityNews>
): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'news', newsId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteMunicipalityNews(municipalityId: string, newsId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'news', newsId)
  await deleteDoc(docRef)
}

// ============================================
// GALLERY SUBCOLLECTION
// ============================================

export async function getMunicipalityGallery(municipalityId: string): Promise<MunicipalityImage[]> {
  const q = query(
    collection(db, COLLECTION, municipalityId, 'gallery'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    municipalityId,
    ...doc.data(),
  })) as MunicipalityImage[]
}

export async function addMunicipalityImage(
  municipalityId: string,
  data: Omit<MunicipalityImage, 'id' | 'municipalityId'>
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, municipalityId, 'gallery'), data)
  return docRef.id
}

export async function deleteMunicipalityImage(municipalityId: string, imageId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, municipalityId, 'gallery', imageId)
  await deleteDoc(docRef)
}
