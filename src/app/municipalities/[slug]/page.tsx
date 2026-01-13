import Link from 'next/link'
import { MapPin, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PublicHeader } from '@/components/layout/public-header'

const municipalityNames: Record<string, string> = {
  'bongao': 'Bongao',
  'mapun': 'Mapun',
  'sibutu': 'Sibutu',
  'sitangkai': 'Sitangkai',
  'simunul': 'Simunul',
  'languyan': 'Languyan',
  'panglima-sugala': 'Panglima Sugala',
  'sapa-sapa': 'Sapa-Sapa',
  'south-ubian': 'South Ubian',
  'tandubas': 'Tandubas',
  'turtle-island': 'Turtle Island',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function MunicipalityPage({ params }: PageProps) {
  const { slug } = await params
  const municipalityName = municipalityNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Municipality of {municipalityName}</h1>
          <p className="text-white/80">
            Province of Tawi-Tawi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Website Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The official website for the Municipality of {municipalityName} is currently under development. Please check back later for updates.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <Clock className="w-4 h-4" />
              <span>Expected to launch soon</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Provincial Site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi
          </p>
        </div>
      </footer>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const municipalityName = municipalityNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  
  return {
    title: `Municipality of ${municipalityName} - Province of Tawi-Tawi`,
    description: `Official website of the Municipality of ${municipalityName}, Province of Tawi-Tawi.`,
  }
}
