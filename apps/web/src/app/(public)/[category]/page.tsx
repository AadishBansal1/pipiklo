import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getApprovedItems, toItemCard } from '@/lib/data'
import { ItemGrid } from '@/components/browse/ItemGrid'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import { formatNumber } from '@/lib/utils'

// ISR: revalidate every 5 minutes
export const revalidate = 300

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ subcategory?: string; sortBy?: string; page?: string }>
}

export function generateStaticParams() {
  return CATEGORY_GROUPS.map((g) => ({ category: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const group = CATEGORY_GROUPS.find((g) => g.slug === category)
  if (!group) return { title: 'Not Found' }
  return {
    title: `${group.name} Templates & Assets — Free Download`,
    description: `Browse ${formatNumber(125)} premium ${group.name} assets on Pipiklo. Free to download with commercial license.`,
    openGraph: { title: `${group.name} — Pipiklo`, description: group.description ?? '' },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const sp = await searchParams

  const group = CATEGORY_GROUPS.find((g) => g.slug === category)
  if (!group) notFound()

  const page = Math.max(1, Number(sp.page ?? 1))
  const PAGE_SIZE = 24
  const sortBy = (sp.sortBy ?? 'downloads') as 'downloads' | 'rating' | 'newest'

  const { items: rawItems, total } = await getApprovedItems({
    category,
    subcategory: sp.subcategory,
    sortBy,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const items = rawItems.map(toItemCard)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      {/* Category header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{group.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground text-sm">{formatNumber(total)} assets</p>
            </div>
          </div>

          {/* Subcategory pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href={`/${category}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !sp.subcategory ? 'bg-brand-500 text-white border-brand-500' : 'hover:border-brand-500 hover:text-brand-600'
              }`}
            >
              All
            </Link>
            {group.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/${category}?subcategory=${encodeURIComponent(sub.slug)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  sp.subcategory === sub.slug ? 'bg-brand-500 text-white border-brand-500' : 'hover:border-brand-500 hover:text-brand-600'
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-8 container mx-auto px-4 py-8">
        <FilterSidebar currentCategory={category} currentSubcategory={sp.subcategory} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {items.length} of {formatNumber(total)} assets
            </p>
            <div className="flex gap-2">
              {(['downloads', 'newest', 'rating'] as const).map((s) => (
                <Link
                  key={s}
                  href={`/${category}?${new URLSearchParams({ ...sp, sortBy: s })}`}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    sortBy === s ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <p className="text-5xl">🔍</p>
              <p className="text-lg font-semibold">No assets found</p>
              <p className="text-muted-foreground text-sm">Try a different filter or subcategory</p>
              <Link href={`/${category}`} className="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                Clear filters
              </Link>
            </div>
          ) : (
            <ItemGrid items={items} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {page > 1 && (
                <Link href={`/${category}?${new URLSearchParams({ ...sp, page: String(page - 1) })}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border hover:bg-muted text-sm">‹</Link>
              )}
              {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${category}?${new URLSearchParams({ ...sp, page: String(p) })}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-brand-500 text-white' : 'border hover:bg-muted'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {totalPages > 8 && <span className="self-center text-muted-foreground px-2">…{totalPages}</span>}
              {page < totalPages && (
                <Link href={`/${category}?${new URLSearchParams({ ...sp, page: String(page + 1) })}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border hover:bg-muted text-sm">›</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
