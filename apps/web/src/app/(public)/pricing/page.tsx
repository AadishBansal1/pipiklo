import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pricing — Pipiklo',
  description: 'Start free and upgrade when you need more. Access 27M+ creative assets.',
}

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    cta: 'Get started free',
    href: '/sign-up',
    highlight: false,
    features: [
      { text: 'Unlimited downloads', included: true },
      { text: '27M+ creative assets', included: true },
      { text: 'Commercial license', included: true },
      { text: 'AI tools (limited)', included: true },
      { text: 'Priority support', included: false },
      { text: 'Team collaboration', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 1650,
    period: 'month',
    description: 'For professional creators',
    cta: 'Start Pro — ₹1,650/mo',
    href: '/sign-up?plan=pro',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited downloads', included: true },
      { text: '27M+ creative assets', included: true },
      { text: 'Lifetime commercial license', included: true },
      { text: 'All AI tools (unlimited)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team collaboration (up to 3)', included: true },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Team',
    price: 5500,
    period: 'month',
    description: 'For agencies and teams',
    cta: 'Start Team — ₹5,500/mo',
    href: '/sign-up?plan=team',
    highlight: false,
    features: [
      { text: 'Unlimited downloads', included: true },
      { text: '27M+ creative assets', included: true },
      { text: 'Lifetime commercial license', included: true },
      { text: 'All AI tools (unlimited)', included: true },
      { text: 'Priority & dedicated support', included: true },
      { text: 'Team collaboration (unlimited)', included: true },
      { text: 'API access', included: true },
    ],
  },
]

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes! Pipiklo starts completely free. All assets are free to download during our launch phase. Premium subscription unlocks AI tools, priority support, and team features.',
  },
  {
    q: 'What license do I get?',
    a: 'Every download comes with a commercial license. You can use assets in personal and client projects. Read our full License Agreement for details.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel anytime from your dashboard. You keep access until the end of your billing period, and completed project licenses remain valid forever.',
  },
  {
    q: 'Do you support Razorpay?',
    a: 'Yes! We support UPI, net banking, and Indian debit/credit cards via Razorpay. No international payment headaches.',
  },
  {
    q: 'How do creator earnings work?',
    a: 'Creators earn a percentage of subscription revenue based on downloads. Payouts via bank transfer or UPI every month.',
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Simple, transparent pricing
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Start free. Upgrade when ready.</h1>
        <p className="text-muted-foreground text-lg">
          All plans include a commercial license, unlimited downloads, and access to 27M+ assets. No hidden fees.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              plan.highlight
                ? 'border-brand-500 shadow-xl shadow-brand-500/10 bg-brand-50/50 dark:bg-brand-900/10'
                : 'bg-card'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="flex items-end gap-1">
                {plan.price === 0 ? (
                  <span className="text-4xl font-extrabold">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-extrabold">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground mb-1">/{plan.period}</span>
                  </>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f.text} className={`flex items-center gap-2 text-sm ${!f.included && 'opacity-40'}`}>
                  {f.included ? (
                    <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlight ? 'brand' : 'outline'}
              size="lg"
              className="w-full"
              asChild
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Feature comparison note */}
      <div className="text-center mb-20">
        <p className="text-muted-foreground text-sm">
          All plans include lifetime commercial license on completed projects. Payments via Razorpay (UPI, Net Banking, Cards).
        </p>
        <Link href="/license" className="text-brand-600 text-sm hover:underline mt-1 inline-block">
          Read the full License Agreement →
        </Link>
      </div>

      {/* FAQs */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border rounded-xl p-5">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
