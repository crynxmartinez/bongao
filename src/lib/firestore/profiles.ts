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
import type { Profile, Position, Achievement, Education, ProfileImage } from '@/types'

const COLLECTION = 'profiles'

// ============================================
// PROFILE CRUD
// ============================================

export async function getProfiles(): Promise<Profile[]> {
  const q = query(
    collection(db, COLLECTION),
    where('isActive', '==', true),
    orderBy('lastName', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Profile[]
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const docRef = doc(db, COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Profile
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Profile
}

export async function createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateProfile(id: string, data: Partial<Profile>): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteProfile(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

// ============================================
// POSITIONS SUBCOLLECTION
// ============================================

export async function getPositions(profileId: string): Promise<Position[]> {
  const q = query(
    collection(db, COLLECTION, profileId, 'positions'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    profileId,
    ...doc.data(),
  })) as Position[]
}

export async function addPosition(profileId: string, data: Omit<Position, 'id' | 'profileId' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, profileId, 'positions'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updatePosition(profileId: string, positionId: string, data: Partial<Position>): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'positions', positionId)
  await updateDoc(docRef, data)
}

export async function deletePosition(profileId: string, positionId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'positions', positionId)
  await deleteDoc(docRef)
}

// ============================================
// ACHIEVEMENTS SUBCOLLECTION
// ============================================

export async function getAchievements(profileId: string): Promise<Achievement[]> {
  const q = query(
    collection(db, COLLECTION, profileId, 'achievements'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    profileId,
    ...doc.data(),
  })) as Achievement[]
}

export async function addAchievement(profileId: string, data: Omit<Achievement, 'id' | 'profileId' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, profileId, 'achievements'), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function updateAchievement(profileId: string, achievementId: string, data: Partial<Achievement>): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'achievements', achievementId)
  await updateDoc(docRef, data)
}

export async function deleteAchievement(profileId: string, achievementId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'achievements', achievementId)
  await deleteDoc(docRef)
}

// ============================================
// EDUCATION SUBCOLLECTION
// ============================================

export async function getEducation(profileId: string): Promise<Education[]> {
  const q = query(
    collection(db, COLLECTION, profileId, 'education'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    profileId,
    ...doc.data(),
  })) as Education[]
}

export async function addEducation(profileId: string, data: Omit<Education, 'id' | 'profileId'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, profileId, 'education'), data)
  return docRef.id
}

export async function updateEducation(profileId: string, educationId: string, data: Partial<Education>): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'education', educationId)
  await updateDoc(docRef, data)
}

export async function deleteEducation(profileId: string, educationId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'education', educationId)
  await deleteDoc(docRef)
}

// ============================================
// GALLERY SUBCOLLECTION
// ============================================

export async function getGallery(profileId: string): Promise<ProfileImage[]> {
  const q = query(
    collection(db, COLLECTION, profileId, 'gallery'),
    orderBy('order', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    profileId,
    ...doc.data(),
  })) as ProfileImage[]
}

export async function addGalleryImage(profileId: string, data: Omit<ProfileImage, 'id' | 'profileId'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION, profileId, 'gallery'), data)
  return docRef.id
}

export async function deleteGalleryImage(profileId: string, imageId: string): Promise<void> {
  const docRef = doc(db, COLLECTION, profileId, 'gallery', imageId)
  await deleteDoc(docRef)
}
