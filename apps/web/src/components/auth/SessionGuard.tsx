'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store/app-store'
import { AlertTriangle, Clock, LogIn } from 'lucide-react'

const SESSION_MS = 5 * 60 * 1000  // 5 minutes total
const WARN_AT    = 4 * 60 * 1000  // show warning after 4 minutes
const TICK_MS    = 10_000         // check every 10 s
// Use sessionStorage so timestamp is cleared when the browser tab closes
const SS_KEY     = 'pipiklo_session_start'

function pad(n: number) { return String(n).padStart(2, '0') }
function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

export function SessionGuard() {
  const { isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { user: adminUser, logout } = useAppStore()

  const [showWarning, setShowWarning] = useState(false)
  const [remaining, setRemaining]     = useState(SESSION_MS - WARN_AT)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isAdminSession = adminUser?.role === 'admin'
  const isActive = isAdminSession || (isLoaded && !!isSignedIn)

  // Stamp session start in sessionStorage (auto-cleared on tab close)
  useEffect(() => {
    if (!isLoaded) return
    if (isActive) {
      if (!sessionStorage.getItem(SS_KEY)) {
        sessionStorage.setItem(SS_KEY, String(Date.now()))
      }
    } else {
      sessionStorage.removeItem(SS_KEY)
      setShowWarning(false)
    }
  }, [isActive, isLoaded])

  const doSignOut = useCallback(async () => {
    setShowWarning(false)
    sessionStorage.removeItem(SS_KEY)
    try { localStorage.clear(); sessionStorage.clear() } catch {}
    logout()
    if (!isAdminSession) {
      try { await signOut() } catch {}
    }
    window.location.replace('/sign-in?expired=1')
  }, [signOut, logout, isAdminSession])

  // Tick
  useEffect(() => {
    if (!isActive) return

    intervalRef.current = setInterval(() => {
      const raw = sessionStorage.getItem(SS_KEY)
      if (!raw) return
      const elapsed = Date.now() - Number(raw)
      const left    = SESSION_MS - elapsed

      if (left <= 0) {
        clearInterval(intervalRef.current!)
        doSignOut()
        return
      }
      if (elapsed >= WARN_AT) {
        setRemaining(left)
        setShowWarning(true)
      }
    }, TICK_MS)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isActive, doSignOut])

  function handleExtend() {
    sessionStorage.setItem(SS_KEY, String(Date.now()))
    setShowWarning(false)
  }

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Session Expiring Soon</h3>
            <p className="text-xs text-muted-foreground mt-0.5">You'll be signed out automatically for security.</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Auto sign-out in{' '}
            <span className="font-bold font-mono text-base">{fmtCountdown(remaining)}</span>
          </span>
        </div>

        <div className="flex gap-2">
          <button onClick={doSignOut} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">
            Sign out now
          </button>
          <button onClick={handleExtend} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors">
            <LogIn className="h-4 w-4" /> Stay signed in
          </button>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">"Stay signed in" resets your 5-minute session.</p>
      </div>
    </div>
  )
}
