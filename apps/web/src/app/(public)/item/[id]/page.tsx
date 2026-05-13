import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getItemById, getSimilarItems } from '@/lib/mock-data'
import { ItemDetailClient } from './ItemDetailClient'
import { ItemGrid } from '@/components/browse/ItemGrid'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = getItemById(id)
  if (!item) return { title: 'Item Not Found' }
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    openGraph: {
      images: [{ url: item.thumbnailUrl }],
    },
  }
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params
  const item = getItemById(id)
  if (!item) notFound()

  const similar = getSimilarItems(id, 8)

  return (
    <div className="container mx-auto px-4 py-8">
      <ItemDetailClient item={item} />

      {similar.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <ItemGrid items={similar} />
        </section>
      )}
    </div>
  )
}
