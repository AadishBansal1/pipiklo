import { createClient } from './client'
import type { Database } from './types'

type Item = Database['public']['Tables']['items']['Row']
type Download = Database['public']['Tables']['downloads']['Row']

// ─── Items ────────────────────────────────────────────────────────────────────

export async function getApprovedItems(limit = 50, category?: string) {
  const supabase = createClient()
  let query = supabase
    .from('items')
    .select('*, users(name, avatar_url)')
    .eq('status', 'approved')
    .order('downloads', { ascending: false })
    .limit(limit)

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getItemById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*, users(name, avatar_url)')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getItemsByCreator(creatorId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPendingItems() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*, users(name, avatar_url)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllItems() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .select('*, users(name, avatar_url)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function submitItem(item: Partial<Item> & { title: string; category: string; creator_id: string }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('items')
    .insert({ ...item, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateItemStatus(id: string, status: 'approved' | 'rejected', rejectionReason?: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('items')
    .update({ status, rejection_reason: rejectionReason ?? null })
    .eq('id', id)
  if (error) throw error
}

export async function incrementItemViews(id: string) {
  const supabase = createClient()
  await supabase.rpc('increment_views', { item_id: id })
}

// ─── Downloads ────────────────────────────────────────────────────────────────

export async function getUserDownloads(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('downloads')
    .select('*, items(title, thumbnail_url, category)')
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function downloadItem(userId: string, itemId: string, projectName?: string) {
  const supabase = createClient()

  // Insert or return existing download record
  const { data, error } = await supabase
    .from('downloads')
    .upsert({ user_id: userId, item_id: itemId, project_name: projectName }, { onConflict: 'user_id,item_id' })
    .select()
    .single()

  if (error) throw error

  // Increment download count
  await supabase.rpc('increment_downloads', { item_id: itemId })

  return data
}

export async function hasDownloaded(userId: string, itemId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('downloads')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single()
  return !!data
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function updateUserProfile(userId: string, updates: { name?: string; bio?: string; website?: string; avatar_url?: string }) {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
  if (error) throw error
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getItemReviews(itemId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users(name, avatar_url)')
    .eq('item_id', itemId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function submitReview(userId: string, itemId: string, rating: number, comment?: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('reviews')
    .upsert({ user_id: userId, item_id: itemId, rating, comment }, { onConflict: 'user_id,item_id' })
  if (error) throw error
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getUserCollections(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createCollection(userId: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collections')
    .insert({ user_id: userId, name })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function addToCollection(collectionId: string, itemId: string) {
  const supabase = createClient()
  const { data: collection } = await supabase
    .from('collections')
    .select('item_ids')
    .eq('id', collectionId)
    .single()
  if (!collection) return

  const ids = [...new Set([...(collection.item_ids ?? []), itemId])]
  await supabase.from('collections').update({ item_ids: ids }).eq('id', collectionId)
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const supabase = createClient()
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
}

// ─── Creator Stats ────────────────────────────────────────────────────────────

export async function getCreatorStats(creatorId: string) {
  const supabase = createClient()
  const { data: items } = await supabase
    .from('items')
    .select('id, downloads, views, rating, rating_count, status')
    .eq('creator_id', creatorId)

  const approved = items?.filter(i => i.status === 'approved') ?? []
  return {
    totalItems: items?.length ?? 0,
    approvedItems: approved.length,
    totalDownloads: approved.reduce((sum, i) => sum + (i.downloads ?? 0), 0),
    totalViews: approved.reduce((sum, i) => sum + (i.views ?? 0), 0),
    avgRating: approved.length > 0
      ? approved.reduce((sum, i) => sum + (i.rating ?? 0), 0) / approved.length
      : 0,
  }
}
