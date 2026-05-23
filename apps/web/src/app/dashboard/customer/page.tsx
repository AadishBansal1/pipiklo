'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Download, BookMarked, Heart, Coins, Plus, ArrowRight, Sparkles, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TOKEN_PACKS = [
  { tokens: 5,   price: 99,   id: 'starter', label: 'Starter' },
  { tokens: 20,  price: 299,  id: 'popular', label: 'Popular', highlight: true },
  { tokens: 50,  price: 599,  id: 'pro',     label: 'Pro' },
]

const CATEGORIES = [
  { label: '🎬 Video Templates', slug: 'video-templates' },
  { label: '🎨 Graphics', slug: 'graphics' },
  { label: '✍️ Fonts', slug: 'fonts' },
  { label: '🎵 Audio', slug: 'audio' },
  { label: '🖼️ Photos', slug: 'photos' },
  { label: '📐 Design Templates', slug: 'design-templates' },
  { label: '🧊 3D Models', slug: '3d' },
  { label: '🌐 Web Templates', slug: 'web' },
]

export default function CustomerDashboardPage() {
  const { user, addTokens } = useAppStore()
  const tokens = user?.tokens ?? 0
  const totalDownloads = user?.totalDownloads ?? 0

  const isLow = tokens <= 1

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Manage your tokens, downloads, and licenses.
        </p>
      </div>

      {/* ── Token Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 text-white relative overflow-hidden ${
          isLow
            ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500'
            : 'bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-600'
        }`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">
              {isLow ? '⚠️ Token balance is low' : '🎉 Your token balance'}
            </p>
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-amber-300" />
              <div>
                <span className="text-5xl font-black">{tokens}</span>
                <span className="text-xl font-bold ml-2 opacity-80">tokens</span>
              </div>
            </div>
            <p className="text-white/70 text-sm mt-2">
              {tokens === 0
                ? 'Buy tokens to download assets with commercial licenses'
                : `${tokens} download${tokens !== 1 ? 's' : ''} available · ${totalDownloads} total downloads`}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" className="bg-white text-brand-700 hover:bg-brand-50 font-bold shadow-lg" asChild>
              <Link href="/pricing">
                <Plus className="h-4 w-4" /> Buy Tokens
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Token Packs ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Top up tokens</h2>
          <Link href="/pricing" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            See all packs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TOKEN_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${
                pack.highlight ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'bg-card hover:border-brand-300'
              }`}
              onClick={() => addTokens(pack.tokens, pack.label, pack.price)}
            >
              {pack.highlight && (
                <div className="absolute -top-2.5 left-4 bg-brand-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  POPULAR
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">{pack.tokens} Tokens</p>
                  <p className="text-xs text-muted-foreground">₹{(pack.price / pack.tokens).toFixed(0)}/token</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg">₹{pack.price}</p>
                <Button size="sm" variant={pack.highlight ? 'brand' : 'outline'} className="text-xs h-7 px-3 mt-1">
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Token Balance', value: tokens, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Total Downloads', value: totalDownloads, icon: Download, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/20' },
          { label: 'Active Licenses', value: totalDownloads, icon: BookMarked, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Collections', value: 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`h-4.5 w-4.5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Downloads ── */}
      <div className="border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold">Recent Downloads</h2>
          <Link href="/dashboard/customer/downloads" className="text-sm text-brand-600 hover:underline">View all</Link>
        </div>
        {totalDownloads === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold mb-1">No downloads yet</h3>
            <p className="text-muted-foreground text-sm mb-5">Use your {tokens} token{tokens !== 1 ? 's' : ''} to download amazing assets</p>
            <Button variant="brand" asChild>
              <Link href="/"><Sparkles className="h-4 w-4" /> Browse Assets</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {/* ── Quick Browse ── */}
      <div className="bg-muted/30 rounded-2xl p-5">
        <h2 className="font-bold mb-3">Browse by category</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="px-3.5 py-2 rounded-xl border bg-background hover:border-brand-500 hover:text-brand-600 text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
