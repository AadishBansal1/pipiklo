'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { useTheme } from 'next-themes'
import {
  Search, Sun, Moon, Menu, X, ChevronDown, ChevronRight,
  Sparkles, LayoutDashboard, LogOut, User, Settings,
  Home, Tag, CreditCard, Globe, Instagram, Coins
} from 'lucide-react'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { GoogleTranslate } from '@/components/ui/GoogleTranslate'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAppStore()
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Close mega menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMegaMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Prevent body scroll when mobile menu open
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

  const dashboardHref =
    user?.role === 'admin' ? '/dashboard/admin' :
    user?.role === 'creator' ? '/dashboard/creator' :
    '/dashboard/customer'

  const navLinks = [
    { label: 'Gen AI', slug: 'gen-ai' },
    { label: 'Video Templates', slug: 'video-templates' },
    { label: 'Stock Video', slug: 'stock-video' },
    { label: 'Audio', slug: 'audio' },
    { label: 'Graphics', slug: 'graphics' },
    { label: 'More', slug: 'more' },
  ]

  const activeMegaGroup = CATEGORY_GROUPS.find((g) => g.slug === megaMenu)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Pipiklo</span>
            </Link>

            {/* Desktop Nav */}
            <nav ref={menuRef} className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <div key={link.slug} className="relative">
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground',
                      megaMenu === link.slug && 'bg-accent'
                    )}
                    onMouseEnter={() => setMegaMenu(link.slug === 'more' ? null : link.slug)}
                  >
                    {link.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', megaMenu === link.slug && 'rotate-180')} />
                  </button>
                </div>
              ))}

              {/* Mega Menu */}
              {activeMegaGroup && (
                <div
                  className="absolute top-16 left-0 right-0 bg-background border-b shadow-xl z-50 py-8"
                  onMouseLeave={() => setMegaMenu(null)}
                >
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8">
                      <div>
                        <Link href={`/${activeMegaGroup.slug}`} className="block">
                          <h3 className="text-lg font-bold mb-1 hover:text-brand-500 transition-colors">{activeMegaGroup.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">{activeMegaGroup.description}</p>
                        <Button variant="brand" size="sm" asChild>
                          <Link href={`/${activeMegaGroup.slug}`}>Browse All</Link>
                        </Button>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Categories</p>
                        <ul className="space-y-1.5">
                          {activeMegaGroup.subcategories.slice(0, 8).map((sub) => (
                            <li key={sub.slug}>
                              <Link href={`/${activeMegaGroup.slug}/${sub.slug}`} className="text-sm hover:text-brand-500 transition-colors" onClick={() => setMegaMenu(null)}>
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {activeMegaGroup.compatibleTools && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Compatible Tools</p>
                          <ul className="space-y-1.5">
                            {activeMegaGroup.compatibleTools.map((tool) => (
                              <li key={tool} className="text-sm text-muted-foreground">{tool}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {activeMegaGroup.topSearches && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Searches</p>
                          <div className="flex flex-wrap gap-2">
                            {activeMegaGroup.topSearches.slice(0, 8).map((s) => (
                              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="text-xs px-2.5 py-1 rounded-full border hover:border-brand-500 hover:text-brand-500 transition-colors" onClick={() => setMegaMenu(null)}>
                                {s}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates, videos, fonts..." className="pl-9 pr-4 h-10 rounded-full border-muted bg-muted/50 focus:bg-background" />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Google Translate — desktop only */}
              <div className="hidden md:flex">
                <GoogleTranslate />
              </div>

              {/* Creator Program pill — desktop */}
              <Link
                href="/influencer"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 shrink-0"
              >
                <Instagram className="h-3 w-3" />
                Creator Program
              </Link>

              {/* Theme toggle */}
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Toggle theme">
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </button>

              {/* Auth — desktop */}
              {user ? (
                <Link href={dashboardHref} className="hidden md:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors">Log in</Link>
                  <Link href="/sign-in" className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors">Get started free</Link>
                </>
              )}

              {/* Hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search bar (below header row) */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets..." className="pl-9 rounded-full" />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* ── Full-screen Mobile Menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col bg-background overflow-y-auto" style={{ top: '0' }}>
          {/* Mobile menu header */}
          <div className="flex items-center justify-between px-4 h-16 border-b shrink-0">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Pipiklo</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets..." className="pl-9 rounded-full" />
              </div>
            </form>

            {/* User section */}
            {user ? (
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/50 mb-4">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border text-sm font-semibold hover:bg-accent transition-colors">Log in</Link>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors">Get started free</Link>
              </div>
            )}

            {/* Dashboard links (if logged in) */}
            {user && (
              <div className="mb-3 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-1">My Account</p>
                <Link href={dashboardHref} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                  <LayoutDashboard className="h-4 w-4 text-brand-500" /> Dashboard
                </Link>
                <Link href={`${dashboardHref}/settings`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                </Link>
              </div>
            )}

            <div className="border-t pt-3 mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">Browse</p>
            </div>

            {/* Home */}
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
              <Home className="h-4 w-4 text-muted-foreground" /> Home
            </Link>

            {/* All Categories with expandable subcategories */}
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.slug}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === group.slug ? null : group.slug)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                >
                  <span className="text-base">{group.icon}</span>
                  <span className="flex-1 text-left">{group.name}</span>
                  <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', mobileExpanded === group.slug && 'rotate-90')} />
                </button>

                {mobileExpanded === group.slug && (
                  <div className="ml-10 mt-1 mb-2 space-y-1">
                    <Link href={`/${group.slug}`} onClick={() => setMobileOpen(false)} className="block px-3 py-1.5 text-sm text-brand-600 font-semibold hover:underline">
                      Browse All {group.name} →
                    </Link>
                    {group.subcategories.map((sub) => (
                      <Link key={sub.slug} href={`/${group.slug}/${sub.slug}`} onClick={() => setMobileOpen(false)} className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Extra links */}
            <div className="border-t pt-3 mt-3 space-y-1">
              <Link href="/influencer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-purple-600 dark:text-purple-400">
                <Instagram className="h-4 w-4" /> Creator Program
              </Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-brand-600">
                <CreditCard className="h-4 w-4" /> Pricing
              </Link>
              <Link href="/license" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                <Tag className="h-4 w-4 text-muted-foreground" /> License Info
              </Link>
              <Link href="/admin-login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground">
                <User className="h-4 w-4" /> Admin Portal
              </Link>
            </div>

            {/* Google Translate in mobile */}
            <div className="border-t pt-3 mt-3 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Language
              </p>
              <GoogleTranslate />
            </div>

            {/* Theme toggle */}
            <div className="border-t pt-3 mt-3">
              <button
                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMobileOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>

            {/* Sign out */}
            {user && (
              <div className="border-t pt-3 mt-3">
                <button
                  onClick={() => { logout(); localStorage.clear(); window.location.href = '/' }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors text-sm font-medium text-muted-foreground"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
