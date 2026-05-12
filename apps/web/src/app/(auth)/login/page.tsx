'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, ShoppingBag, Palette, Shield } from 'lucide-react'

type Tab = 'customer' | 'creator'

const DEMO = {
  customer: { email: 'customer@pipiklo.com', password: 'customer123' },
  creator: { email: 'creator@pipiklo.com', password: 'creator123' },
}

export default function LoginPage() {
  const login = useAppStore((s) => s.login)
  const user = useAppStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user?.role === 'customer') window.location.href = '/dashboard/customer'
    else if (user?.role === 'creator') window.location.href = '/dashboard/creator'
    else if (user?.role === 'admin') window.location.href = '/dashboard/admin'
  }, [user])

  function fillDemo() {
    setEmail(DEMO[tab].email)
    setPassword(DEMO[tab].password)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = login(email.trim(), password)
    if (result.ok) {
      // Hard redirect so Zustand persist rehydrates correctly on the next page
      window.location.href = tab === 'creator' ? '/dashboard/creator' : '/dashboard/customer'
    } else {
      setLoading(false)
      setError(result.error ?? 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white">
            <Sparkles className="h-6 w-6 text-brand-400" />
            Pipiklo
          </Link>
          <p className="text-slate-400 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/8 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Role tabs */}
          <div className="flex rounded-xl bg-white/5 border border-white/8 p-1 mb-6 gap-1">
            {([
              { id: 'customer', label: 'Customer', icon: ShoppingBag },
              { id: 'creator', label: 'Creator', icon: Palette },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setEmail(''); setPassword(''); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === id
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Demo credentials banner */}
          <button
            onClick={fillDemo}
            className="w-full mb-5 px-4 py-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 hover:bg-brand-500/20 transition-colors text-left"
          >
            <span className="font-semibold">Demo login →</span>{' '}
            {tab === 'customer' ? 'customer@pipiklo.com / customer123' : 'creator@pipiklo.com / creator123'}
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO[tab].email}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold text-sm transition-all duration-200 active:scale-98 shadow-lg shadow-brand-500/20"
            >
              {loading ? 'Signing in…' : `Sign in as ${tab === 'customer' ? 'Customer' : 'Creator'}`}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/8 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button onClick={fillDemo} className="text-brand-400 hover:text-brand-300 font-medium">
                Use demo credentials
              </button>
            </p>
            <Link
              href="/admin-login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Shield className="h-3 w-3" />
              Admin login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
