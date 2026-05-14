'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import {
  LayoutDashboard, Download, BookMarked, CreditCard, Settings,
  Upload, BarChart2, DollarSign, Package, Users, ShieldCheck,
  Tag, TrendingUp, Sparkles, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/dashboard/admin/users', icon: Users },
  { label: 'Content Queue', href: '/dashboard/admin/items', icon: ShieldCheck },
  { label: 'Categories', href: '/dashboard/admin/categories', icon: Tag },
  { label: 'Revenue', href: '/dashboard/admin/revenue', icon: TrendingUp },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

const CUSTOMER_NAV: NavItem[] = [
  { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
  { label: 'Downloads', href: '/dashboard/customer/downloads', icon: Download },
  { label: 'Licenses', href: '/dashboard/customer/licenses', icon: BookMarked },
  { label: 'Collections', href: '/dashboard/customer/collections', icon: Package },
  { label: 'Subscription', href: '/dashboard/customer/subscription', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/customer/settings', icon: Settings },
]

const CREATOR_NAV: NavItem[] = [
  { label: 'Earnings', href: '/dashboard/creator', icon: DollarSign },
  { label: 'Upload', href: '/dashboard/creator/upload', icon: Upload },
  { label: 'My Items', href: '/dashboard/creator/items', icon: Package },
  { label: 'Analytics', href: '/dashboard/creator/analytics', icon: BarChart2 },
  { label: 'Payouts', href: '/dashboard/creator/payouts', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/creator/settings', icon: Settings },
]

interface Props {
  variant: 'admin' | 'customer' | 'creator'
}

const NAV_MAP = { admin: ADMIN_NAV, customer: CUSTOMER_NAV, creator: CREATOR_NAV }
const TITLE_MAP = { admin: 'Admin Panel', customer: 'My Account', creator: 'Creator Studio' }

export function DashboardSidebar({ variant }: Props) {
  const pathname = usePathname()
  const { user, logout } = useAppStore()
  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    logout()
    window.location.href = '/'
  }
  const nav = NAV_MAP[variant]

  return (
    <aside className="w-64 shrink-0 border-r min-h-[calc(100vh-64px)] bg-muted/20 flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <span className="font-bold text-sm">{TITLE_MAP[variant]}</span>
        </div>
        {user && (
          <div className="flex items-center gap-2 mt-2">
            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard type switcher */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {[
            { label: 'Customer', href: '/dashboard/customer', active: variant === 'customer' },
            { label: 'Creator', href: '/dashboard/creator', active: variant === 'creator' },
            { label: 'Admin', href: '/dashboard/admin', active: variant === 'admin' },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'text-xs text-center py-1.5 rounded-md transition-colors font-medium',
                tab.active ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <nav className="p-3 space-y-0.5 flex-1">
        {nav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-900/30 dark:text-brand-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="p-3 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      )}
    </aside>
  )
}
