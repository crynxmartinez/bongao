import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Briefcase,
  Award,
  ArrowLeft,
  Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function GovernorPage() {
  // Governor data
  const governor = {
    firstName: 'Yshmael',
    middleName: 'I.',
    lastName: 'Sali',
    nickname: 'Mang',
    position: 'Governor',
    organization: 'Province of Tawi-Tawi',
    image: 'https://storage.googleapis.com/msgsndr/xzA6eU8kOYmBuwFdr3CF/media/692c2faf82f4c5c37d1baacc.png',
    bio: 'Governor Yshmael "Mang" I. Sali is the current Governor of the Province of Tawi-Tawi. He is committed to the development and progress of Tawi-Tawi through his 11-Point Agenda, focusing on governance, economic growth, and the welfare of the Tawi-Tawian people.',
    email: 'governor@tawi-tawi.gov.ph',
    phone: '+63 966 2732 237',
    facebook: 'https://www.facebook.com/governormang',
    address: 'Office of the Governor, Capitol Hills, Tubig Boh, Bongao, Tawi-Tawi',
    stats: {
      yearsInService: '5+',
      projects: '50+',
      municipalities: '11'
    }
  }

  const fullName = `${governor.firstName} "${governor.nickname}" ${governor.middleName} ${governor.lastName}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Profile Hero */}
      <section className="bg-primary text-white pb-32 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Photo */}
            <div className="relative mb-6">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl bg-primary/20 flex items-center justify-center">
                <span className="text-6xl font-bold text-white/80">YS</span>
              </div>
            </div>

            {/* Info */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{fullName}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-1">{governor.position}</p>
            <p className="text-lg text-white/70">{governor.organization}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 -mt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* About Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-primary">About the Governor</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{governor.bio}</p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold text-gray-900">{governor.stats.yearsInService}</p>
                <p className="text-sm text-gray-500">Years in Service</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold text-gray-900">{governor.stats.projects}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold text-gray-900">{governor.stats.municipalities}</p>
                <p className="text-sm text-gray-500">Municipalities</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-primary">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${governor.email}`} className="text-gray-900 hover:text-primary transition-colors">
                      {governor.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${governor.phone}`} className="text-gray-900 hover:text-primary transition-colors">
                      {governor.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Office Address</p>
                    <p className="text-gray-900">{governor.address}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-3">Connect with the Governor</p>
                <div className="flex gap-3">
                  <a 
                    href={governor.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook Page
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Provincial Government of Tawi-Tawi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export const metadata = {
  title: 'The Governor - Yshmael "Mang" I. Sali',
  description: 'Official profile of Governor Yshmael "Mang" I. Sali of the Province of Tawi-Tawi.',
}
