'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import type { AuthUser } from '@/store/app-store'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)

  useEffect(() => {
    const supabase = createClient()

    // Load current session on mount
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name ?? user.email?.split('@')[0] ?? 'User',
            email: profile.email,
            role: profile.role as AuthUser['role'],
            avatar: profile.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
          })
        }
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        return
      }

      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name ?? session.user.email?.split('@')[0] ?? 'User',
            email: profile.email,
            role: profile.role as AuthUser['role'],
            avatar: profile.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
          })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}
