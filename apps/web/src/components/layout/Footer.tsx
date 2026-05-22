import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { CATEGORY_GROUPS } from '@/lib/categories'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Pipiklo</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unlimited creative assets with lifetime commercial license. Templates, videos, audio, graphics, and AI tools — all in one place.
            </p>
          </div>

          {/* Assets */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Assets</h4>
            <ul className="space-y-2">
              {CATEGORY_GROUPS.slice(0, 5).map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Assets */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">More Assets</h4>
            <ul className="space-y-2">
              {CATEGORY_GROUPS.slice(5).map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'Pricing', href: '/pricing' },
                { label: 'License', href: '/license' },
                { label: '✦ Creator / Influencer Program', href: '/influencer' },
                { label: 'Blog', href: '/blog' },
                { label: 'Help Center', href: '/help' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'License Agreement', href: '/license' },
                { label: 'DMCA', href: '/dmca' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Pipiklo. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
