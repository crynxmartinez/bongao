import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getProfiles } from '@/lib/firestore/profiles'

export default async function ProfilesPage() {
  let profiles: Awaited<ReturnType<typeof getProfiles>> = []
  
  try {
    profiles = await getProfiles()
  } catch (error) {
    console.error('Failed to fetch profiles:', error)
  }

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

      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Government Officials</h1>
          <p className="text-white/80">Province of Tawi-Tawi</p>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="container mx-auto px-4 py-12">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No profiles available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {profiles.map((profile) => {
              const fullName = [
                profile.firstName,
                profile.lastName,
                profile.suffix
              ].filter(Boolean).join(' ')

              return (
                <Link key={profile.id} href={`/profiles/${profile.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Photo */}
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {profile.profileImage ? (
                            <Image
                              src={profile.profileImage}
                              alt={fullName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">
                                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                            {fullName}
                          </h3>
                          {profile.currentPosition && (
                            <p className="text-sm text-gray-500 truncate">{profile.currentPosition}</p>
                          )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi
          </p>
        </div>
      </footer>
    </div>
  )
}

export const metadata = {
  title: 'Government Officials',
  description: 'Official profiles of Tawi-Tawi Provincial Government officials',
}
