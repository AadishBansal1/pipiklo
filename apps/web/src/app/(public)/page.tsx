import dynamic from 'next/dynamic'
import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryGrid } from '@/components/home/CategoryGrid'

// Lazy-load sections below the fold — they don't block first paint
const AIToolsShowcase = dynamic(() => import('@/components/home/AIToolsShowcase').then((m) => m.AIToolsShowcase))
const FeaturedItems = dynamic(() => import('@/components/home/FeaturedItems').then((m) => m.FeaturedItems))
const CuratedCollections = dynamic(() => import('@/components/home/CuratedCollections').then((m) => m.CuratedCollections))
const FreeBanner = dynamic(() => import('@/components/home/FreeBanner').then((m) => m.FreeBanner))

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <AIToolsShowcase />
      <FeaturedItems />
      <CuratedCollections />
      <FreeBanner />
    </>
  )
}
