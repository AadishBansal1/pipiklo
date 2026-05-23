'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CustomerLicensesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Licenses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All Pipiklo licenses issued to your account. Each download generates a unique license certificate.
        </p>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-lg mb-2">No licenses yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Browse assets and download items to generate license certificates</p>
          <Link href="/">
            <Button variant="brand">Browse Assets</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
