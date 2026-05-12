'use client'

import { useLayoutEffect, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import type { Role } from '@/store/app-store'

interface Props {
  requiredRole: Role
  redirectTo: string
  children: React.ReactNode
}

/**
 * Auth guard with zero perceived latency.
 * Uses useLayoutEffect so the hydration check runs before the browser paints.
 * Zustand persist reads localStorage synchronously, so by the time this effect
 * fires the store already has the correct user — no spinner needed.
 */
export function AuthGuard({ requiredRole, redirectTo, children }: Props) {
  const user = useAppStore((s) => s.user)
  const [ready, setReady] = useState(false)

  // useLayoutEffect runs synchronously after DOM mutations, before paint.
  // Zustand persist has already hydrated from localStorage at this point,
  // so we can safely check user role without any delay.
  useLayoutEffect(() => {
    setReady(true)
  }, [])

  // Not yet mounted on client — render nothing (matches SSR, no flash)
  if (!ready) return null

  // Wrong role or not logged in — redirect
  if (!user || user.role !== requiredRole) {
    if (typeof window !== 'undefined') window.location.href = redirectTo
    return null
  }

  return <>{children}</>
}
