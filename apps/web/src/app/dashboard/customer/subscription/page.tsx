'use client'

import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for trying out Pipiklo',
    features: ['5 downloads/month', 'Standard resolution', 'Basic license', 'Community support'],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹1,650',
    period: '/month',
    description: 'For professionals and creators',
    features: [
      'Unlimited downloads',
      'High resolution + source files',
      'Extended commercial license',
      'Priority support',
      'Early access to new assets',
      'AI tools (100 credits/mo)',
    ],
    cta: 'Upgrade to Pro',
    current: false,
  },
  {
    id: 'team',
    name: 'Team',
    price: '₹5,500',
    period: '/month',
    description: 'For agencies and teams up to 10',
    features: [
      'Everything in Pro',
      'Up to 10 team seats',
      'Team asset library',
      'Shared collections',
      'Dedicated account manager',
      'AI tools (500 credits/mo)',
    ],
    cta: 'Upgrade to Team',
    current: false,
  },
]

export default function CustomerSubscriptionPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your plan and billing</p>
      </div>

      {/* Current plan banner */}
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">You are on the Free plan</p>
          <p className="text-xs text-brand-600 dark:text-brand-500 mt-0.5">
            3 of 5 downloads used this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 bg-brand-200 dark:bg-brand-800 rounded-full overflow-hidden">
            <div className="h-full w-[60%] bg-brand-500 rounded-full" />
          </div>
          <span className="text-xs text-brand-600 dark:text-brand-500">3/5</span>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3">
        <span className={`text-sm ${billing === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-11 h-6 rounded-full transition-colors ${billing === 'yearly' ? 'bg-brand-500' : 'bg-muted'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-5' : ''}`} />
        </button>
        <span className={`text-sm ${billing === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
          Yearly <span className="text-brand-500 text-xs font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 flex flex-col ${
              plan.id === 'pro'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                : 'border bg-card'
            }`}
          >
            {plan.id === 'pro' && (
              <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
                <Zap className="w-3 h-3" />
                MOST POPULAR
              </div>
            )}
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-3xl font-bold text-foreground">
                {billing === 'yearly' && plan.id !== 'free'
                  ? `₹${Math.round(parseInt(plan.price.replace(/[₹,]/g, '')) * 0.8).toLocaleString('en-IN')}`
                  : plan.price}
              </span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              disabled={plan.current}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                plan.current
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : plan.id === 'pro'
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : 'border hover:bg-accent text-foreground'
              }`}
            >
              {plan.current ? 'Current Plan' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold text-foreground mb-4">Billing History</h2>
        <p className="text-sm text-muted-foreground">No billing history. You are on the free plan.</p>
      </div>
    </div>
  )
}
