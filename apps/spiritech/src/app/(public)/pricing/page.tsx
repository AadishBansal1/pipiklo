import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'SpiriTech pricing plans — free and premium tiers for NCERT 3D learning',
}

const PLANS = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Get started with NCERT 3D learning',
    features: [
      'All 3D models and videos',
      '1 doubt per month',
      'Previous year questions',
      'Community videos',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Student',
    price: '99',
    period: '/month',
    description: 'For serious learners',
    features: [
      'Everything in Free',
      '5 doubts per month',
      'Priority answers',
      'Download study notes',
      'Ad-free experience',
    ],
    cta: 'Start Learning',
    popular: true,
  },
  {
    name: 'Pro',
    price: '199',
    period: '/month',
    description: 'Complete learning experience',
    features: [
      'Everything in Student',
      '10 doubts per month',
      '1-on-1 doubt sessions',
      'Exclusive 3D models',
      'Test series access',
      'Progress analytics',
    ],
    cta: 'Go Pro',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Student-Friendly Pricing</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Start free. Upgrade when you need more help.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'relative',
              plan.popular && 'border-brand-500 shadow-lg shadow-brand-500/10'
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">&#8377;{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'brand' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
