'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { Profile, ServicePeriod, Project, Legislation, Program, Achievement, Education } from '@/types'
import {
  getServicePeriods,
  addServicePeriod,
  deleteServicePeriod,
  getProjects,
  addProject,
  deleteProject,
  getLegislation,
  addLegislation,
  deleteLegislation,
  getPrograms,
  addProgram,
  deleteProgram,
  getAchievements,
  addAchievement,
  deleteAchievement,
  getEducation,
  addEducation,
  deleteEducation,
} from '@/lib/firestore/profiles'

export default function EditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Profile>>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    nickname: '',
    slug: '',
    currentPosition: '',
    currentOrganization: '',
    positionCategory: undefined,
    district: undefined,
    municipalitySlug: undefined,
    positionOrder: 0,
    shortBio: '',
    fullBio: '',
    email: '',
    phone: '',
    facebook: '',
    profileImage: '',
    isActive: true,
    // Stat card toggles
    showYearsInService: false,
    showProjects: false,
    showAwards: false,
    showLegislation: false,
    showPrograms: false,
    showEducation: false,
  })

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    basic: true,
    position: true,
    biography: false,
    contact: false,
    image: false,
    yearsInService: false,
    projects: false,
    awards: false,
    legislation: false,
    programs: false,
    education: false,
  })

  // Stat card data
  const [servicePeriods, setServicePeriods] = useState<Omit<ServicePeriod, 'id' | 'profileId' | 'createdAt'>[]>([])
  const [projects, setProjects] = useState<Omit<Project, 'id' | 'profileId' | 'createdAt'>[]>([])
  const [awards, setAwards] = useState<Omit<Achievement, 'id' | 'profileId' | 'createdAt'>[]>([])
  const [legislation, setLegislation] = useState<Omit<Legislation, 'id' | 'profileId' | 'createdAt'>[]>([])
  const [programs, setPrograms] = useState<Omit<Program, 'id' | 'profileId' | 'createdAt'>[]>([])
  const [education, setEducation] = useState<Omit<Education, 'id' | 'profileId'>[]>([])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  useEffect(() => {
    if (!isNew) {
      fetchProfile()
    }
  }, [isNew, params.id])

  const fetchProfile = async () => {
    try {
      const profileId = params.id as string
      const response = await fetch(`/api/profiles/${profileId}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.profile)
        
        // Fetch subcollection data
        const [
          servicePeriodData,
          projectData,
          awardData,
          legislationData,
          programData,
          educationData,
        ] = await Promise.all([
          getServicePeriods(profileId),
          getProjects(profileId),
          getAchievements(profileId),
          getLegislation(profileId),
          getPrograms(profileId),
          getEducation(profileId),
        ])
        
        setServicePeriods(servicePeriodData)
        setProjects(projectData)
        setAwards(awardData)
        setLegislation(legislationData)
        setPrograms(programData)
        setEducation(educationData)
      } else {
        toast.error('Profile not found')
        router.push('/admin/profiles')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from name
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? value : formData.firstName || ''
      const lastName = name === 'lastName' ? value : formData.lastName || ''
      const slug = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = isNew ? '/api/profiles' : `/api/profiles/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Get the profile ID (either from response for new, or from params for existing)
        const profileId = isNew ? data.id : (params.id as string)
        
        // Save subcollection data
        await saveSubcollectionData(profileId)
        
        toast.success(isNew ? 'Profile created successfully' : 'Profile updated successfully')
        router.push('/admin/profiles')
      } else {
        toast.error(data.error || 'Failed to save profile')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const saveSubcollectionData = async (profileId: string) => {
    // For simplicity, we'll delete all existing items and re-add them
    // This ensures clean state without tracking individual changes
    
    // Get existing data to delete
    const [
      existingServicePeriods,
      existingProjects,
      existingAwards,
      existingLegislation,
      existingPrograms,
      existingEducation,
    ] = await Promise.all([
      getServicePeriods(profileId),
      getProjects(profileId),
      getAchievements(profileId),
      getLegislation(profileId),
      getPrograms(profileId),
      getEducation(profileId),
    ])

    // Delete existing items
    await Promise.all([
      ...existingServicePeriods.map(item => deleteServicePeriod(profileId, item.id)),
      ...existingProjects.map(item => deleteProject(profileId, item.id)),
      ...existingAwards.map(item => deleteAchievement(profileId, item.id)),
      ...existingLegislation.map(item => deleteLegislation(profileId, item.id)),
      ...existingPrograms.map(item => deleteProgram(profileId, item.id)),
      ...existingEducation.map(item => deleteEducation(profileId, item.id)),
    ])

    // Add new items
    await Promise.all([
      ...servicePeriods.map((item, index) => addServicePeriod(profileId, { ...item, order: index })),
      ...projects.map((item, index) => addProject(profileId, { ...item, order: index })),
      ...awards.map((item, index) => addAchievement(profileId, { ...item, order: index })),
      ...legislation.map((item, index) => addLegislation(profileId, { ...item, order: index })),
      ...programs.map((item, index) => addProgram(profileId, { ...item, order: index })),
      ...education.map((item, index) => addEducation(profileId, { ...item, order: index })),
    ])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/profiles">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Add New Profile' : 'Edit Profile'}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? 'Create a new official profile' : `Editing: ${formData.firstName} ${formData.lastName}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Personal details of the official</CardDescription>
                  </div>
                  {openSections.basic ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={formData.middleName || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suffix">Suffix</Label>
                    <Input
                      id="suffix"
                      name="suffix"
                      value={formData.suffix || ''}
                      onChange={handleChange}
                      placeholder="Jr., Sr., III"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      name="nickname"
                      value={formData.nickname || ''}
                      onChange={handleChange}
                      placeholder="e.g., Mang"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleChange}
                      required
                      placeholder="e.g., yshmael-sali"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Position */}
        <Collapsible open={openSections.position} onOpenChange={() => toggleSection('position')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Position</CardTitle>
                    <CardDescription>Current role and organization</CardDescription>
                  </div>
                  {openSections.position ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPosition">Current Position</Label>
                    <Input
                      id="currentPosition"
                      name="currentPosition"
                      value={formData.currentPosition || ''}
                      onChange={handleChange}
                      placeholder="e.g., Governor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentOrganization">Organization</Label>
                    <Input
                      id="currentOrganization"
                      name="currentOrganization"
                      value={formData.currentOrganization || ''}
                      onChange={handleChange}
                      placeholder="e.g., Province of Tawi-Tawi"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="positionCategory">Position Category</Label>
                    <select
                      id="positionCategory"
                      name="positionCategory"
                      value={formData.positionCategory || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, positionCategory: e.target.value as Profile['positionCategory'] || undefined }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">-- Select --</option>
                      <optgroup label="Provincial">
                        <option value="GOVERNOR">Governor</option>
                        <option value="VICE_GOVERNOR">Vice Governor</option>
                        <option value="SP_SECRETARY">SP Secretary</option>
                        <option value="BOARD_MEMBER">Board Member (SP)</option>
                        <option value="EX_OFFICIO">Ex-Officio Member</option>
                        <option value="DEPARTMENT_HEAD">Department Head</option>
                      </optgroup>
                      <optgroup label="Municipal">
                        <option value="MAYOR">Mayor</option>
                        <option value="VICE_MAYOR">Vice Mayor</option>
                        <option value="COUNCILOR">Councilor</option>
                      </optgroup>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positionOrder">Display Order</Label>
                    <Input
                      id="positionOrder"
                      name="positionOrder"
                      type="number"
                      value={formData.positionOrder || 0}
                      onChange={(e) => setFormData(prev => ({ ...prev, positionOrder: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District (for Board Members)</Label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value as Profile['district'] || undefined }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      disabled={formData.positionCategory !== 'BOARD_MEMBER'}
                    >
                      <option value="">-- Select --</option>
                      <option value="FIRST">First District</option>
                      <option value="SECOND">Second District</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipalitySlug">Municipality (for Municipal Officials)</Label>
                    <select
                      id="municipalitySlug"
                      name="municipalitySlug"
                      value={formData.municipalitySlug || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, municipalitySlug: e.target.value || undefined }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      disabled={!['MAYOR', 'VICE_MAYOR', 'COUNCILOR'].includes(formData.positionCategory || '')}
                    >
                      <option value="">-- Select --</option>
                      <option value="bongao">Bongao</option>
                      <option value="languyan">Languyan</option>
                      <option value="mapun">Mapun</option>
                      <option value="panglima-sugala">Panglima Sugala</option>
                      <option value="sapa-sapa">Sapa-Sapa</option>
                      <option value="sibutu">Sibutu</option>
                      <option value="simunul">Simunul</option>
                      <option value="sitangkai">Sitangkai</option>
                      <option value="south-ubian">South Ubian</option>
                      <option value="tandubas">Tandubas</option>
                      <option value="turtle-islands">Turtle Islands</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Biography */}
        <Collapsible open={openSections.biography} onOpenChange={() => toggleSection('biography')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Biography</CardTitle>
                    <CardDescription>About the official</CardDescription>
                  </div>
                  {openSections.biography ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shortBio">Short Bio (for cards/previews)</Label>
                  <Textarea
                    id="shortBio"
                    name="shortBio"
                    value={formData.shortBio || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="A brief 2-3 sentence bio..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullBio">Full Biography</Label>
                  <Textarea
                    id="fullBio"
                    name="fullBio"
                    value={formData.fullBio || ''}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Complete biography..."
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Contact */}
        <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How to reach this official</CardDescription>
                  </div>
                  {openSections.contact ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook || ''}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Profile Image */}
        <Collapsible open={openSections.image} onOpenChange={() => toggleSection('image')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Image</CardTitle>
                    <CardDescription>Photo of the official</CardDescription>
                  </div>
                  {openSections.image ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Image URL</Label>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    value={formData.profileImage || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the URL of the profile image
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* ============================================ */}
        {/* PROFILE STATS SECTION */}
        {/* ============================================ */}
        <div className="py-4">
          <Separator />
          <div className="py-4 text-center">
            <h2 className="text-lg font-semibold text-muted-foreground">PROFILE STATS</h2>
            <p className="text-sm text-muted-foreground">Check to show as clickable cards on the profile page</p>
          </div>
          <Separator />
        </div>

        {/* Years in Service */}
        <Collapsible open={openSections.yearsInService} onOpenChange={() => toggleSection('yearsInService')}>
          <Card className={formData.showYearsInService ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showYearsInService || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showYearsInService: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Years in Service</CardTitle>
                      <CardDescription>Service timeline (shows total years computed)</CardDescription>
                    </div>
                  </div>
                  {openSections.yearsInService ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {servicePeriods.map((period, index) => (
                  <div key={index} className="flex gap-4 items-start p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Year Start</Label>
                        <Input
                          type="number"
                          value={period.yearStart || ''}
                          onChange={(e) => {
                            const updated = [...servicePeriods]
                            updated[index].yearStart = parseInt(e.target.value) || 0
                            setServicePeriods(updated)
                          }}
                          placeholder="2019"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year End</Label>
                        <Input
                          type="number"
                          value={period.yearEnd || ''}
                          onChange={(e) => {
                            const updated = [...servicePeriods]
                            updated[index].yearEnd = e.target.value ? parseInt(e.target.value) : undefined
                            setServicePeriods(updated)
                          }}
                          placeholder="Present"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title/Details</Label>
                        <Input
                          value={period.title || ''}
                          onChange={(e) => {
                            const updated = [...servicePeriods]
                            updated[index].title = e.target.value
                            setServicePeriods(updated)
                          }}
                          placeholder="e.g., Governor"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setServicePeriods(servicePeriods.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setServicePeriods([...servicePeriods, { yearStart: new Date().getFullYear(), title: '', order: servicePeriods.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service Period
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Projects */}
        <Collapsible open={openSections.projects} onOpenChange={() => toggleSection('projects')}>
          <Card className={formData.showProjects ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showProjects || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showProjects: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Projects</CardTitle>
                      <CardDescription>Projects led or involved in</CardDescription>
                    </div>
                  </div>
                  {openSections.projects ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Project Name</Label>
                          <Input
                            value={project.name || ''}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[index].name = e.target.value
                              setProjects(updated)
                            }}
                            placeholder="Project name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            value={project.year || ''}
                            onChange={(e) => {
                              const updated = [...projects]
                              updated[index].year = parseInt(e.target.value) || undefined
                              setProjects(updated)
                            }}
                            placeholder="2023"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={project.description || ''}
                        onChange={(e) => {
                          const updated = [...projects]
                          updated[index].description = e.target.value
                          setProjects(updated)
                        }}
                        rows={2}
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setProjects([...projects, { name: '', order: projects.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Awards & Recognition */}
        <Collapsible open={openSections.awards} onOpenChange={() => toggleSection('awards')}>
          <Card className={formData.showAwards ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showAwards || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showAwards: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Awards & Recognition</CardTitle>
                      <CardDescription>Awards and honors received</CardDescription>
                    </div>
                  </div>
                  {openSections.awards ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Award Title</Label>
                          <Input
                            value={award.title || ''}
                            onChange={(e) => {
                              const updated = [...awards]
                              updated[index].title = e.target.value
                              setAwards(updated)
                            }}
                            placeholder="Award name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            value={award.year || ''}
                            onChange={(e) => {
                              const updated = [...awards]
                              updated[index].year = parseInt(e.target.value) || undefined
                              setAwards(updated)
                            }}
                            placeholder="2023"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAwards(awards.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={award.description || ''}
                        onChange={(e) => {
                          const updated = [...awards]
                          updated[index].description = e.target.value
                          setAwards(updated)
                        }}
                        rows={2}
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAwards([...awards, { title: '', order: awards.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Award
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Legislation */}
        <Collapsible open={openSections.legislation} onOpenChange={() => toggleSection('legislation')}>
          <Card className={formData.showLegislation ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showLegislation || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showLegislation: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Legislation Authored</CardTitle>
                      <CardDescription>Ordinances and resolutions (for SP members)</CardDescription>
                    </div>
                  </div>
                  {openSections.legislation ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {legislation.map((leg, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={leg.title || ''}
                            onChange={(e) => {
                              const updated = [...legislation]
                              updated[index].title = e.target.value
                              setLegislation(updated)
                            }}
                            placeholder="Legislation title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <select
                            value={leg.type || ''}
                            onChange={(e) => {
                              const updated = [...legislation]
                              updated[index].type = e.target.value as 'ORDINANCE' | 'RESOLUTION'
                              setLegislation(updated)
                            }}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="ORDINANCE">Ordinance</option>
                            <option value="RESOLUTION">Resolution</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            type="number"
                            value={leg.year || ''}
                            onChange={(e) => {
                              const updated = [...legislation]
                              updated[index].year = parseInt(e.target.value) || undefined
                              setLegislation(updated)
                            }}
                            placeholder="2023"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setLegislation(legislation.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={leg.description || ''}
                        onChange={(e) => {
                          const updated = [...legislation]
                          updated[index].description = e.target.value
                          setLegislation(updated)
                        }}
                        rows={2}
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLegislation([...legislation, { title: '', type: 'ORDINANCE', order: legislation.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Legislation
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Programs & Initiatives */}
        <Collapsible open={openSections.programs} onOpenChange={() => toggleSection('programs')}>
          <Card className={formData.showPrograms ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showPrograms || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showPrograms: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Programs & Initiatives</CardTitle>
                      <CardDescription>Ongoing programs championed</CardDescription>
                    </div>
                  </div>
                  {openSections.programs ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {programs.map((prog, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Program Name</Label>
                          <Input
                            value={prog.name || ''}
                            onChange={(e) => {
                              const updated = [...programs]
                              updated[index].name = e.target.value
                              setPrograms(updated)
                            }}
                            placeholder="Program name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <select
                            value={prog.status || 'ONGOING'}
                            onChange={(e) => {
                              const updated = [...programs]
                              updated[index].status = e.target.value as 'ONGOING' | 'COMPLETED' | 'PLANNED'
                              setPrograms(updated)
                            }}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="ONGOING">Ongoing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PLANNED">Planned</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setPrograms(programs.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={prog.description || ''}
                        onChange={(e) => {
                          const updated = [...programs]
                          updated[index].description = e.target.value
                          setPrograms(updated)
                        }}
                        rows={2}
                        placeholder="Brief description..."
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPrograms([...programs, { name: '', status: 'ONGOING', order: programs.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Program
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Education */}
        <Collapsible open={openSections.education} onOpenChange={() => toggleSection('education')}>
          <Card className={formData.showEducation ? 'border-primary' : ''}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.showEducation || false}
                      onCheckedChange={(checked: boolean) => {
                        setFormData(prev => ({ ...prev, showEducation: checked }))
                      }}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <div>
                      <CardTitle>Education</CardTitle>
                      <CardDescription>Educational background</CardDescription>
                    </div>
                  </div>
                  {openSections.education ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="flex gap-4 items-start p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree || ''}
                          onChange={(e) => {
                            const updated = [...education]
                            updated[index].degree = e.target.value
                            setEducation(updated)
                          }}
                          placeholder="e.g., Bachelor of Laws"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>School</Label>
                        <Input
                          value={edu.school || ''}
                          onChange={(e) => {
                            const updated = [...education]
                            updated[index].school = e.target.value
                            setEducation(updated)
                          }}
                          placeholder="University name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={edu.year || ''}
                          onChange={(e) => {
                            const updated = [...education]
                            updated[index].year = parseInt(e.target.value) || undefined
                            setEducation(updated)
                          }}
                          placeholder="2000"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEducation(education.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEducation([...education, { degree: '', school: '', order: education.length }])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/profiles">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isNew ? 'Create Profile' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
