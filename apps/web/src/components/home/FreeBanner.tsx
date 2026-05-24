'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Zap, Shield, Download } from 'lucide-react'

const FEATURES = [
  { icon: Download, text: '27M+ premium creative assets — templates, video, audio, fonts, 3D' },
  { icon: Zap, text: 'AI Tools: image, video, music & voice generation' },
  { icon: Shield, text: 'Lifetime commercial license on every download' },
  { icon: CheckCircle2, text: 'No watermarks, no attribution required' },
  { icon: CheckCircle2, text: 'Token-based — buy once, download anytime, tokens never expire' },
]

const PLAN_ROWS = [
  { label: 'Starting tokens', value: '3 Free' },
  { label: 'Commercial license', value: '✓ Included' },
  { label: 'AI tools access', value: '✓ Included' },
  { label: 'Watermarks', value: 'None' },
  { label: 'Attribution required', value: 'Never' },
]

export function FreeBanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#030712]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-500/15 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-48 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]"
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <div className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-4">Start for free today</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Everything you need to create
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400"> amazing content</span>
            </h2>
            <p className="text-slate-400 mb-8 text-base leading-relaxed">
              Join 12,000+ designers, editors, and marketers who use Pipiklo to power their creative projects.
            </p>

            <ul className="space-y-3 mb-10">
              {FEATURES.map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3 w-3 text-brand-400" />
                  </div>
                  {text}
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/15 hover:bg-white/8 transition-all duration-200"
              >
                View plans
              </Link>
            </div>
          </motion.div>

          {/* Glass card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="flex-shrink-0 w-full lg:w-80"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/50 p-8">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

              <div className="relative text-center mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                  Launch Offer
                </div>
                <p className="text-6xl font-black text-white mb-1">FREE</p>
                <p className="text-slate-400 text-sm">3 tokens on signup · no card needed</p>
              </div>

              <div className="relative space-y-3 border-t border-white/10 pt-6">
                {PLAN_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-semibold text-white">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-6">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
