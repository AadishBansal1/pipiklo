'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Sparkles } from 'lucide-react'

export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading spinner while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
          <p className="text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  // Not signed in — redirecting (show nothing to avoid flash)
  if (!isSignedIn) return null

  return (
    <div className="flex flex-1">
      <DashboardSidebar variant="creator" />
      <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">{children}</main>
    </div>
  )
}
