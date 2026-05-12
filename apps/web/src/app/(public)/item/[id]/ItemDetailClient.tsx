'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSafeUser } from '@/components/auth/useSafeUser'
import {
  Download, Star, Eye, Tag, CheckCircle2, Shield, AlertCircle,
  ChevronLeft, ChevronRight, Heart, Share2, ExternalLink
} from 'lucide-react'
import type { Item } from '@pipiklo/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatDate, generateLicenseKey } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface Props {
  item: Item
}

export function ItemDetailClient({ item }: Props) {
  const { isSignedIn, user } = useSafeUser()
  const [activeImg, setActiveImg] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [liked, setLiked] = useState(false)

  async function handleDownload() {
    // Allow download in dev mode even without auth
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !isSignedIn) return

    setDownloading(true)
    try {
      // Simulate download + license generation
      await new Promise((r) => setTimeout(r, 1500))
      const licenseKey = generateLicenseKey()
      setDownloaded(true)
      toast({
        title: 'Download started!',
        description: `License key: ${licenseKey}. Check your dashboard for the certificate.`,
      })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-10">
      {/* Left: Preview */}
      <div>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={`/${item.category}`} className="hover:text-foreground capitalize">{item.category.replace(/-/g, ' ')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{item.title}</span>
        </nav>

        {/* Main image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-3">
          <Image
            src={item.previewUrls[activeImg] ?? item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {item.previewUrls.length > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                onClick={() => setActiveImg((i) => (i - 1 + item.previewUrls.length) % item.previewUrls.length)}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                onClick={() => setActiveImg((i) => (i + 1) % item.previewUrls.length)}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2">
          {item.previewUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeImg ? 'border-brand-500' : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">About this item</h2>
          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Compatible Tools */}
        {item.compatibleTools && item.compatibleTools.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Compatible Tools</h3>
            <div className="flex flex-wrap gap-2">
              {item.compatibleTools.map((tool) => (
                <span key={tool} className="px-3 py-1 rounded-full bg-muted text-sm">{tool}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{item.rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{formatNumber(item.ratingCount)} ratings</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Download className="h-4 w-4 text-brand-500" />
              <span className="font-bold text-lg">{formatNumber(item.downloads)}</span>
            </div>
            <p className="text-xs text-muted-foreground">downloads</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg">{formatNumber(item.views ?? 0)}</span>
            </div>
            <p className="text-xs text-muted-foreground">views</p>
          </div>
        </div>
      </div>

      {/* Right: Download panel */}
      <div className="lg:sticky lg:top-24 self-start">
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="free" className="mb-2">FREE</Badge>
                <h1 className="text-xl font-bold leading-tight">{item.title}</h1>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{item.subcategory}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="p-2 rounded-lg border hover:bg-muted transition-colors"
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="p-2 rounded-lg border hover:bg-muted transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Creator */}
            {item.creator && (
              <div className="flex items-center gap-2.5 mb-5 p-3 rounded-xl bg-muted/50">
                <Image
                  src={item.creator.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={item.creator.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <p className="font-medium text-sm truncate">{item.creator.name}</p>
                </div>
              </div>
            )}

            {/* File info */}
            <div className="space-y-2 mb-5 text-sm">
              {item.fileFormat && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">{item.fileFormat}</span>
                </div>
              )}
              {item.fileSize && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium">{item.fileSize}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Added</span>
                <span className="font-medium">{formatDate(item.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium">Standard Commercial</span>
              </div>
            </div>

            {/* Download CTA */}
            {(isSignedIn || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ? (
              <Button
                variant="brand"
                size="lg"
                className="w-full text-base"
                onClick={handleDownload}
                disabled={downloading || downloaded}
              >
                {downloading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating license...
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
                <Button variant="brand" size="lg" className="w-full text-base">
                  <Download className="h-5 w-5" /> Sign in to Download
                </Button>
              </Link>
            )}
          </div>

          {/* License summary */}
          <div className="border-t bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-brand-500" />
              <span className="text-sm font-semibold">Pipiklo Commercial License</span>
            </div>
            <ul className="space-y-1.5">
              {[
                'Use in unlimited personal & client projects',
                'Lifetime commercial usage rights',
                'No attribution required',
                'Modify and customize freely',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/license" className="flex items-center gap-1 text-xs text-brand-600 hover:underline mt-3">
              View full license <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
