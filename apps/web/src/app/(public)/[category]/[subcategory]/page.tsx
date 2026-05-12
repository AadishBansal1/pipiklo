import { notFound } from 'next/navigation'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getItemsByCategory } from '@/lib/mock-data'
import { ItemCard } from '@/components/browse/ItemCard'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ category: string; subcategory: string }>
  searchParams: Promise<{ sort?: string; rating?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params
  const cat = CATEGORY_GROUPS.find((c) => c.slug === category)
  const sub = cat?.subcategories.find((s) => s.slug === subcategory)
  if (!cat || !sub) return { title: 'Not Found' }
  return {
    title: `${sub.name} — ${cat.name} | Pipiklo`,
    description: `Browse ${sub.name} assets in the ${cat.name} category on Pipiklo.`,
  }
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { category, subcategory } = await params
  const { sort: sortBy = 'popular', rating = '0' } = await searchParams

  const cat = CATEGORY_GROUPS.find((c) => c.slug === category)
  const sub = cat?.subcategories.find((s) => s.slug === subcategory)

  if (!cat || !sub) notFound()

  const items = getItemsByCategory(category, 48)
  const minRating = parseFloat(rating)

  const sorted = [...items]
    .filter((i) => i.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'rating') return b.rating - a.rating
      return b.downloads - a.downloads
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb + heading */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href={`/${cat!.slug}`} className="hover:text-brand-600">{cat!.name}</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{sub!.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cat!.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sub!.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{sorted.length.toLocaleString()} assets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 flex gap-8">
        <aside className="w-60 flex-shrink-0 hidden lg:block">
          <FilterSidebar currentCategory={category} currentSubcategory={subcategory} />
        </aside>

        <main className="flex-1 min-w-0">
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No assets found with these filters.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
