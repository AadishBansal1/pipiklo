'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Download, Star, Eye, Tag, CheckCircle2, Shield,
  ChevronLeft, ChevronRight, Heart, Share2, ExternalLink,
  Info, Coins, X, ZoomIn, Play, ArrowRight,
} from 'lucide-react'
import type { Item } from '@pipiklo/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatDate, generateLicenseKey } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface Props {
  item: Item
}

// ── Category-specific attributes ─────────────────────────────────────────────
function getAttributes(item: Item): { label: string; value: string }[] {
  const cat = item.category
  if (cat === 'stock-video' || cat === 'video-templates') return [
    { label: 'Length', value: '0:10' },
    { label: 'Resolution', value: '3840 × 2160' },
    { label: 'File Size', value: item.fileSize ?? '510 MB' },
    { label: 'Frame Rate', value: '30 fps' },
    { label: 'Alpha Channel', value: 'No' },
    { label: 'Video Encoding', value: item.fileFormat ?? 'ProRes' },
    { label: 'Orientation', value: 'Horizontal' },
    { label: 'Commercial License', value: '✓ Included' },
  ]
  if (cat === 'audio') return [
    { label: 'Length', value: '2:35' },
    { label: 'File Format', value: item.fileFormat ?? 'WAV + MP3' },
    { label: 'File Size', value: item.fileSize ?? '42 MB' },
    { label: 'Sample Rate', value: '44.1 kHz' },
    { label: 'BPM', value: '128' },
    { label: 'Commercial License', value: '✓ Included' },
  ]
  if (cat === 'photos') return [
    { label: 'Resolution', value: '6000 × 4000' },
    { label: 'File Format', value: item.fileFormat ?? 'JPEG' },
    { label: 'File Size', value: item.fileSize ?? '18 MB' },
    { label: 'Color Mode', value: 'RGB' },
    { label: 'Orientation', value: 'Horizontal' },
    { label: 'Commercial License', value: '✓ Included' },
  ]
  if (cat === 'fonts') return [
    { label: 'Font Style', value: 'Sans-serif' },
    { label: 'Weights', value: '7 (Thin → Black)' },
    { label: 'File Format', value: item.fileFormat ?? 'TTF + OTF' },
    { label: 'File Size', value: item.fileSize ?? '3 MB' },
    { label: 'Character Set', value: 'Extended Latin' },
    { label: 'Commercial License', value: '✓ Included' },
  ]
  return [
    { label: 'File Format', value: item.fileFormat ?? 'PSD + AI + PNG' },
    { label: 'File Size', value: item.fileSize ?? '24 MB' },
    { label: 'Resolution', value: '4000 × 3000' },
    { label: 'DPI', value: '300' },
    { label: 'Layers', value: 'Fully Layered' },
    { label: 'Orientation', value: 'Horizontal' },
    { label: 'Commercial License', value: '✓ Included' },
  ]
}

// ── Preview Lightbox ──────────────────────────────────────────────────────────
function PreviewLightbox({
  images, startIndex, onClose,
}: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
        <X className="h-5 w-5" />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {idx + 1} / {images.length}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length) }}
        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <motion.div
        key={idx}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-5xl w-full max-h-[80vh] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={images[idx]} alt="" fill className="object-contain" sizes="90vw" />
      </motion.div>

      <button
        onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length) }}
        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIdx(i) }}
            className={`relative shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${i === idx ? 'border-brand-400' : 'border-white/20 hover:border-white/50'}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="56px" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ItemDetailClient({ item }: Props) {
  const { user, useToken } = useAppStore()
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [liked, setLiked] = useState(false)

  const attributes = getAttributes(item)
  const tokenCost = 1
  const canDownload = !!user
  const hasTokens = (user?.tokens ?? 0) >= tokenCost

  async function handleDownload() {
    if (!canDownload) { window.location.href = `/sign-in?redirect=/item/${item.id}`; return }
    if (!hasTokens) {
      toast({ title: 'Not enough tokens', description: 'Buy more tokens to download this asset.', variant: 'destructive' })
      return
    }

    setDownloading(true)
    try {
      const spent = useToken(tokenCost)
      if (!spent) { toast({ title: 'Token error', description: 'Could not deduct token.', variant: 'destructive' }); return }

      const licenseKey = generateLicenseKey()

      // Persist to Supabase in background (non-blocking)
      if (user?.id) {
        import('@/lib/supabase/db').then(({ dbUseToken, dbRecordDownload }) => {
          // Deduct token in DB
          dbUseToken(user.id, tokenCost).catch(console.error)
          // Record download + credit creator
          dbRecordDownload({
            userId: user.id,
            itemId: item.id,
            licenseKey,
            creatorId: item.creator?.id ?? '',
            itemTitle: item.title,
          }).catch(console.error)
        }).catch(console.error)
      }

      await new Promise((r) => setTimeout(r, 800))

      const content = [
        `PIPIKLO — ${item.title}`,
        '═'.repeat(60),
        '',
        `License Key  : ${licenseKey}`,
        `Item ID      : ${item.id}`,
        `Category     : ${item.category}`,
        `Creator      : ${item.creator?.name ?? 'Pipiklo'}`,
        `Downloaded   : ${new Date().toLocaleString()}`,
        '',
        'LICENSE',
        '───────',
        'Pipiklo Commercial License — use in unlimited personal & client projects.',
        'No attribution required. Lifetime commercial usage rights.',
        'See https://pipiklo.com/license for full terms.',
        '',
        '© Pipiklo — https://pipiklo.com',
      ].join('\n')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `pipiklo-${item.id}-${licenseKey}.txt`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)

      setDownloaded(true)
      toast({ title: '✅ Download started!', description: `License: ${licenseKey} — 1 token used.` })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <PreviewLightbox
            images={item.previewUrls.length > 0 ? item.previewUrls : [item.thumbnailUrl]}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${item.category}`} className="hover:text-foreground transition-colors capitalize">
            {item.category.replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] sm:max-w-sm">{item.title}</span>
        </nav>

        {/* ── Two-column hero layout ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mb-14">

          {/* LEFT — Gallery */}
          <div>
            {/* Main image */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden bg-muted group cursor-zoom-in mb-3"
              onClick={() => setLightboxIdx(activeImg)}
            >
              <Image
                src={item.previewUrls[activeImg] ?? item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              {/* Preview overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm font-medium">
                  <ZoomIn className="h-4 w-4" />
                  Click to preview
                </div>
              </div>
              {/* Image counter */}
              {item.previewUrls.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">
                  {activeImg + 1} / {item.previewUrls.length}
                </div>
              )}
              {/* Nav arrows */}
              {item.previewUrls.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + item.previewUrls.length) % item.previewUrls.length) }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % item.previewUrls.length) }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {item.previewUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {item.previewUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-transparent hover:border-muted-foreground/40'
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
                {/* "Preview all" button */}
                <button
                  onClick={() => setLightboxIdx(0)}
                  className="shrink-0 w-20 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-brand-500 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-brand-500 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Preview all</span>
                </button>
              </div>
            )}

            {/* Title + meta — shown below gallery on mobile, overlaid on right on desktop */}
            <div className="mt-6 lg:hidden">
              <ItemMeta item={item} liked={liked} setLiked={setLiked} />
            </div>
          </div>

          {/* RIGHT — Sticky download panel */}
          <div className="flex flex-col gap-4">
            {/* Title + meta (desktop only) */}
            <div className="hidden lg:block">
              <ItemMeta item={item} liked={liked} setLiked={setLiked} />
            </div>

            {/* Download card */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden sticky top-24">
              {/* Token cost header */}
              <div className="bg-gradient-to-br from-brand-500 to-brand-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium mb-0.5">Download cost</p>
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-5 w-5 text-amber-300" />
                      <span className="text-2xl font-black text-white">{tokenCost} token</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs mb-0.5">Your balance</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Coins className="h-4 w-4 text-amber-300" />
                      <span className={`text-lg font-bold ${hasTokens ? 'text-white' : 'text-red-200'}`}>
                        {user?.tokens ?? 0} tokens
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Download / Sign in / Buy tokens button */}
                {canDownload ? (
                  hasTokens ? (
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full text-base font-bold"
                      onClick={handleDownload}
                      disabled={downloading || downloaded}
                    >
                      {downloading ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating license…
                        </span>
                      ) : downloaded ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" /> Downloaded!
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="h-5 w-5" /> Download · 1 Token
                        </span>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="brand" size="lg" className="w-full font-bold" asChild>
                        <Link href="/pricing">
                          <Coins className="h-5 w-5" /> Buy More Tokens
                        </Link>
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        You need {tokenCost} token to download this asset
                      </p>
                    </div>
                  )
                ) : (
                  <Button variant="brand" size="lg" className="w-full font-bold" asChild>
                    <Link href={`/sign-in?redirect=/item/${item.id}`}>
                      <Download className="h-5 w-5" /> Sign in to Download
                    </Link>
                  </Button>
                )}

                {/* New user CTA */}
                {!user && (
                  <p className="text-center text-xs text-muted-foreground">
                    New? <Link href="/sign-up" className="text-brand-600 font-semibold hover:underline">Sign up free</Link> and get <strong>3 tokens</strong> instantly
                  </p>
                )}

                {/* Quick stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { icon: Eye, value: formatNumber(item.views ?? 0), label: 'Views' },
                    { icon: Download, value: formatNumber(item.downloads), label: 'Downloads' },
                    { icon: Star, value: item.rating?.toFixed(1) ?? '—', label: 'Rating' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="text-center bg-muted/40 rounded-xl py-2.5">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground mx-auto mb-0.5" />
                      <p className="font-bold text-sm leading-none">{value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* License strip */}
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-muted/20">
                  <Shield className="h-4 w-4 text-brand-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">Pipiklo Commercial License</p>
                    <p className="text-[11px] text-muted-foreground">Unlimited projects · No attribution</p>
                  </div>
                  <Link href="/license" className="text-brand-600 hover:text-brand-700 shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Creator */}
                {item.creator && (
                  <div className="flex items-center gap-3 border rounded-xl px-3 py-2.5">
                    <Image
                      src={item.creator.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creator.id}`}
                      alt={item.creator.name}
                      width={36}
                      height={36}
                      className="rounded-full shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Made by</p>
                      <p className="text-sm font-semibold truncate">{item.creator.name}</p>
                    </div>
                    <Link href={`/search?creator=${item.creator.id}`} className="ml-auto">
                      <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  Added {formatDate(item.createdAt)}
                </p>
              </div>
            </div>

            {/* Compatible tools card */}
            {item.compatibleTools && item.compatibleTools.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Compatible With
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.compatibleTools.map((tool) => (
                    <span key={tool} className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Description ── */}
        <section className="mb-10 max-w-3xl">
          <h2 className="text-xl font-bold mb-3">About this asset</h2>
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        </section>

        {/* ── Tags ── */}
        {item.tags?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold mb-3 text-muted-foreground uppercase tracking-wider text-xs">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Attributes table ── */}
        <section className="mb-10 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">File Details</h2>
          <div className="rounded-2xl border overflow-hidden">
            {attributes.map((attr, i) => (
              <div
                key={attr.label}
                className={`flex items-center justify-between px-5 py-3.5 text-sm ${i !== attributes.length - 1 ? 'border-b' : ''} ${i % 2 === 0 ? 'bg-muted/20' : ''}`}
              >
                <span className="text-muted-foreground font-medium">{attr.label}</span>
                <span className="font-semibold">{attr.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3.5 text-sm border-t bg-muted/20">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Further Information
              </span>
              <Link href="/license" className="text-brand-600 hover:underline text-xs flex items-center gap-1">
                View License <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── License details ── */}
        <section className="mb-14 max-w-2xl">
          <div className="rounded-2xl border bg-gradient-to-br from-brand-50/50 to-background dark:from-brand-950/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-brand-500" />
              <h2 className="font-bold">What's included in the Pipiklo Commercial License</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {[
                'Use in unlimited personal & client projects',
                'Lifetime commercial usage rights',
                'No attribution required',
                'Modify and customize freely',
                'Use in print & digital media',
                'Use in social media and ads',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <Link href="/license" className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline font-medium">
              Read full license agreement <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

// ── ItemMeta sub-component (title, creator, rating, actions) ─────────────────
function ItemMeta({
  item, liked, setLiked,
}: { item: Item; liked: boolean; setLiked: (v: boolean) => void }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <Badge className="mb-2 capitalize">{item.category.replace(/-/g, ' ')}</Badge>
          <h1 className="text-2xl lg:text-3xl font-black leading-tight mb-2">{item.title}</h1>

          {item.creator && (
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={item.creator.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creator.id}`}
                alt={item.creator.name}
                width={22}
                height={22}
                className="rounded-full"
              />
              <span className="text-sm text-muted-foreground">
                by{' '}
                <span className="text-foreground font-semibold hover:text-brand-600 cursor-pointer transition-colors">
                  {item.creator.name}
                </span>
              </span>
            </div>
          )}

          {/* Rating row */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
              ))}
              <span className="ml-1 font-semibold text-foreground">{item.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({formatNumber(item.ratingCount)})</span>
            </div>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {formatNumber(item.downloads)} downloads
            </span>
          </div>
        </div>

        {/* Share + like */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-xl border transition-all ${liked ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'hover:bg-muted'}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: 'Link copied!' }) }}
            className="p-2.5 rounded-xl border hover:bg-muted transition-colors"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
