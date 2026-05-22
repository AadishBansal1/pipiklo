'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

interface Props {
  currentCategory?: string
  currentSubcategory?: string
}

export function MobileFilterDrawer({ currentCategory, currentSubcategory }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger — only visible below lg */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </button>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-72 h-full bg-background shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="font-bold text-sm">Filters</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <FilterSidebar
                currentCategory={currentCategory}
                currentSubcategory={currentSubcategory}
              />
            </div>
            <div className="p-4 border-t shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
