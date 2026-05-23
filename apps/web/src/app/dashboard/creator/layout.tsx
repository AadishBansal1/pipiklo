'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in')
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
        <p className="text-sm">Loading Creator Studio…</p>
      </div>
    </div>
  )

  if (!isSignedIn) return null

  return (
    <div className="flex flex-col flex-1">
      {/* Creator Studio identity band */}
      <div className="border-b bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500 text-white px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span>Creator Studio</span>
          </div>
          <Link href="/" className="text-white/70 hover:text-white text-xs transition-colors">
            ← Back to Pipiklo
          </Link>
        </div>
      </div>

      <div className="flex flex-1">
        <DashboardSidebar variant="creator" />
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  )
}
