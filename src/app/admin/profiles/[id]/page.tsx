'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { Profile } from '@/types'

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
    shortBio: '',
    fullBio: '',
    email: '',
    phone: '',
    facebook: '',
    profileImage: '',
    isActive: true,
  })

  useEffect(() => {
    if (!isNew) {
      fetchProfile()
    }
  }, [isNew, params.id])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profiles/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.profile)
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Personal details of the official</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Position */}
        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
            <CardDescription>Current role and organization</CardDescription>
          </CardHeader>
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
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
            <CardDescription>About the official</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How to reach this official</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>Photo of the official</CardDescription>
          </CardHeader>
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
        </Card>

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
