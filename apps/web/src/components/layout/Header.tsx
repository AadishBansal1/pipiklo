'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Sun, Moon, Menu, X, ChevronDown, ChevronRight,
  Sparkles, LayoutDashboard, LogOut, Settings, CreditCard,
  Coins, BadgeCheck, Zap, ArrowRight, TrendingUp, Star,
} from 'lucide-react'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { cn } from '@/lib/utils'

// ── Mega menu data ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Templates',
    slug: 'design-templates',
    color: '#6366f1',
    image: 'https://picsum.photos/seed/designtpl99/480/260',
    trending: ['Social Media Kit', 'Business Card', 'Pitch Deck', 'Resume'],
  },
  {
    label: 'Video',
    slug: 'video-templates',
    color: '#f43f5e',
    image: 'https://picsum.photos/seed/videotpl88/480/260',
    trending: ['Logo Reveal', 'Podcast Intro', 'Reel Template', 'Title Sequence'],
  },
  {
    label: 'Audio',
    slug: 'audio',
    color: '#8b5cf6',
    image: 'https://picsum.photos/seed/audiotpl77/480/260',
    trending: ['Corporate Music', 'Epic Trailer', 'Gaming SFX', 'Podcast Intro'],
  },
  {
    label: 'Graphics',
    slug: 'graphics',
    color: '#f59e0b',
    image: 'https://picsum.photos/seed/graphicstpl66/480/260',
    trending: ['Icons Pack', 'Illustration Set', 'Textures', 'Pattern Library'],
  },
  {
    label: 'Photos',
    slug: 'photos',
    color: '#10b981',
    image: 'https://picsum.photos/seed/photostpl55/480/260',
    trending: ['Business Lifestyle', 'Indian Wedding', 'Nature & Travel', 'Tech & Startup'],
  },
  {
    label: 'Fonts',
    slug: 'fonts',
    color: '#ec4899',
    image: 'https://picsum.photos/seed/fontstpl44/480/260',
    trending: ['Display Fonts', 'Script & Calligraphy', 'Sans Serif', 'Vintage'],
  },
  {
    label: '3D & Web',
    slug: '3d',
    color: '#06b6d4',
    image: 'https://picsum.photos/seed/threedtpl33/480/260',
    trending: ['3D Icons', 'Web Templates', 'UI Kits', 'Lottie Animations'],
  },
]

// ── Floating spark particle ────────────────────────────────────────────────────
function Spark({ delay, angle }: { delay: number; angle: number }) {
  const rad = (angle * Math.PI) / 180
  const tx = Math.cos(rad) * 28
  const ty = Math.sin(rad) * 28
  return (
    <motion.span
      className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-brand-400 pointer-events-none"
      style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
      animate={{
        x: ['-50%', `calc(-50% + ${tx}px)`, '-50%'],
        y: ['-50%', `calc(-50% + ${ty}px)`, '-50%'],
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 2.2,
        delay,
        repeat: Infinity,
        repeatDelay: 1.8,
        ease: 'easeInOut',
      }}
    />
  )
}

function LogoSparks() {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <span className="absolute inset-0 pointer-events-none">
      {angles.map((a, i) => (
        <Spark key={a} angle={a} delay={i * 0.28} />
      ))}
    </span>
  )
}

// ── Mega Menu Panel ────────────────────────────────────────────────────────────
function MegaMenu({
  item,
  onClose,
}: {
  item: (typeof NAV_ITEMS)[number]
  onClose: () => void
}) {
  const group = CATEGORY_GROUPS.find((g) => g.slug === item.slug)
  if (!group) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] z-50"
      style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.35))' }}
    >
      {/* Arrow pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#111]/95 border-t border-l border-white/8 z-10" />

      <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#0e0e12]/95 backdrop-blur-2xl">
        {/* Glow top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${item.color}99, transparent)` }}
        />

        <div className="grid grid-cols-[220px_1fr] divide-x divide-white/6">
          {/* Left — subcategories */}
          <div className="p-5">
            <Link
              href={`/${group.slug}`}
              onClick={onClose}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-4 hover:bg-white/5 transition-colors"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ background: `${item.color}22`, border: `1px solid ${item.color}44` }}
              >
                {group.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                  All {group.name}
                </p>
                <p className="text-[10px] text-white/40 leading-tight mt-0.5">Browse everything</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/30 group-hover:text-brand-400 ml-auto transition-all group-hover:translate-x-0.5" />
            </Link>

            <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 px-3 mb-2">Categories</p>
            <ul className="space-y-0.5">
              {group.subcategories.slice(0, 8).map((sub, i) => (
                <motion.li
                  key={sub.slug}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                >
                  <Link
                    href={`/${group.slug}/${sub.slug}`}
                    onClick={onClose}
                    className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150"
                      style={{ background: item.color }}
                    />
                    {sub.name}
                    <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right — featured image + trending */}
          <div className="p-5 flex flex-col gap-4">
            {/* Hero image */}
            <Link
              href={`/${group.slug}`}
              onClick={onClose}
              className="group relative block rounded-xl overflow-hidden aspect-[16/8] shrink-0"
            >
              <img
                src={item.image}
                alt={group.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${item.color}22, transparent)` }}
              />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white font-bold text-sm">{group.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{group.description}</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                <Star className="h-3 w-3 text-amber-400" />
                <span className="text-[10px] text-white font-semibold">Premium</span>
              </div>
            </Link>

            {/* Trending */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-3.5 w-3.5 text-white/30" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/25">Trending now</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {item.trending.map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={`/search?q=${encodeURIComponent(t)}`}
                      onClick={onClose}
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/8 transition-all"
                    >
                      <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-brand-400 transition-colors shrink-0" />
                      {t}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Header ────────────────────────────────────────────────────────────────
export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAppStore()
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Creator mode hidden — creator role falls back to customer dashboard
  const dashboardHref =
    user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'

  // Close dropdown when route changes
  useEffect(() => { setMobileOpen(false); setActiveNav(null) }, [pathname])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveNav(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setMobileOpen(false)
    }
  }

  function openNav(slug: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveNav(slug)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveNav(null), 120)
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      {/* ── Top announcement bar ─────────────────────────────────────────────── */}
      <div className="relative z-50 hidden sm:flex items-center justify-center gap-3 px-4 py-2 text-xs font-medium text-white/80 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f14, #16101f, #0f0f14)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0" />
        <Sparkles className="h-3 w-3 text-brand-400 animate-pulse shrink-0" />
        <span>
          🎉 New accounts get{' '}
          <span className="font-bold text-brand-300">3 free download tokens</span>
          {' '}— No credit card needed
        </span>
        <Link href="/sign-up" className="ml-1 text-brand-400 hover:text-brand-300 font-bold underline-offset-2 hover:underline transition-colors">
          Start free →
        </Link>
      </div>

      {/* ── Main Header ─────────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full"
        style={{ background: 'rgba(8, 8, 12, 0.88)' }}
      >
        {/* Frosted glass overlay */}
        <div className="absolute inset-0 backdrop-blur-2xl" style={{ WebkitBackdropFilter: 'blur(24px)' }} />

        {/* Top glow line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

        {/* Ambient bottom shadow */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/[0.05]" />

        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="flex h-[72px] items-center gap-5">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <Link
              href="/"
              className="relative flex items-center gap-3 shrink-0 group"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              {/* Icon with sparks */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #059669)',
                  boxShadow: logoHovered
                    ? '0 0 30px rgba(22,163,74,0.6), 0 0 60px rgba(22,163,74,0.2)'
                    : '0 0 16px rgba(22,163,74,0.35)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <Sparkles className="h-5 w-5 text-white relative z-10" />
                <AnimatePresence>{logoHovered && <LogoSparks />}</AnimatePresence>
              </div>

              {/* Name */}
              <div className="hidden sm:flex flex-col">
                <span
                  className="text-xl font-black tracking-tight leading-none"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff, #a3e635)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Pipiklo
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <BadgeCheck className="h-3 w-3 text-brand-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-400/80">Verified</span>
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.slug
                return (
                  <div key={item.slug} className="relative">
                    <motion.button
                      onMouseEnter={() => openNav(item.slug)}
                      onMouseLeave={scheduleClose}
                      whileTap={{ scale: 0.97 }}
                      className="relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150 group"
                      style={{ color: isActive ? item.color : 'rgba(255,255,255,0.65)' }}
                    >
                      {/* Hover bg */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-xl"
                            style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10 group-hover:text-white transition-colors"
                        style={{ color: isActive ? item.color : undefined }}>
                        {item.label}
                      </span>
                      <motion.span
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </motion.span>
                    </motion.button>

                    {/* Mega dropdown */}
                    <AnimatePresence>
                      {isActive && (
                        <div
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                        >
                          <MegaMenu item={item} onClose={() => setActiveNav(null)} />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* Pricing — glowing pill */}
              <Link
                href="/pricing"
                className="relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-xl ml-1 overflow-hidden group transition-all"
                style={{
                  color: pathname === '/pricing' ? '#fbbf24' : 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  background: pathname === '/pricing' ? 'rgba(251,191,36,0.12)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(251,191,36,0.12)'
                  e.currentTarget.style.color = '#fbbf24'
                  e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)'
                }}
                onMouseLeave={(e) => {
                  if (pathname !== '/pricing') {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                    e.currentTarget.style.borderColor = 'rgba(251,191,36,0.25)'
                  }
                }}
              >
                <Coins className="h-4 w-4" />
                Pricing
              </Link>
            </nav>

            {/* ── Search ────────────────────────────────────────────────────── */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-[260px] lg:max-w-[220px] xl:max-w-[300px]"
            >
              <motion.div
                animate={{ width: searchFocused ? '100%' : '100%' }}
                className="relative w-full"
              >
                <Search className={cn(
                  'absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200',
                  searchFocused ? 'text-brand-400' : 'text-white/25'
                )} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search 27M+ assets…"
                  className="w-full pl-10 pr-4 h-10 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300"
                  style={{
                    background: searchFocused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                    border: searchFocused ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: searchFocused ? '0 0 0 3px rgba(22,163,74,0.08), 0 0 20px rgba(22,163,74,0.12)' : 'none',
                  }}
                />
              </motion.div>
            </form>

            {/* ── Right Controls ────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Theme toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-xl flex items-center justify-center transition-colors text-white/40 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.04)' }}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </motion.button>

              {/* Token balance — customers only */}
              {user?.role === 'customer' && (
                <Link
                  href="/pricing"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#fbbf24',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.18)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(245,158,11,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <Coins className="h-3.5 w-3.5" />
                  {user.tokens} tokens
                </Link>
              )}

              {/* Auth */}
              {user ? (
                <Link
                  href={dashboardHref}
                  className="hidden md:flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}
                >
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover ring-2 ring-brand-500/40" />
                  <span className="max-w-[80px] truncate text-sm">{user.name.split(' ')[0]}</span>
                  <LayoutDashboard className="h-3.5 w-3.5 text-white/30" />
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-sm font-semibold rounded-xl text-white/60 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>

                  {/* Get started — animated shimmer CTA */}
                  <Link href="/sign-up" className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)',
                      boxShadow: '0 0 0 1px rgba(22,163,74,0.4), 0 4px 20px rgba(22,163,74,0.3)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(22,163,74,0.6), 0 4px 32px rgba(22,163,74,0.5), 0 0 60px rgba(22,163,74,0.2)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(22,163,74,0.4), 0 4px 20px rgba(22,163,74,0.3)' }}
                  >
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                    <span className="relative flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" />
                      Get started free
                    </span>
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-screen Mobile Menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-0 z-50 lg:hidden flex flex-col overflow-y-auto"
            style={{ background: '#080810', backdropFilter: 'blur(24px)' }}
          >
            {/* Mobile top bar */}
            <div className="flex items-center justify-between px-5 h-[72px] shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 0 20px rgba(22,163,74,0.4)' }}>
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-lg font-black text-white">Pipiklo</span>
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="flex-1 px-5 py-5 space-y-4">

              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search 27M+ assets…"
                    className="w-full pl-10 pr-4 h-11 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </form>

              {/* Auth section */}
              {user ? (
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-brand-500/40 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white text-sm truncate">{user.name}</p>
                      <BadgeCheck className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    </div>
                    <p className="text-xs text-white/35 truncate">{user.email}</p>
                    {user.role === 'customer' && (
                      <div className="flex items-center gap-1 mt-1">
                        <Coins className="h-3 w-3 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">{user.tokens} tokens remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Log in
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 4px 16px rgba(22,163,74,0.35)' }}>
                    <Zap className="h-3.5 w-3.5" /> Get started free
                  </Link>
                </div>
              )}

              {/* Quick links */}
              <div className="rounded-2xl overflow-hidden divide-y divide-white/5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {user && (
                  <>
                    <Link href={dashboardHref} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-white/75 hover:text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <LayoutDashboard className="h-4 w-4 text-brand-400" /> Dashboard
                    </Link>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                  </>
                )}
                <Link href="/pricing" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  style={{ background: 'rgba(245,158,11,0.04)' }}>
                  <Coins className="h-4 w-4" /> Pricing & Tokens
                </Link>
              </div>

              {/* Categories */}
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 px-1 pt-1">Browse Categories</p>
              <div className="rounded-2xl overflow-hidden divide-y" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {NAV_ITEMS.map((item, i) => {
                  const group = CATEGORY_GROUPS.find((g) => g.slug === item.slug)
                  const isExp = mobileExpanded === item.slug
                  return (
                    <div key={item.slug} style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <button
                        onClick={() => setMobileExpanded(isExp ? null : item.slug)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                      >
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: item.color }} />
                        <span className="flex-1 text-left">{item.label}</span>
                        <motion.span animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="h-4 w-4 text-white/25" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isExp && group && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 pt-1 space-y-0.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                              <Link href={`/${group.slug}`} onClick={() => setMobileOpen(false)}
                                className="block py-2 text-sm font-bold transition-colors"
                                style={{ color: item.color }}>
                                Browse All {group.name} →
                              </Link>
                              {group.subcategories.slice(0, 8).map((sub) => (
                                <Link key={sub.slug} href={`/${group.slug}/${sub.slug}`} onClick={() => setMobileOpen(false)}
                                  className="block py-2 pl-3 text-sm text-white/40 hover:text-white/80 transition-colors"
                                  style={{ borderLeft: `2px solid ${item.color}40` }}>
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              {/* Bottom actions */}
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/60 hover:text-white transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Sun className="h-4 w-4 text-amber-400 hidden dark:block" />
                  <Moon className="h-4 w-4 text-indigo-400 dark:hidden" />
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
                {user && (
                  <button
                    onClick={() => { logout(); localStorage.clear(); window.location.href = '/' }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
