'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { MOCK_CREATOR_STATS } from '@/lib/mock-data'
import { DollarSign, Download, Eye, Package, Upload, ArrowRight } from 'lucide-react'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const CreatorEarningsChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.CreatorEarningsChart),
  { ssr: false, loading: () => <div className="animate-pulse bg-muted rounded-lg h-[220px]" /> }
)

export default function CreatorDashboardPage() {
  const stats = MOCK_CREATOR_STATS

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Creator Studio</h1>
            <p className="text-muted-foreground text-sm">Track your earnings and manage your uploads</p>
          </div>
          <Button variant="brand" asChild>
            <Link href="/dashboard/creator/upload">
              <Upload className="h-4 w-4" /> Upload New Item
            </Link>
          </Button>
        </div>

        {/* Earnings highlight */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 md:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
              <p className="text-3xl font-black">{formatCurrency(stats.totalEarnings)}</p>
              <p className="text-brand-400 text-sm mt-1">↑ 12.4% this month</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Pending Payout</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.pendingPayout)}</p>
              <p className="text-slate-400 text-sm mt-1">Next payout: June 1</p>
            </div>
            <div className="flex flex-col justify-between gap-3 sm:gap-0">
              <p className="text-slate-400 text-sm">Quick payout</p>
              <Button size="sm" className="bg-brand-500 hover:bg-brand-600 w-fit">
                Request ₹{formatNumber(Math.floor(stats.pendingPayout))} →
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Items" value={stats.totalItems} icon={Package} iconColor="text-purple-500" />
          <StatCard title="Total Downloads" value={formatNumber(stats.totalDownloads)} change="8.3%" changePositive icon={Download} iconColor="text-brand-500" />
          <StatCard title="Total Views" value={formatNumber(stats.totalViews)} change="15.7%" changePositive icon={Eye} iconColor="text-blue-500" />
          <StatCard title="Avg. Earnings/Item" value={formatCurrency(stats.totalEarnings / stats.totalItems)} icon={DollarSign} iconColor="text-orange-500" />
        </div>

        {/* Earnings Chart */}
        <div className="border rounded-xl p-5 mb-6">
          <h2 className="font-bold mb-4">Monthly Earnings (₹)</h2>
          <CreatorEarningsChart data={stats.monthlyEarnings} />
        </div>

        {/* Top performing items */}
        <div className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-bold">Top Performing Items</h2>
            <Link href="/dashboard/creator/items" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Item</th>
                  <th className="text-left px-5 py-3 font-medium">Downloads</th>
                  <th className="text-left px-5 py-3 font-medium">Earnings</th>
                  <th className="text-left px-5 py-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.topItems.map((item, i) => (
                  <tr key={item.itemId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs w-4">{i + 1}.</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatNumber(item.downloads)}</td>
                    <td className="px-5 py-3 font-semibold text-brand-600">{formatCurrency(item.earnings)}</td>
                    <td className="px-5 py-3">
                      <span className="text-green-600 text-xs font-medium">↑ {Math.floor(Math.random() * 20 + 5)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}
