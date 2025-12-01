import Link from 'next/link'
import { User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getProvincialOfficials } from '@/lib/firestore/profiles'
import { PublicHeader } from '@/components/layout/public-header'
import type { Profile } from '@/types'

// Official Card Component
function OfficialCard({ profile, showPosition = true }: { profile: Profile; showPosition?: boolean }) {
  const fullName = [
    profile.firstName,
    profile.nickname ? `"${profile.nickname}"` : null,
    profile.middleName,
    profile.lastName,
    profile.suffix,
  ].filter(Boolean).join(' ')

  return (
    <Link href={`/profiles/${profile.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-6 text-center">
          {/* Photo or Initials */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </span>
            )}
          </div>
          
          {/* Name */}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            HON. {fullName.toUpperCase()}
          </h3>
          
          {/* Position */}
          {showPosition && profile.currentPosition && (
            <p className="text-sm text-gray-500 mt-1">{profile.currentPosition}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

// Placeholder Card for empty positions
function PlaceholderCard({ title }: { title: string }) {
  return (
    <Card className="h-full opacity-50">
      <CardContent className="p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-500">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">Profile not yet added</p>
      </CardContent>
    </Card>
  )
}

export default async function SangguniangPanlalawiganPage() {
  let officials = {
    governor: null as Profile | null,
    viceGovernor: null as Profile | null,
    spSecretary: null as Profile | null,
    boardMembersFirst: [] as Profile[],
    boardMembersSecond: [] as Profile[],
    exOfficioMembers: [] as Profile[],
  }

  try {
    officials = await getProvincialOfficials()
  } catch (error) {
    console.error('Failed to fetch officials:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PublicHeader />

      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sangguniang Panlalawigan</h1>
          <p className="text-white/80">Provincial Legislative Body of Tawi-Tawi</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Presiding Officer (Vice Governor) */}
          <div>
            <h2 className="text-xl font-bold text-center mb-6 text-primary">Presiding Officer</h2>
            <div className="max-w-sm mx-auto">
              {officials.viceGovernor ? (
                <OfficialCard profile={officials.viceGovernor} />
              ) : (
                <PlaceholderCard title="Vice Governor" />
              )}
            </div>
          </div>

          {/* SP Secretary */}
          <div>
            <h2 className="text-xl font-bold text-center mb-6 text-primary">SP Secretary</h2>
            <div className="max-w-sm mx-auto">
              {officials.spSecretary ? (
                <OfficialCard profile={officials.spSecretary} />
              ) : (
                <PlaceholderCard title="SP Secretary" />
              )}
            </div>
          </div>

          {/* Board Members - First District */}
          <div>
            <h2 className="text-xl font-bold text-center mb-6 text-primary">Board Members - First District</h2>
            {officials.boardMembersFirst.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {officials.boardMembersFirst.map((member) => (
                  <OfficialCard key={member.id} profile={member} showPosition={false} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No board members added yet</p>
            )}
          </div>

          {/* Board Members - Second District */}
          <div>
            <h2 className="text-xl font-bold text-center mb-6 text-primary">Board Members - Second District</h2>
            {officials.boardMembersSecond.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {officials.boardMembersSecond.map((member) => (
                  <OfficialCard key={member.id} profile={member} showPosition={false} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No board members added yet</p>
            )}
          </div>

          {/* Ex-Officio Members */}
          <div>
            <h2 className="text-xl font-bold text-center mb-6 text-primary">Ex-Officio Members</h2>
            {officials.exOfficioMembers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-md mx-auto">
                {officials.exOfficioMembers.map((member) => (
                  <OfficialCard key={member.id} profile={member} showPosition={false} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No ex-officio members added yet</p>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export const metadata = {
  title: 'Sangguniang Panlalawigan',
  description: 'Provincial Legislative Body of Tawi-Tawi - Board Members and Officials',
}
