import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Calendar,
  Briefcase,
  Award,
  ArrowLeft
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getProfileBySlug } from '@/lib/firestore/profiles'

interface ProfilePageProps {
  params: { slug: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileBySlug(params.slug)
  
  if (!profile) {
    notFound()
  }

  const fullName = [
    profile.firstName,
    profile.middleName,
    profile.lastName,
    profile.suffix
  ].filter(Boolean).join(' ')

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

      {/* Profile Hero */}
      <section className="bg-primary text-white pb-24 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            {/* Photo */}
            <div className="relative">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={fullName}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/50">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{fullName}</h1>
              {profile.currentPosition && (
                <p className="text-xl text-white/90 mb-1">{profile.currentPosition}</p>
              )}
              {profile.currentOrganization && (
                <p className="text-lg text-white/70">{profile.currentOrganization}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 -mt-16 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* About Card */}
          {profile.shortBio && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-primary">About</h2>
                <p className="text-gray-600 leading-relaxed">{profile.shortBio}</p>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-gray-900">5+</p>
                <p className="text-sm text-gray-500">Years in Service</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Projects</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500">Programs</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-primary">Contact Information</h2>
              <div className="space-y-3">
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${profile.email}`} className="text-gray-600 hover:text-primary">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${profile.phone}`} className="text-gray-600 hover:text-primary">
                      {profile.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Capitol Hills, Tubig Boh, Bongao, Tawi-Tawi</span>
                </div>
              </div>

              {/* Social Links */}
              {profile.facebook && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex gap-3">
                    <a 
                      href={profile.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi
          </p>
        </div>
      </footer>
    </div>
  )
}

// Generate metadata
export async function generateMetadata({ params }: ProfilePageProps) {
  const profile = await getProfileBySlug(params.slug)
  
  if (!profile) {
    return { title: 'Profile Not Found' }
  }

  const fullName = [profile.firstName, profile.lastName].join(' ')
  
  return {
    title: `${fullName} - ${profile.currentPosition || 'Official'}`,
    description: profile.shortBio || `Profile of ${fullName}`,
  }
}
