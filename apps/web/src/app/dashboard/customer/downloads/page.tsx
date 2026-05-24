'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { Download, BookMarked, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DownloadRow {
  id: string
  item_id: string
  license_key: string
  downloaded_at: string
  // joined
  item_title?: string
  item_thumbnail?: string
  item_category?: string
}

export default function CustomerDownloadsPage() {
  const { user } = useAppStore()
  const [downloads, setDownloads] = useState<DownloadRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)

    import('@/lib/supabase/client').then(async ({ createClient }) => {
      const supabase = createClient()

      // Fetch downloads
      const { data: dlData } = await supabase
        .from('downloads')
        .select('id, item_id, license_key, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })

      if (!dlData || dlData.length === 0) { setLoading(false); return }

      // Fetch item details
      const itemIds = [...new Set(dlData.map((d) => d.item_id))]
      const { data: itemsData } = await supabase
        .from('items')
        .select('id, title, thumbnail_url, category')
        .in('id', itemIds)

      const itemMap = Object.fromEntries((itemsData ?? []).map((i) => [i.id, i]))

      setDownloads(dlData.map((d) => ({
        ...d,
        item_title: itemMap[d.item_id]?.title ?? 'Unknown Item',
        item_thumbnail: itemMap[d.item_id]?.thumbnail_url,
        item_category: itemMap[d.item_id]?.category,
      })))
      setLoading(false)
    })
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Downloads</h1>
          <p className="text-muted-foreground text-sm">
            {loading ? 'Loading…' : `${downloads.length} total download${downloads.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {downloads.length > 0 && (
          <Button variant="outline" asChild>
            <Link href="/dashboard/customer/licenses">
              <BookMarked className="h-4 w-4" /> View Licenses
            </Link>
          </Button>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="border rounded-xl overflow-hidden divide-y">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="shimmer w-14 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-3.5 w-48 rounded" />
                <div className="shimmer h-2.5 w-28 rounded" />
              </div>
              <div className="shimmer h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && downloads.length === 0 && (
        <div className="border rounded-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No downloads yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {(user?.tokens ?? 0) > 0
                ? `Use your ${user?.tokens} token${user?.tokens !== 1 ? 's' : ''} to download amazing assets`
                : 'Buy tokens to start downloading assets with commercial licenses'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="brand" asChild>
                <Link href="/"><Sparkles className="h-4 w-4" /> Browse Assets</Link>
              </Button>
              {(user?.tokens ?? 0) === 0 && (
                <Button variant="outline" asChild>
                  <Link href="/dashboard/customer/subscription">Buy Tokens</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Downloads list */}
      {!loading && downloads.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">License Key</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {downloads.map((dl) => (
                  <tr key={dl.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={dl.item_thumbnail || `https://picsum.photos/seed/${dl.item_id}/80/60`}
                          alt={dl.item_title}
                          className="w-12 h-9 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{dl.item_title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{dl.item_category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {dl.license_key?.toString().slice(0, 8).toUpperCase()}…
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground text-xs">
                      {new Date(dl.downloaded_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/item/${dl.item_id}`}
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
