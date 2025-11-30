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
  // Simple query without compound index requirement
  const snapshot = await getDocs(collection(db, COLLECTION))
  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Profile[]
  
  // Filter and sort in memory
  results = results.filter(p => p.isActive !== false)
  results.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''))
  
  return results
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

// Position category to URL slug mapping
const POSITION_URL_MAP: Record<string, string> = {
  'GOVERNOR': 'governor',
  'VICE_GOVERNOR': 'vice-governor',
  'BOARD_MEMBER': 'board-member',
  'EX_OFFICIO': 'ex-officio',
  'SP_SECRETARY': 'sp-secretary',
  'DEPARTMENT_HEAD': 'department-head',
  'MAYOR': 'mayor',
  'VICE_MAYOR': 'vice-mayor',
  'COUNCILOR': 'councilor',
  'OTHER': 'other',
}

// Reverse mapping: URL slug to position category
const URL_POSITION_MAP: Record<string, Profile['positionCategory']> = {
  'governor': 'GOVERNOR',
  'vice-governor': 'VICE_GOVERNOR',
  'board-member': 'BOARD_MEMBER',
  'ex-officio': 'EX_OFFICIO',
  'sp-secretary': 'SP_SECRETARY',
  'department-head': 'DEPARTMENT_HEAD',
  'mayor': 'MAYOR',
  'vice-mayor': 'VICE_MAYOR',
  'councilor': 'COUNCILOR',
  'other': 'OTHER',
}

// Positions that should only have one active profile
export const UNIQUE_POSITIONS: Profile['positionCategory'][] = [
  'GOVERNOR',
  'VICE_GOVERNOR',
  'SP_SECRETARY',
]

export function getPositionUrlSlug(category: Profile['positionCategory'] | undefined): string {
  if (!category) return 'other'
  return POSITION_URL_MAP[category] || 'other'
}

export function getPositionFromUrlSlug(urlSlug: string): Profile['positionCategory'] | null {
  return URL_POSITION_MAP[urlSlug] || null
}

export async function getProfileByPositionAndSlug(
  positionUrlSlug: string,
  profileSlug: string
): Promise<Profile | null> {
  const positionCategory = getPositionFromUrlSlug(positionUrlSlug)
  if (!positionCategory) return null

  const allProfiles = await getProfiles()
  const profile = allProfiles.find(
    p => p.positionCategory === positionCategory && p.slug === profileSlug
  )
  
  return profile || null
}

export async function getCurrentGovernor(): Promise<Profile | null> {
  const allProfiles = await getProfiles()
  return allProfiles.find(p => p.positionCategory === 'GOVERNOR') || null
}

export async function getCurrentViceGovernor(): Promise<Profile | null> {
  const allProfiles = await getProfiles()
  return allProfiles.find(p => p.positionCategory === 'VICE_GOVERNOR') || null
}

export async function checkUniquePositionExists(
  category: Profile['positionCategory'],
  excludeId?: string
): Promise<boolean> {
  if (!UNIQUE_POSITIONS.includes(category)) return false
  
  const allProfiles = await getProfiles()
  const existing = allProfiles.find(
    p => p.positionCategory === category && p.id !== excludeId
  )
  
  return !!existing
}

export async function getProfilesByCategory(category: Profile['positionCategory']): Promise<Profile[]> {
  // Simple query without compound index requirement
  const snapshot = await getDocs(collection(db, COLLECTION))
  let results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Profile[]
  
  // Filter and sort in memory
  results = results.filter(p => p.isActive !== false && p.positionCategory === category)
  results.sort((a, b) => (a.positionOrder || 0) - (b.positionOrder || 0))
  
  return results
}

export async function getProvincialOfficials(): Promise<{
  governor: Profile | null
  viceGovernor: Profile | null
  spSecretary: Profile | null
  boardMembersFirst: Profile[]
  boardMembersSecond: Profile[]
  exOfficioMembers: Profile[]
}> {
  const allProfiles = await getProfiles()
  
  return {
    governor: allProfiles.find(p => p.positionCategory === 'GOVERNOR') || null,
    viceGovernor: allProfiles.find(p => p.positionCategory === 'VICE_GOVERNOR') || null,
    spSecretary: allProfiles.find(p => p.positionCategory === 'SP_SECRETARY') || null,
    boardMembersFirst: allProfiles
      .filter(p => p.positionCategory === 'BOARD_MEMBER' && p.district === 'FIRST')
      .sort((a, b) => (a.positionOrder || 0) - (b.positionOrder || 0)),
    boardMembersSecond: allProfiles
      .filter(p => p.positionCategory === 'BOARD_MEMBER' && p.district === 'SECOND')
      .sort((a, b) => (a.positionOrder || 0) - (b.positionOrder || 0)),
    exOfficioMembers: allProfiles
      .filter(p => p.positionCategory === 'EX_OFFICIO')
      .sort((a, b) => (a.positionOrder || 0) - (b.positionOrder || 0)),
  }
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
