'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function NewsFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')

  // Note: For now, filtering is client-side only for display
  // In production, you'd want to use URL params and server-side filtering

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-10 px-3 rounded-md border border-input bg-white text-sm"
      >
        <option value="">All Categories</option>
        <option value="ANNOUNCEMENT">Announcements</option>
        <option value="EVENT">Events</option>
        <option value="PROJECT">Projects</option>
        <option value="AWARD">Awards</option>
        <option value="PRESS_RELEASE">Press Releases</option>
        <option value="GENERAL">General</option>
      </select>
    </div>
  )
}
