'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageInput } from '@/components/ui/image-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { toast } from 'sonner'
import type { ProvincialNews } from '@/types'

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<ProvincialNews>>({
    title: '',
    slug: '',
    bannerImage: '',
    content: '',
    excerpt: '',
    category: undefined,
    published: false,
  })

  useEffect(() => {
    if (!isNew) {
      fetchNews()
    }
  }, [isNew, params.id])

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.news)
      } else {
        toast.error('News not found')
        router.push('/admin/news')
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      toast.error('Failed to load news')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100)
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.bannerImage || !formData.content) {
      toast.error('Please fill in title, banner image, and content')
      return
    }
    
    setIsSaving(true)

    try {
      const url = isNew ? '/api/news' : `/api/news/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const payload = {
        ...formData,
        published: publish,
        publishedAt: publish ? new Date().toISOString() : formData.publishedAt,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          isNew 
            ? (publish ? 'News published!' : 'News saved as draft') 
            : 'News updated successfully'
        )
        router.push('/admin/news')
      } else {
        toast.error(data.error || 'Failed to save news')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save news')
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/news">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? 'Create News Article' : 'Edit News Article'}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Write a new news article' : `Editing: ${formData.title}`}
            </p>
          </div>
        </div>
        {!isNew && formData.published && (
          <Link href={`/news/${formData.slug}`} target="_blank">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </Link>
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Title & Slug */}
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Basic information about the article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                placeholder="Enter article title..."
                className="text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  placeholder="auto-generated-from-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">-- Select Category --</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="EVENT">Event</option>
                  <option value="PROJECT">Project</option>
                  <option value="AWARD">Award</option>
                  <option value="PRESS_RELEASE">Press Release</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banner Image */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Image *</CardTitle>
            <CardDescription>
              The main image displayed at the top of the article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageInput
              value={formData.bannerImage || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, bannerImage: url }))}
              placeholder="Paste image URL or drag & drop..."
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <CardDescription>
              Write your article content. You can format text, add images, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={formData.content || ''}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Start writing your article..."
            />
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card>
          <CardHeader>
            <CardTitle>Excerpt (Optional)</CardTitle>
            <CardDescription>
              A short summary shown on news cards. Auto-generated if left empty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              placeholder="Brief summary of the article..."
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/news">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="outline" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          <Button 
            type="button" 
            disabled={isSaving}
            onClick={(e) => handleSubmit(e, true)}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {formData.published ? 'Update & Publish' : 'Publish'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
