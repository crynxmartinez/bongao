'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderOpen,
  Newspaper,
  FileText,
  Image,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { User } from '@/types'
import { useState } from 'react'
import { toast } from 'sonner'

interface AdminSidebarProps {
  user: Omit<User, 'password'>
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Profiles', href: '/admin/profiles', icon: Users },
  { name: 'Municipalities', href: '/admin/municipalities', icon: MapPin },
  { name: 'Directories', href: '/admin/directories', icon: FolderOpen },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Gazette', href: '/admin/gazette', icon: FileText },
  { name: 'Media', href: '/admin/media', icon: Image },
]

const settingsNav = [
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Users', href: '/admin/users', icon: Users },
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/login')
      router.refresh()
    } catch {
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">TT</span>
            </div>
            <div>
              <span className="font-bold text-sm">Tawi-Tawi</span>
              <span className="text-xs text-muted-foreground block">Admin CMS</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role.replace('_', ' ')}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Settings Section */}
            {(user.role === 'SUPER_ADMIN' || user.role === 'PROVINCIAL_ADMIN') && (
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                  Settings
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {settingsNav.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                          pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}

            {/* Logout */}
            <li className="mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start gap-x-3 text-gray-700 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
