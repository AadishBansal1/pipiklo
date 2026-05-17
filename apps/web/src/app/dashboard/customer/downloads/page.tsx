'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CustomerDownloadsPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Downloads</h1>
            <p className="text-muted-foreground text-sm">0 total downloads</p>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Download className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No downloads yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Browse assets and download your first item for free!</p>
            <Link href="/">
              <Button variant="brand">Browse Assets</Button>
            </Link>
          </div>
        </div>
    </div>
  )
}
