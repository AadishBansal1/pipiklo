'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useLayoutEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="flex flex-1">
      <DashboardSidebar variant="creator" />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
