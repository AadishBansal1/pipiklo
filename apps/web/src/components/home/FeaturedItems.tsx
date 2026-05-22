import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { getFeaturedItems, toItemCard } from '@/lib/data'
import { ItemCard } from '@/components/browse/ItemCard'

// Server component — rendered at build time, ISR every 10 min
export async function FeaturedItems() {
  const rawItems = await getFeaturedItems(8)
  const items = rawItems.map(toItemCard)

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
              <TrendingUp className="h-4 w-4" />
              Trending Now
            </div>
            <h2 className="text-4xl font-black text-foreground">Most Popular This Week</h2>
            <p className="text-sm text-muted-foreground mt-1">{items.length.toLocaleString()} top assets</p>
          </div>
          <Link
            href="/search?sortBy=downloads"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 border border-brand-500/30 hover:border-brand-500/60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:bg-brand-500/5 shrink-0"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
