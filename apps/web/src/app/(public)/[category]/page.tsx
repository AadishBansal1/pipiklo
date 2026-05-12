import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getItemsByCategory } from '@/lib/mock-data'
import { ItemGrid } from '@/components/browse/ItemGrid'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import { formatNumber } from '@/lib/utils'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ subcategory?: string; sortBy?: string; page?: string }>
}

export async function generateStaticParams() {
  return CATEGORY_GROUPS.map((g) => ({ category: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const group = CATEGORY_GROUPS.find((g) => g.slug === category)
  if (!group) return { title: 'Not Found' }
  return {
    title: `${group.name} Templates & Assets`,
    description: `Browse ${group.name} assets on Pipiklo.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const sp = await searchParams

  const group = CATEGORY_GROUPS.find((g) => g.slug === category)
  if (!group) notFound()

  const page = Number(sp.page ?? 1)
  const PAGE_SIZE = 24
  let items = getItemsByCategory(category, 500)

  if (sp.subcategory) {
    items = items.filter((i) => i.subcategory === sp.subcategory)
  }

  if (sp.sortBy === 'newest') items = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  else if (sp.sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating)

  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      {/* Category header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{group.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground text-sm">{formatNumber(items.length)} assets</p>
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
                href={`/${category}?subcategory=${sub.slug}`}
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
            <p className="text-sm text-muted-foreground">{paged.length} of {formatNumber(items.length)} assets</p>
            <div className="flex gap-2">
              {['downloads', 'newest', 'rating'].map((s) => (
                <Link
                  key={s}
                  href={`/${category}?${new URLSearchParams({ ...sp, sortBy: s })}`}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    (sp.sortBy ?? 'downloads') === s ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          <ItemGrid items={paged} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
