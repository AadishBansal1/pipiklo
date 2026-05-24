'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, BadgeCheck, Shield, Coins, Download, Star, Zap } from 'lucide-react'

const PERKS = [
  { icon: Coins,    text: '3 free tokens the moment you sign up — no card needed' },
  { icon: Download, text: 'Download from 27M+ assets with lifetime commercial license' },
  { icon: Zap,      text: 'AI tools for images, video, music & mockups' },
  { icon: Shield,   text: 'Every asset covered by Pipiklo\'s commercial license' },
]

const STATS = [
  { value: '27M+',  label: 'Assets' },
  { value: '892K+', label: 'Downloads' },
  { value: '4.9★',  label: 'Rating' },
]

export default function SignUpPage() {
  // Creator mode is hidden for now — always set customer role
  useEffect(() => {
    localStorage.setItem('pipiklo_pending_role', 'customer')
  }, [])

  return (
    <div className="min-h-screen flex" style={{ background: '#08080f' }}>

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] xl:w-[55%] relative overflow-hidden px-14 py-12"
        style={{ background:'linear-gradient(145deg,#0d0d18 0%,#0e0a1f 50%,#080f14 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'-5%', left:'-5%', width:500, height:500, borderRadius:'50%',
            background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 60%)', filter:'blur(60px)' }} />
          <div style={{ position:'absolute', bottom:'0', right:'-10%', width:420, height:420, borderRadius:'50%',
            background:'radial-gradient(circle,rgba(22,163,74,0.14) 0%,transparent 60%)', filter:'blur(60px)' }} />
          <div className="absolute inset-0 opacity-[0.028]"
            style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'52px 52px' }} />
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background:'linear-gradient(90deg,transparent,rgba(124,58,237,0.5),rgba(22,163,74,0.3),transparent)' }} />
        </div>

        {/* Logo */}
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl shrink-0"
              style={{ background:'linear-gradient(135deg,#16a34a,#059669)', boxShadow:'0 0 24px rgba(22,163,74,0.5)' }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-tight leading-none">Pipiklo</p>
              <div className="flex items-center gap-1 mt-0.5">
                <BadgeCheck className="h-3 w-3 text-emerald-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/70">Verified Platform</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Copy */}
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.1, ease:[0.22,1,0.36,1] }}
          className="flex-1 flex flex-col justify-center py-12 max-w-md">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 w-fit"
            style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', color:'#fbbf24' }}>
            <Coins className="h-3 w-3" />
            Start free — 3 tokens on signup, no credit card
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.08] tracking-tight mb-4">
            Create without{' '}
            <span style={{ background:'linear-gradient(135deg,#a78bfa,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              limits.
            </span>
          </h1>

          <p className="text-base text-white/40 leading-relaxed mb-10">
            Join thousands of designers, editors, and marketers who use Pipiklo to find premium creative assets — all with lifetime commercial licenses.
          </p>

          <ul className="space-y-4 mb-10">
            {PERKS.map(({ icon: Icon, text }, i) => (
              <motion.li key={i}
                initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.25 + i * 0.07, duration:0.4 }}
                className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-sm text-white/55 leading-snug">{text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-8 pt-8"
            style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-white/35 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5, duration:0.5 }}
          className="p-5 rounded-2xl"
          style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_,i) => <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
          </div>
          <p className="text-sm text-white/50 italic leading-relaxed">
            "The asset quality is incredible. Downloaded 40+ templates in a week — every single one came with a clean commercial license."
          </p>
          <div className="flex items-center gap-2.5 mt-3">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-emerald-400 flex items-center justify-center text-xs font-bold text-white">A</div>
            <div>
              <p className="text-xs font-semibold text-white/70">Arjun Kapoor</p>
              <p className="text-[10px] text-white/30">Brand Strategist, Delhi</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — form
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-y-auto"
        style={{ background:'#0b0b14' }}>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{ position:'absolute', top:'20%', right:'-20%', width:280, height:280, borderRadius:'50%',
            background:'radial-gradient(circle,rgba(124,58,237,0.09) 0%,transparent 65%)', filter:'blur(40px)' }} />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8 self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background:'linear-gradient(135deg,#16a34a,#059669)', boxShadow:'0 0 18px rgba(22,163,74,0.45)' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <p className="text-lg font-black text-white">Pipiklo</p>
        </div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.08, ease:[0.22,1,0.36,1] }}
          className="w-full relative z-10" style={{ maxWidth:360 }}>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
            <p className="text-sm text-white/35">Already have one?{' '}
              <Link href="/sign-in" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Sign in →
              </Link>
            </p>
          </div>

          {/* Free token badge (mobile) */}
          <div className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold mb-4 w-fit"
            style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.22)', color:'#fbbf24' }}>
            <Coins className="h-3.5 w-3.5" />3 free tokens on signup
          </div>

          {/* Perks line */}
          <p className="text-xs text-center mb-5" style={{ color:'rgba(255,255,255,0.28)' }}>
            Download assets · Lifetime commercial license · 3 free tokens
          </p>

          {/* Clerk form */}
          <div className="w-full rounded-2xl overflow-hidden"
            style={{ border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  cardBox: 'w-full shadow-none',
                  card: 'w-full bg-transparent shadow-none border-0 rounded-none',
                  main: 'w-full p-5',
                  header: 'hidden',
                  socialButtonsBlockButton: 'w-full h-10 rounded-xl text-sm font-semibold text-white transition-all',
                  socialButtonsBlockButtonText: 'text-white font-semibold text-sm',
                  dividerRow: 'my-4',
                  dividerLine: 'bg-white/7',
                  dividerText: 'text-white/22 text-xs px-2',
                  formFieldLabel: 'text-white/40 text-xs font-medium mb-1',
                  formFieldInput: 'w-full h-10 rounded-xl text-sm text-white px-3.5 outline-none',
                  formButtonPrimary: 'w-full h-10 rounded-xl text-sm font-bold text-white mt-1',
                  footer: 'px-5 pb-4 pt-0',
                  footerActionText: 'text-white/25 text-xs',
                  footerActionLink: 'text-violet-400 hover:text-violet-300 font-semibold ml-1 text-xs',
                  identityPreviewText: 'text-white text-sm',
                  identityPreviewEditButton: 'text-violet-400 text-xs',
                  form: 'w-full',
                  internal: 'w-full',
                },
                variables: {
                  colorBackground: 'transparent',
                  colorText: '#ffffff',
                  colorTextSecondary: 'rgba(255,255,255,0.35)',
                  colorPrimary: '#7c3aed',
                  colorInputBackground: 'rgba(255,255,255,0.05)',
                  colorInputText: '#ffffff',
                  colorNeutral: 'rgba(255,255,255,0.07)',
                  borderRadius: '0.75rem',
                  spacingUnit: '0.9rem',
                },
              }}
              fallbackRedirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>

          {/* Trust */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs"
            style={{ color:'rgba(255,255,255,0.18)' }}>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secured by Clerk</span>
            <span className="flex items-center gap-1"><Coins className="h-3 w-3" /> 3 free tokens</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
