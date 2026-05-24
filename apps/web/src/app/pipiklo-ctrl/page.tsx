'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import Link from 'next/link'
import { Shield, Eye, EyeOff, Lock } from 'lucide-react'

const ADMIN_EMAIL    = 'admin@pipiklo.com'
const ADMIN_PASSWORD = 'Admin@2025'

export default function AdminControlPage() {
  const user       = useAppStore((s) => s.user)
  const adminLogin = useAppStore((s) => s.adminLogin)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (user?.role === 'admin') window.location.href = '/dashboard/admin'
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError('Invalid credentials.')
      setLoading(false)
      return
    }

    const result = adminLogin(email.trim(), password)
    if (result.ok) {
      window.location.href = '/dashboard/admin'
    } else {
      setError(result.error ?? 'Authentication failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#07070f' }}>

      {/* Subtle red orb — very faint */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)',
          width:500, height:300, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(239,68,68,0.07) 0%,transparent 65%)', filter:'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:20, scale:0.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
        className="w-full relative z-10"
        style={{ maxWidth: 360 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
            style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
            <Shield className="h-6 w-6 text-red-400" />
          </div>
          <h1 className="text-xl font-black text-white mb-1">Admin Access</h1>
          <p className="text-xs text-white/25">Restricted — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="w-full rounded-2xl p-px"
          style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.25),rgba(239,68,68,0.08),rgba(255,255,255,0.05))' }}>
          <div className="rounded-2xl p-6"
            style={{ background:'rgba(12,10,18,0.98)', backdropFilter:'blur(20px)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:'rgba(255,255,255,0.4)' }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pipiklo.com"
                  required
                  autoComplete="email"
                  className="w-full h-11 px-3.5 rounded-xl text-sm text-white outline-none transition-all"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(239,68,68,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.06)' }}
                  onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color:'rgba(255,255,255,0.4)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full h-11 pl-3.5 pr-10 rounded-xl text-sm text-white outline-none transition-all"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'rgba(239,68,68,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.06)' }}
                    onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color:'rgba(255,255,255,0.25)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ color:'#f87171', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)' }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#dc2626,#b91c1c)',
                  boxShadow: loading ? 'none' : '0 0 20px rgba(239,68,68,0.25)',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 0 32px rgba(239,68,68,0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 20px rgba(239,68,68,0.25)' }}
              >
                {loading ? (
                  <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</>
                ) : (
                  <><Lock className="h-4 w-4" /> Sign in as Admin</>
                )}
              </button>
            </form>

            <p className="text-center mt-5 text-xs" style={{ color:'rgba(255,255,255,0.18)' }}>
              Not an admin?{' '}
              <Link href="/sign-in" className="text-violet-400/70 hover:text-violet-400 transition-colors">
                Go to sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-4 text-xs" style={{ color:'rgba(255,255,255,0.1)' }}>
          This page is not indexed or linked publicly.
        </p>
      </motion.div>
    </div>
  )
}
