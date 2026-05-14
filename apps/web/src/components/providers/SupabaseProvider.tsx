'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store/app-store'
import type { AuthUser } from '@/store/app-store'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const setUser = useAppStore((s) => s.setUser)

  useEffect(() => {
    if (!isLoaded) return

    if (!clerkUser) {
      setUser(null)
      return
    }

    // Role priority:
    // 1. Clerk publicMetadata.role (set by admin)
    // 2. localStorage pipiklo_pending_role (set during sign-in/sign-up flow)
    // 3. Default: 'customer'
    const pendingRole =
      typeof window !== 'undefined'
        ? (localStorage.getItem('pipiklo_pending_role') as AuthUser['role'] | null)
        : null

    const role: AuthUser['role'] =
      (clerkUser.publicMetadata?.role as AuthUser['role']) ??
      pendingRole ??
      'customer'

    const authUser: AuthUser = {
      id: clerkUser.id,
      name:
        clerkUser.fullName ??
        clerkUser.firstName ??
        clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] ??
        'User',
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      role,
      avatar:
        clerkUser.imageUrl ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${clerkUser.id}`,
    }

    setUser(authUser)

    // Sync to Supabase (best-effort, non-blocking)
    syncToSupabase(authUser).catch(console.error)
  }, [clerkUser, isLoaded, setUser])

  return <>{children}</>
}

async function syncToSupabase(user: AuthUser) {
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.from('users').upsert(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar,
        role: user.role,
      },
      { onConflict: 'id' }
    )
  } catch {
    // Supabase sync is optional — app works without it
  }
}
