'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { generateItems } from '@/lib/mock-data'
import { CheckCircle2, XCircle, Eye, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function AdminItemsPage() {
  const { items, approveItem, rejectItem } = useAppStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const staticItems = generateItems(20).slice(0, 10).map((i) => ({
    id: i.id, title: i.title, description: 'Static catalog item.',
    category: i.category, subcategory: i.subcategory, tags: i.tags,
    thumbnailUrl: i.thumbnailUrl, isFree: true, status: 'approved' as const,
    creatorId: i.creator?.id ?? 'c1', creatorName: i.creator?.name ?? 'Arjun Sharma',
    downloads: i.downloads ?? 0, views: (i.downloads ?? 0) * 4,
    rating: i.rating ?? 4.5, ratingCount: i.ratingCount ?? 100,
    submittedAt: i.createdAt ?? new Date().toISOString(),
  }))

  const allItems = [...items, ...staticItems]
  const filtered = filter === 'all' ? allItems : allItems.filter((i) => i.status === filter)
  const pendingCount = items.filter((i) => i.status === 'pending').length

  function handleReject() {
    if (!rejectModal || !rejectReason.trim()) return
    rejectItem(rejectModal, rejectReason.trim())
    setRejectModal(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve creator submissions
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
              {pendingCount} pending
            </span>
          )}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              filter === tab ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {tab === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-500 text-white text-[10px] font-bold">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Items grid */}
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
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                </div>
                {item.status === 'pending' && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" /> Needs Review
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">by {item.creatorName} · {item.category}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-muted rounded text-[10px] text-muted-foreground">#{tag}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted {new Date(item.submittedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
                {('rejectionReason' in item) && item.rejectionReason && (
                  <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">Rejected: {item.rejectionReason}</p>
                )}

                {item.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => approveItem(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => setRejectModal(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}

                {item.status === 'approved' && (
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views.toLocaleString()}</span>
                    <span>{item.downloads.toLocaleString()} dl</span>
                    {item.rating > 0 && <span>★ {item.rating.toFixed(1)}</span>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No {filter} items.</p>
        </div>
      )}

      {/* Reject reason modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setRejectModal(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="font-bold text-foreground mb-1">Reject Submission</h3>
              <p className="text-sm text-muted-foreground mb-4">Provide a reason so the creator can improve.</p>
              <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Poor quality, missing description, wrong category…"
                className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                <button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold transition-colors">Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
