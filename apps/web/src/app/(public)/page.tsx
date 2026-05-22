import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedItems } from '@/components/home/FeaturedItems'

// ISR: homepage revalidates every 5 minutes
export const revalidate = 300

// Lazy-load below-the-fold sections — they don't block first paint
const AIToolsShowcase   = dynamic(() => import('@/components/home/AIToolsShowcase').then((m) => m.AIToolsShowcase))
const CuratedCollections = dynamic(() => import('@/components/home/CuratedCollections').then((m) => m.CuratedCollections))
const FreeBanner        = dynamic(() => import('@/components/home/FreeBanner').then((m) => m.FreeBanner))

function ItemsSkeleton() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="h-8 w-64 bg-muted rounded-lg animate-pulse mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <Suspense fallback={<ItemsSkeleton />}>
        <FeaturedItems />
      </Suspense>
      <AIToolsShowcase />
      <CuratedCollections />
      <FreeBanner />
    </>
  )
}
