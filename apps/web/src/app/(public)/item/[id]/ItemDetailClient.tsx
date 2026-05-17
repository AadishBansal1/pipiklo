'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSafeUser } from '@/components/auth/useSafeUser'
import {
  Download, Star, Eye, Tag, CheckCircle2, Shield,
  ChevronLeft, ChevronRight, Heart, Share2, ExternalLink,
  Info
} from 'lucide-react'
import type { Item } from '@pipiklo/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatDate, generateLicenseKey } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface Props {
  item: Item
}

// Generate category-specific attributes
function getAttributes(item: Item): { label: string; value: string }[] {
  const cat = item.category

  if (cat === 'stock-video' || cat === 'video-templates') {
    return [
      { label: 'Length', value: '0:10' },
      { label: 'Resolution', value: '3840 x 2160' },
      { label: 'File Size', value: item.fileSize ?? '510 MB' },
      { label: 'Frame Rate', value: '30 fps' },
      { label: 'Alpha Channel', value: 'No' },
      { label: 'Looped', value: 'Yes' },
      { label: 'Video Encoding', value: item.fileFormat ?? 'ProRes' },
      { label: 'Orientation', value: 'Horizontal' },
      { label: 'Commercial License', value: 'Included' },
    ]
  }
  if (cat === 'audio') {
    return [
      { label: 'Length', value: '2:35' },
      { label: 'File Format', value: item.fileFormat ?? 'WAV + MP3' },
      { label: 'File Size', value: item.fileSize ?? '42 MB' },
      { label: 'Sample Rate', value: '44.1 kHz' },
      { label: 'Bit Depth', value: '24-bit' },
      { label: 'Looped', value: 'No' },
      { label: 'BPM', value: '128' },
      { label: 'Commercial License', value: 'Included' },
    ]
  }
  if (cat === 'photos') {
    return [
      { label: 'Resolution', value: '6000 x 4000' },
      { label: 'File Format', value: item.fileFormat ?? 'JPEG' },
      { label: 'File Size', value: item.fileSize ?? '18 MB' },
      { label: 'Color Mode', value: 'RGB' },
      { label: 'Orientation', value: 'Horizontal' },
      { label: 'Commercial License', value: 'Included' },
    ]
  }
  if (cat === 'fonts') {
    return [
      { label: 'Styles', value: '6' },
      { label: 'Weights', value: 'Thin to Black' },
      { label: 'File Format', value: item.fileFormat ?? 'OTF + TTF' },
      { label: 'File Size', value: item.fileSize ?? '2.4 MB' },
      { label: 'Languages', value: 'Latin + Extended' },
      { label: 'Commercial License', value: 'Included' },
    ]
  }
  if (cat === '3d') {
    return [
      { label: 'File Format', value: item.fileFormat ?? 'OBJ + FBX + BLEND' },
      { label: 'File Size', value: item.fileSize ?? '85 MB' },
      { label: 'Polygons', value: '12,480' },
      { label: 'Textures', value: 'Yes (4K)' },
      { label: 'Rigged', value: 'No' },
      { label: 'Animated', value: 'No' },
      { label: 'Commercial License', value: 'Included' },
    ]
  }
  // Default (graphics, design-templates, web, gen-ai)
  return [
    { label: 'File Format', value: item.fileFormat ?? 'PSD + AI + PNG' },
    { label: 'File Size', value: item.fileSize ?? '24 MB' },
    { label: 'Resolution', value: '4000 x 3000' },
    { label: 'DPI', value: '300' },
    { label: 'Layers', value: 'Yes' },
    { label: 'Orientation', value: 'Horizontal' },
    { label: 'Commercial License', value: 'Included' },
  ]
}

export function ItemDetailClient({ item }: Props) {
  const { isSignedIn } = useSafeUser()
  const [activeImg, setActiveImg] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [liked, setLiked] = useState(false)

  const attributes = getAttributes(item)

  async function handleDownload() {
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !isSignedIn) return
    setDownloading(true)
    try {
      // Simulate license key generation + small delay
      await new Promise((r) => setTimeout(r, 1200))
      const licenseKey = generateLicenseKey()

      // Build a demo "readme" text that mimics a real download package
      const readmeContent = [
        `PIPIKLO — ${item.title}`,
        '═'.repeat(60),
        '',
        `License Key : ${licenseKey}`,
        `Item ID     : ${item.id}`,
        `Category    : ${item.category}`,
        `Creator     : ${item.creator?.name ?? 'Pipiklo'}`,
        `Downloaded  : ${new Date().toLocaleString()}`,
        '',
        'LICENSE',
        '───────',
        'This asset is licensed under the Pipiklo Commercial License.',
        'You may use it in unlimited personal and client projects.',
        'No attribution required. Lifetime commercial usage rights.',
        'See https://pipiklo.com/license for full terms.',
        '',
        'NOTE',
        '────',
        'This is a demo download. In production the full source',
        'files (PSD / ZIP / MP4 etc.) are served from secure R2 storage.',
        '',
        '© Pipiklo — https://pipiklo.com',
      ].join('\n')

      // Trigger browser download
      const blob = new Blob([readmeContent], { type: 'text/plain' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `pipiklo-${item.id}-${licenseKey}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloaded(true)
      toast({
        title: '✅ Download started!',
        description: `License key: ${licenseKey}. Check your Downloads folder.`,
      })
    } finally {
      setDownloading(false)
    }
  }

  const canDownload = isSignedIn || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${item.category}`} className="hover:text-foreground transition-colors capitalize">
          {item.category.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[240px]">{item.title}</span>
      </nav>

      {/* ── Title + Meta ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold leading-tight mb-2">{item.title}</h1>
            {item.creator && (
              <div className="flex items-center gap-2">
                <Image
                  src={item.creator.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creator.id}`}
                  alt={item.creator.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm text-muted-foreground">
                  by{' '}
                  <span className="text-foreground font-medium hover:text-brand-600 cursor-pointer transition-colors">
                    {item.creator.name}
                  </span>
                </span>
              </div>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">{item.rating.toFixed(1)}</span>
              <span>({formatNumber(item.ratingCount)})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
              <Download className="h-4 w-4" />
              <span>{formatNumber(item.downloads)}</span>
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
              title="Save to collection"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-2 rounded-lg border hover:bg-muted transition-colors" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Preview + Download Panel ── */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mb-12">
        {/* LEFT: Preview */}
        <div>
          {/* Main image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted group">
            <Image
              src={item.previewUrls[activeImg] ?? item.thumbnailUrl}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
            />
            {item.previewUrls.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={() => setActiveImg((i) => (i - 1 + item.previewUrls.length) % item.previewUrls.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                  onClick={() => setActiveImg((i) => (i + 1) % item.previewUrls.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            {/* Image counter */}
            {item.previewUrls.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                {activeImg + 1} / {item.previewUrls.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {item.previewUrls.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {item.previewUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImg
                      ? 'border-brand-500 ring-1 ring-brand-500/40'
                      : 'border-transparent hover:border-muted-foreground/40'
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Download Panel */}
        <div className="lg:sticky lg:top-24 self-start space-y-4">
          {/* Download card */}
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="free" className="text-xs">
                  {item.isFree ? 'FREE' : `₹${item.price}`}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(item.views ?? 0)} views
                </div>
              </div>

              {canDownload ? (
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full text-base font-bold mb-3"
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
                      <Download className="h-5 w-5" /> Download Free
                    </span>
                  )}
                </Button>
              ) : (
                <Link href="/sign-in">
                  <Button variant="brand" size="lg" className="w-full text-base font-bold mb-3">
                    <Download className="h-5 w-5" /> Sign in to Download
                  </Button>
                </Link>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Added {formatDate(item.createdAt)}
              </p>
            </div>

            {/* License strip */}
            <div className="border-t bg-muted/30 px-5 py-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-500 shrink-0" />
                <span className="text-xs font-semibold">Pipiklo Commercial License</span>
              </div>
              <Link
                href="/license"
                className="flex items-center gap-1 text-xs text-brand-600 hover:underline mt-1.5"
              >
                View full license <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Compatible tools */}
          {item.compatibleTools && item.compatibleTools.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
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
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">{item.description}</p>
      </section>

      {/* ── Tags ── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">Item Tags</h2>
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

      {/* ── Attributes ── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Attributes</h2>
        <div className="rounded-xl border overflow-hidden max-w-2xl">
          {attributes.map((attr, i) => (
            <div
              key={attr.label}
              className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                i !== attributes.length - 1 ? 'border-b' : ''
              } ${i % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
            >
              <span className="text-muted-foreground font-medium">{attr.label}</span>
              <span className="font-semibold">{attr.value}</span>
            </div>
          ))}

          {/* Further information row */}
          <div className="flex items-center justify-between px-5 py-3.5 text-sm border-t bg-muted/30">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Further Information
            </span>
            <Link href="/license" className="text-brand-600 hover:underline text-xs flex items-center gap-1">
              Pipiklo License <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── License details ── */}
      <section className="mb-12 max-w-2xl">
        <div className="rounded-xl border bg-muted/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-brand-500" />
            <h2 className="font-bold">Commercial License</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Use in unlimited personal & client projects',
              'Lifetime commercial usage rights',
              'No attribution required',
              'Modify and customize freely',
              'Use in digital or print media',
              'Use in social media content',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/license"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline mt-4"
          >
            Read the full Pipiklo License <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
