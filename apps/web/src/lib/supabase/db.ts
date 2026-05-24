/**
 * Supabase DB helpers — all writes go through here so the DB stays in sync.
 * Client-side only (uses anon key via createBrowserClient).
 */

import { createClient } from './client'

// ─── User token operations ─────────────────────────────────────────────────────

/** Deduct tokens from user and increment total_downloads in DB */
export async function dbUseToken(userId: string, count = 1): Promise<boolean> {
  const supabase = createClient()
  try {
    const { data, error } = await supabase.rpc('deduct_tokens', {
      p_user_id: userId,
      p_count: count,
    })
    if (error) throw error
    return data === true
  } catch {
    // Fallback: manual update if RPC not available
    const { data: user } = await supabase
      .from('users')
      .select('tokens, total_downloads')
      .eq('id', userId)
      .single()
    if (!user || user.tokens < count) return false
    await supabase
      .from('users')
      .update({
        tokens: user.tokens - count,
        total_downloads: user.total_downloads + count,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    return true
  }
}

/** Add tokens to user after purchase */
export async function dbAddTokens(userId: string, count: number): Promise<void> {
  const supabase = createClient()
  const { data: user } = await supabase
    .from('users')
    .select('tokens')
    .eq('id', userId)
    .single()
  const current = user?.tokens ?? 0
  await supabase
    .from('users')
    .update({ tokens: current + count, updated_at: new Date().toISOString() })
    .eq('id', userId)
}

// ─── Download record ───────────────────────────────────────────────────────────

export interface DownloadRecord {
  userId: string
  itemId: string
  licenseKey: string
  creatorId: string
  itemTitle: string
}

export async function dbRecordDownload(record: DownloadRecord) {
  const supabase = createClient()

  // 1. Insert download row
  await supabase.from('downloads').insert({
    user_id: record.userId,
    item_id: record.itemId,
    license_key: record.licenseKey,
  })

  // 2. Increment item download counter
  const { data: item } = await supabase
    .from('items')
    .select('downloads')
    .eq('id', record.itemId)
    .single()
  if (item) {
    await supabase
      .from('items')
      .update({ downloads: (item.downloads ?? 0) + 1 })
      .eq('id', record.itemId)
  }

  // 3. Credit creator earnings (₹12 per download)
  if (record.creatorId) {
    const RATE = 12 // INR per download
    const { data: existing } = await supabase
      .from('creator_earnings')
      .select('id, download_count, total_earned, pending_payout')
      .eq('creator_id', record.creatorId)
      .eq('item_id', record.itemId)
      .single()

    if (existing) {
      await supabase
        .from('creator_earnings')
        .update({
          download_count: existing.download_count + 1,
          total_earned: Number(existing.total_earned) + RATE,
          pending_payout: Number(existing.pending_payout) + RATE,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('creator_earnings').insert({
        creator_id: record.creatorId,
        item_id: record.itemId,
        download_count: 1,
        total_earned: RATE,
        pending_payout: RATE,
        paid_out: 0,
      })
    }

    // Also update creator's total_earnings on users table
    const { data: creatorUser } = await supabase
      .from('users')
      .select('total_earnings, pending_payout')
      .eq('id', record.creatorId)
      .single()
    if (creatorUser) {
      await supabase
        .from('users')
        .update({
          total_earnings: Number(creatorUser.total_earnings) + RATE,
          pending_payout: Number(creatorUser.pending_payout) + RATE,
          updated_at: new Date().toISOString(),
        })
        .eq('id', record.creatorId)
    }
  }
}

// ─── Creator stats ─────────────────────────────────────────────────────────────

export interface CreatorStats {
  totalItems: number
  pendingItems: number
  approvedItems: number
  rejectedItems: number
  totalDownloads: number
  totalViews: number
  totalEarnings: number
  pendingPayout: number
}

export async function dbGetCreatorStats(creatorId: string): Promise<CreatorStats> {
  const supabase = createClient()

  const { data: items } = await supabase
    .from('items')
    .select('id, status, downloads, views')
    .eq('creator_id', creatorId)

  const rows = items ?? []
  const totalItems = rows.length
  const pendingItems = rows.filter((i) => i.status === 'pending').length
  const approvedItems = rows.filter((i) => i.status === 'approved').length
  const rejectedItems = rows.filter((i) => i.status === 'rejected').length
  const totalDownloads = rows.reduce((s, i) => s + (i.downloads ?? 0), 0)
  const totalViews = rows.reduce((s, i) => s + (i.views ?? 0), 0)

  const { data: creatorUser } = await supabase
    .from('users')
    .select('total_earnings, pending_payout')
    .eq('id', creatorId)
    .single()

  return {
    totalItems,
    pendingItems,
    approvedItems,
    rejectedItems,
    totalDownloads,
    totalViews,
    totalEarnings: Number(creatorUser?.total_earnings ?? 0),
    pendingPayout: Number(creatorUser?.pending_payout ?? 0),
  }
}

// ─── Admin item moderation ─────────────────────────────────────────────────────

export async function dbApproveItem(itemId: string) {
  const supabase = createClient()
  await supabase
    .from('items')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', itemId)
}

export async function dbRejectItem(itemId: string, reason: string) {
  const supabase = createClient()
  await supabase
    .from('items')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
}

// ─── Admin stats ───────────────────────────────────────────────────────────────

export async function dbGetAdminStats() {
  const supabase = createClient()
  const [{ count: totalUsers }, { count: totalItems }, { count: pendingItems }, { data: downloads }] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('items').select('*', { count: 'exact', head: true }),
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('downloads').select('id'),
    ])
  return {
    totalUsers: totalUsers ?? 0,
    totalItems: totalItems ?? 0,
    pendingItems: pendingItems ?? 0,
    totalDownloads: downloads?.length ?? 0,
  }
}

// ─── Payment record ────────────────────────────────────────────────────────────

export async function dbRecordPayment(opts: {
  userId: string
  amount: number
  packName: string
  tokensAdded: number
}) {
  const supabase = createClient()
  await supabase.from('payments').insert({
    user_id: opts.userId,
    amount: opts.amount,
    currency: 'INR',
    gateway: 'razorpay',
    status: 'success',
    pack_name: opts.packName,
    tokens_added: opts.tokensAdded,
  })
}
