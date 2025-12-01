'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ProvincialNews } from '@/types'

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: 'Announcement',
  EVENT: 'Event',
  PROJECT: 'Project',
  AWARD: 'Award',
  PRESS_RELEASE: 'Press Release',
  GENERAL: 'General',
}

interface NewsListProps {
  news: ProvincialNews[]
}

export function NewsList({ news }: NewsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Filter news based on search and category
  const filteredNews = news.filter((article) => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = category === '' || article.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Filters */}
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

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {news.length === 0 ? 'No news articles yet.' : 'No news found matching your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredNews.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.slug}`}
              className="group"
            >
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  {article.bannerImage ? (
                    <img
                      src={article.bannerImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  {article.category && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs rounded">
                      {categoryLabels[article.category] || article.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
