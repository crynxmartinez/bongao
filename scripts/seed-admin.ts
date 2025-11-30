/**
 * Seed script to create admin user
 * Run with: npx ts-node scripts/seed-admin.ts
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

const firebaseConfig = {
  apiKey: "AIzaSyBGz74wlAG0KrYhdKlwu21ApjobKrcV5Jc",
  authDomain: "bongao.firebaseapp.com",
  projectId: "bongao",
  storageBucket: "bongao.firebasestorage.app",
  messagingSenderId: "547246416538",
  appId: "1:547246416538:web:9f3f7f0b74ef41ea9df523",
  measurementId: "G-TW82CB6WZ2"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedAdmin() {
  console.log('🌱 Seeding admin user...')
  
  // Check if admin already exists
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('username', '==', 'admin'))
  const snapshot = await getDocs(q)
  
  if (!snapshot.empty) {
    console.log('⚠️  Admin user already exists!')
    return
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  // Create admin user
  const adminUser = {
    username: 'admin',
    email: 'admin@tawi-tawi.gov.ph',
    password: hashedPassword,
    name: 'System Administrator',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  
  const docRef = await addDoc(usersRef, adminUser)
  console.log('✅ Admin user created with ID:', docRef.id)
  console.log('')
  console.log('📋 Login credentials:')
  console.log('   Username: admin')
  console.log('   Password: admin123')
  console.log('')
}

seedAdmin()
  .then(() => {
    console.log('🎉 Seed complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
