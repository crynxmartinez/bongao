import Link from 'next/link'
import Image from 'next/image'
import { Building2, Phone, Mail, MapPin, ChevronRight, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'
import { getDirectories } from '@/lib/firestore/directories'
import type { Directory } from '@/types'

const categoryLabels: Record<Directory['category'], string> = {
  PROVINCIAL_OFFICE: 'Provincial Departments & Offices',
  NATIONAL_AGENCY: 'National Government Agencies',
  BARMM_MINISTRY: 'BARMM Ministries',
  LGU: 'Local Government Units',
  OTHER: 'Other Agencies',
}

const categoryOrder: Directory['category'][] = [
  'PROVINCIAL_OFFICE',
  'NATIONAL_AGENCY',
  'BARMM_MINISTRY',
  'LGU',
  'OTHER',
]

export default async function DirectoryPage() {
  let directories: Directory[] = []

  try {
    directories = await getDirectories()
  } catch (error) {
    console.error('Failed to fetch directories:', error)
  }

  // Group directories by category
  const grouped = directories.reduce((acc, dir) => {
    if (!acc[dir.category]) acc[dir.category] = []
    acc[dir.category].push(dir)
    return acc
  }, {} as Record<string, Directory[]>)

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Government Directory</h1>
          <p className="text-white/80">
            Find contact information for government agencies and offices in Tawi-Tawi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {directories.length === 0 ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Directory Entries Yet</h2>
              <p className="text-muted-foreground">
                The government directory is currently being updated. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {categoryOrder.map((category) => {
              const items = grouped[category]
              if (!items || items.length === 0) return null

              return (
                <section key={category}>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {items.map((dir) => (
                      <Link key={dir.id} href={`/directory/${dir.slug}`}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                              {/* Logo or Icon */}
                              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {dir.logo ? (
                                  <Image
                                    src={dir.logo}
                                    alt={dir.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="w-7 h-7 text-primary" />
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                  {dir.name}
                                </h3>
                                {dir.headName && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    <Users className="w-3 h-3 inline mr-1" />
                                    {dir.headName}
                                  </p>
                                )}
                                <div className="space-y-1">
                                  {dir.phone && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span className="truncate">{dir.phone}</span>
                                    </p>
                                  )}
                                  {dir.email && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      <span className="truncate">{dir.email}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
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

export const metadata = {
  title: 'Government Directory - Province of Tawi-Tawi',
  description: 'Find contact information for government agencies and offices in Tawi-Tawi.',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
