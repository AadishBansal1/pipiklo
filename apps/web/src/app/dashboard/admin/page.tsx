'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { formatNumber } from '@/lib/utils'
import { dbGetAdminStats, dbApproveItem } from '@/lib/supabase/db'
import {
  Package, Download, TrendingUp, Clock, CreditCard, CheckCircle,
  Plus, X, AlertTriangle, Trash2, IndianRupee, Users, RefreshCw
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/dashboard/StatCard'
import { toast } from '@/hooks/use-toast'
import type { Sale } from '@/store/app-store'

const PLAN_AMOUNTS = { Monthly: 299, Annual: 2999, 'One-time': 0 }

// ── Add Sale Modal ────────────────────────────────────────────────────────────
function AddSaleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Omit<Sale, 'id' | 'date'>) => void }) {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    plan: 'Monthly' as Sale['plan'],
    amount: PLAN_AMOUNTS.Monthly,
    gateway: 'manual' as Sale['gateway'],
    status: 'completed' as Sale['status'],
    note: '',
  })

  function set(k: string, v: string | number) { setForm((f) => ({ ...f, [k]: v })) }

  function handlePlan(plan: Sale['plan']) {
    setForm((f) => ({ ...f, plan, amount: PLAN_AMOUNTS[plan] }))
  }

  function handleSubmit() {
    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.amount) return
    onAdd(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="font-semibold">Add Sale</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Customer Name *</label>
            <Input value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="Rahul Sharma" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Customer Email *</label>
            <Input type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} placeholder="rahul@example.com" />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Plan</label>
            <div className="flex gap-2">
              {(['Monthly', 'Annual', 'One-time'] as Sale['plan'][]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePlan(p)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${form.plan === p ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Amount (₹) *</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => set('amount', Number(e.target.value))}
                className="pl-9"
                placeholder="299"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Payment Gateway</label>
            <select
              value={form.gateway}
              onChange={(e) => set('gateway', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="manual">Manual / Cash</option>
              <option value="razorpay">Razorpay</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Note (optional)</label>
            <textarea
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              rows={2}
              placeholder="Any extra info…"
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!form.customerName.trim() || !form.customerEmail.trim() || !form.amount}
            className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Add Sale
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<Sale['status'], string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  refunded:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { sales, addSale, updateSaleStatus, deleteSale } = useAppStore()
  const [addSaleOpen, setAddSaleOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dbStats, setDbStats] = useState<{ totalUsers: number; totalItems: number; pendingItems: number; totalDownloads: number } | null>(null)
  const [pendingQueue, setPendingQueue] = useState<any[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const [stats, queueData] = await Promise.all([
        dbGetAdminStats(),
        import('@/lib/supabase/client').then(async ({ createClient }) => {
          const supabase = createClient()
          const { data } = await supabase
            .from('items')
            .select('id, title, thumbnail_url, category, creator_id, created_at')
            .eq('status', 'pending')
            .order('created_at', { ascending: true })
            .limit(4)
          if (!data) return []
          // get creator names
          const ids = [...new Set(data.map((i) => i.creator_id).filter(Boolean))]
          const { data: users } = await supabase.from('users').select('id, name').in('id', ids)
          const um = Object.fromEntries((users ?? []).map((u) => [u.id, u.name]))
          return data.map((i) => ({ ...i, creator_name: um[i.creator_id] ?? 'Unknown' }))
        }),
      ])
      setDbStats(stats)
      setPendingQueue(queueData)
    } catch (err) {
      console.error(err)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const totalRevenue   = sales.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0)
  const totalSales     = sales.filter((s) => s.status === 'completed').length
  const pendingRevenue = sales.filter((s) => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0)

  async function handleApproveFromQueue(id: string) {
    try {
      await dbApproveItem(id)
      setPendingQueue((q) => q.filter((i) => i.id !== id))
      setDbStats((s) => s ? { ...s, pendingItems: Math.max(0, s.pendingItems - 1) } : s)
      toast({ title: '✅ Item approved' })
    } catch {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' })
    }
  }

  function handleDelete() {
    if (deletingId) { deleteSale(deletingId); setDeletingId(null) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground text-sm">Real-time platform metrics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadStats} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAddSaleOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Sale
          </button>
        </div>
      </div>

      {/* Stats — real Supabase data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={statsLoading ? '…' : formatNumber(dbStats?.totalUsers ?? 0)} icon={Users} iconColor="text-brand-500" />
        <StatCard title="Total Items" value={statsLoading ? '…' : formatNumber(dbStats?.totalItems ?? 0)} icon={Package} iconColor="text-purple-500" />
        <StatCard title="Pending Reviews" value={statsLoading ? '…' : (dbStats?.pendingItems ?? 0)} icon={Clock} iconColor="text-yellow-500" />
        <StatCard title="Total Downloads" value={statsLoading ? '…' : formatNumber(dbStats?.totalDownloads ?? 0)} icon={Download} iconColor="text-blue-500" />
        <StatCard title="Revenue (Manual)" value={`₹${formatNumber(totalRevenue)}`} icon={TrendingUp} iconColor="text-green-500" />
        <StatCard title="Manual Sales" value={formatNumber(totalSales)} icon={CreditCard} iconColor="text-teal-500" />
        <StatCard title="Pending Revenue" value={`₹${formatNumber(pendingRevenue)}`} icon={Clock} iconColor="text-orange-500" />
        <StatCard title="Completed Sales" value={formatNumber(totalSales)} icon={CheckCircle} iconColor="text-green-500" />
      </div>

      {/* Sales table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/20">
          <div>
            <h2 className="font-bold">Sales</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{sales.length} record{sales.length !== 1 ? 's' : ''} · Click + Add Sale to record a new transaction</p>
          </div>
          <button
            onClick={() => setAddSaleOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Sale
          </button>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            <IndianRupee className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No sales recorded yet</p>
            <p className="text-xs mt-1">Click "Add Sale" to record your first transaction.</p>
            <button
              onClick={() => setAddSaleOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" /> Add First Sale
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-px">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Gateway</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{sale.customerName}</p>
                      <p className="text-xs text-muted-foreground">{sale.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{sale.plan}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{sale.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-muted font-medium capitalize">{sale.gateway}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sale.status}
                        onChange={(e) => updateSaleStatus(sale.id, e.target.value as Sale['status'])}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_STYLE[sale.status]}`}
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeletingId(sale.id)}
                        className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-muted-foreground transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Content review queue — real Supabase data */}
      <div className="border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Content Review Queue</h2>
          <Link href="/dashboard/admin/items" className="text-sm text-brand-600 hover:underline">View all →</Link>
        </div>
        {statsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="shimmer w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="shimmer h-3 w-40 rounded" />
                  <div className="shimmer h-2.5 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : pendingQueue.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
            All caught up! No pending submissions.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnail_url || `https://picsum.photos/seed/${item.id}/80/80`}
                    alt={item.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.creator_name} · {item.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => handleApproveFromQueue(item.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" /> Approve
                  </button>
                  <Link href="/dashboard/admin/items" className="px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors">
                    Review
                  </Link>
                </div>
              </div>
            ))}
            {(dbStats?.pendingItems ?? 0) > 4 && (
              <Link href="/dashboard/admin/items" className="block text-center text-sm text-brand-600 hover:underline py-2">
                +{(dbStats?.pendingItems ?? 0) - 4} more pending — View all
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Add Sale modal */}
      {addSaleOpen && <AddSaleModal onClose={() => setAddSaleOpen(false)} onAdd={addSale} />}

      {/* Delete confirm */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Delete this sale record?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
