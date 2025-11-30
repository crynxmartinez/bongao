# Tawi-Tawi Provincial Government Website

A modern, full-stack government website with CMS for the Province of Tawi-Tawi, Philippines.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Authentication:** Custom JWT-based (stored in Firestore)
- **Styling:** TailwindCSS + shadcn/ui
- **Deployment:** Vercel

## Features

### Public Website
- Provincial homepage
- Governor and Officials profiles
- Municipality sub-sites (subdomain support)
- Government directory with agency profiles
- News and announcements
- Gazette (Ordinances & Resolutions)
- Contact information

### Admin CMS
- Profile management (officials with achievements, education, positions)
- Municipality management
- Directory management with connected people
- News article management
- Gazette document uploads
- Media library
- User management with role-based access

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/crynxmartinez/bongao.git
cd bongao
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

4. Update Firebase Firestore rules in Firebase Console:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Run the development server:
```bash
npm run dev
```

6. Seed the database (visit in browser):
```
http://localhost:3000/api/seed
```

7. Login to admin:
```
URL: http://localhost:3000/admin/login
Username: admin
Password: admin123
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin CMS pages
│   ├── api/                # API routes
│   ├── profile/            # Public profile pages
│   ├── directory/          # Directory pages
│   └── ...                 # Other public pages
├── components/
│   ├── admin/              # Admin-specific components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   ├── firestore/          # Firestore CRUD functions
│   ├── auth.ts             # Authentication utilities
│   ├── storage.ts          # Firebase Storage utilities
│   └── utils.ts            # Helper functions
└── types/
    └── index.ts            # TypeScript type definitions
```

## Firebase Collections

- `profiles` - Government officials
- `municipalities` - Municipalities with sub-collections
- `directories` - Government agencies/offices
- `provincial_news` - News articles
- `gazette` - Ordinances and resolutions
- `users` - CMS users
- `settings` - Site settings

## User Roles

- **SUPER_ADMIN** - Full access to everything
- **PROVINCIAL_ADMIN** - Manage provincial content
- **MUNICIPAL_ADMIN** - Manage specific municipality only
- **EDITOR** - Edit content, no user management
- **VIEWER** - Read-only access

## Deployment

### Vercel Setup

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `JWT_SECRET` (generate with: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL` (your production URL)

3. Deploy - Vercel will automatically build and deploy on push to main branch

### Initial Setup After Deployment

1. Visit `/api/seed` to create the admin user
2. Login at `/admin/login` with:
   - Username: `admin`
   - Password: `admin123`
3. **Important:** Change the admin password immediately after first login

## License

Copyright © 2024 Provincial Government of Tawi-Tawi. All rights reserved.
