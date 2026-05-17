'use client'

import { useState } from 'react'
import {
  Search, Download, CreditCard, CheckCircle2,
  XCircle, Clock, RefreshCw, IndianRupee, TrendingUp,
  Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'

type TxStatus = 'success' | 'failed' | 'pending' | 'refunded'
type TxType = 'subscription' | 'one-time' | 'payout' | 'refund'

interface Transaction {
  id: string
  user: string
  email: string
  avatar: string
  type: TxType
  plan?: string
  amount: number
  status: TxStatus
  gateway: 'razorpay' | 'manual'
  date: string
  ref: string
}

const TX: Transaction[] = [
  { id: 't1',  user: 'Aryan Kapoor',   email: 'aryan@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan',   type: 'subscription', plan: 'Annual',  amount: 299900, status: 'success',  gateway: 'razorpay', date: '2025-05-17', ref: 'rzp_1Abc23' },
  { id: 't2',  user: 'Priya Singh',    email: 'priya@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priyaS',  type: 'subscription', plan: 'Monthly', amount:  29900, status: 'success',  gateway: 'razorpay', date: '2025-05-16', ref: 'rzp_2Bcd34' },
  { id: 't3',  user: 'DesignStudio',   email: 'ds@creator.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dstudio',  type: 'payout',       plan: undefined, amount:  24500, status: 'success',  gateway: 'manual',   date: '2025-05-15', ref: 'PAY-001' },
  { id: 't4',  user: 'Rahul Mehta',    email: 'rahul@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahulM',  type: 'subscription', plan: 'Annual',  amount: 299900, status: 'failed',   gateway: 'razorpay', date: '2025-05-15', ref: 'rzp_3Cde45' },
  { id: 't5',  user: 'Sneha Patel',    email: 'sneha@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',   type: 'subscription', plan: 'Monthly', amount:  29900, status: 'success',  gateway: 'razorpay', date: '2025-05-14', ref: 'rzp_4Def56' },
  { id: 't6',  user: 'MotionCraft',    email: 'mc@creator.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=motion',   type: 'payout',       plan: undefined, amount:  18200, status: 'pending',  gateway: 'manual',   date: '2025-05-14', ref: 'PAY-002' },
  { id: 't7',  user: 'Vikram Nair',    email: 'vikram@example.com',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikramN', type: 'subscription', plan: 'Annual',  amount: 299900, status: 'refunded',  gateway: 'razorpay', date: '2025-05-13', ref: 'rzp_5Efg67' },
  { id: 't8',  user: 'Anjali Desai',   email: 'anjali@example.com',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali',  type: 'subscription', plan: 'Monthly', amount:  29900, status: 'success',  gateway: 'razorpay', date: '2025-05-12', ref: 'rzp_6Fgh78' },
  { id: 't9',  user: 'PixelForge',     email: 'pf@creator.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel',   type: 'payout',       plan: undefined, amount:  31000, status: 'pending',  gateway: 'manual',   date: '2025-05-11', ref: 'PAY-003' },
  { id: 't10', user: 'Rohan Shah',     email: 'rohan@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',   type: 'subscription', plan: 'Annual',  amount: 299900, status: 'success',  gateway: 'razorpay', date: '2025-05-10', ref: 'rzp_7Ghi89' },
  { id: 't11', user: 'AudioWave',      email: 'aw@creator.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=audio',   type: 'payout',       plan: undefined, amount:   9800, status: 'pending',  gateway: 'manual',   date: '2025-05-09', ref: 'PAY-004' },
  { id: 't12', user: 'Meera Joshi',    email: 'meera@example.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',   type: 'subscription', plan: 'Monthly', amount:  29900, status: 'failed',   gateway: 'razorpay', date: '2025-05-08', ref: 'rzp_8Hij90' },
]

const STATUS_CONFIG: Record<TxStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  success:  { label: 'Success',  color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',  icon: CheckCircle2 },
  failed:   { label: 'Failed',   color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',          icon: XCircle },
  pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',      icon: RefreshCw },
}

const TYPE_LABELS: Record<TxType, string> = {
  subscription: 'Subscription',
  'one-time': 'One-time',
  payout: 'Creator Payout',
  refund: 'Refund',
}

function fmt(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

export default function AdminPaymentsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all')
  const [transactions, setTransactions] = useState(TX)

  const filtered = transactions.filter((tx) => {
    const matchQ = !query || tx.user.toLowerCase().includes(query.toLowerCase()) || tx.email.toLowerCase().includes(query.toLowerCase()) || tx.ref.toLowerCase().includes(query.toLowerCase())
    const matchS = statusFilter === 'all' || tx.status === statusFilter
    const matchT = typeFilter === 'all' || tx.type === typeFilter
    return matchQ && matchS && matchT
  })

  // Summary stats
  const totalIn = TX.filter((t) => t.status === 'success' && t.type !== 'payout').reduce((s, t) => s + t.amount, 0)
  const totalOut = TX.filter((t) => t.status === 'success' && t.type === 'payout').reduce((s, t) => s + t.amount, 0)
  const pending = TX.filter((t) => t.status === 'pending').length
  const failed = TX.filter((t) => t.status === 'failed').length

  function markPaid(id: string) {
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, status: 'success' as TxStatus } : t))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">All platform transactions and creator payouts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalIn), icon: IndianRupee, color: 'text-green-600' },
          { label: 'Creator Payouts', value: fmt(totalOut), icon: CreditCard, color: 'text-orange-500' },
          { label: 'Pending', value: `${pending} tx`, icon: Clock, color: 'text-yellow-600' },
          { label: 'Failed', value: `${failed} tx`, icon: XCircle, color: 'text-red-600' },
        ].map((card) => (
          <div key={card.label} className="border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search user, email, ref…" className="pl-9" />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['all', 'success', 'pending', 'failed', 'refunded'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                statusFilter === s ? 'bg-brand-500 text-white border-brand-500' : 'hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'subscription', 'payout'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                typeFilter === t ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted'
              }`}
            >
              {t === 'all' ? 'All types' : t === 'subscription' ? 'Subscriptions' : 'Payouts'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Gateway</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Ref ID</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((tx) => {
              const sc = STATUS_CONFIG[tx.status]
              const StatusIcon = sc.icon
              return (
                <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={tx.avatar} alt={tx.user} className="w-7 h-7 rounded-full shrink-0" />
                      <div>
                        <p className="font-medium leading-tight">{tx.user}</p>
                        <p className="text-xs text-muted-foreground">{tx.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{TYPE_LABELS[tx.type]}</p>
                      {tx.plan && <p className="text-xs text-muted-foreground">{tx.plan} plan</p>}
                    </div>
                  </td>
                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold">
                    <span className={tx.type === 'payout' ? 'text-orange-600' : 'text-green-600'}>
                      {tx.type === 'payout' ? '-' : '+'}{fmt(tx.amount)}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  </td>
                  {/* Gateway */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      tx.gateway === 'razorpay' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-muted text-muted-foreground'
                    }`}>
                      {tx.gateway === 'razorpay' ? 'Razorpay' : 'Manual'}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  {/* Ref */}
                  <td className="px-4 py-3">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{tx.ref}</code>
                  </td>
                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    {tx.status === 'pending' && tx.type === 'payout' && (
                      <button
                        onClick={() => markPaid(tx.id)}
                        className="px-3 py-1 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                    {tx.status === 'failed' && (
                      <button className="px-3 py-1 text-xs font-medium border rounded-lg hover:bg-muted transition-colors">
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No transactions found.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {TX.length} transactions · Amounts in INR (paise)
      </p>
    </div>
  )
}
