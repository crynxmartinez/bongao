import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { getProvincialNews } from '@/lib/firestore/news'
import { PublicHeader } from '@/components/layout/public-header'
import { NewsFilters } from './news-filters'

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: 'Announcement',
  EVENT: 'Event',
  PROJECT: 'Project',
  AWARD: 'Award',
  PRESS_RELEASE: 'Press Release',
  GENERAL: 'General',
}

export default async function NewsPage() {
  const news = await getProvincialNews(true)

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PublicHeader />

      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">News & Updates</h1>
          <p className="text-white/80">
            Stay informed with the latest news from the Province of Tawi-Tawi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <NewsFilters />

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No news articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {news.map((article) => (
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
      </div>
    </div>
  )
}

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
