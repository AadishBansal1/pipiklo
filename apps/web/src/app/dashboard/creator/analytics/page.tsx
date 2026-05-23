'use client'

import dynamic from 'next/dynamic'

// Deterministic daily data (no Math.random to avoid hydration mismatch)
const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: 100 + ((i * 137 + 41) % 400),
  downloads: 10 + ((i * 73 + 17) % 50),
}))

const topItems = [
  { title: 'Minimalist Branding Kit', views: 4823, downloads: 312, revenue: 3744 },
  { title: 'Social Media Pack Vol.3', views: 3901, downloads: 278, revenue: 3336 },
  { title: 'Corporate Presentation', views: 2741, downloads: 199, revenue: 2388 },
  { title: 'Logo Templates Bundle', views: 2190, downloads: 156, revenue: 1872 },
  { title: 'UI Components Kit', views: 1844, downloads: 134, revenue: 1608 },
]

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

export default function CreatorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Views and downloads across all your items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '15,499', change: '+12%' },
          { label: 'Total Downloads', value: '1,079', change: '+8%' },
          { label: 'Conversion Rate', value: '6.96%', change: '+0.4%' },
          { label: 'Avg. Rating', value: '4.7 ★', change: '+0.1' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-green-500 mt-0.5">{s.change} vs last month</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-5 md:p-6">
        <h2 className="font-semibold mb-4">Daily Views — Last 30 Days</h2>
        <AnalyticsViewsChart data={dailyData} />
      </div>

      <div className="bg-card rounded-xl border p-5 md:p-6">
        <h2 className="font-semibold mb-4">Daily Downloads — Last 30 Days</h2>
        <AnalyticsDownloadsChart data={dailyData} />
      </div>

      <div className="bg-card rounded-xl border p-5 md:p-6">
        <h2 className="font-semibold mb-4">Top Performing Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-muted-foreground">Item</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Views</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Downloads</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topItems.map((item) => (
                <tr key={item.title} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium">{item.title}</td>
                  <td className="py-3 text-right text-muted-foreground">{item.views.toLocaleString()}</td>
                  <td className="py-3 text-right text-muted-foreground">{item.downloads}</td>
                  <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                    ₹{item.revenue.toLocaleString('en-IN')}
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
