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
import { ImageInput } from '@/components/ui/image-input'
import { toast } from 'sonner'
import type { Municipality } from '@/types'

export default function EditMunicipalityPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Municipality>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    logo: '',
    heroImage: '',
    email: '',
    phone: '',
    address: '',
    population: undefined,
    landArea: '',
    incomeClass: '',
    district: '',
    isActive: true,
  })

  useEffect(() => {
    if (!isNew) {
      fetchMunicipality()
    }
  }, [isNew, params.id])

  const fetchMunicipality = async () => {
    try {
      const response = await fetch(`/api/municipalities/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.municipality)
      } else {
        toast.error('Municipality not found')
        router.push('/admin/municipalities')
      }
    } catch (error) {
      console.error('Failed to fetch municipality:', error)
      toast.error('Failed to load municipality')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'population') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      toast.error('Name and slug are required')
      return
    }
    
    setIsSaving(true)

    try {
      const url = isNew ? '/api/municipalities' : `/api/municipalities/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(isNew ? 'Municipality created!' : 'Municipality updated!')
        router.push('/admin/municipalities')
      } else {
        toast.error(data.error || 'Failed to save municipality')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save municipality')
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
        <Link href="/admin/municipalities">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Add Municipality' : 'Edit Municipality'}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? 'Add a new municipality' : `Editing: ${formData.name}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Municipality name and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Bongao"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g., bongao"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                placeholder="e.g., The Capital of Tawi-Tawi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the municipality..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Logo and hero image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageInput
                value={formData.logo || ''}
                onChange={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                placeholder="Paste logo URL..."
              />
            </div>
            <div className="space-y-2">
              <Label>Hero Image</Label>
              <ImageInput
                value={formData.heroImage || ''}
                onChange={(url) => setFormData(prev => ({ ...prev, heroImage: url }))}
                placeholder="Paste hero image URL..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How to reach the municipality</CardDescription>
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
                  placeholder="municipality@example.com"
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
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={2}
                placeholder="Municipal Hall address..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Population and classification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="population">Population</Label>
                <Input
                  id="population"
                  name="population"
                  type="number"
                  value={formData.population || ''}
                  onChange={handleChange}
                  placeholder="e.g., 100000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area</Label>
                <Input
                  id="landArea"
                  name="landArea"
                  value={formData.landArea || ''}
                  onChange={handleChange}
                  placeholder="e.g., 243.20 km²"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incomeClass">Income Class</Label>
                <Input
                  id="incomeClass"
                  name="incomeClass"
                  value={formData.incomeClass || ''}
                  onChange={handleChange}
                  placeholder="e.g., 1st Class"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <select
                  id="district"
                  name="district"
                  value={formData.district || ''}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">-- Select District --</option>
                  <option value="FIRST">First District</option>
                  <option value="SECOND">Second District</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive ?? true}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Active (visible on public site)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/municipalities">
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
                {isNew ? 'Create Municipality' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
