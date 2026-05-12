import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchResults } from './SearchResults'

interface Props {
  searchParams: { q?: string; category?: string; subcategory?: string; sortBy?: string; minRating?: string; page?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q
  return {
    title: q ? `"${q}" — Search Results` : 'Browse All Assets',
    description: `Browse ${q ? `results for "${q}"` : 'all creative assets'} on Pipiklo`,
  }
}

export default function SearchPage({ searchParams }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading...</div>}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
