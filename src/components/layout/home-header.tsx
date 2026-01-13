'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown,
  ChevronRight,
  Menu,
  X
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

const mainNavLinks = [
  { name: 'News', href: '/news' },
  { name: 'Gazette', href: '/gazette' },
  { name: 'Directory', href: '/directory' },
  { name: 'Contact Us', href: '/contact-us' },
]

export function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [provinceExpanded, setProvinceExpanded] = useState(false)
  const [municipalitiesExpanded, setMunicipalitiesExpanded] = useState(false)

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setProvinceExpanded(false)
    setMunicipalitiesExpanded(false)
  }

  return (
    <>
      {/* Top Bar - Black */}
      <div className="bg-black text-white text-xs sm:text-sm py-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="tel:+639662732237" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden xs:inline">+63 966 2732 237</span>
              <span className="xs:hidden">Call</span>
            </a>
            <a href="mailto:kasalitawitawi2019@gmail.com" className="hidden sm:flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="w-3 h-3" />
              <span className="hidden md:inline">kasalitawitawi2019@gmail.com</span>
              <span className="md:hidden">Email</span>
            </a>
          </div>
          <span className="flex items-center gap-1 text-white/80">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">Monday - Friday:</span> 8AM - 5PM
          </span>
        </div>
      </div>

      {/* Main Header - Green Background */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMobileMenu}>
              <Image 
                src="https://storage.googleapis.com/msgsndr/xzA6eU8kOYmBuwFdr3CF/media/692c2fb282f4c5268e1baafe.png" 
                alt="Tawi-Tawi Provincial Seal"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="text-white font-semibold text-sm sm:text-base hidden sm:block">PROVINCE OF TAWI-TAWI</span>
              <span className="text-white font-semibold text-sm sm:hidden">TAWI-TAWI</span>
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
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all max-h-80 overflow-y-auto">
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
            <button 
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="container mx-auto px-4 py-4 overflow-y-auto max-h-[calc(80vh-2rem)]">
            {/* Province Accordion */}
            <div className="border-b border-gray-100">
              <button
                className="w-full flex items-center justify-between py-3 text-gray-900 font-medium"
                onClick={() => setProvinceExpanded(!provinceExpanded)}
              >
                <span>Province</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${provinceExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${provinceExpanded ? 'max-h-48 pb-2' : 'max-h-0'}`}>
                {provinceDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2 pl-4 text-gray-600 hover:text-primary transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Municipalities Accordion */}
            <div className="border-b border-gray-100">
              <button
                className="w-full flex items-center justify-between py-3 text-gray-900 font-medium"
                onClick={() => setMunicipalitiesExpanded(!municipalitiesExpanded)}
              >
                <span>Municipalities</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${municipalitiesExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${municipalitiesExpanded ? 'max-h-96 pb-2' : 'max-h-0'}`}>
                <div className="grid grid-cols-2 gap-1">
                  {municipalitiesNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-2 pl-4 text-sm text-gray-600 hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Nav Links */}
            {mainNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-3 text-gray-900 font-medium border-b border-gray-100 hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                <span>{item.name}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}

            {/* Login Button */}
            <div className="pt-4">
              <Link
                href="/login"
                className="block w-full py-3 text-center font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
          style={{ top: '92px' }}
        />
      )}
    </>
  )
}
