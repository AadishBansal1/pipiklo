'use client'

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useAppStore } from '@/store/app-store'
import { LogOut, AlertTriangle } from 'lucide-react'

export function SignOutSection() {
  const { signOut } = useClerk()
  const { logout } = useAppStore()
  const [showConfirm, setShowConfirm] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleConfirm() {
    setSigningOut(true)
    try { localStorage.clear(); sessionStorage.clear() } catch {}
    logout()
    try { await signOut() } catch {}
    window.location.replace('/')
  }

  return (
    <>
      <section className="rounded-xl border border-red-200 dark:border-red-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-red-600 dark:text-red-400">Sign Out</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              End your current session. You can sign back in any time.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Sign out of Pipiklo?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">You'll need to sign in again to access your account.</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {signingOut ? 'Signing out…' : 'Yes, sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
