'use client'

import { SignIn } from '@clerk/nextjs'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

// Separate component so useSearchParams is inside Suspense
function ExpiredBanner() {
  const searchParams = useSearchParams()
  const expired = searchParams.get('expired') === '1'
  if (!expired) return null
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p className="text-sm font-medium">Your session expired. Please sign in again to continue.</p>
    </div>
  )
}

export default function SignInPage() {
  const [role, setRole] = useState<'customer' | 'creator'>('customer')

  useEffect(() => {
    const saved = localStorage.getItem('pipiklo_pending_role') as 'customer' | 'creator' | null
    if (saved) setRole(saved)
    else localStorage.setItem('pipiklo_pending_role', 'customer')
  }, [])

  const handleRoleChange = (newRole: 'customer' | 'creator') => {
    setRole(newRole)
    localStorage.setItem('pipiklo_pending_role', newRole)
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-4 relative z-10">

        {/* Session expired banner — wrapped in Suspense for useSearchParams */}
        <Suspense fallback={null}>
          <ExpiredBanner />
        </Suspense>

        {/* Role selector */}
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 gap-1">
          <button
            onClick={() => handleRoleChange('customer')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
              role === 'customer'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            )}
          >
            I&apos;m a Customer
          </button>
          <button
            onClick={() => handleRoleChange('creator')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
              role === 'creator'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            )}
          >
            I&apos;m a Creator
          </button>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-400',
              socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
              socialButtonsBlockButtonText: 'text-white',
              dividerLine: 'bg-white/10',
              dividerText: 'text-slate-500',
              formFieldLabel: 'text-slate-400',
              formFieldInput: 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50',
              formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white',
              footerActionText: 'text-slate-500',
              footerActionLink: 'text-violet-400 hover:text-violet-300',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-violet-400',
            },
          }}
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />

        <p className="text-center text-xs text-slate-600">
          Admin?{' '}
          <a href="/admin-login" className="text-red-400 hover:text-red-300 transition-colors">
            Admin Portal →
          </a>
        </p>
      </div>
    </div>
  )
}
