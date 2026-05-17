'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { StatCard } from '@/components/dashboard/StatCard'
import { Download, BookMarked, Heart, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CustomerDashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName ?? user?.fullName ?? 'there'

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {firstName}! Your downloads, licenses, and subscription.</p>
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
          <StatCard title="Total Downloads" value={0} icon={Download} iconColor="text-brand-500" />
          <StatCard title="Active Licenses" value={0} icon={BookMarked} iconColor="text-purple-500" />
          <StatCard title="Collections" value={0} icon={Heart} iconColor="text-red-500" />
          <StatCard title="Subscription" value="Free" icon={CreditCard} iconColor="text-blue-500" />
        </div>

        {/* Empty state for Recent Downloads */}
        <div className="border rounded-xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-bold">Recent Downloads</h2>
            <Link href="/dashboard/customer/downloads" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Download className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No downloads yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Browse assets and download your first item!</p>
            <Link href="/">
              <Button variant="brand">Browse Assets</Button>
            </Link>
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
