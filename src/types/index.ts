// ============================================
// PROFILE TYPES
// ============================================

export interface Profile {
  id: string
  slug: string
  
  // Personal Info
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  nickname?: string
  
  // Bio
  fullBio?: string
  shortBio?: string
  birthDate?: Date | string
  birthPlace?: string
  
  // Images
  profileImage?: string
  coverImage?: string
  
  // Contact
  email?: string
  phone?: string
  facebook?: string
  twitter?: string
  instagram?: string
  
  // Current Position (for quick display)
  currentPosition?: string
  currentOrganization?: string
  
  // Position Category (for filtering/grouping)
  positionCategory?: 'GOVERNOR' | 'VICE_GOVERNOR' | 'BOARD_MEMBER' | 'EX_OFFICIO' | 'SP_SECRETARY' | 'DEPARTMENT_HEAD' | 'MAYOR' | 'VICE_MAYOR' | 'COUNCILOR' | 'OTHER'
  district?: 'FIRST' | 'SECOND'
  municipalitySlug?: string  // For municipal officials (bongao, mapun, sibutu, etc.)
  positionOrder?: number
  
  // Metadata
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Position {
  id: string
  profileId: string
  title: string
  organization: string
  level: 'PROVINCIAL' | 'MUNICIPAL' | 'BARANGAY' | 'NATIONAL'
  district?: string
  municipalityId?: string
  startDate?: Date | string
  endDate?: Date | string
  isCurrent: boolean
  order: number
  createdAt: Date | string
}

export interface Achievement {
  id: string
  profileId: string
  title: string
  description?: string
  year?: number
  date?: Date | string
  category?: string
  image?: string
  order: number
  createdAt: Date | string
}

export interface Education {
  id: string
  profileId: string
  degree: string
  school: string
  year?: number
  honors?: string
  order: number
}

export interface ProfileImage {
  id: string
  profileId: string
  url: string
  caption?: string
  order: number
}

// ============================================
// MUNICIPALITY TYPES
// ============================================

export interface Municipality {
  id: string
  name: string
  slug: string
  tagline?: string
  description?: string
  history?: string
  etymology?: string
  
  // Branding
  logo?: string
  heroImage?: string
  primaryColor?: string
  secondaryColor?: string
  
  // Contact
  email?: string
  phone?: string
  address?: string
  
  // Location
  latitude?: number
  longitude?: number
  
  // Classification
  incomeClass?: string
  district?: string
  landArea?: string
  population?: number
  
  // Mayor
  mayorProfileId?: string
  
  // Settings
  settings?: MunicipalitySettings
  
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface MunicipalitySettings {
  showTourism: boolean
  showNews: boolean
  showServices: boolean
  showBarangays: boolean
  heroTitle?: string
  heroSubtitle?: string
  metaTitle?: string
  metaDescription?: string
}

export interface MunicipalityOfficial {
  id: string
  municipalityId: string
  profileId: string
  position: string
  order: number
  isCurrent: boolean
}

export interface Barangay {
  id: string
  municipalityId: string
  name: string
  captainName?: string
  captainProfileId?: string
  population?: number
  order: number
  createdAt: Date | string
}

export interface MunicipalityService {
  id: string
  municipalityId: string
  name: string
  description?: string
  requirements?: string
  process?: string
  fee?: string
  icon?: string
  order: number
}

export interface TourismSpot {
  id: string
  municipalityId: string
  name: string
  description?: string
  image?: string
  images?: string[]
  category?: string
  order: number
}

export interface MunicipalityNews {
  id: string
  municipalityId: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  published: boolean
  publishedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface MunicipalityImage {
  id: string
  municipalityId: string
  url: string
  caption?: string
  section?: string
  order: number
}

// ============================================
// DIRECTORY TYPES
// ============================================

export interface Directory {
  id: string
  name: string
  slug: string
  category: 'PROVINCIAL_OFFICE' | 'NATIONAL_AGENCY' | 'BARMM_MINISTRY' | 'LGU' | 'OTHER'
  
  // About
  description?: string
  
  // Contact (required for display)
  email: string
  phone: string
  address?: string
  
  // Images
  logo?: string
  
  // Head of Office / Officer
  headName?: string
  headTitle?: string
  
  // Office hours
  officeHours?: string
  
  order: number
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface DirectoryPerson {
  id: string
  directoryId: string
  profileId?: string
  name: string
  position: string
  email?: string
  phone?: string
  image?: string
  order: number
  isActive: boolean
}

// ============================================
// NEWS & GAZETTE TYPES
// ============================================

export interface ProvincialNews {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  featured: boolean
  authorId?: string
  authorName?: string
  published: boolean
  publishedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Gazette {
  id: string
  type: 'ORDINANCE' | 'RESOLUTION'
  number: string
  year: number
  description?: string
  fileUrl: string
  createdAt: Date | string
}

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string
  username: string
  email: string
  password?: string // Never expose in client
  name: string
  role: 'SUPER_ADMIN' | 'PROVINCIAL_ADMIN' | 'MUNICIPAL_ADMIN' | 'EDITOR' | 'VIEWER'
  municipalityId?: string
  isActive: boolean
  lastLogin?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Session {
  user: Omit<User, 'password'>
  expires: Date | string
}

// ============================================
// SETTINGS & AUDIT TYPES
// ============================================

export interface SiteSetting {
  id: string
  key: string
  value: string
  category?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  collection: string
  documentId: string
  changes?: {
    before?: Record<string, unknown>
    after?: Record<string, unknown>
  }
  createdAt: Date | string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
