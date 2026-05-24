'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Eye, Download, Plus, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  draft: 'bg-muted text-muted-foreground',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface Item {
  id: string
  title: string
  thumbnail_url: string | null
  status: string
  downloads: number
  views: number
  rating: number
  category: string
  subcategory: string | null
  created_at: string
}

export default function CreatorItemsPage() {
  const { user } = useAppStore()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase
        .from('items')
        .select('id, title, thumbnail_url, status, downloads, views, rating, category, subcategory, created_at')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error) setItems(data ?? [])
          setLoading(false)
        })
    })
  }, [user?.id])

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)
  const counts = {
    all: items.length,
    approved: items.filter((i) => i.status === 'approved').length,
    pending: items.filter((i) => i.status === 'pending').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Items</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading…' : `${items.length} item${items.length !== 1 ? 's' : ''} uploaded`}
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/dashboard/creator/upload">
            <Plus className="w-4 h-4" /> Upload New
          </Link>
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b">
        {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              filter === tab
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-semibold">
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-card border rounded-xl overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
              <div className="shimmer w-12 h-10 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="shimmer h-3 w-48 rounded" />
                <div className="shimmer h-2.5 w-24 rounded" />
              </div>
              <div className="shimmer h-6 w-16 rounded-full" />
              <div className="shimmer h-3 w-12 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No items yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Upload your creative work to start earning</p>
          <Button variant="brand" asChild>
            <Link href="/dashboard/creator/upload"><Plus className="h-4 w-4" /> Upload First Item</Link>
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Views</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Downloads</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail_url || `https://picsum.photos/seed/${item.id}/80/60`}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[item.status] ?? 'bg-muted'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      <span className="flex items-center justify-end gap-1">
                        <Eye className="w-3 h-3" />{(item.views ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      <span className="flex items-center justify-end gap-1">
                        <Download className="w-3 h-3" />{(item.downloads ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                      ₹{((item.downloads ?? 0) * 12).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filtered empty */}
      {!loading && items.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-xl">
          <p className="text-sm">No {filter} items.</p>
        </div>
      )}
    </div>
  )
}
