import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Check if we're on the login page
  // This is handled by checking the path in the component

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar user={session.user} />
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
