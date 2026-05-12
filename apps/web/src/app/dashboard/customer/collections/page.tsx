'use client'

import { useState } from 'react'
import { getFeaturedItems } from '@/lib/mock-data'
import { Bookmark, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

const MOCK_COLLECTIONS = [
  { id: '1', name: 'Brand Kit', items: getFeaturedItems(4), updatedAt: new Date() },
  { id: '2', name: 'Social Media Templates', items: getFeaturedItems(6).slice(2, 6), updatedAt: new Date() },
]

export default function CustomerCollectionsPage() {
  const [collections, setCollections] = useState(MOCK_COLLECTIONS)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const createCollection = () => {
    if (!newName.trim()) return
    setCollections([
      ...collections,
      { id: Date.now().toString(), name: newName.trim(), items: [], updatedAt: new Date() },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 h-28">
              {col.items.slice(0, 4).map((item) => (
                <img key={item.id} src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              ))}
              {col.items.length === 0 && (
                <div className="col-span-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-300">
                  <Bookmark className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="p-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{col.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {col.items.length} item{col.items.length !== 1 ? 's' : ''} · Updated{' '}
                  {col.updatedAt.toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteCollection(col.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && !creating && (
        <div className="text-center py-20 text-gray-400">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No collections yet. Create one to start saving assets.</p>
        </div>
      )}
    </div>
  )
}
