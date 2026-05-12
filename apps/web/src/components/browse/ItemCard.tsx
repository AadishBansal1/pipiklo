'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo, useState } from 'react'
import { Download, Star, Heart } from 'lucide-react'
import type { ItemCard as ItemCardType } from '@pipiklo/types'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'

interface ItemCardProps {
  item: ItemCardType
}

export const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)

  return (
    <Link href={`/item/${item.id}`}>
      <article
        className="group relative rounded-xl overflow-hidden border bg-card hover:border-brand-500/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => { setHovered(true); setPreviewIdx(1) }}
        onMouseLeave={() => { setHovered(false); setPreviewIdx(0) }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={item.previewUrls[previewIdx] ?? item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/90 text-black rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Free
            </div>
          </div>

          {/* Preview dots */}
          {item.previewUrls.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {item.previewUrls.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === previewIdx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}

          {/* Free badge */}
          {item.isFree && (
            <div className="absolute top-2 left-2">
              <Badge variant="free" className="text-xs font-bold">FREE</Badge>
            </div>
          )}

          {/* Like button */}
          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            aria-label="Save to collection"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1 capitalize">{item.subcategory}</p>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors mb-2">
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({formatNumber(item.ratingCount)})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-3 w-3" />
              <span className="text-xs">{formatNumber(item.downloads)}</span>
            </div>
          </div>

          {item.creator && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t">
              <Image
                src={item.creator.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={item.creator.name}
                width={16}
                height={16}
                className="rounded-full"
              />
              <span className="text-xs text-muted-foreground truncate">{item.creator.name}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
})
