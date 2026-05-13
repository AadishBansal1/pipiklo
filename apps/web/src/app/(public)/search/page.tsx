import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchResults } from './SearchResults'

interface SearchParams {
  q?: string
  category?: string
  subcategory?: string
  sortBy?: string
  minRating?: string
  page?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const q = sp.q
  return {
    title: q ? `"${q}" — Search Results` : 'Browse All Assets',
    description: `Browse ${q ? `results for "${q}"` : 'all creative assets'} on Pipiklo`,
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">Loading...</div>}>
        <SearchResults searchParams={sp} />
      </Suspense>
    </div>
  )
}
