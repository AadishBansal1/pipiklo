'use client'

import { useState } from 'react'
import { CATEGORY_GROUPS } from '@/lib/categories'

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('')

  const filtered = CATEGORY_GROUPS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subcategories.some((s) => s.name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {CATEGORY_GROUPS.length} categories ·{' '}
            {CATEGORY_GROUPS.reduce((s, c) => s + c.subcategories.length, 0)} subcategories
          </p>
        </div>
        <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Category
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories…"
        className="w-full max-w-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  Delete
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.subcategories.map((sub) => (
                <span
                  key={sub.slug}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs"
                >
                  {sub.name}
                </span>
              ))}
              <button className="px-2 py-1 border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 rounded-md text-xs hover:border-brand-500 hover:text-brand-500 transition-colors">
                + Add
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              {cat.subcategories.length} subcategories
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
