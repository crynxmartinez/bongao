import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { getNewsBySlug, getProvincialNews } from '@/lib/firestore/news'

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: 'Announcement',
  EVENT: 'Event',
  PROJECT: 'Project',
  AWARD: 'Award',
  PRESS_RELEASE: 'Press Release',
  GENERAL: 'General',
}

interface PageProps {
  params: { slug: string }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const article = await getNewsBySlug(params.slug)

  if (!article || !article.published) {
    notFound()
  }

  // Get related news (same category, excluding current)
  const allNews = await getProvincialNews(true)
  const relatedNews = allNews
    .filter(n => n.id !== article.id && n.category === article.category)
    .slice(0, 3)

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
      {/* Banner Image */}
      <div className="relative h-64 md:h-96 bg-gray-900">
        {article.bannerImage && (
          <img
            src={article.bannerImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link 
            href="/news"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <article className="bg-white rounded-lg shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt || article.createdAt)}
            </div>
            {article.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                  {categoryLabels[article.category] || article.category}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold mb-6">
            {article.title}
          </h1>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 mb-8">
            <h2 className="text-xl font-bold mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <Link 
                  key={news.id} 
                  href={`/news/${news.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video relative overflow-hidden">
                      {news.bannerImage ? (
                        <img
                          src={news.bannerImage}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(news.publishedAt || news.createdAt)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
