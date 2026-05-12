'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { getFeaturedItems } from '@/lib/mock-data'
import { ItemCard } from '@/components/browse/ItemCard'
import { useAppStore } from '@/store/app-store'
import { useShallow } from 'zustand/react/shallow'
import type { ItemCard as ItemCardType } from '@pipiklo/types'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

// Cache base items at module level — generateItems() is idempotent
const BASE_ITEMS = getFeaturedItems(8)

export function FeaturedItems() {
  const approvedStoreItems = useAppStore(
    useShallow((s) => s.items.filter((i) => i.status === 'approved'))
  )

  const storeCards: ItemCardType[] = useMemo(() => approvedStoreItems.map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category as any,
    subcategory: i.subcategory,
    thumbnailUrl: i.thumbnailUrl,
    previewUrls: [i.thumbnailUrl],
    isFree: i.isFree,
    downloads: i.downloads,
    rating: i.rating,
    ratingCount: i.ratingCount,
    tags: i.tags,
    creator: { id: i.creatorId, name: i.creatorName, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i.creatorId}` },
    createdAt: i.submittedAt,
  })), [approvedStoreItems])

  const allItems = useMemo(() => [...storeCards, ...BASE_ITEMS].slice(0, 8), [storeCards])

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
              <TrendingUp className="h-4 w-4" />
              Trending Now
            </div>
            <h2 className="text-4xl font-black text-foreground">Most Popular This Week</h2>
            {storeCards.length > 0 && (
              <p className="text-xs text-brand-500 mt-1 font-medium">✓ {storeCards.length} newly approved items included</p>
            )}
          </div>
          <Link
            href="/search?sortBy=downloads"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 border border-brand-500/30 hover:border-brand-500/60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:bg-brand-500/5 shrink-0"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
        >
          {allItems.map((i) => (
            <motion.div key={i.id} variants={item}>
              <ItemCard item={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
