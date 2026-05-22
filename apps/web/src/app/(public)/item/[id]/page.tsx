import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getItemById, getSimilarItems, toItemCard } from '@/lib/data'
import { ItemDetailClient } from './ItemDetailClient'
import { ItemGrid } from '@/components/browse/ItemGrid'

// ISR: revalidate every 10 minutes
export const revalidate = 600

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getItemById(id)
  if (!item) return { title: 'Item Not Found' }
  return {
    title: `${item.title} — Free Download`,
    description: (item.description ?? '').slice(0, 160),
    openGraph: {
      title: item.title,
      description: (item.description ?? '').slice(0, 160),
      images: item.thumbnail_url ? [{ url: item.thumbnail_url, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: (item.description ?? '').slice(0, 160),
      images: item.thumbnail_url ? [item.thumbnail_url] : [],
    },
  }
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params
  const [item, similarRaw] = await Promise.all([
    getItemById(id),
    getSimilarItems(id, '', 8),
  ])
  if (!item) notFound()

  // Re-fetch similar scoped to same category
  const similar = (await getSimilarItems(id, item.category, 8)).map(toItemCard)

  // Convert DB item to the shape ItemDetailClient expects
  const clientItem = {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    category: item.category as any,
    subcategory: item.subcategory ?? '',
    thumbnailUrl: item.thumbnail_url ?? `https://picsum.photos/seed/${item.id}/400/300`,
    previewUrls: item.preview_urls.length > 0
      ? item.preview_urls
      : [item.thumbnail_url ?? `https://picsum.photos/seed/${item.id}/800/600`],
    isFree: item.is_free,
    price: item.price > 0 ? item.price : undefined,
    downloads: item.downloads,
    views: item.views,
    rating: item.rating,
    ratingCount: item.rating_count,
    fileSize: item.file_size ?? undefined,
    fileFormat: item.file_type ?? undefined,
    compatibleTools: item.compatible_tools,
    tags: item.tags,
    creatorId: item.creator_id ?? 'unknown',
    creator: item.users
      ? {
          id: item.creator_id ?? 'unknown',
          name: item.users.name ?? 'Creator',
          avatar: item.users.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.creator_id}`,
        }
      : undefined,
    status: 'approved' as const,
    licenseType: 'standard' as const,
    createdAt: item.created_at,
    updatedAt: item.created_at,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ItemDetailClient item={clientItem} />

      {similar.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-6">More {item.category.replace(/-/g, ' ')} Assets</h2>
          <ItemGrid items={similar} />
        </section>
      )}
    </div>
  )
}
