import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, FolderOpen, Newspaper, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { getProfiles } from '@/lib/firestore/profiles'
import { getMunicipalities } from '@/lib/firestore/municipalities'
import { getDirectories } from '@/lib/firestore/directories'
import { getProvincialNews } from '@/lib/firestore/news'
import { getRecentActivityLogs, type ActivityLog } from '@/lib/firestore/activity-logs'

export default async function AdminDashboard() {
  // Fetch actual counts from database
  let profiles: Awaited<ReturnType<typeof getProfiles>> = []
  let municipalities: Awaited<ReturnType<typeof getMunicipalities>> = []
  let directories: Awaited<ReturnType<typeof getDirectories>> = []
  let news: Awaited<ReturnType<typeof getProvincialNews>> = []
  let activityLogs: ActivityLog[] = []
  let fetchError: string | null = null

  try {
    const results = await Promise.all([
      getProfiles(),
      getMunicipalities(),
      getDirectories(),
      getProvincialNews(false),
      getRecentActivityLogs(5),
    ])
    profiles = results[0]
    municipalities = results[1]
    directories = results[2]
    news = results[3]
    activityLogs = results[4]
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    fetchError = error instanceof Error ? error.message : 'Unknown error'
  }

  const stats = [
    { name: 'Profiles', value: profiles.length.toString(), icon: Users, href: '/admin/profiles', description: 'Government officials' },
    { name: 'Municipalities', value: municipalities.length.toString(), icon: MapPin, href: '/admin/municipalities', description: 'Municipal websites' },
    { name: 'Directories', value: directories.length.toString(), icon: FolderOpen, href: '/admin/directories', description: 'Government agencies' },
    { name: 'News Articles', value: news.length.toString(), icon: Newspaper, href: '/admin/news', description: 'Published articles' },
    // TODO: Add gazette page when implemented
    // { name: 'Gazette', value: gazettes.length.toString(), icon: FileText, href: '/admin/gazette', description: 'Ordinances & Resolutions' },
  ]
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Tawi-Tawi Provincial Government CMS
        </p>
      </div>

      {/* Error Display */}
      {fetchError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600 text-sm">
              <strong>Error loading data:</strong> {fetchError}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              href="/admin/profiles/new" 
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Add New Profile</p>
                  <p className="text-sm text-muted-foreground">Create a new official profile</p>
                </div>
              </div>
            </Link>
            <Link 
              href="/admin/news/new" 
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Create News Article</p>
                  <p className="text-sm text-muted-foreground">Publish a new news article</p>
                </div>
              </div>
            </Link>
            {/* TODO: Add gazette upload when page is implemented */}
            {/* <Link 
              href="/admin/gazette/upload" 
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Upload Gazette</p>
                  <p className="text-sm text-muted-foreground">Add ordinance or resolution</p>
                </div>
              </div>
            </Link> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLogs.length > 0 ? (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">{log.userName}</span>
                        {' '}{log.action}{' '}
                        <span className="font-medium">{log.entityName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
                <p className="text-sm">Activity will appear here once you start making changes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Municipalities Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Municipalities
          </CardTitle>
          <CardDescription>Manage municipality websites</CardDescription>
        </CardHeader>
        <CardContent>
          {municipalities.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {municipalities.map((muni) => (
                <Link
                  key={muni.id}
                  href={`/admin/municipalities/${muni.slug}`}
                  className="p-2 text-center rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                >
                  {muni.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No municipalities added yet. Add municipalities through the Municipalities section.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
