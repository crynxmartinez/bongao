import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users,
  ChevronRight,
  User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDirectoryBySlug, getDirectoryPeople } from '@/lib/firestore/directories'
import { getProfileById } from '@/lib/firestore/profiles'
import type { Directory, DirectoryPerson, Profile } from '@/types'

const categoryLabels: Record<Directory['category'], string> = {
  PROVINCIAL_OFFICE: 'Provincial Department/Office',
  NATIONAL_AGENCY: 'National Government Agency',
  BARMM_MINISTRY: 'BARMM Ministry',
  LGU: 'Local Government Unit',
  OTHER: 'Other',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DirectoryDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  const directory = await getDirectoryBySlug(slug)
  
  if (!directory) {
    notFound()
  }

  // Fetch people connected to this directory
  let people: DirectoryPerson[] = []
  let peopleProfiles: Map<string, Profile> = new Map()
  
  try {
    people = await getDirectoryPeople(directory.id)
    
    // Fetch profile data for people who have profileId
    const profilePromises = people
      .filter(p => p.profileId)
      .map(async (p) => {
        const profile = await getProfileById(p.profileId!)
        if (profile) {
          peopleProfiles.set(p.id, profile)
        }
      })
    await Promise.all(profilePromises)
  } catch (error) {
    console.error('Failed to fetch directory people:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/directory" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {directory.logo ? (
                <Image
                  src={directory.logo}
                  alt={directory.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
                {categoryLabels[directory.category]}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{directory.name}</h1>
              {directory.headName && (
                <p className="text-white/80">
                  <Users className="w-4 h-4 inline mr-2" />
                  {directory.headTitle ? `${directory.headTitle}: ` : ''}{directory.headName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {directory.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{directory.description}</p>
                </CardContent>
              </Card>
            )}

            {/* People */}
            {people.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    People
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {people.map((person) => {
                      const profile = peopleProfiles.get(person.id)
                      const hasProfile = profile && profile.slug

                      const PersonCard = (
                        <div className={`flex items-center gap-4 p-4 rounded-lg border ${hasProfile ? 'hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors' : 'bg-gray-50'}`}>
                          {/* Photo */}
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {person.image || profile?.profileImage ? (
                              <Image
                                src={person.image || profile?.profileImage || ''}
                                alt={person.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{person.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">{person.position}</p>
                            {person.email && (
                              <p className="text-xs text-muted-foreground truncate">{person.email}</p>
                            )}
                          </div>

                          {hasProfile && (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      )

                      if (hasProfile) {
                        return (
                          <Link key={person.id} href={`/profiles/${profile.slug}`}>
                            {PersonCard}
                          </Link>
                        )
                      }

                      return <div key={person.id}>{PersonCard}</div>
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {directory.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a href={`tel:${directory.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                        {directory.phone}
                      </a>
                    </div>
                  </div>
                )}

                {directory.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${directory.email}`} className="text-sm text-muted-foreground hover:text-primary break-all">
                        {directory.email}
                      </a>
                    </div>
                  </div>
                )}

                {directory.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-muted-foreground">{directory.address}</p>
                    </div>
                  </div>
                )}

                {directory.officeHours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Office Hours</p>
                      <p className="text-sm text-muted-foreground">{directory.officeHours}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button asChild className="w-full">
              <Link href="/directory">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Link>
            </Button>
          </div>
        </div>
      </div>

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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const directory = await getDirectoryBySlug(slug)
  
  if (!directory) {
    return {
      title: 'Not Found - Province of Tawi-Tawi',
    }
  }

  return {
    title: `${directory.name} - Government Directory`,
    description: directory.description || `Contact information for ${directory.name}`,
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
