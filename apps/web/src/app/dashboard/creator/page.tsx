'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { dbGetCreatorStats, type CreatorStats } from '@/lib/supabase/db'
import { DollarSign, Download, Eye, Package, Upload, ArrowRight, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const CreatorEarningsChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.CreatorEarningsChart),
  { ssr: false, loading: () => <div className="shimmer rounded-lg h-[220px]" /> }
)

// Empty chart placeholder for new creators
const EMPTY_CHART_DATA = Array.from({ length: 6 }, (_, i) => {
  const d = new Date()
  d.setMonth(d.getMonth() - (5 - i))
  return { month: d.toLocaleString('en-IN', { month: 'short' }), earnings: 0 }
})

function StatCard({ title, value, icon: Icon, color, delay = 0 }: {
  title: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border rounded-xl p-4"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
    </motion.div>
  )
}

export default function CreatorDashboardPage() {
  const { user } = useAppStore()
  const [stats, setStats] = useState<CreatorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    dbGetCreatorStats(user.id)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const fmt = (n: number) => n.toLocaleString('en-IN')
  const fmtCurrency = (n: number) =>
    n === 0 ? '₹0' : `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Creator Studio</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Track your earnings and manage your uploads.
          </p>
        </div>
        <Button variant="brand" asChild>
          <Link href="/dashboard/creator/upload">
            <Upload className="h-4 w-4" /> Upload New Item
          </Link>
        </Button>
      </div>

      {/* Earnings hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white p-5 md:p-6"
      >
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="shimmer h-3 w-24 rounded opacity-30" />
                <div className="shimmer h-8 w-32 rounded opacity-30" />
                <div className="shimmer h-3 w-20 rounded opacity-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
              <p className="text-3xl font-black">{fmtCurrency(stats?.totalEarnings ?? 0)}</p>
              {stats?.totalDownloads === 0 ? (
                <p className="text-slate-500 text-sm mt-1">Upload items to start earning</p>
              ) : (
                <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> ₹12 per download
                </p>
              )}
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Pending Payout</p>
              <p className="text-3xl font-bold">{fmtCurrency(stats?.pendingPayout ?? 0)}</p>
              {(stats?.pendingPayout ?? 0) > 0 ? (
                <p className="text-slate-400 text-sm mt-1">Ready to withdraw</p>
              ) : (
                <p className="text-slate-500 text-sm mt-1">No pending payouts</p>
              )}
            </div>
            <div className="flex flex-col justify-between gap-3 sm:gap-0">
              <p className="text-slate-400 text-sm">Withdraw earnings</p>
              <Button
                size="sm"
                disabled={(stats?.pendingPayout ?? 0) === 0}
                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 w-fit"
                asChild
              >
                <Link href="/dashboard/creator/payouts">
                  Request Payout →
                </Link>
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="shimmer rounded-xl h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Items" value={stats?.totalItems ?? 0}
            icon={Package} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" delay={0.05} />
          <StatCard title="Total Downloads" value={fmt(stats?.totalDownloads ?? 0)}
            icon={Download} color="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" delay={0.1} />
          <StatCard title="Total Views" value={fmt(stats?.totalViews ?? 0)}
            icon={Eye} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" delay={0.15} />
          <StatCard
            title="Avg. Earnings/Item"
            value={(stats?.totalItems ?? 0) > 0
              ? fmtCurrency((stats?.totalEarnings ?? 0) / stats!.totalItems)
              : '₹0'}
            icon={DollarSign} color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" delay={0.2} />
        </div>
      )}

      {/* Item status breakdown */}
      {!loading && (stats?.totalItems ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Approved', count: stats?.approvedItems ?? 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', href: '/dashboard/creator/items?filter=approved' },
            { label: 'Pending Review', count: stats?.pendingItems ?? 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', href: '/dashboard/creator/items?filter=pending' },
            { label: 'Rejected', count: stats?.rejectedItems ?? 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', href: '/dashboard/creator/items?filter=rejected' },
          ].map(({ label, count, icon: Icon, color, bg, href }) => (
            <Link key={label} href={href}
              className="bg-card border rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Earnings Chart */}
      <div className="border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Monthly Earnings (₹)</h2>
          {(stats?.totalEarnings ?? 0) === 0 && (
            <span className="text-xs text-muted-foreground">Upload items to see earnings here</span>
          )}
        </div>
        <CreatorEarningsChart data={EMPTY_CHART_DATA} />
      </div>

      {/* Empty state OR quick actions */}
      {!loading && (stats?.totalItems ?? 0) === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-border rounded-2xl p-10 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
            <Upload className="h-8 w-8 text-brand-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Upload your first item</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Share your creative work with thousands of customers. Earn ₹12 for every download.
          </p>
          <Button variant="brand" asChild>
            <Link href="/dashboard/creator/upload">
              <Upload className="h-4 w-4" /> Upload Now
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Top items */}
      {!loading && (stats?.totalItems ?? 0) > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-bold">My Items</h2>
            <Link href="/dashboard/creator/items" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CreatorItemsTable creatorId={user?.id ?? ''} />
        </div>
      )}
    </div>
  )
}

// Inline table component to avoid extra file
function CreatorItemsTable({ creatorId }: { creatorId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!creatorId) return
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase
        .from('items')
        .select('id, title, thumbnail_url, status, downloads, views, rating, category')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => { setItems(data ?? []); setLoading(false) })
    })
  }, [creatorId])

  const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground text-sm">Loading items…</div>
  if (!items.length) return <div className="p-8 text-center text-muted-foreground text-sm">No items yet</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Item</th>
            <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
            <th className="text-right px-5 py-3 font-medium text-muted-foreground">Downloads</th>
            <th className="text-right px-5 py-3 font-medium text-muted-foreground">Earned</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <img src={item.thumbnail_url || `https://picsum.photos/seed/${item.id}/80/60`}
                    alt={item.title} className="w-10 h-8 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[item.status] ?? ''}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-muted-foreground">{(item.downloads ?? 0).toLocaleString()}</td>
              <td className="px-5 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                ₹{((item.downloads ?? 0) * 12).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
