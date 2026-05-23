'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Coins, CheckCircle2, Zap, Star, Shield, ArrowRight, Sparkles, Download, HelpCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'
import { toast } from '@/hooks/use-toast'

const TOKEN_PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    tokens: 5,
    price: 99,
    pricePerToken: 19.8,
    badge: null,
    color: 'border',
    highlight: false,
    description: 'Perfect for trying out Pipiklo',
    perks: [
      '5 download tokens',
      'Commercial license on each download',
      'All asset categories',
      'Never expires',
    ],
  },
  {
    id: 'popular',
    name: 'Popular',
    tokens: 20,
    price: 299,
    pricePerToken: 14.95,
    badge: 'Most Popular',
    color: 'border-brand-500',
    highlight: true,
    description: 'Best value for active creators',
    perks: [
      '20 download tokens',
      'Commercial license on each download',
      'All asset categories',
      'Never expires',
      'Priority download queue',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tokens: 50,
    price: 599,
    pricePerToken: 11.98,
    badge: 'Best Value',
    color: 'border-purple-500',
    highlight: false,
    description: 'For power users and agencies',
    perks: [
      '50 download tokens',
      'Commercial license on each download',
      'All asset categories',
      'Never expires',
      'Priority download queue',
      'Invoice / GST receipt',
    ],
  },
  {
    id: 'mega',
    name: 'Mega',
    tokens: 150,
    price: 1499,
    pricePerToken: 9.99,
    badge: 'Team Pack',
    color: 'border',
    highlight: false,
    description: 'For teams and heavy usage',
    perks: [
      '150 download tokens',
      'Commercial license on each download',
      'All asset categories',
      'Never expires',
      'Priority download queue',
      'Invoice / GST receipt',
      'Dedicated support',
    ],
  },
]

const FAQS = [
  {
    q: 'What is a download token?',
    a: 'Each token lets you download one asset with a lifetime commercial license. Tokens never expire — use them at your own pace.',
  },
  {
    q: 'Do tokens expire?',
    a: 'No. Tokens never expire. Buy a pack today and use it whenever you need it.',
  },
  {
    q: 'What license do I get?',
    a: 'Every download includes a Pipiklo Commercial License — valid for unlimited personal and client projects, forever.',
  },
  {
    q: 'How do I get my 3 free tokens?',
    a: 'Every new account automatically starts with 3 free download tokens. No credit card required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, net banking, debit/credit cards, and all major wallets via Razorpay — no international payment hassles.',
  },
  {
    q: 'Can I get a GST invoice?',
    a: 'Yes! Pro and Mega packs include a GST invoice. Enter your GSTIN during checkout.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-sm">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/10">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const { user, addTokens } = useAppStore()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  async function handlePurchase(pack: typeof TOKEN_PACKS[number]) {
    if (!user) {
      window.location.href = '/sign-in?redirect=/pricing'
      return
    }
    setPurchasing(pack.id)
    // Simulate Razorpay payment flow
    await new Promise((r) => setTimeout(r, 1400))
    addTokens(pack.tokens, pack.name, pack.price)
    toast({
      title: `🎉 ${pack.tokens} tokens added!`,
      description: `Your balance now has ${(user.tokens + pack.tokens)} tokens. Happy downloading!`,
    })
    setPurchasing(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 dark:from-brand-950/20 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
              <Coins className="h-4 w-4" />
              Token-based downloads — no subscription needed
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Buy tokens.<br />
              <span className="text-brand-500">Download anything.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Every new account gets <strong className="text-foreground">3 free tokens</strong>. Each token downloads one asset with a lifetime commercial license. Tokens never expire.
            </p>

            {/* Live token balance */}
            {user?.role === 'customer' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 mb-8"
              >
                <Coins className="h-5 w-5 text-amber-600" />
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  You have {user.tokens} token{user.tokens !== 1 ? 's' : ''}
                </span>
                {user.tokens === 0 && (
                  <span className="text-xs text-amber-600 dark:text-amber-500">Top up below ↓</span>
                )}
              </motion.div>
            )}

            {/* How it works — 3 steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-4">
              {[
                { icon: Sparkles, step: '1', text: 'Sign up free — get 3 tokens instantly' },
                { icon: Download, step: '2', text: 'Browse 27M+ assets, pick what you love' },
                { icon: Shield, step: '3', text: 'Download with 1 token — lifetime license' },
              ].map(({ icon: Icon, step, text }) => (
                <div key={step} className="flex items-center gap-3 bg-card border rounded-xl px-4 py-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{step}</div>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Token Packs */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">Choose your pack</h2>
          <p className="text-muted-foreground">Bigger packs = lower cost per token. All packs include commercial license.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-6">
          {TOKEN_PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-2xl border-2 p-6 flex flex-col bg-card ${
                pack.highlight ? 'border-brand-500 shadow-xl shadow-brand-500/15' : pack.color
              }`}
            >
              {pack.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${
                  pack.highlight ? 'bg-brand-500' : pack.id === 'pro' ? 'bg-purple-600' : 'bg-foreground'
                }`}>
                  {pack.badge}
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold mb-1">{pack.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{pack.description}</p>

                {/* Token count badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-3 py-1.5">
                    <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xl font-black text-amber-700 dark:text-amber-400">{pack.tokens}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">tokens</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-black">₹{pack.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">one-time</span>
                </div>
                <p className="text-xs text-muted-foreground">₹{pack.pricePerToken.toFixed(2)} per token</p>
              </div>

              {/* Perks */}
              <ul className="space-y-2 mb-6 flex-1">
                {pack.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>

              <Button
                variant={pack.highlight ? 'brand' : 'outline'}
                className="w-full font-semibold"
                onClick={() => handlePurchase(pack)}
                disabled={purchasing === pack.id}
              >
                {purchasing === pack.id ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Buy {pack.tokens} Tokens — ₹{pack.price}
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Secure payments via <strong>Razorpay</strong> · UPI · Net Banking · Cards · Wallets ·{' '}
          <Link href="/license" className="text-brand-600 hover:underline">License Agreement</Link>
        </p>
      </div>

      {/* Value proposition */}
      <div className="bg-muted/30 border-y py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Lifetime Commercial License', desc: 'Every download gives you a permanent, project-wide commercial license — no renewals ever.' },
              { icon: Coins, title: 'Tokens Never Expire', desc: 'Buy now, download later. Your tokens stay valid forever — no monthly pressure.' },
              { icon: Star, title: '27M+ Premium Assets', desc: 'Templates, videos, audio, graphics, fonts, 3D models — the largest creative library in India.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="h-12 w-12 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-4">Still have questions?</p>
            <Button variant="outline" asChild>
              <Link href="mailto:support@pipiklo.com">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
