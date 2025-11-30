'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import type { Directory } from '@/types'

const categoryLabels: Record<Directory['category'], string> = {
  PROVINCIAL_OFFICE: 'Provincial Department/Office',
  NATIONAL_AGENCY: 'National Government Agency',
  BARMM_MINISTRY: 'BARMM Ministry',
  LGU: 'Local Government Unit',
  OTHER: 'Other',
}

export default function AdminDirectoriesPage() {
  const [directories, setDirectories] = useState<Directory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchDirectories()
  }, [])

  const fetchDirectories = async () => {
    try {
      const response = await fetch('/api/directories')
      const data = await response.json()
      if (data.success) {
        setDirectories(data.directories)
      }
    } catch (error) {
      console.error('Failed to fetch directories:', error)
      toast.error('Failed to load directories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/directories/${deleteId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Directory deleted successfully')
        setDirectories(directories.filter(d => d.id !== deleteId))
      } else {
        toast.error(data.error || 'Failed to delete directory')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete directory')
    } finally {
      setDeleteId(null)
    }
  }

  // Group by category
  const grouped = directories.reduce((acc, dir) => {
    if (!acc[dir.category]) acc[dir.category] = []
    acc[dir.category].push(dir)
    return acc
  }, {} as Record<string, Directory[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Directory</h1>
          <p className="text-muted-foreground">
            Manage government agencies and offices
          </p>
        </div>
        <Link href="/admin/directories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Agency/Office
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agencies & Offices</CardTitle>
          <CardDescription>
            {directories.length} entr{directories.length !== 1 ? 'ies' : 'y'} in directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading directories...
            </div>
          ) : directories.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No agencies/offices yet</p>
              <Link href="/admin/directories/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Entry
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {directories.map((dir) => (
                  <TableRow key={dir.id}>
                    <TableCell className="font-medium">{dir.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                        {categoryLabels[dir.category]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {dir.headName ? (
                        <div>
                          <p className="font-medium">{dir.headName}</p>
                          <p className="text-sm text-muted-foreground">{dir.headTitle}</p>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{dir.email}</p>
                        <p className="text-muted-foreground">{dir.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/directories/${dir.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteId(dir.id)}
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
            <AlertDialogTitle>Delete Directory Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this agency/office? This action cannot be undone.
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
