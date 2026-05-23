import { notFound } from 'next/navigation'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getItemsByCategory } from '@/lib/mock-data'
import { ItemCard } from '@/components/browse/ItemCard'
import { FilterSidebar } from '@/components/browse/FilterSidebar'
import { MobileFilterDrawer } from '@/components/browse/MobileFilterDrawer'
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
    <div className="min-h-screen bg-background">
      {/* Breadcrumb + heading */}
      <div className="bg-card border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href={`/${cat!.slug}`} className="hover:text-brand-600">{cat!.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{sub!.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cat!.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{sub!.name}</h1>
              <p className="text-sm text-muted-foreground">{sorted.length.toLocaleString()} assets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 flex gap-8">
        <aside className="w-60 flex-shrink-0 hidden lg:block">
          <FilterSidebar currentCategory={category} currentSubcategory={subcategory} />
        </aside>

        <main className="flex-1 min-w-0">
          {/* Mobile filter access */}
          <div className="flex items-center justify-end mb-4 lg:hidden">
            <MobileFilterDrawer currentCategory={category} currentSubcategory={subcategory} />
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No assets found with these filters.</div>
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
