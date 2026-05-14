'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard, Download, BookMarked, CreditCard, Settings,
  Upload, BarChart2, DollarSign, Package, Users, ShieldCheck,
  Tag, TrendingUp, Sparkles, LogOut, AlertTriangle
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
  const { signOut } = useClerk()
  const [showConfirm, setShowConfirm] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOutConfirm = async () => {
    setSigningOut(true)
    logout()
    await signOut()
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
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      )}

      {/* Sign-out confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Sign out of Pipiklo?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">You will need to sign in again to access your dashboard.</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOutConfirm}
                disabled={signingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {signingOut ? 'Signing out…' : 'Yes, sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
