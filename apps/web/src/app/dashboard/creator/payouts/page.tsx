'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/dashboard/StatCard'
import { DollarSign, Clock, CheckCircle, ArrowDownToLine } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function CreatorPayoutsPage() {
  const { user } = useAppStore()
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank'>('upi')
  const [upiId, setUpiId] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const [earnings, setEarnings] = useState<{ totalEarnings: number; pendingPayout: number }>({ totalEarnings: 0, pendingPayout: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase
        .from('users')
        .select('total_earnings, pending_payout')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setEarnings({
              totalEarnings: Number(data.total_earnings ?? 0),
              pendingPayout: Number(data.pending_payout ?? 0),
            })
          }
          setLoading(false)
        })
    })
  }, [user?.id])

  async function handleRequestPayout() {
    if (earnings.pendingPayout < 500) {
      toast({ title: 'Minimum ₹500 required', description: 'Keep earning and come back when you have ₹500+', variant: 'destructive' })
      return
    }
    setRequesting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setRequesting(false)
    setRequested(true)
    toast({ title: '✅ Payout requested!', description: `₹${earnings.pendingPayout.toLocaleString('en-IN')} will be processed in 2–3 business days.` })
  }

  const fmtCurrency = (n: number) => n === 0 ? '₹0' : `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payouts</h1>
        <p className="text-muted-foreground text-sm">Manage your earnings and withdrawal settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Payout"
          value={loading ? '…' : fmtCurrency(earnings.pendingPayout)}
          icon={Clock} iconColor="text-yellow-500"
        />
        <StatCard
          title="Total Paid Out"
          value="₹0"
          icon={CheckCircle} iconColor="text-brand-500"
        />
        <StatCard
          title="Total Earnings"
          value={loading ? '…' : fmtCurrency(earnings.totalEarnings)}
          icon={DollarSign} iconColor="text-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Payout */}
        <div className="border rounded-xl p-5">
          <h2 className="font-bold mb-4">Request Payout</h2>
          {requested ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-brand-500 mx-auto mb-3" />
              <p className="font-semibold">Payout Requested!</p>
              <p className="text-muted-foreground text-sm mt-1">
                {fmtCurrency(earnings.pendingPayout)} will be processed in 2–3 business days
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setRequested(false)}>
                Request Another
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-muted/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                <p className="text-3xl font-black mt-1">
                  {loading ? <span className="shimmer h-8 w-24 rounded block" /> : fmtCurrency(earnings.pendingPayout)}
                </p>
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
              <Button
                variant="brand"
                className="w-full"
                onClick={handleRequestPayout}
                disabled={requesting || earnings.pendingPayout < 500}
              >
                {requesting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    {earnings.pendingPayout >= 500 ? `Request ${fmtCurrency(earnings.pendingPayout)}` : 'Min. ₹500 required'}
                  </span>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Payout schedule */}
        <div className="border rounded-xl p-5">
          <h2 className="font-bold mb-4">How Payouts Work</h2>
          <div className="space-y-4 text-sm">
            {[
              { dot: 'bg-brand-500', title: '₹12 per download', desc: 'You earn ₹12 every time a customer downloads your item using tokens.' },
              { dot: 'bg-blue-500', title: '2–3 business days', desc: 'UPI payouts arrive in 1 business day. Bank transfers take 2–3 days.' },
              { dot: 'bg-purple-500', title: 'Minimum ₹500', desc: 'Earnings accumulate until you reach ₹500, then you can request a withdrawal anytime.' },
              { dot: 'bg-amber-500', title: 'No expiry', desc: 'Your earnings never expire. Withdraw whenever you want.' },
            ].map(({ dot, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full ${dot} mt-1.5 shrink-0`} />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout history — empty for fresh accounts */}
      <div className="border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-bold">Payout History</h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="h-8 w-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No payouts yet. Request your first payout above!</p>
        </div>
      </div>
    </div>
  )
}
