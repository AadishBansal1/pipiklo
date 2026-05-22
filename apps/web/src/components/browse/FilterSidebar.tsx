'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { Star, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FilterSidebarProps {
  currentCategory?: string
  currentSubcategory?: string
}

export function FilterSidebar({ currentCategory, currentSubcategory }: FilterSidebarProps) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(['category', 'subcategory', 'rating'])

  function toggle(section: string) {
    setOpenSections((prev) => prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section])
  }

  function updateFilter(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (p.get(key) === value) p.delete(key)
    else p.set(key, value)
    p.delete('page')
    // Stay on same page (category or search)
    const base = pathname.startsWith('/search') ? '/search' : pathname
    router.push(`${base}?${p.toString()}`)
  }

  const activeGroup = CATEGORY_GROUPS.find((g) => g.slug === currentCategory)

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 space-y-1">
        {/* Categories */}
        <div className="border rounded-xl overflow-hidden">
          <button
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
            onClick={() => toggle('category')}
          >
            Category
            <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.includes('category') && 'rotate-180')} />
          </button>
          {openSections.includes('category') && (
            <div className="border-t px-2 py-2 space-y-0.5 max-h-80 overflow-y-auto">
              {CATEGORY_GROUPS.map((g) => (
                <button
                  key={g.slug}
                  onClick={() => updateFilter('category', g.slug)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    currentCategory === g.slug
                      ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30 dark:text-brand-400'
                      : 'hover:bg-muted'
                  )}
                >
                  <span>{g.icon}</span>
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory */}
        {activeGroup && activeGroup.subcategories.length > 0 && (
          <div className="border rounded-xl overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
              onClick={() => toggle('subcategory')}
            >
              Subcategory
              <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.includes('subcategory') && 'rotate-180')} />
            </button>
            {openSections.includes('subcategory') && (
              <div className="border-t px-2 py-2 space-y-0.5 max-h-72 overflow-y-auto">
                {activeGroup.subcategories.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => updateFilter('subcategory', sub.slug)}
                    className={cn(
                      'flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      currentSubcategory === sub.slug
                        ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30 dark:text-brand-400'
                        : 'hover:bg-muted'
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="border rounded-xl overflow-hidden">
          <button
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
            onClick={() => toggle('rating')}
          >
            Minimum Rating
            <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.includes('rating') && 'rotate-180')} />
          </button>
          {openSections.includes('rating') && (
            <div className="border-t px-4 py-3 space-y-2">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => updateFilter('minRating', String(r))}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                    params.get('minRating') === String(r)
                      ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i < r ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
                    ))}
                  </div>
                  <span>{r}+ stars</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="border rounded-xl overflow-hidden">
          <button
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
            onClick={() => toggle('sort')}
          >
            Sort By
            <ChevronDown className={cn('h-4 w-4 transition-transform', openSections.includes('sort') && 'rotate-180')} />
          </button>
          {openSections.includes('sort') && (
            <div className="border-t px-2 py-2 space-y-0.5">
              {[
                { value: 'downloads', label: 'Most Downloaded' },
                { value: 'newest', label: 'Newest First' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'relevance', label: 'Relevance' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('sortBy', opt.value)}
                  className={cn(
                    'flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    (params.get('sortBy') ?? 'downloads') === opt.value
                      ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30'
                      : 'hover:bg-muted'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
