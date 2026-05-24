'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store/app-store'
import type { AuthUser } from '@/store/app-store'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const setUser = useAppStore((s) => s.setUser)
  const syncedId = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    if (!clerkUser) {
      setUser(null)
      syncedId.current = null
      return
    }

    // Skip if already synced this session for this user
    if (syncedId.current === clerkUser.id) return

    const pendingRole =
      typeof window !== 'undefined'
        ? (localStorage.getItem('pipiklo_pending_role') as AuthUser['role'] | null)
        : null

    const role: AuthUser['role'] =
      (clerkUser.publicMetadata?.role as AuthUser['role']) ??
      pendingRole ??
      'customer'

    const baseUser: AuthUser = {
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
      tokens: 3,
      totalDownloads: 0,
      joinedAt: new Date().toISOString(),
    }

    // Set immediately so UI doesn't wait for DB
    setUser(baseUser)
    syncedId.current = clerkUser.id

    // Sync to Supabase in background — fetches real token balance
    syncToSupabase(baseUser, setUser).catch(console.error)
  }, [clerkUser, isLoaded, setUser])

  return <>{children}</>
}

async function syncToSupabase(
  user: AuthUser,
  setUser: (u: AuthUser | null) => void
) {
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // Upsert user — insert if new, ignore conflict on existing (don't overwrite tokens)
    const { data: existing } = await supabase
      .from('users')
      .select('tokens, total_downloads, role, created_at')
      .eq('id', user.id)
      .single()

    if (!existing) {
      // New user — insert with 3 starter tokens
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar,
        role: user.role,
        tokens: 3,
        total_downloads: 0,
      })
      // Mark as new so UI can show welcome state
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pipiklo_new_user', '1')
      }
    } else {
      // Existing user — update name/avatar but keep tokens from DB
      await supabase
        .from('users')
        .update({
          name: user.name,
          avatar_url: user.avatar,
          role: user.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      // Update Zustand with real token balance from DB
      setUser({
        ...user,
        tokens: existing.tokens ?? 3,
        totalDownloads: existing.total_downloads ?? 0,
        joinedAt: existing.created_at ?? user.joinedAt,
      })
    }
  } catch (err) {
    console.error('[SupabaseProvider] sync error:', err)
  }
}
