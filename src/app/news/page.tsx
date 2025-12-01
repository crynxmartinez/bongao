import { getProvincialNews } from '@/lib/firestore/news'
import { PublicHeader } from '@/components/layout/public-header'
import { NewsList } from './news-list'

export default async function NewsPage() {
  const news = await getProvincialNews(true)

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
        <NewsList news={news} />
      </div>
    </div>
  )
}

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0
