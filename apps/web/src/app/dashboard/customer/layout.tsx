'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { useAppStore } from '@/store/app-store'
import { Sparkles, Coins } from 'lucide-react'
import Link from 'next/link'

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const { user } = useAppStore()

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in')
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
        <p className="text-sm">Loading your account…</p>
      </div>
    </div>
  )

  if (!isSignedIn) return null

  return (
    <div className="flex flex-col flex-1">
      {/* Customer identity band — shows token balance */}
      <div className="border-b bg-background/80 backdrop-blur-sm px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            <span>My Account</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 hover:bg-amber-100 transition-colors text-xs font-bold text-amber-700 dark:text-amber-400"
            >
              <Coins className="h-3.5 w-3.5" />
              {user?.tokens ?? 0} tokens
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground text-xs transition-colors">
              ← Back to store
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <DashboardSidebar variant="customer" />
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">{children}</main>
      </div>
    </div>
  )
}
