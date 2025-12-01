import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin,
  Award,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  FolderKanban,
  ScrollText,
  Rocket
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PublicHeader } from '@/components/layout/public-header'
import { ProfileStatsCards } from '@/components/profile/stats-cards'
import { 
  getProfileByPositionAndSlug, 
  getPositionFromUrlSlug,
  getAchievements,
  getEducation,
  getPositions,
  getServicePeriods,
  getProjects,
  getLegislation,
  getPrograms,
  calculateYearsInService
} from '@/lib/firestore/profiles'

interface PageProps {
  params: Promise<{
    position: string
    slug: string
  }>
}

// Position display names
const POSITION_DISPLAY_NAMES: Record<string, string> = {
  'GOVERNOR': 'Governor',
  'VICE_GOVERNOR': 'Vice Governor',
  'BOARD_MEMBER': 'Board Member',
  'EX_OFFICIO': 'Ex-Officio Member',
  'SP_SECRETARY': 'SP Secretary',
  'DEPARTMENT_HEAD': 'Department Head',
  'MAYOR': 'Mayor',
  'VICE_MAYOR': 'Vice Mayor',
  'COUNCILOR': 'Councilor',
  'OTHER': 'Official',
}

export default async function OfficialProfilePage({ params }: PageProps) {
  const { position, slug } = await params
  
  // Validate position
  const positionCategory = getPositionFromUrlSlug(position)
  if (!positionCategory) {
    notFound()
  }

  // Fetch profile
  const profile = await getProfileByPositionAndSlug(position, slug)
  if (!profile) {
    notFound()
  }

  // Fetch related data
  const [achievements, education, positions, servicePeriods, projects, legislation, programs] = await Promise.all([
    getAchievements(profile.id),
    getEducation(profile.id),
    getPositions(profile.id),
    getServicePeriods(profile.id),
    getProjects(profile.id),
    getLegislation(profile.id),
    getPrograms(profile.id),
  ])

  // Calculate years in service
  const yearsInService = calculateYearsInService(servicePeriods)

  const fullName = `${profile.firstName || ''} ${profile.middleName || ''} ${profile.lastName || ''} ${profile.suffix || ''}`.trim()
  const positionTitle = profile.currentPosition || POSITION_DISPLAY_NAMES[profile.positionCategory || 'OTHER']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PublicHeader />

      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary to-primary/90 text-white pb-32 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <div className="relative">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={fullName}
                  width={200}
                  height={200}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                  <span className="text-6xl font-bold text-white/50">
                    {profile.firstName?.[0] || '?'}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Title */}
            <div className="text-center md:text-left">
              <p className="text-white/80 text-lg mb-2 uppercase tracking-wider">
                {positionTitle}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Hon. {fullName}
              </h1>
              {profile.district && (
                <p className="text-white/80 text-lg">
                  {profile.district === 'FIRST' ? '1st District' : '2nd District'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-24">
        {/* Stats Cards */}
        <ProfileStatsCards
          profile={profile}
          yearsInService={yearsInService}
          servicePeriods={servicePeriods}
          projects={projects}
          awards={achievements}
          legislation={legislation}
          programs={programs}
          education={education}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biography */}
            {profile.fullBio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Biography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: profile.fullBio }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Career / Positions */}
            {positions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Career History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positions.map((pos) => (
                      <div key={pos.id} className="flex gap-4 border-l-2 border-primary pl-4">
                        <div>
                          <h4 className="font-semibold">{pos.title}</h4>
                          {pos.organization && (
                            <p className="text-muted-foreground">{pos.organization}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {pos.startDate ? new Date(pos.startDate).getFullYear() : ''}{pos.endDate ? ` - ${new Date(pos.endDate).getFullYear()}` : pos.isCurrent ? ' - Present' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements & Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.description && (
                            <p className="text-muted-foreground text-sm">{achievement.description}</p>
                          )}
                          {achievement.year && (
                            <p className="text-sm text-muted-foreground">{achievement.year}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.school}</p>
                          {edu.year && (
                            <p className="text-sm text-muted-foreground">{edu.year}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${profile.phone}`} className="hover:underline">
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile.currentOrganization && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{profile.currentOrganization}</span>
                  </div>
                )}
                {!profile.email && !profile.phone && !profile.currentOrganization && (
                  <p className="text-muted-foreground text-sm">
                    Contact information not available.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/sangguniang-panlalawigan">
                    Sangguniang Panlalawigan
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/directory">
                    Directory
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/contact-us">
                    Contact Us
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  )
}

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
