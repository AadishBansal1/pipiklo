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

const SkeletonChart = ({ h }: { h: number }) => <div className="animate-pulse bg-muted rounded-lg" style={{ height: h }} />

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Views and downloads across all your items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '15,499', change: '+12%' },
          { label: 'Total Downloads', value: '1,079', change: '+8%' },
          { label: 'Conversion Rate', value: '6.96%', change: '+0.4%' },
          { label: 'Avg. Rating', value: '4.7 ★', change: '+0.1' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
            <p className="text-xs text-green-500 mt-0.5">{s.change} vs last month</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Views — Last 30 Days</h2>
        <AnalyticsViewsChart data={dailyData} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Downloads — Last 30 Days</h2>
        <AnalyticsDownloadsChart data={dailyData} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top Performing Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">Item</th>
                <th className="text-right py-2 font-medium text-gray-500 dark:text-gray-400">Views</th>
                <th className="text-right py-2 font-medium text-gray-500 dark:text-gray-400">Downloads</th>
                <th className="text-right py-2 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {topItems.map((item) => (
                <tr key={item.title}>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{item.title}</td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{item.views.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-600 dark:text-gray-400">{item.downloads}</td>
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
