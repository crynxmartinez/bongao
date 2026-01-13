import Link from 'next/link'
import { FileText, Clock, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PublicHeader } from '@/components/layout/public-header'

export default function GazettePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Provincial Gazette</h1>
          <p className="text-white/80">
            Official ordinances and resolutions of the Province of Tawi-Tawi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              The Provincial Gazette section is currently under development. Soon you will be able to access official ordinances and resolutions here.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <Clock className="w-4 h-4" />
              <span>Expected to launch soon</span>
            </div>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
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

export const metadata = {
  title: 'Provincial Gazette - Province of Tawi-Tawi',
  description: 'Official ordinances and resolutions of the Provincial Government of Tawi-Tawi.',
}
