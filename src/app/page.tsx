import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  Building2,
  Users,
  FileText,
  Newspaper,
  BookOpen,
  Mountain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getMunicipalities } from '@/lib/firestore/municipalities'

// Quick Links - these are static navigation items
const quickLinks = [
  { title: 'The Governor', href: '/governor', icon: Users, description: 'Office of the Governor' },
  { title: 'Sangguniang Panlalawigan', href: '/sangguniang-panlalawigan', icon: Building2, description: 'Provincial Board' },
  { title: 'Directory', href: '/directory', icon: BookOpen, description: 'Government Offices' },
  { title: 'Gazette', href: '/gazette', icon: FileText, description: 'Ordinances & Resolutions' },
  { title: 'News', href: '/news', icon: Newspaper, description: 'Latest Updates' },
  { title: 'History', href: '/history', icon: Mountain, description: 'Provincial History' },
]

export default async function HomePage() {
  // Fetch municipalities from database
  let municipalities: Awaited<ReturnType<typeof getMunicipalities>> = []
  
  try {
    municipalities = await getMunicipalities()
  } catch (error) {
    console.error('Failed to fetch municipalities:', error)
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Province of Tawi-Tawi</h1>
                <p className="text-xs text-muted-foreground">Gobyernong kaSali ang lahat</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/governor" className="text-sm hover:text-primary transition-colors">Governor</Link>
              <Link href="/sangguniang-panlalawigan" className="text-sm hover:text-primary transition-colors">Officials</Link>
              <Link href="/municipalities" className="text-sm hover:text-primary transition-colors">Municipalities</Link>
              <Link href="/directory" className="text-sm hover:text-primary transition-colors">Directory</Link>
              <Link href="/gazette" className="text-sm hover:text-primary transition-colors">Gazette</Link>
              <Link href="/news" className="text-sm hover:text-primary transition-colors">News</Link>
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
            </nav>

            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-600 via-ocean-500 to-ocean-700 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Tawi-Tawi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              The Southernmost Province of the Philippines. Gateway to BIMP-EAGA. 
              Home to pristine beaches, rich culture, and the most hospitable people of the south.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/governor">
                <Button size="lg" className="bg-white text-ocean-600 hover:bg-white/90">
                  Meet the Governor
                </Button>
              </Link>
              <Link href="/municipalities">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Explore Municipalities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <link.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold text-sm">{link.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Municipalities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Municipalities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tawi-Tawi is composed of 11 municipalities, each with its unique culture, history, and natural beauty.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {municipalities.map((muni) => (
              <Link key={muni.id} href={`/municipalities/${muni.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{muni.name}</h3>
                        {muni.tagline && (
                          <p className="text-sm text-muted-foreground">{muni.tagline}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-muted-foreground mb-8">
              Have questions or need assistance? Reach out to the Provincial Government of Tawi-Tawi.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Capitol Hills, Tubig Boh, Bongao, Tawi-Tawi, Philippines</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+63 966 273 2237 | +63 930 513 5195</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>kasalitawitawi2019@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Monday - Friday: 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Province of Tawi-Tawi</h3>
              <p className="text-gray-400 text-sm">
                Gobyernong kaSali ang lahat
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/governor" className="hover:text-white transition-colors">The Governor</Link></li>
                <li><Link href="/sangguniang-panlalawigan" className="hover:text-white transition-colors">Officials</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/gazette" className="hover:text-white transition-colors">Gazette</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Government Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://www.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GOV.PH</a></li>
                <li><a href="https://president.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Office of the President</a></li>
                <li><a href="https://www.officialgazette.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Gazette</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About GOVPH</h4>
              <p className="text-sm text-gray-400">
                Learn more about the Philippine government, its structure, how government works and the people behind it.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>Copyright © {new Date().getFullYear()} Provincial Government of Tawi-Tawi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
