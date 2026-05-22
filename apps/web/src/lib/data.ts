/**
 * Unified data service — tries Supabase first, falls back to mock data.
 * All functions are safe to call from Server Components.
 */
import { cache } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DBItem {
  id: string
  title: string
  description: string | null
  category: string
  subcategory: string | null
  tags: string[]
  thumbnail_url: string | null
  preview_urls: string[]
  is_free: boolean
  price: number
  creator_id: string | null
  status: string
  downloads: number
  views: number
  rating: number
  rating_count: number
  file_size: string | null
  file_type: string | null
  compatible_tools: string[]
  created_at: string
  users?: { name: string | null; avatar_url: string | null } | null
}

export interface DBItemCard {
  id: string
  title: string
  category: string
  subcategory: string | null
  thumbnail_url: string | null
  is_free: boolean
  price: number
  downloads: number
  rating: number
  rating_count: number
  tags: string[]
  creator_id: string | null
  created_at: string
  users?: { name: string | null; avatar_url: string | null } | null
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function getSupabase() {
  try {
    const { createClient } = await import('./supabase/server')
    return createClient()
  } catch {
    return null
  }
}

// ─── Items ────────────────────────────────────────────────────────────────────

export const getApprovedItems = cache(async (options: {
  category?: string
  subcategory?: string
  sortBy?: 'downloads' | 'rating' | 'newest'
  limit?: number
  offset?: number
  search?: string
} = {}): Promise<{ items: DBItemCard[]; total: number }> => {
  const { category, subcategory, sortBy = 'downloads', limit = 24, offset = 0, search } = options

  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error('No supabase client')

    let query = supabase
      .from('items')
      .select('id,title,category,subcategory,thumbnail_url,is_free,price,downloads,rating,rating_count,tags,creator_id,created_at,users(name,avatar_url)', { count: 'exact' })
      .eq('status', 'approved')

    if (category) query = query.eq('category', category)
    if (subcategory) query = query.eq('subcategory', subcategory)
    if (search) query = query.ilike('title', `%${search}%`)

    switch (sortBy) {
      case 'rating':  query = query.order('rating',     { ascending: false }); break
      case 'newest':  query = query.order('created_at', { ascending: false }); break
      default:        query = query.order('downloads',  { ascending: false }); break
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)
    if (error) throw error
    return { items: (data ?? []) as DBItemCard[], total: count ?? 0 }
  } catch (err) {
    // Fallback to mock data
    const { generateItems, getItemsByCategory } = await import('./mock-data')
    let items = category ? getItemsByCategory(category, 500) : generateItems()
    if (subcategory) items = items.filter((i) => i.subcategory === subcategory)
    if (search) items = items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'newest') items = [...items].reverse()
    else items = [...items].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))
    const total = items.length
    const paged = items.slice(offset, offset + limit)
    return {
      total,
      items: paged.map((i) => ({
        id: i.id, title: i.title, category: i.category as string,
        subcategory: i.subcategory ?? null, thumbnail_url: i.thumbnailUrl,
        is_free: true, price: 0,
        downloads: i.downloads ?? 0, rating: i.rating ?? 0, rating_count: i.ratingCount ?? 0,
        tags: i.tags ?? [], creator_id: i.creator?.id ?? null, created_at: i.createdAt ?? '',
        users: i.creator ? { name: i.creator.name, avatar_url: i.creator.avatar } : null,
      })),
    }
  }
})

export const getItemById = cache(async (id: string): Promise<DBItem | null> => {
  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error('No supabase client')
    const { data, error } = await supabase
      .from('items')
      .select('*,users(name,avatar_url)')
      .eq('id', id)
      .eq('status', 'approved')
      .single()
    if (error) throw error
    return data as DBItem
  } catch {
    const { getItemById: mockGet } = await import('./mock-data')
    const item = mockGet(id)
    if (!item) return null
    return {
      id: item.id, title: item.title,
      description: item.description ?? null,
      category: item.category as string,
      subcategory: item.subcategory ?? null,
      tags: item.tags ?? [],
      thumbnail_url: item.thumbnailUrl,
      preview_urls: item.previewUrls ?? [],
      is_free: true, price: 0,
      creator_id: item.creatorId ?? null,
      status: 'approved',
      downloads: item.downloads ?? 0,
      views: item.views ?? 0,
      rating: item.rating ?? 0,
      rating_count: item.ratingCount ?? 0,
      file_size: item.fileSize ?? null,
      file_type: item.fileFormat ?? null,
      compatible_tools: item.compatibleTools ?? [],
      created_at: item.createdAt ?? '',
      users: item.creator ? { name: item.creator.name, avatar_url: item.creator.avatar } : null,
    }
  }
})

export const getFeaturedItems = cache(async (limit = 8): Promise<DBItemCard[]> => {
  const { items } = await getApprovedItems({ sortBy: 'downloads', limit })
  return items
})

export const getSimilarItems = cache(async (itemId: string, category: string, limit = 8): Promise<DBItemCard[]> => {
  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error()
    const { data } = await supabase
      .from('items')
      .select('id,title,category,subcategory,thumbnail_url,is_free,price,downloads,rating,rating_count,tags,creator_id,created_at,users(name,avatar_url)')
      .eq('status', 'approved')
      .eq('category', category)
      .neq('id', itemId)
      .order('downloads', { ascending: false })
      .limit(limit)
    return (data ?? []) as DBItemCard[]
  } catch {
    const { getSimilarItems: mockSimilar } = await import('./mock-data')
    const items = mockSimilar(itemId, limit)
    return items.map((i) => ({
      id: i.id, title: i.title, category: i.category as string,
      subcategory: i.subcategory ?? null, thumbnail_url: i.thumbnailUrl,
      is_free: true, price: 0,
      downloads: i.downloads ?? 0, rating: i.rating ?? 0, rating_count: i.ratingCount ?? 0,
      tags: i.tags ?? [], creator_id: i.creator?.id ?? null, created_at: i.createdAt ?? '',
      users: i.creator ? { name: i.creator.name, avatar_url: i.creator.avatar } : null,
    }))
  }
})

export const getAdminStats = cache(async () => {
  try {
    const supabase = await getSupabase()
    if (!supabase) throw new Error()
    const [usersRes, itemsRes, downloadsRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('items').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('downloads').select('id', { count: 'exact', head: true }),
    ])
    return {
      totalUsers: usersRes.count ?? 0,
      totalItems: itemsRes.count ?? 0,
      totalDownloads: downloadsRes.count ?? 0,
    }
  } catch {
    return { totalUsers: 0, totalItems: 0, totalDownloads: 0 }
  }
})

// ─── Adapter: DBItemCard → ItemCard (for existing components) ─────────────────

import type { ItemCard } from '@pipiklo/types'

export function toItemCard(i: DBItemCard): ItemCard {
  return {
    id: i.id,
    title: i.title,
    category: i.category as any,
    subcategory: i.subcategory ?? '',
    thumbnailUrl: i.thumbnail_url ?? `https://picsum.photos/seed/${i.id}/400/300`,
    previewUrls: [],
    isFree: i.is_free,
    price: i.price > 0 ? i.price : undefined,
    downloads: i.downloads,
    rating: i.rating,
    ratingCount: i.rating_count,
    tags: i.tags,
    creator: i.users
      ? { id: i.creator_id ?? 'unknown', name: i.users.name ?? 'Creator', avatar: i.users.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i.creator_id}` }
      : undefined,
    createdAt: i.created_at,
  }
}
