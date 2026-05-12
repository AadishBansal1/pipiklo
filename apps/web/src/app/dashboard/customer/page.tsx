'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { MOCK_DOWNLOADS } from '@/lib/mock-data'
import { Download, BookMarked, Heart, CreditCard, ExternalLink, Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function CustomerDashboardPage() {
  const recentDownloads = MOCK_DOWNLOADS.slice(0, 5)

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-muted-foreground text-sm">Your downloads, licenses, and subscription</p>
        </div>

        {/* Subscription banner */}
        <div className="rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 text-white p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-100">Current Plan</p>
              <p className="text-2xl font-bold">Free Plan</p>
              <p className="text-brand-100 text-sm mt-1">All assets free to download during launch phase</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black mb-1">FREE</div>
              <Button size="sm" className="bg-white text-brand-700 hover:bg-brand-50" asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Downloads" value={MOCK_DOWNLOADS.length} icon={Download} iconColor="text-brand-500" />
          <StatCard title="Active Licenses" value={MOCK_DOWNLOADS.length} icon={BookMarked} iconColor="text-purple-500" />
          <StatCard title="Collections" value="3" icon={Heart} iconColor="text-red-500" />
          <StatCard title="Subscription" value="Free" icon={CreditCard} iconColor="text-blue-500" />
        </div>

        {/* Recent Downloads */}
        <div className="border rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-bold">Recent Downloads</h2>
            <Link href="/dashboard/customer/downloads" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentDownloads.map((dl) => (
              <div key={dl.id} className="flex items-center gap-3 px-5 py-3">
                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image src={dl.item?.thumbnailUrl ?? ''} alt={dl.item?.title ?? ''} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{dl.item?.title}</p>
                  <p className="text-xs text-muted-foreground">{dl.projectName} · {formatDate(dl.downloadedAt)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3 text-brand-500" />
                    <span className="font-mono text-xs">{dl.licenseKey.slice(0, 15)}…</span>
                  </div>
                  <a href={dl.certificateUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg border hover:bg-muted transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick browse */}
        <div className="bg-muted/30 rounded-xl p-5">
          <h2 className="font-bold mb-3">Quick Browse</h2>
          <div className="flex flex-wrap gap-2">
            {['Video Templates', 'Graphics', 'Fonts', 'Audio', 'Design Templates', 'Photos', '3D', 'Web'].map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-2 rounded-lg border bg-background hover:border-brand-500 hover:text-brand-600 text-sm transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
    </div>
  )
}
