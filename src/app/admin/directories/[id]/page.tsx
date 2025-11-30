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
import type { Directory } from '@/types'

export default function EditDirectoryPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Directory>>({
    name: '',
    slug: '',
    category: 'PROVINCIAL_OFFICE',
    description: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
    headName: '',
    headTitle: '',
    officeHours: '',
    order: 0,
    isActive: true,
  })

  useEffect(() => {
    if (!isNew) {
      fetchDirectory()
    }
  }, [isNew, params.id])

  const fetchDirectory = async () => {
    try {
      const response = await fetch(`/api/directories/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.directory)
      } else {
        toast.error('Directory not found')
        router.push('/admin/directories')
      }
    } catch (error) {
      console.error('Failed to fetch directory:', error)
      toast.error('Failed to load directory')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.email || !formData.phone) {
      toast.error('Email and Phone are required')
      return
    }
    
    setIsSaving(true)

    try {
      const url = isNew ? '/api/directories' : `/api/directories/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(isNew ? 'Directory created successfully' : 'Directory updated successfully')
        router.push('/admin/directories')
      } else {
        toast.error(data.error || 'Failed to save directory')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save directory')
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
        <Link href="/admin/directories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Add New Agency/Office' : 'Edit Agency/Office'}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? 'Add a new entry to the directory' : `Editing: ${formData.name}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Agency or office details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department/Agency Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Provincial Planning and Development Office"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || 'PROVINCIAL_OFFICE'}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  required
                >
                  <option value="PROVINCIAL_OFFICE">Provincial Department/Office</option>
                  <option value="NATIONAL_AGENCY">National Government Agency</option>
                  <option value="BARMM_MINISTRY">BARMM Ministry</option>
                  <option value="LGU">Local Government Unit</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the agency/office..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Officer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Officer Information</CardTitle>
            <CardDescription>Head of office or department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headName">Officer Name</Label>
                <Input
                  id="headName"
                  name="headName"
                  value={formData.headName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Juan Dela Cruz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headTitle">Title/Position</Label>
                <Input
                  id="headTitle"
                  name="headTitle"
                  value={formData.headTitle || ''}
                  onChange={handleChange}
                  placeholder="e.g., Provincial Planning Officer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info - REQUIRED */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information *</CardTitle>
            <CardDescription>Email and phone are required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                  placeholder="office@tawi-tawi.gov.ph"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                  placeholder="(068) 268-XXXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="Capitol Complex, Bongao, Tawi-Tawi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="officeHours">Office Hours</Label>
                <Input
                  id="officeHours"
                  name="officeHours"
                  value={formData.officeHours || ''}
                  onChange={handleChange}
                  placeholder="Mon-Fri 8:00 AM - 5:00 PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>Agency/office logo image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL of the logo image
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display Order */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/directories">
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
                {isNew ? 'Create Entry' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
