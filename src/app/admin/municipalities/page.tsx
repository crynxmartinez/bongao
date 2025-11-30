'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, MapPin, Search, ExternalLink } from 'lucide-react'
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
import type { Municipality } from '@/types'

export default function AdminMunicipalitiesPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<Municipality[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMunicipalities()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setFilteredMunicipalities(
        municipalities.filter(m => 
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredMunicipalities(municipalities)
    }
  }, [municipalities, searchQuery])

  const fetchMunicipalities = async () => {
    try {
      const response = await fetch('/api/municipalities')
      const data = await response.json()
      if (data.success) {
        setMunicipalities(data.municipalities)
      }
    } catch (error) {
      console.error('Failed to fetch municipalities:', error)
      toast.error('Failed to load municipalities')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/municipalities/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Municipality deleted successfully')
        setMunicipalities(municipalities.filter(m => m.id !== deleteId))
      } else {
        toast.error(data.error || 'Failed to delete municipality')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete municipality')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Municipalities</h1>
          <p className="text-muted-foreground">
            Manage the 11 municipalities of Tawi-Tawi
          </p>
        </div>
        <Link href="/admin/municipalities/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Municipality
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Municipalities</CardTitle>
              <CardDescription>
                {filteredMunicipalities.length} of {municipalities.length} municipalities
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search municipalities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading municipalities...
            </div>
          ) : filteredMunicipalities.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No municipalities found' : 'No municipalities yet'}
              </p>
              {!searchQuery && (
                <Link href="/admin/municipalities/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Municipality
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMunicipalities.map((municipality) => (
                  <TableRow key={municipality.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{municipality.name}</p>
                          {municipality.tagline && (
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {municipality.tagline}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {municipality.slug}
                    </TableCell>
                    <TableCell>
                      {municipality.population?.toLocaleString() || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        municipality.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {municipality.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/municipality/${municipality.slug}`} target="_blank">
                          <Button variant="outline" size="sm" title="View public page">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/municipalities/${municipality.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteId(municipality.id)}
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
            <AlertDialogTitle>Delete Municipality</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this municipality? This will also delete all associated data (officials, barangays, etc.). This action cannot be undone.
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
