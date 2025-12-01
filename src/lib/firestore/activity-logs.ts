import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ActivityLog {
  id: string
  action: string
  entityType: 'profile' | 'news' | 'municipality' | 'directory' | 'gazette' | 'user'
  entityId: string
  entityName: string
  userId: string
  userName: string
  createdAt: Date
}

const COLLECTION = 'activity_logs'

export async function getRecentActivityLogs(limitCount = 10): Promise<ActivityLog[]> {
  try {
    // Simple query - just get all and sort in memory to avoid index requirement
    const snapshot = await getDocs(collection(db, COLLECTION))
    let results = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      }
    }) as ActivityLog[]
    
    // Sort by date (newest first) in memory
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    
    return results.slice(0, limitCount)
  } catch (error) {
    console.error('Failed to fetch activity logs:', error)
    return []
  }
}

export async function logActivity(
  action: string,
  entityType: ActivityLog['entityType'],
  entityId: string,
  entityName: string,
  userId: string,
  userName: string
): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTION), {
      action,
      entityType,
      entityId,
      entityName,
      userId,
      userName,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
