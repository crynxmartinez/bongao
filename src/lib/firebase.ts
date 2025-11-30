import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBGz74wlAG0KrYhdKlwu21ApjobKrcV5Jc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bongao.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bongao",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bongao.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "547246416538",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:547246416538:web:9f3f7f0b74ef41ea9df523",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TW82CB6WZ2"
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Storage
export const storage = getStorage(app)

// Initialize Analytics (only on client side)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported()
    if (supported) {
      return getAnalytics(app)
    }
  }
  return null
}

export default app
