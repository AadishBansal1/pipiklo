'use client'

import { useState } from 'react'
import { Bookmark, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CustomerCollectionsPage() {
  const [collections, setCollections] = useState<{ id: string; name: string; updatedAt: Date }[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const createCollection = () => {
    if (!newName.trim()) return
    setCollections([
      ...collections,
      { id: Date.now().toString(), name: newName.trim(), updatedAt: new Date() },
    ])
    setNewName('')
    setCreating(false)
  }

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organise saved assets into named collections
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </button>
      </div>

      {creating && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-brand-300 dark:border-brand-700 p-5 flex items-center gap-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createCollection()}
            placeholder="Collection name…"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={createCollection}
            className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg"
          >
            Create
          </button>
          <button
            onClick={() => setCreating(false)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}

      {collections.length === 0 && !creating ? (
        <div className="border rounded-xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No collections yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Browse assets and save items to create your first collection</p>
            <Link href="/">
              <Button variant="brand">Browse Assets</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 h-28">
                <Bookmark className="w-10 h-10 text-gray-300" />
              </div>

              <div className="p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{col.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    0 items · Updated {col.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteCollection(col.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
