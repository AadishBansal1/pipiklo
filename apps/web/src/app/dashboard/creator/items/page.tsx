'use client'

import { useState } from 'react'
import { getItemsByCategory } from '@/lib/mock-data'
import { Eye, Download, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  draft: 'bg-muted text-muted-foreground',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function CreatorItemsPage() {
  const allItems = getItemsByCategory('graphics', 20)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'draft'>('all')

  const statuses = ['approved', 'pending', 'draft', 'rejected']
  const itemsWithStatus = allItems.map((item, i) => ({
    ...item,
    status: statuses[i % statuses.length],
  }))

  const filtered = filter === 'all' ? itemsWithStatus : itemsWithStatus.filter((i) => i.status === filter)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Items</h1>
          <p className="text-sm text-muted-foreground mt-1">{allItems.length} items uploaded</p>
        </div>
        <Link
          href="/dashboard/creator/upload"
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload New
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'approved', 'pending', 'draft'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              filter === tab
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Views</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Downloads</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Earned</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <span className="font-medium text-foreground line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3" />
                      {(item.downloads * 4).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <Download className="w-3 h-3" />
                      {item.downloads.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">
                    ₹{(item.downloads * 12).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
