import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Province of Tawi-Tawi | Official Government Website',
    template: '%s | Province of Tawi-Tawi',
  },
  description: 'Official website of the Provincial Government of Tawi-Tawi. Gobyernong kaSali ang lahat.',
  keywords: ['Tawi-Tawi', 'Province', 'Government', 'BARMM', 'Philippines', 'Bongao'],
  authors: [{ name: 'Provincial Government of Tawi-Tawi' }],
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    siteName: 'Province of Tawi-Tawi',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
