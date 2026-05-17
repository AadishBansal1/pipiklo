import Link from 'next/link'
import { Box } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Box className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">
              Spiri<span className="text-brand-500">Tech</span>
            </span>
          </div>

          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/subjects" className="hover:text-foreground transition-colors">
              Subjects
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SpiriTech. NCERT in 3D.
          </p>
        </div>
      </div>
    </footer>
  )
}
