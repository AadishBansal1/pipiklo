'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { MOCK_DOWNLOADS } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Search, Download, Shield, FileText, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function CustomerDownloadsPage() {
  const [query, setQuery] = useState('')

  const filtered = MOCK_DOWNLOADS.filter((dl) =>
    !query || dl.item?.title?.toLowerCase().includes(query.toLowerCase()) || dl.projectName?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Downloads</h1>
            <p className="text-muted-foreground text-sm">{MOCK_DOWNLOADS.length} total downloads</p>
          </div>
        </div>

        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search downloads..." className="pl-9" />
        </div>

        <div className="border rounded-xl overflow-hidden">
          <div className="divide-y">
            {filtered.map((dl) => (
              <div key={dl.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image src={dl.item?.thumbnailUrl ?? ''} alt={dl.item?.title ?? ''} fill className="object-cover" sizes="80px" />
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/item/${dl.itemId}`} className="font-semibold text-sm hover:text-brand-600 transition-colors line-clamp-1">
                    {dl.item?.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Project: <span className="font-medium text-foreground">{dl.projectName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Downloaded {formatDate(dl.downloadedAt)}</p>
                </div>

                <div className="shrink-0 text-right space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                    <Shield className="h-3 w-3 text-brand-500" />
                    <span className="font-mono">{dl.licenseKey}</span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <a
                      href={dl.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-2.5 py-1 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-3 w-3" /> Certificate
                    </a>
                    <Link
                      href={`/item/${dl.itemId}`}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                      <Download className="h-3 w-3" /> Re-download
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Download className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No downloads yet</p>
              <p className="text-muted-foreground text-sm mt-1">Start browsing and download assets for free</p>
              <Link href="/" className="inline-block mt-4 px-5 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors">
                Browse assets
              </Link>
            </div>
          )}
        </div>
    </div>
  )
}
