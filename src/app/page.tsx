import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  ChevronDown,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getMunicipalities } from '@/lib/firestore/municipalities'

// Navigation structure matching original site
const provinceDropdown = [
  { name: 'The Governor', href: '/the-governor' },
  { name: 'Sangguniang Panlalawigan', href: '/sangguniang-panlalawigan' },
  { name: 'History', href: '/history' },
]

// 11 Municipalities
const municipalitiesNav = [
  { name: 'Bongao', href: '/bongao' },
  { name: 'Mapun', href: '/mapun' },
  { name: 'Sibutu', href: '/sibutu' },
  { name: 'Sitangkai', href: '/sitangkai' },
  { name: 'Simunul', href: '/simunul' },
  { name: 'Languyan', href: '/languyan' },
  { name: 'Panglima Sugala', href: '/panglima-sugala' },
  { name: 'Sapa-Sapa', href: '/sapa-sapa' },
  { name: 'South Ubian', href: '/south-ubian' },
  { name: 'Tandubas', href: '/tandubas' },
  { name: 'Turtle Island', href: '/turtle-island' },
]

// 11-Point Agenda from original site
const agenda = [
  { number: 1, title: 'Governance for Prosperity', description: 'Integrity and Unity in the Bangsamoro Autonomous Region in Muslim Mindanao (BARMM).' },
  { number: 2, title: 'Gateway to BIMP-EAGA', description: 'Opens its Gateway and make Tawi-Tawi as the main hub of trading in BARMM to the BIMPEAGA member countries and boost socioeconomic activities.' },
  { number: 3, title: 'Revenue & Tourism', description: 'Becomes the BARMM biggest revenue contributor not only for aqua-agriculture product, but to eco-tourism industry.' },
  { number: 4, title: 'Halal Manufacturing', description: 'Manufacturing and producers of basic halal Commodities like Tuna, mackerel canning, semiprocessed seaweeds and other processed Aquatic food produce.' },
  { number: 5, title: 'Communication & Transport', description: 'Advancement to both Communication and Transportation facilities to Boost Economic Activities, Faster, accessible information Technology.' },
  { number: 6, title: 'Natural Resources', description: 'Natural Resources Management Programs to Sustain Ecological and Environmental Protection for disaster resiliency.' },
  { number: 7, title: 'Gender & Development', description: 'Gender and development advocacy. Protection of children and woman.' },
  { number: 8, title: 'Health & Education', description: 'Sustainability and Development for Health, Education and Basic Services. Water system improvement and Power availability.' },
  { number: 9, title: 'Anti-Drug Campaign', description: 'Anti-Drug Abuse Campaign and Anti-RedTape, Anti-Terrorism and Extremism ending all forms of violence.' },
  { number: 10, title: 'Livable Tawi-Tawi', description: 'Livable Tawi-Tawi with Sufficient Foods, Effective Services, Enhanced Service Providers. Guaranteed income and secured foods.' },
  { number: 11, title: 'Tourism Destination', description: 'Introducing Tawi-Tawi To The World and make it as a prime tourist destination with proud cultural heritage.' },
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
      {/* Top Bar - Black */}
      <div className="bg-black text-white text-sm py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +63 966 2732 237 | +63 930 5135 195
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail className="w-3 h-3" />
              kasalitawitawi2019@gmail.com
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Monday - Friday: 8:00 AM - 5:00 PM
          </span>
        </div>
      </div>

      {/* Main Header - Green Background */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="https://storage.googleapis.com/msgsndr/xzA6eU8kOYmBuwFdr3CF/media/692c2fb282f4c5268e1baafe.png" 
                alt="Tawi-Tawi Provincial Seal"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <span className="text-white font-semibold hidden md:block">PROVINCE OF TAWI-TAWI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white border border-white rounded hover:bg-white/10 transition-colors">
                HOME
              </Link>
              
              {/* Province Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-1">
                  PROVINCE <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {provinceDropdown.map((item) => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Municipalities Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center gap-1">
                  MUNICIPALITIES <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {municipalitiesNav.map((item) => (
                    <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/gazette" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                GAZETTE
              </Link>
              <Link href="/directory" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                DIRECTORY
              </Link>
              <Link href="/contact-us" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                CONTACT US
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen minus headers */}
      <section 
        className="relative w-full flex items-center justify-center text-white overflow-hidden"
        style={{
          height: 'calc(100vh - 92px)',
          backgroundImage: 'url(https://storage.googleapis.com/msgsndr/xzA6eU8kOYmBuwFdr3CF/media/692c3036aaad917619d94776.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Yellow-Green Gradient Overlay - Darker */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-600/40 to-green-900/70" />
        
        {/* Main Content - Centered Text */}
        <div className="relative z-10 text-center -mt-20">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-2 tracking-wider drop-shadow-2xl italic">
            TAWI-TAWI
          </h1>
          <p className="text-2xl md:text-4xl lg:text-5xl font-light tracking-widest drop-shadow-xl mb-4">
            TO THE WORLD
          </p>
          <p className="text-2xl md:text-3xl lg:text-4xl text-yellow-400 drop-shadow-xl typewriter inline-block" style={{ fontFamily: 'var(--font-cursive)' }}>
            GOByernong kaSali ang lahat!
          </p>
        </div>

        {/* Governor and Vice Governor - Full Width at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <Image 
            src="https://storage.googleapis.com/msgsndr/xzA6eU8kOYmBuwFdr3CF/media/692c2faf82f4c5c37d1baacc.png"
            alt="Governor Yshmael Mang Sali and Vice Governor Al-Syed Sali"
            width={1920}
            height={800}
            className="w-full h-auto object-contain object-bottom"
            style={{ maxHeight: '75vh' }}
            priority
          />
        </div>
      </section>

      {/* 11-Point Agenda */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">EXPANDED ELEVEN (11) POINT AGENDA</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agenda.map((item) => (
              <div key={item.number} className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold flex-shrink-0">
                    {item.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Municipalities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Municipalities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tawi-Tawi is composed of 11 municipalities, each with its unique culture, history, and natural beauty.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {municipalitiesNav.map((muni) => (
              <Link key={muni.href} href={muni.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{muni.name}</h3>
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
              <h3 className="font-bold text-lg mb-4">Republic of the Philippines</h3>
              <p className="text-gray-400 text-sm">
                All content is in the public domain unless otherwise stated.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About GOVPH</h4>
              <p className="text-sm text-gray-400 mb-4">
                Learn more about the Philippine government, its structure, how government works and the people behind it.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://www.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GOV.PH</a></li>
                <li><a href="https://www.gov.ph/data" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Open Data Portal</a></li>
                <li><a href="https://www.officialgazette.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Gazette</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Government Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://president.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Office of the President</a></li>
                <li><a href="http://ovp.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Office of the Vice President</a></li>
                <li><a href="http://www.senate.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Senate of the Philippines</a></li>
                <li><a href="http://www.congress.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">House of Representatives</a></li>
                <li><a href="http://sc.judiciary.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Supreme Court</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +63 966 2732 237
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  kasalitawitawi2019@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Capitol Hills, Tubig Boh, Bongao
                </li>
              </ul>
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
