'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  RefreshCw, 
  ExternalLink, 
  UserPlus, 
  LogIn,
  CheckCircle,
  AlertCircle,
  Globe,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface MunicipalityRegistry {
  id: string
  name: string
  slug: string
  crmUrl?: string
  websiteUrl?: string
  status: 'active' | 'inactive'
}

interface MunicipalAdmin {
  id: string
  municipalityId: string
  username: string
  email: string
  name: string
}

interface MunicipalityCard {
  registry: MunicipalityRegistry
  admin: MunicipalAdmin | null
  isConnected: boolean
}

export default function MunicipalitiesManagementPage() {
  const [municipalities, setMunicipalities] = useState<MunicipalityCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showCreateAdmin, setShowCreateAdmin] = useState<string | null>(null)
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
  })
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)

  useEffect(() => {
    loadMunicipalities()
  }, [])

  const loadMunicipalities = async () => {
    setIsLoading(true)
    try {
      // Load registry from manifest
      const manifestRes = await fetch('/municipalities-registry/manifest.json')
      const manifest = await manifestRes.json()

      // Load each municipality JSON
      const registryData: MunicipalityRegistry[] = []
      for (const file of manifest.municipalities) {
        try {
          const res = await fetch(`/municipalities-registry/${file}`)
          if (res.ok) {
            const data = await res.json()
            registryData.push(data)
          }
        } catch (err) {
          console.error(`Failed to load ${file}:`, err)
        }
      }

      // Load municipal admins from Firestore
      const adminsRes = await fetch('/api/municipal-admins')
      const adminsData = await adminsRes.json()
      const admins: MunicipalAdmin[] = adminsData.success ? adminsData.admins : []

      // Combine registry with admin status
      const combined: MunicipalityCard[] = registryData.map(reg => {
        const admin = admins.find(a => a.municipalityId === reg.id)
        return {
          registry: reg,
          admin: admin || null,
          isConnected: !!admin,
        }
      })

      // Sort by name
      combined.sort((a, b) => a.registry.name.localeCompare(b.registry.name))

      setMunicipalities(combined)
    } catch (error) {
      console.error('Failed to load municipalities:', error)
      toast.error('Failed to load municipalities')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDetectWebsites = async () => {
    setIsSyncing(true)
    toast.info('Scanning for municipality websites...')
    
    try {
      // Reload from registry
      await loadMunicipalities()
      toast.success('Scan complete!')
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Failed to detect websites')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCreateAdmin = async (municipalityId: string) => {
    if (!adminForm.username || !adminForm.password || !adminForm.email || !adminForm.name) {
      toast.error('Please fill all fields')
      return
    }

    if (adminForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsCreatingAdmin(true)
    try {
      const response = await fetch('/api/municipal-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adminForm,
          municipalityId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Municipal admin created successfully!')
        setShowCreateAdmin(null)
        setAdminForm({ username: '', password: '', email: '', name: '' })
        await loadMunicipalities()
      } else {
        toast.error(data.error || 'Failed to create admin')
      }
    } catch (error) {
      console.error('Create admin error:', error)
      toast.error('Failed to create admin')
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  const handleSuperAdminLogin = async (municipality: MunicipalityCard) => {
    if (!municipality.registry.crmUrl) {
      toast.error('No CRM URL configured for this municipality')
      return
    }

    try {
      // Generate one-time token for super admin login
      const response = await fetch('/api/super-admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          municipalityId: municipality.registry.id,
        }),
      })

      const data = await response.json()

      if (data.success && data.token) {
        // Open municipal CRM with token
        const loginUrl = `${municipality.registry.crmUrl}/admin/token-login?token=${data.token}`
        window.open(loginUrl, '_blank')
      } else {
        toast.error(data.error || 'Failed to generate login token')
      }
    } catch (error) {
      console.error('Super admin login error:', error)
      toast.error('Failed to login')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Municipality Management</h1>
          <p className="text-muted-foreground">
            Manage municipal CRM admins and website connections
          </p>
        </div>
        <Button onClick={handleDetectWebsites} disabled={isSyncing}>
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Detect Websites
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Municipalities</p>
                <p className="text-3xl font-bold">{municipalities.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-3xl font-bold text-green-600">
                  {municipalities.filter(m => m.isConnected).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Connected</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {municipalities.filter(m => !m.isConnected).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Municipality Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading municipalities...</p>
        </div>
      ) : municipalities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Municipalities Detected</h3>
            <p className="text-muted-foreground mb-4">
              Add municipality JSON files to the registry folder, then click "Detect Websites"
            </p>
            <p className="text-sm text-muted-foreground">
              Registry location: <code className="bg-muted px-2 py-1 rounded">/public/municipalities-registry/</code>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {municipalities.map((municipality) => (
            <Card key={municipality.registry.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{municipality.registry.name}</CardTitle>
                      <CardDescription>{municipality.registry.slug}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className={`p-3 rounded-lg border ${
                  municipality.isConnected 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {municipality.isConnected ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className={`text-sm font-semibold ${
                        municipality.isConnected ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {municipality.isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                      </span>
                    </div>
                    {!municipality.isConnected && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setShowCreateAdmin(municipality.registry.id)}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Create Admin
                      </Button>
                    )}
                  </div>
                  {municipality.isConnected && municipality.admin && (
                    <p className="text-xs text-green-700 mt-1">
                      Admin: {municipality.admin.email}
                    </p>
                  )}
                </div>

                {/* CRM URL */}
                {municipality.registry.crmUrl ? (
                  <a 
                    href={municipality.registry.crmUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-700">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">CRM Website</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-blue-600 mt-1 truncate">
                      {municipality.registry.crmUrl}
                    </p>
                  </a>
                ) : (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">No CRM URL configured</span>
                    </div>
                  </div>
                )}

                {/* Public Website URL */}
                {municipality.registry.websiteUrl && (
                  <a 
                    href={municipality.registry.websiteUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-700">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Public Website</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-purple-600 mt-1 truncate">
                      {municipality.registry.websiteUrl}
                    </p>
                  </a>
                )}

                {/* Super Admin Login Button */}
                {municipality.isConnected && municipality.registry.crmUrl && (
                  <Button 
                    className="w-full"
                    onClick={() => handleSuperAdminLogin(municipality)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login as Super Admin
                  </Button>
                )}
              </CardContent>

              {/* Create Admin Modal */}
              {showCreateAdmin === municipality.registry.id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Create Municipal Admin</CardTitle>
                      <CardDescription>
                        Create an admin account for {municipality.registry.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name">Full Name</Label>
                        <Input
                          id="admin-name"
                          value={adminForm.name}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Juan Dela Cruz"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={adminForm.email}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="admin@bongao.gov.ph"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-username">Username</Label>
                        <Input
                          id="admin-username"
                          value={adminForm.username}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="admin_bongao"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min 6 characters"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setShowCreateAdmin(null)
                            setAdminForm({ username: '', password: '', email: '', name: '' })
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => handleCreateAdmin(municipality.registry.id)}
                          disabled={isCreatingAdmin}
                        >
                          {isCreatingAdmin ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Create Admin
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
