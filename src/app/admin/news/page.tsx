'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Star, Search, Newspaper, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import type { ProvincialNews } from '@/types'

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: 'Announcement',
  EVENT: 'Event',
  PROJECT: 'Project',
  AWARD: 'Award',
  PRESS_RELEASE: 'Press Release',
  GENERAL: 'General',
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<ProvincialNews[]>([])
  const [filteredNews, setFilteredNews] = useState<ProvincialNews[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all')

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, searchQuery, statusFilter])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news?published=false')
      const data = await response.json()
      if (data.success) {
        setNews(data.news)
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      toast.error('Failed to load news')
    } finally {
      setIsLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = [...news]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter === 'published') {
      filtered = filtered.filter(n => n.published)
    } else if (statusFilter === 'draft') {
      filtered = filtered.filter(n => !n.published)
    } else if (statusFilter === 'featured') {
      filtered = filtered.filter(n => n.featured)
    }

    setFilteredNews(filtered)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/news/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('News deleted successfully')
        setNews(news.filter(n => n.id !== deleteId))
      } else {
        toast.error(data.error || 'Failed to delete news')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete news')
    } finally {
      setDeleteId(null)
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(currentFeatured ? 'Removed from featured' : 'Added to featured')
        setNews(news.map(n => 
          n.id === id ? { ...n, featured: !currentFeatured } : n
        ))
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch (error) {
      console.error('Toggle featured error:', error)
      toast.error('Failed to update')
    }
  }

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          published: !currentPublished,
          publishedAt: !currentPublished ? new Date().toISOString() : null,
        }),
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(currentPublished ? 'Unpublished' : 'Published')
        setNews(news.map(n => 
          n.id === id ? { ...n, published: !currentPublished } : n
        ))
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch (error) {
      console.error('Toggle publish error:', error)
      toast.error('Failed to update')
    }
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">News & Updates</h1>
          <p className="text-muted-foreground">
            Manage news articles and announcements
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create News
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All News</CardTitle>
              <CardDescription>
                {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading news...
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' ? 'No news found matching your filters' : 'No news articles yet'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/admin/news/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Article
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16 text-center">⭐</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      {article.bannerImage ? (
                        <img
                          src={article.bannerImage}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <Newspaper className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{article.title}</p>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground truncate">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.category ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {categoryLabels[article.category] || article.category}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleTogglePublish(article.id, article.published)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          article.published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {article.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleFeatured(article.id, article.featured)}
                        className={`p-1 rounded hover:bg-muted transition-colors ${
                          article.featured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                        }`}
                        title={article.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star className={`w-5 h-5 ${article.featured ? 'fill-current' : ''}`} />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/news/${article.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteId(article.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete News Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
