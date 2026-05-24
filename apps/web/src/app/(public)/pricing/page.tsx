'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Coins, CheckCircle2, Star, Shield, ArrowRight,
  Sparkles, Download, ChevronDown, Zap, BadgeCheck, Lock,
} from 'lucide-react'
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
    highlight: false,
    glowColor: '',
    description: 'Perfect for trying out Pipiklo',
    perks: [
      '5 download tokens',
      'Commercial license on each',
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
    highlight: true,
    glowColor: 'shadow-brand-500/40',
    description: 'Best value for active creators',
    perks: [
      '20 download tokens',
      'Commercial license on each',
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
    highlight: false,
    glowColor: 'shadow-purple-500/30',
    description: 'For power users and agencies',
    perks: [
      '50 download tokens',
      'Commercial license on each',
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
    highlight: false,
    glowColor: 'shadow-amber-500/20',
    description: 'For teams and heavy usage',
    perks: [
      '150 download tokens',
      'Commercial license on each',
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
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-sm">{q}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
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

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#030712] text-white">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/8 blur-[140px]"
          />
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              No subscription. No lock-in. Just tokens.
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-5 tracking-tight leading-[1.05]">
              Buy tokens.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-cyan-400">
                Download anything.
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Every account starts with{' '}
              <span className="text-white font-bold">3 free tokens</span>.
              Each token downloads one asset with a{' '}
              <span className="text-brand-400 font-semibold">lifetime commercial license</span>.
              Tokens never expire.
            </p>

            {/* Live token balance */}
            {user?.role === 'customer' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-8 backdrop-blur-sm"
              >
                <Coins className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-amber-300">
                  You have {user.tokens} token{user.tokens !== 1 ? 's' : ''}
                </span>
                {user.tokens === 0 && (
                  <span className="text-xs text-amber-500">Top up below ↓</span>
                )}
              </motion.div>
            )}

            {/* How it works — 3 steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
              {[
                { icon: Sparkles, step: '1', text: 'Sign up free — get 3 tokens instantly', color: 'text-brand-400' },
                { icon: Download, step: '2', text: 'Browse 27M+ assets, pick what you love', color: 'text-emerald-400' },
                { icon: Shield, step: '3', text: 'Download with 1 token — lifetime license', color: 'text-purple-400' },
              ].map(({ icon: Icon, step, text, color }) => (
                <div key={step} className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-left">
                  <div className={`h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>
                    {step}
                  </div>
                  <p className="text-sm text-slate-300">{text}</p>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: BadgeCheck, label: 'Verified Platform' },
                { icon: Lock, label: 'Secure via Razorpay' },
                { icon: Shield, label: 'Lifetime License' },
                { icon: Zap, label: 'Instant Access' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Icon className="h-3.5 w-3.5 text-brand-400" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom fade to background */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* ── Token Packs ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3">Choose your pack</h2>
          <p className="text-muted-foreground text-lg">Bigger packs = lower cost per token. All packs include commercial license.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-8">
          {TOKEN_PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl flex flex-col bg-card transition-all duration-300 ${
                pack.highlight
                  ? 'border-2 border-brand-500 shadow-2xl shadow-brand-500/30 ring-1 ring-brand-500/20'
                  : pack.id === 'pro'
                  ? 'border-2 border-purple-500/60 shadow-xl shadow-purple-500/15 hover:shadow-purple-500/25 hover:border-purple-500'
                  : pack.id === 'mega'
                  ? 'border-2 border-amber-500/40 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:border-amber-500/60'
                  : 'border-2 border-border hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10'
              }`}
            >
              {/* Glow highlight bg for popular */}
              {pack.highlight && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
              )}

              {pack.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                  pack.highlight
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-500/40'
                    : pack.id === 'pro'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30'
                }`}>
                  {pack.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-1">{pack.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{pack.description}</p>

                  {/* Token count */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-xl px-3 py-1.5">
                      <Coins className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pack.tokens}</span>
                      <span className="text-xs text-amber-600/70 dark:text-amber-500 font-medium">tokens</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-4xl font-black">₹{pack.price}</span>
                    <span className="text-muted-foreground text-sm mb-1.5">one-time</span>
                  </div>
                  <p className="text-xs text-muted-foreground">₹{pack.pricePerToken.toFixed(2)} per token</p>
                </div>

                {/* Perks */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pack.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${
                        pack.highlight ? 'text-brand-500' : pack.id === 'pro' ? 'text-purple-500' : pack.id === 'mega' ? 'text-amber-500' : 'text-brand-500'
                      }`} />
                      <span className="text-foreground/80">{perk}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pack.highlight ? 'brand' : 'outline'}
                  className={`w-full font-semibold transition-all duration-200 ${
                    pack.id === 'pro' && !pack.highlight
                      ? 'border-purple-500/40 hover:border-purple-500 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400'
                      : pack.id === 'mega'
                      ? 'border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400'
                      : ''
                  }`}
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-center text-xs text-muted-foreground">
            Secure payments via <strong className="text-foreground">Razorpay</strong> · UPI · Net Banking · Cards · Wallets ·{' '}
            <Link href="/license" className="text-brand-600 dark:text-brand-400 hover:underline">License Agreement</Link>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> PCI DSS Compliant</span>
            <span className="flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Verified Seller</span>
          </div>
        </motion.div>
      </div>

      {/* ── Value Propositions ───────────────────────────────────────────────── */}
      <div className="border-y border-border/60 bg-muted/20 dark:bg-muted/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Lifetime Commercial License',
                desc: 'Every download gives you a permanent, project-wide commercial license — no renewals ever.',
                color: 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400',
              },
              {
                icon: Coins,
                title: 'Tokens Never Expire',
                desc: 'Buy now, download later. Your tokens stay valid forever — no monthly pressure.',
                color: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
              },
              {
                icon: Star,
                title: '27M+ Premium Assets',
                desc: 'Templates, videos, audio, graphics, fonts, 3D models — the largest creative library in India.',
                color: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold mb-2 text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Everything you need to know about Pipiklo tokens</p>
          </div>
          <div className="space-y-2.5">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>

          <div className="text-center mt-10 p-8 rounded-2xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 border border-border/60">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <h3 className="font-bold text-lg">Still have questions?</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-5">Our support team is here to help you get started</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="brand" asChild className="gap-2">
                <Link href="/sign-up">
                  <Sparkles className="h-4 w-4" />
                  Get 3 Free Tokens
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:support@pipiklo.com">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
