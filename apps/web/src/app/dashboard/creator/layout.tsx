'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Creator mode is hidden — redirect anyone who lands here to customer dashboard
export default function CreatorDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/customer')
  }, [router])

  return null
}
