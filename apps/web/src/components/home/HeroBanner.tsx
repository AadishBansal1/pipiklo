'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, ArrowRight, Zap } from 'lucide-react'

const TRENDING = ['Logo Animation', 'Instagram Stories', 'Podcast Intro', 'UI Kit', 'Wedding Invitation', 'YouTube Thumbnail']

const ROTATING_WORDS = ['Templates', 'Videos', 'Music', 'Graphics', 'Fonts', '3D Assets']

const FLOATING_PILLS = [
  { label: '🎨 27M+ Assets', delay: 0, x: -60, y: 20 },
  { label: '⚡ AI Powered', delay: 0.4, x: 55, y: -15 },
  { label: '🆓 3 Free Tokens', delay: 0.8, x: -40, y: -25 },
  { label: '📄 Commercial License', delay: 1.2, x: 50, y: 30 },
]

const STATS = [
  { label: 'Creative Assets', value: '27M+' },
  { label: 'Downloads', value: '892K+' },
  { label: 'Active Members', value: '12K+' },
  { label: 'Categories', value: '10+' },
]

export function HeroBanner() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <section className="relative overflow-hidden bg-[#030712] text-white min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-center">

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-brand-500/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full bg-purple-600/12 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-brand-400/5 blur-[140px]"
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-brand-300 border border-brand-500/30 bg-brand-500/10 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            27M+ Creative Assets — Start with 3 Free Tokens
            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-500/30 text-xs font-bold text-brand-200">NEW</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-5xl mx-auto mb-6"
        >
          <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
            Unlimited{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-cyan-400"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-white/90">for every project</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          Access 27M+ premium assets — templates, fonts, videos, music & 3D — each with a lifetime commercial license.
          Start with 3 free tokens, no credit card needed.
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 focus-within:border-brand-500/50 transition-colors duration-300">
            <Search className="ml-3 h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates, videos, fonts, audio..."
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-base outline-none py-2 px-2"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shrink-0"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>

        {/* Trending */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-14"
        >
          <span className="text-sm text-slate-500">Trending:</span>
          {TRENDING.map((term, i) => (
            <motion.button
              key={term}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="text-sm px-3 py-1.5 rounded-full bg-white/6 hover:bg-brand-500/20 hover:text-brand-300 border border-white/8 hover:border-brand-500/30 transition-all duration-200 text-slate-300"
            >
              {term}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats with glass cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative text-center px-4 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/8 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
