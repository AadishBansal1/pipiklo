'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store/app-store'
import { Sparkles } from 'lucide-react'

export default function DashboardRouterPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/sign-in')
      return
    }
    // Wait for SupabaseProvider to set the user in the store
    if (!user) return

    // Read role from localStorage (set during sign-in/sign-up)
    const pendingRole = localStorage.getItem('pipiklo_pending_role') as
      | 'customer'
      | 'creator'
      | null

    const role = pendingRole ?? user.role

    // Clear pending role — it's been consumed
    localStorage.removeItem('pipiklo_pending_role')

    if (role === 'creator') {
      router.replace('/dashboard/creator')
    } else {
      router.replace('/dashboard/customer')
    }
  }, [isLoaded, isSignedIn, user, router])

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
        <p className="text-sm">Loading your dashboard…</p>
      </div>
    </div>
  )
}
