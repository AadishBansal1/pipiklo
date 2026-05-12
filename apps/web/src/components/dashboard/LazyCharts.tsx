'use client'

/**
 * All Recharts components live here so they can be dynamically imported.
 * This keeps ~200KB of chart JS out of the initial page bundle.
 */

import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { formatNumber } from '@/lib/utils'

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#10b981']

// ── Admin: revenue bar chart + category pie ──────────────────────────────────

interface RevenueData { month: string; revenue: number }
interface CategoryData { category: string; downloads: number }

export function AdminRevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
        <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
        <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AdminCategoryPie({ data }: { data: CategoryData[] }) {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="downloads" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={false}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => [formatNumber(Number(v)), 'Downloads']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1 mt-2">
        {data.slice(0, 4).map((c, i) => (
          <div key={c.category} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <span className="flex-1 truncate">{c.category}</span>
            <span className="font-medium">{formatNumber(c.downloads)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Creator: earnings area chart ──────────────────────────────────────────────

interface EarningsData { month: string; earnings: number }

export function CreatorEarningsChart({ data }: { data: EarningsData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
        <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Earnings']} />
        <Area type="monotone" dataKey="earnings" stroke="#22c55e" strokeWidth={2} fill="url(#earningsGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Admin revenue page charts ────────────────────────────────────────────────

interface MonthlyBreakdown { month: string; gross: number; payouts: number; net: number }

export function AdminRevenueAreaChart({ data }: { data: MonthlyBreakdown[] }) {
  const fmt = (v: number) => `₹${(v / 100).toLocaleString('en-IN')}`
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gross" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="net" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `₹${v / 100}`} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => fmt(v)} />
        <Area type="monotone" dataKey="gross" name="Gross" stroke="#22c55e" fill="url(#gross)" strokeWidth={2} />
        <Area type="monotone" dataKey="net" name="Net" stroke="#3b82f6" fill="url(#net)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function AdminRevenueBarChart({ data }: { data: MonthlyBreakdown[] }) {
  const fmt = (v: number) => `₹${(v / 100).toLocaleString('en-IN')}`
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `₹${v / 100}`} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => fmt(v)} />
        <Bar dataKey="payouts" name="Payouts" fill="#f97316" radius={[4, 4, 0, 0]} />
        <Bar dataKey="net" name="Net" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Creator analytics page charts ────────────────────────────────────────────

interface DailyData { day: string; views: number; downloads: number }

export function AnalyticsViewsChart({ data }: { data: DailyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Area type="monotone" dataKey="views" stroke="#22c55e" fill="url(#viewsGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsDownloadsChart({ data }: { data: DailyData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="downloads" fill="#3b82f6" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
