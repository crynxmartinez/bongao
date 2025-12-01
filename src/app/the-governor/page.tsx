import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentGovernor, getPositionUrlSlug } from '@/lib/firestore/profiles'

export default async function TheGovernorPage() {
  // Fetch current Governor from database
  const governor = await getCurrentGovernor()

  // If Governor exists, redirect to their profile page
  if (governor && governor.slug) {
    const positionSlug = getPositionUrlSlug(governor.positionCategory)
    redirect(`/officials/${positionSlug}/${governor.slug}`)
  }

  // If no Governor profile exists, show a placeholder page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12 text-center">
            <UserX className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Governor Profile</h1>
            <p className="text-muted-foreground mb-6">
              The Governor profile is currently being updated. Please check back later.
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'The Governor - Province of Tawi-Tawi',
  description: 'Official profile of the Governor of the Province of Tawi-Tawi.',
}

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
