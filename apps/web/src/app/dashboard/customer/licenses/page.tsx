'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { Shield, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface License {
  id: string
  item_id: string
  license_key: string
  downloaded_at: string
  item_title?: string
  item_thumbnail?: string
  item_category?: string
}

export default function CustomerLicensesPage() {
  const { user } = useAppStore()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)

    import('@/lib/supabase/client').then(async ({ createClient }) => {
      const supabase = createClient()

      const { data: dlData } = await supabase
        .from('downloads')
        .select('id, item_id, license_key, downloaded_at')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })

      if (!dlData || dlData.length === 0) { setLoading(false); return }

      const itemIds = [...new Set(dlData.map((d) => d.item_id))]
      const { data: itemsData } = await supabase
        .from('items')
        .select('id, title, thumbnail_url, category')
        .in('id', itemIds)

      const itemMap = Object.fromEntries((itemsData ?? []).map((i) => [i.id, i]))

      setLicenses(dlData.map((d) => ({
        ...d,
        item_title: itemMap[d.item_id]?.title ?? 'Unknown Item',
        item_thumbnail: itemMap[d.item_id]?.thumbnail_url,
        item_category: itemMap[d.item_id]?.category,
      })))
      setLoading(false)
    })
  }, [user?.id])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Licenses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? 'Loading…' : `${licenses.length} commercial license${licenses.length !== 1 ? 's' : ''} issued to your account`}
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="border rounded-xl overflow-hidden divide-y">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="shimmer w-14 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-3.5 w-48 rounded" />
                <div className="shimmer h-2.5 w-28 rounded" />
              </div>
              <div className="shimmer h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && licenses.length === 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No licenses yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Download assets to generate commercial license certificates
            </p>
            <Button variant="brand" asChild>
              <Link href="/">Browse Assets</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Licenses grid */}
      {!loading && licenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {licenses.map((lic) => (
            <div key={lic.id} className="bg-card border rounded-xl p-4 flex gap-4">
              <img
                src={lic.item_thumbnail || `https://picsum.photos/seed/${lic.item_id}/80/60`}
                alt={lic.item_title}
                className="w-16 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{lic.item_title}</p>
                <p className="text-xs text-muted-foreground capitalize mb-2">{lic.item_category}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Commercial License</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {lic.license_key?.toString().slice(0, 12).toUpperCase()}…
                  </span>
                  <Link href={`/item/${lic.item_id}`}
                    className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(lic.downloaded_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
