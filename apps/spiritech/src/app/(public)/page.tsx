import { HeroBanner } from '@/components/home/HeroBanner'
import { SubjectGrid } from '@/components/home/SubjectGrid'
import { FeatureHighlights } from '@/components/home/FeatureHighlights'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <SubjectGrid />
      <FeatureHighlights />
    </>
  )
}
