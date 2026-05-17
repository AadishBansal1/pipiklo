'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { useAppStore } from '@/store/app-store'
import { useTheme } from 'next-themes'
import {
  Search, Sun, Moon, Menu, X, ChevronDown, Sparkles, Download, Bell
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
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMegaMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Pipiklo</span>
          </Link>

          {/* Nav Links (desktop) */}
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

            {/* Mega Menu Dropdown */}
            {activeMegaGroup && (
              <div
                className="absolute top-16 left-0 right-0 bg-background border-b shadow-xl z-50 py-8"
                onMouseLeave={() => setMegaMenu(null)}
              >
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <Link href={`/${activeMegaGroup.slug}`} className="block">
                        <h3 className="text-lg font-bold mb-1 hover:text-brand-500 transition-colors">
                          {activeMegaGroup.name}
                        </h3>
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
                            <Link
                              href={`/${activeMegaGroup.slug}/${sub.slug}`}
                              className="text-sm hover:text-brand-500 transition-colors"
                              onClick={() => setMegaMenu(null)}
                            >
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
                            <Link
                              key={s}
                              href={`/search?q=${encodeURIComponent(s)}`}
                              className="text-xs px-2.5 py-1 rounded-full border hover:border-brand-500 hover:text-brand-500 transition-colors"
                              onClick={() => setMegaMenu(null)}
                            >
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

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates, videos, fonts..."
                className="pl-9 pr-4 h-10 rounded-full border-muted bg-muted/50 focus:bg-background"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <GoogleTranslate />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'admin' ? '/dashboard/admin' : user.role === 'creator' ? '/dashboard/creator' : '/dashboard/customer'}
                  className="hidden md:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-accent transition-colors text-muted-foreground"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in" className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                  Log in
                </Link>
                <Link href="/sign-in" className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors">
                  Get started free
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 rounded-full"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {CATEGORY_GROUPS.map((group) => (
              <Link
                key={group.slug}
                href={`/${group.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{group.icon}</span>
                <span className="font-medium">{group.name}</span>
              </Link>
            ))}
            <div className="border-t pt-3 mt-3">
              <Link href="/pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium text-brand-600">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
