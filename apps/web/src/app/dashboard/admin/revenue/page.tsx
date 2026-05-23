'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const monthlyData = [
  { month: 'Nov', gross: 280000, payouts: 84000, net: 196000 },
  { month: 'Dec', gross: 410000, payouts: 123000, net: 287000 },
  { month: 'Jan', gross: 320000, payouts: 96000, net: 224000 },
  { month: 'Feb', gross: 390000, payouts: 117000, net: 273000 },
  { month: 'Mar', gross: 450000, payouts: 135000, net: 315000 },
  { month: 'Apr', gross: 520000, payouts: 156000, net: 364000 },
  { month: 'May', gross: 490000, payouts: 147000, net: 343000 },
]

const pendingPayouts = [
  { creator: 'DesignStudio Pro', amount: 24500, items: 18, status: 'pending' },
  { creator: 'MotionCraft', amount: 18200, items: 12, status: 'pending' },
  { creator: 'PixelForge', amount: 31000, items: 24, status: 'processing' },
  { creator: 'AudioWave', amount: 9800, items: 7, status: 'pending' },
  { creator: 'VectorArt Co', amount: 15600, items: 11, status: 'pending' },
]

const fmt = (v: number) => `₹${(v / 100).toLocaleString('en-IN')}`
const SkeletonChart = ({ h }: { h: number }) => <div className="shimmer rounded-lg" style={{ height: h }} />

const AdminRevenueAreaChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AdminRevenueAreaChart),
  { ssr: false, loading: () => <SkeletonChart h={300} /> }
)
const AdminRevenueBarChart = dynamic(
  () => import('@/components/dashboard/LazyCharts').then((m) => m.AdminRevenueBarChart),
  { ssr: false, loading: () => <SkeletonChart h={260} /> }
)

export default function AdminRevenuePage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const totalGross = monthlyData.reduce((s, d) => s + d.gross, 0)
  const totalPayouts = monthlyData.reduce((s, d) => s + d.payouts, 0)
  const totalNet = monthlyData.reduce((s, d) => s + d.net, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform earnings and creator payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Gross Revenue', value: fmt(totalGross), color: 'text-brand-600' },
          { label: 'Creator Payouts (30%)', value: fmt(totalPayouts), color: 'text-orange-500' },
          { label: 'Net Revenue (70%)', value: fmt(totalNet), color: 'text-green-600' },
        ].map((card) => (
          <div key={card.label} className="bg-card rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground">Revenue Breakdown</h2>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  period === p ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <AdminRevenueAreaChart data={monthlyData} />
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-foreground mb-6">Monthly Payouts vs Net</h2>
        <AdminRevenueBarChart data={monthlyData} />
      </div>

      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Pending Creator Payouts</h2>
          <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors">
            Process All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">Creator</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Items</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingPayouts.map((row) => (
                <tr key={row.creator}>
                  <td className="py-3 font-medium text-foreground">{row.creator}</td>
                  <td className="py-3 text-right text-foreground">₹{row.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right text-muted-foreground">{row.items}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.status === 'processing'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>{row.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-brand-600 hover:text-brand-700 font-medium text-xs">Pay Now</button>
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
