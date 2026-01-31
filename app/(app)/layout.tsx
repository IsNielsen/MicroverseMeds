import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="relative min-h-screen">
      {/* Mobile-first: full width on mobile, centered container on desktop */}
      <div className="min-h-screen md:flex md:items-start md:justify-center md:bg-gray-100 md:pt-8 md:pb-8">
        <div className="min-h-screen md:min-h-0 w-full md:max-w-md md:shadow-2xl md:rounded-3xl bg-white pb-24">
          {children}
        </div>
      </div>
    </div>
  )
}
