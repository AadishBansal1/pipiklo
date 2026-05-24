'use client'

import { useState, useEffect, useCallback } from 'react'
import { dbApproveItem, dbRejectItem } from '@/lib/supabase/db'
import { CheckCircle2, XCircle, Clock, RefreshCw, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/hooks/use-toast'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface Item {
  id: string
  title: string
  description: string | null
  category: string
  subcategory: string | null
  tags: string[]
  thumbnail_url: string | null
  status: string
  rejection_reason: string | null
  downloads: number
  views: number
  rating: number
  created_at: string
  creator_id: string
  // joined from users
  creator_name?: string
  creator_avatar?: string
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase
        .from('items')
        .select('id, title, description, category, subcategory, tags, thumbnail_url, status, rejection_reason, downloads, views, rating, created_at, creator_id')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!data) { setLoading(false); return }

      // Fetch creator names
      const creatorIds = [...new Set(data.map((i) => i.creator_id).filter(Boolean))]
      const { data: creators } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', creatorIds)

      const creatorMap = Object.fromEntries((creators ?? []).map((c) => [c.id, c]))

      setItems(data.map((item) => ({
        ...item,
        tags: item.tags ?? [],
        creator_name: creatorMap[item.creator_id]?.name ?? 'Unknown Creator',
        creator_avatar: creatorMap[item.creator_id]?.avatar_url,
      })))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadItems() }, [loadItems])

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)
  const pendingCount = items.filter((i) => i.status === 'pending').length

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await dbApproveItem(id)
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'approved' } : i))
      toast({ title: '✅ Item approved', description: 'The item is now live on the platform.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to approve item.', variant: 'destructive' })
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject() {
    if (!rejectModal || !rejectReason.trim()) return
    setActionLoading(rejectModal)
    try {
      await dbRejectItem(rejectModal, rejectReason.trim())
      setItems((prev) => prev.map((i) => i.id === rejectModal
        ? { ...i, status: 'rejected', rejection_reason: rejectReason.trim() } : i))
      toast({ title: '❌ Item rejected', description: 'Creator will be notified with the reason.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to reject item.', variant: 'destructive' })
    } finally {
      setActionLoading(null)
      setRejectModal(null)
      setRejectReason('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Content Moderation</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            Review and approve creator submissions
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadItems}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => {
          const count = tab === 'all' ? items.length : items.filter((i) => i.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                filter === tab ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === 'pending' && count > 0
                    ? 'bg-yellow-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border rounded-xl overflow-hidden">
              <div className="shimmer aspect-video w-full" />
              <div className="p-4 space-y-2">
                <div className="shimmer h-4 w-3/4 rounded" />
                <div className="shimmer h-3 w-1/2 rounded" />
                <div className="shimmer h-8 w-full rounded-lg mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-2xl">
          <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
          <p className="text-muted-foreground">
            {filter === 'pending' ? 'No items pending review — all caught up! 🎉' : `No ${filter} items.`}
          </p>
        </div>
      )}

      {/* Items grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-xl border overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail_url || `https://picsum.photos/seed/${item.id}/400/300`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[item.status] ?? ''}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.status === 'pending' && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> Needs Review
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.creator_avatar && (
                      <img src={item.creator_avatar} alt="" className="w-4 h-4 rounded-full" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      by {item.creator_name} · {item.category}
                    </p>
                  </div>
                  {(item.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted {new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                  {item.rejection_reason && (
                    <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                      Rejected: {item.rejection_reason}
                    </p>
                  )}

                  {item.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {actionLoading === item.id ? 'Saving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setRejectModal(item.id)}
                        disabled={actionLoading === item.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}

                  {item.status === 'approved' && (
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{(item.views ?? 0).toLocaleString()} views</span>
                      <span>{(item.downloads ?? 0).toLocaleString()} downloads</span>
                      {item.rating > 0 && <span>★ {Number(item.rating).toFixed(1)}</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Reject reason modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setRejectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="font-bold mb-1">Reject Submission</h3>
              <p className="text-sm text-muted-foreground mb-4">Give a reason so the creator can improve.</p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Poor quality, missing description, wrong category…"
                className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setRejectModal(null); setRejectReason('') }}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || !!actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold transition-colors"
                >
                  {actionLoading ? 'Saving…' : 'Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
