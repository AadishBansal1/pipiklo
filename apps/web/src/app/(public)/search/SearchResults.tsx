'use client'

import { useMemo } from 'react'
import { searchItems, generateItems } from '@/lib/mock-data'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import { ItemGrid } from '@/components/browse/ItemGrid'
import { formatNumber } from '@/lib/utils'
import type { ItemCard } from '@pipiklo/types'

interface Props {
  searchParams: {
    q?: string
    category?: string
    subcategory?: string
    sortBy?: string
    minRating?: string
    page?: string
  }
}

export function SearchResults({ searchParams }: Props) {
  const { q, category, subcategory, sortBy = 'downloads', minRating } = searchParams

  const results = useMemo(() => {
    let items: ItemCard[] = q
      ? searchItems(q, { category, subcategory })
      : generateItems().filter((item) => {
          if (category && item.category !== category) return false
          if (subcategory && item.subcategory !== subcategory) return false
          return true
        })

    if (minRating) {
      items = items.filter((i) => i.rating >= Number(minRating))
    }

    switch (sortBy) {
      case 'downloads':
        items = [...items].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
        break
      case 'rating':
        items = [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case 'newest':
        // mock: reverse order as proxy for newest
        items = [...items].reverse()
        break
    }

    return items
  }, [q, category, subcategory, sortBy, minRating])

  const pageNum = Number(searchParams.page ?? 1)
  const PAGE_SIZE = 24
  const paged = results.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE)
  const totalPages = Math.ceil(results.length / PAGE_SIZE)

  return (
    <div className="flex gap-8">
      <FilterSidebar currentCategory={category} currentSubcategory={subcategory} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {q ? (
              <h1 className="text-2xl font-bold">
                Results for <span className="text-brand-600">&ldquo;{q}&rdquo;</span>
              </h1>
            ) : (
              <h1 className="text-2xl font-bold">
                {category
                  ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  : 'All Assets'}
              </h1>
            )}
            <p className="text-muted-foreground text-sm mt-1">{formatNumber(results.length)} results</p>
          </div>
        </div>

        <ItemGrid items={paged} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === pageNum
                    ? 'bg-brand-500 text-white'
                    : 'border hover:bg-muted'
                }`}
              >
                {p}
              </a>
            ))}
            {totalPages > 8 && <span className="text-muted-foreground">...</span>}
          </div>
        )}
      </div>
    </div>
  )
}
