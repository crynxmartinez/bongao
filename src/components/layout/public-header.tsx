import Link from 'next/link'
import Image from 'next/image'
import { 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown,
  Menu
} from 'lucide-react'

// Navigation structure
const provinceDropdown = [
  { name: 'The Governor', href: '/the-governor' },
  { name: 'Sangguniang Panlalawigan', href: '/sangguniang-panlalawigan' },
  { name: 'History', href: '/history' },
]

const municipalitiesNav = [
  { name: 'Bongao', href: '/municipalities/bongao' },
  { name: 'Mapun', href: '/municipalities/mapun' },
  { name: 'Sibutu', href: '/municipalities/sibutu' },
  { name: 'Sitangkai', href: '/municipalities/sitangkai' },
  { name: 'Simunul', href: '/municipalities/simunul' },
  { name: 'Languyan', href: '/municipalities/languyan' },
  { name: 'Panglima Sugala', href: '/municipalities/panglima-sugala' },
  { name: 'Sapa-Sapa', href: '/municipalities/sapa-sapa' },
  { name: 'South Ubian', href: '/municipalities/south-ubian' },
  { name: 'Tandubas', href: '/municipalities/tandubas' },
  { name: 'Turtle Island', href: '/municipalities/turtle-island' },
]

export function PublicHeader() {
  return (
    <>
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

              <Link href="/news" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                NEWS
              </Link>
              <Link href="/gazette" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                GAZETTE
              </Link>
              <Link href="/directory" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                DIRECTORY
              </Link>
              <Link href="/contact-us" className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                CONTACT US
              </Link>
              <Link href="/login" className="ml-2 px-4 py-2 text-sm font-medium text-primary bg-white rounded hover:bg-gray-100 transition-colors">
                LOGIN
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
