'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/dashboard/StatCard'
import { DollarSign, Clock, CheckCircle, ArrowDownToLine } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

const PAYOUT_HISTORY = [
  { id: '1', amount: 8400, status: 'paid', requestedAt: '2026-04-01', processedAt: '2026-04-03', method: 'UPI' },
  { id: '2', amount: 12600, status: 'paid', requestedAt: '2026-03-01', processedAt: '2026-03-03', method: 'Bank Transfer' },
  { id: '3', amount: 9200, status: 'paid', requestedAt: '2026-02-01', processedAt: '2026-02-04', method: 'UPI' },
  { id: '4', amount: 7800, status: 'paid', requestedAt: '2026-01-01', processedAt: '2026-01-03', method: 'Bank Transfer' },
]

export default function CreatorPayoutsPage() {
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi')
  const [upiId, setUpiId] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)

  async function handleRequestPayout() {
    setRequesting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setRequesting(false)
    setRequested(true)
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-muted-foreground text-sm">Manage your earnings and payout settings</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard title="Pending Payout" value={formatCurrency(12840)} icon={Clock} iconColor="text-yellow-500" />
          <StatCard title="Total Paid Out" value={formatCurrency(38000)} icon={CheckCircle} iconColor="text-brand-500" />
          <StatCard title="Total Earnings" value={formatCurrency(94284.5)} icon={DollarSign} iconColor="text-purple-500" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Request Payout */}
          <div className="border rounded-xl p-5">
            <h2 className="font-bold mb-4">Request Payout</h2>
            {requested ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-brand-500 mx-auto mb-3" />
                <p className="font-semibold">Payout Requested!</p>
                <p className="text-muted-foreground text-sm mt-1">₹12,840 will be processed in 2–3 business days</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setRequested(false)}>Request Another</Button>
              </div>
            ) : (
              <>
                <div className="bg-muted/30 rounded-xl p-4 mb-4">
                  <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                  <p className="text-3xl font-black mt-1">{formatCurrency(12840)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Min. withdrawal: ₹500</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Payout Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPayoutMethod('upi')}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payoutMethod === 'upi' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'hover:border-brand-300'}`}
                    >
                      📱 UPI
                    </button>
                    <button
                      onClick={() => setPayoutMethod('bank')}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payoutMethod === 'bank' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'hover:border-brand-300'}`}
                    >
                      🏦 Bank Transfer
                    </button>
                  </div>
                </div>
                {payoutMethod === 'upi' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1.5">UPI ID</label>
                    <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" />
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    <Input placeholder="Account holder name" />
                    <Input placeholder="Account number" />
                    <Input placeholder="IFSC code" />
                    <Input placeholder="Bank name" />
                  </div>
                )}
                <Button variant="brand" className="w-full" onClick={handleRequestPayout} disabled={requesting}>
                  {requesting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ArrowDownToLine className="h-4 w-4" /> Request ₹12,840
                    </span>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Payout schedule info */}
          <div className="border rounded-xl p-5">
            <h2 className="font-bold mb-4">Payout Schedule</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium">Monthly payouts</p>
                  <p className="text-muted-foreground">Earnings accumulate monthly. Request payout anytime above ₹500.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium">2–3 business days</p>
                  <p className="text-muted-foreground">UPI payouts typically arrive in 1 business day. Bank transfers take 2–3 days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium">70% revenue share</p>
                  <p className="text-muted-foreground">Creators earn 70% of the subscription revenue attributed to their downloads.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout history */}
        <div className="border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-bold">Payout History</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Method</th>
                <th className="text-left px-5 py-3 font-medium">Requested</th>
                <th className="text-left px-5 py-3 font-medium">Processed</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PAYOUT_HISTORY.map((payout) => (
                <tr key={payout.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-semibold">{formatCurrency(payout.amount)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{payout.method}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(payout.requestedAt)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDate(payout.processedAt)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3" /> {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}
