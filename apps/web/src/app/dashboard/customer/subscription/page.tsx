'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Coins, CheckCircle2, ArrowRight, Clock, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'

const TOKEN_PACKS = [
  { id: 'starter', name: 'Starter', tokens: 5,   price: 99,   perToken: 19.8,  highlight: false, badge: null },
  { id: 'popular', name: 'Popular', tokens: 20,  price: 299,  perToken: 14.95, highlight: true,  badge: 'Most Popular' },
  { id: 'pro',     name: 'Pro',     tokens: 50,  price: 599,  perToken: 11.98, highlight: false, badge: 'Best Value' },
  { id: 'mega',    name: 'Mega',    tokens: 150, price: 1499, perToken: 9.99,  highlight: false, badge: null },
]

export default function CustomerTokensPage() {
  const { user, addTokens, tokenPurchases } = useAppStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  async function handleBuy(pack: typeof TOKEN_PACKS[number]) {
    setPurchasing(pack.id)
    await new Promise((r) => setTimeout(r, 1400))
    addTokens(pack.tokens, pack.name, pack.price)
    toast({ title: `🎉 ${pack.tokens} tokens added!`, description: `New balance: ${(user?.tokens ?? 0) + pack.tokens} tokens` })

    // Persist to Supabase in background
    if (user?.id) {
      import('@/lib/supabase/db').then(({ dbAddTokens, dbRecordPayment }) => {
        dbAddTokens(user.id, pack.tokens).catch(console.error)
        dbRecordPayment({
          userId: user.id,
          amount: pack.price,
          packName: pack.name,
          tokensAdded: pack.tokens,
        }).catch(console.error)
      }).catch(console.error)
    }

    setPurchasing(null)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Tokens</h1>
        <p className="text-sm text-muted-foreground mt-1">Buy tokens to download assets. Each download uses 1 token. Tokens never expire.</p>
      </div>

      {/* Current balance hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 p-6 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/80 text-sm mb-2">Current token balance</p>
            <div className="flex items-center gap-3">
              <Coins className="h-8 w-8 text-amber-300" />
              <span className="text-5xl font-black">{user?.tokens ?? 0}</span>
              <span className="text-xl text-white/70 font-bold">tokens</span>
            </div>
            <p className="text-white/70 text-sm mt-2">{user?.totalDownloads ?? 0} assets downloaded lifetime</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Never expire', icon: Clock },
              { label: 'Commercial license', icon: Shield },
              { label: 'All categories', icon: Star },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-xl px-3 py-2">
                <Icon className="h-4 w-4 text-white/80 mx-auto mb-1" />
                <p className="text-white/80 text-[10px] font-medium leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Token packs */}
      <div>
        <h2 className="font-bold text-lg mb-4">Buy More Tokens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOKEN_PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`relative rounded-2xl border-2 p-5 flex flex-col bg-card ${
                pack.highlight ? 'border-brand-500 shadow-lg shadow-brand-500/10' : ''
              }`}
            >
              {pack.badge && (
                <div className={`absolute -top-2.5 left-4 text-[10px] font-bold px-3 py-0.5 rounded-full text-white ${
                  pack.highlight ? 'bg-brand-500' : 'bg-foreground'
                }`}>
                  {pack.badge}
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-bold">{pack.name}</p>
                  <p className="text-xs text-muted-foreground">₹{pack.perToken.toFixed(2)}/token</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-black">{pack.tokens}</span>
                <span className="text-muted-foreground text-sm ml-1">tokens</span>
                <div className="mt-1">
                  <span className="text-xl font-bold">₹{pack.price}</span>
                  <span className="text-muted-foreground text-sm"> one-time</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {['Commercial license', 'All categories', 'Never expires'].map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={pack.highlight ? 'brand' : 'outline'}
                size="sm"
                className="w-full font-semibold"
                onClick={() => handleBuy(pack)}
                disabled={purchasing === pack.id}
              >
                {purchasing === pack.id ? (
                  <span className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : `Buy ₹${pack.price}`}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Secure via Razorpay · UPI · Net Banking · Cards ·
          <Link href="/license" className="text-brand-600 hover:underline ml-1">License Agreement</Link>
        </p>
      </div>

      {/* Purchase history */}
      {tokenPurchases.length > 0 && (
        <div className="border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-bold">Purchase History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-5 font-medium text-muted-foreground">Pack</th>
                  <th className="text-right py-3 px-5 font-medium text-muted-foreground">Tokens</th>
                  <th className="text-right py-3 px-5 font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-3 px-5 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tokenPurchases.map((tp) => (
                  <tr key={tp.id} className="hover:bg-muted/20">
                    <td className="py-3 px-5 font-medium">{tp.pack}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="flex items-center gap-1 justify-end">
                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                        {tp.tokens}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-medium text-green-600">₹{tp.amount}</td>
                    <td className="py-3 px-5 text-right text-muted-foreground">
                      {new Date(tp.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
