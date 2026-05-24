'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'

const SkeletonChart = ({ h }: { h: number }) => (
  <div className="shimmer rounded-lg" style={{ height: h }} />
)

const AnalyticsViewsChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AnalyticsViewsChart),
  { ssr: false, loading: () => <SkeletonChart h={240} /> }
)
const AnalyticsDownloadsChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AnalyticsDownloadsChart),
  { ssr: false, loading: () => <SkeletonChart h={200} /> }
)

const EMPTY_DAILY = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: 0,
  downloads: 0,
}))

interface ItemStat {
  title: string
  views: number
  downloads: number
  revenue: number
}

export default function CreatorAnalyticsPage() {
  const { user } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ItemStat[]>([])
  const [totals, setTotals] = useState({ views: 0, downloads: 0, earnings: 0, rating: 0, ratingCount: 0 })

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase
        .from('items')
        .select('title, views, downloads, rating, rating_count')
        .eq('creator_id', user.id)
        .eq('status', 'approved')
        .order('downloads', { ascending: false })
        .then(({ data }) => {
          const rows = data ?? []
          const totalViews = rows.reduce((s, i) => s + (i.views ?? 0), 0)
          const totalDownloads = rows.reduce((s, i) => s + (i.downloads ?? 0), 0)
          const totalEarnings = totalDownloads * 12
          const ratingSum = rows.reduce((s, i) => s + (Number(i.rating) * (i.rating_count ?? 0)), 0)
          const ratingCount = rows.reduce((s, i) => s + (i.rating_count ?? 0), 0)
          const avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0

          setTotals({ views: totalViews, downloads: totalDownloads, earnings: totalEarnings, rating: avgRating, ratingCount })
          setItems(rows.map((i) => ({
            title: i.title,
            views: i.views ?? 0,
            downloads: i.downloads ?? 0,
            revenue: (i.downloads ?? 0) * 12,
          })))
          setLoading(false)
        })
    })
  }, [user?.id])

  const conversionRate = totals.views > 0 ? ((totals.downloads / totals.views) * 100).toFixed(2) : '0.00'

  const statCards = [
    { label: 'Total Views', value: loading ? '…' : totals.views.toLocaleString() },
    { label: 'Total Downloads', value: loading ? '…' : totals.downloads.toLocaleString() },
    { label: 'Conversion Rate', value: loading ? '…' : `${conversionRate}%` },
    { label: 'Avg. Rating', value: loading ? '…' : (totals.ratingCount > 0 ? `${totals.rating.toFixed(1)} ★` : 'No ratings') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Views and downloads across all your approved items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {!loading && totals.downloads === 0 ? (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-muted-foreground">
          <p className="font-medium mb-1">No analytics data yet</p>
          <p className="text-sm">Upload and get your items approved to start seeing views and downloads here.</p>
        </div>
      ) : (
        <>
          <div className="bg-card rounded-xl border p-5 md:p-6">
            <h2 className="font-semibold mb-4">Daily Views — Last 30 Days</h2>
            <AnalyticsViewsChart data={EMPTY_DAILY} />
          </div>

          <div className="bg-card rounded-xl border p-5 md:p-6">
            <h2 className="font-semibold mb-4">Daily Downloads — Last 30 Days</h2>
            <AnalyticsDownloadsChart data={EMPTY_DAILY} />
          </div>
        </>
      )}

      {/* Top items table */}
      {!loading && items.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold">Top Performing Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Views</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Downloads</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.slice(0, 10).map((item, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium">{item.title}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{item.views.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{item.downloads.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                      {item.revenue > 0 ? `₹${item.revenue.toLocaleString('en-IN')}` : '—'}
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
