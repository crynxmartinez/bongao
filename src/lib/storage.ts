import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { generateId } from '@/lib/utils'

// ============================================
// FILE UPLOAD
// ============================================

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const fileExtension = file.name.split('.').pop()
  const fileName = `${generateId()}.${fileExtension}`
  const fullPath = `${path}/${fileName}`
  
  const storageRef = ref(storage, fullPath)
  await uploadBytes(storageRef, file)
  
  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}

export async function uploadProfileImage(
  file: File,
  profileId: string
): Promise<string> {
  return uploadFile(file, `profiles/${profileId}`)
}

export async function uploadMunicipalityImage(
  file: File,
  municipalitySlug: string
): Promise<string> {
  return uploadFile(file, `municipalities/${municipalitySlug}`)
}

export async function uploadDirectoryImage(
  file: File,
  directoryId: string
): Promise<string> {
  return uploadFile(file, `directories/${directoryId}`)
}

export async function uploadNewsImage(
  file: File,
  newsId: string
): Promise<string> {
  return uploadFile(file, `news/${newsId}`)
}

export async function uploadGazetteFile(
  file: File,
  year: number
): Promise<string> {
  return uploadFile(file, `gazette/${year}`)
}

// ============================================
// FILE DELETE
// ============================================

export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract path from URL
    const decodedUrl = decodeURIComponent(url)
    const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/)
    
    if (pathMatch && pathMatch[1]) {
      const filePath = pathMatch[1]
      const storageRef = ref(storage, filePath)
      await deleteObject(storageRef)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// ============================================
// LIST FILES
// ============================================

export async function listFiles(path: string): Promise<string[]> {
  const storageRef = ref(storage, path)
  const result = await listAll(storageRef)
  
  const urls = await Promise.all(
    result.items.map((itemRef) => getDownloadURL(itemRef))
  )
  
  return urls
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  return imageExtensions.includes(getFileExtension(filename))
}

export function isPDFFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
