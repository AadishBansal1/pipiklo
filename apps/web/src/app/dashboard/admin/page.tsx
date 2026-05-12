'use client'

import dynamic from 'next/dynamic'
import { StatCard } from '@/components/dashboard/StatCard'
import { MOCK_ADMIN_STATS } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import { Users, Package, Download, TrendingUp, Clock, CreditCard, BarChart2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'

const ChartSkeleton = () => <div className="animate-pulse bg-muted rounded-lg" style={{ height: 240 }} />

const AdminRevenueChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AdminRevenueChart),
  { ssr: false, loading: ChartSkeleton }
)
const AdminCategoryPie = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AdminCategoryPie),
  { ssr: false, loading: ChartSkeleton }
)

export default function AdminDashboardPage() {
  const stats = MOCK_ADMIN_STATS
  const { items, approveItem } = useAppStore()
  const pendingItems = items.filter((i) => i.status === 'pending').slice(0, 4)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground text-sm">Platform metrics and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={formatNumber(stats.totalUsers)} change="12.3%" changePositive icon={Users} iconColor="text-blue-500" />
        <StatCard title="Total Items" value={formatNumber(stats.totalItems)} change="8.7%" changePositive icon={Package} iconColor="text-purple-500" />
        <StatCard title="Total Downloads" value={formatNumber(stats.totalDownloads)} change="24.1%" changePositive icon={Download} iconColor="text-brand-500" />
        <StatCard title="Total Revenue" value={`₹${formatNumber(stats.totalRevenue)}`} change="18.4%" changePositive icon={TrendingUp} iconColor="text-orange-500" />
        <StatCard title="Active Subscriptions" value={formatNumber(stats.activeSubscriptions)} change="6.2%" changePositive icon={CreditCard} iconColor="text-teal-500" />
        <StatCard title="Pending Reviews" value={items.filter((i) => i.status === 'pending').length || stats.pendingReviews} icon={Clock} iconColor="text-yellow-500" />
        <StatCard title="Total Creators" value={formatNumber(stats.totalCreators)} change="15.8%" changePositive icon={Users} iconColor="text-pink-500" />
        <StatCard title="Avg Downloads/Item" value={formatNumber(Math.floor(stats.totalDownloads / stats.totalItems))} icon={BarChart2} iconColor="text-indigo-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border rounded-xl p-5">
          <h2 className="font-bold mb-4">Monthly Revenue (₹)</h2>
          <AdminRevenueChart data={stats.monthlyRevenue} />
        </div>
        <div className="border rounded-xl p-5">
          <h2 className="font-bold mb-4">Downloads by Category</h2>
          <AdminCategoryPie data={stats.topCategories} />
        </div>
      </div>

      {/* Pending Review Queue — live from store */}
      <div className="border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Content Review Queue</h2>
          <Link href="/dashboard/admin/items" className="text-sm text-brand-600 hover:underline">View all →</Link>
        </div>
        {pendingItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
            All caught up! No pending submissions.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.creatorName} · {item.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => approveItem(item.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" /> Approve
                  </button>
                  <Link
                    href="/dashboard/admin/items"
                    className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
