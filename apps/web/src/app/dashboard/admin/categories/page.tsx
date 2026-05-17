'use client'

import { useState, useRef, useEffect } from 'react'
import { CATEGORY_GROUPS } from '@/lib/categories'
import {
  Plus, Search, Pencil, Trash2, X, AlertTriangle,
  ChevronDown, ChevronUp, Tag, FolderOpen
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Subcategory { slug: string; name: string }
interface Category {
  slug: string
  name: string
  icon: string
  description: string
  subcategories: Subcategory[]
}

const INITIAL: Category[] = CATEGORY_GROUPS.map((g) => ({
  slug: g.slug,
  name: g.name,
  icon: g.icon ?? '📁',
  description: g.description ?? '',
  subcategories: g.subcategories.map((s) => ({ slug: s.slug, name: s.name })),
}))

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/* ── Modal wrapper ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  // Category modals
  const [addCatOpen, setAddCatOpen] = useState(false)
  const [editCat, setEditCat] = useState<Category | null>(null)
  const [deleteCat, setDeleteCat] = useState<Category | null>(null)

  // Subcategory modals
  const [addSubFor, setAddSubFor] = useState<Category | null>(null)
  const [editSub, setEditSub] = useState<{ cat: Category; sub: Subcategory } | null>(null)
  const [deleteSub, setDeleteSub] = useState<{ cat: Category; sub: Subcategory } | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formIcon, setFormIcon] = useState('📁')
  const [formDesc, setFormDesc] = useState('')
  const [formSubName, setFormSubName] = useState('')

  const filtered = categories.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subcategories.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  )

  // ── Category CRUD ──
  function openAddCat() { setFormName(''); setFormIcon('📁'); setFormDesc(''); setAddCatOpen(true) }
  function openEditCat(cat: Category) { setFormName(cat.name); setFormIcon(cat.icon); setFormDesc(cat.description); setEditCat(cat) }

  function saveAddCat() {
    if (!formName.trim()) return
    const slug = toSlug(formName)
    if (categories.find((c) => c.slug === slug)) return
    setCategories((prev) => [...prev, { slug, name: formName.trim(), icon: formIcon, description: formDesc.trim(), subcategories: [] }])
    setAddCatOpen(false)
  }
  function saveEditCat() {
    if (!editCat || !formName.trim()) return
    setCategories((prev) => prev.map((c) => c.slug === editCat.slug ? { ...c, name: formName.trim(), icon: formIcon, description: formDesc.trim() } : c))
    setEditCat(null)
  }
  function confirmDeleteCat() {
    if (!deleteCat) return
    setCategories((prev) => prev.filter((c) => c.slug !== deleteCat.slug))
    setDeleteCat(null)
  }

  // ── Subcategory CRUD ──
  function openAddSub(cat: Category) { setFormSubName(''); setAddSubFor(cat) }
  function openEditSub(cat: Category, sub: Subcategory) { setFormSubName(sub.name); setEditSub({ cat, sub }) }

  function saveAddSub() {
    if (!addSubFor || !formSubName.trim()) return
    const slug = toSlug(formSubName)
    setCategories((prev) => prev.map((c) => c.slug === addSubFor.slug
      ? { ...c, subcategories: [...c.subcategories, { slug, name: formSubName.trim() }] }
      : c
    ))
    setAddSubFor(null)
  }
  function saveEditSub() {
    if (!editSub || !formSubName.trim()) return
    const newSlug = toSlug(formSubName)
    setCategories((prev) => prev.map((c) => c.slug === editSub.cat.slug
      ? { ...c, subcategories: c.subcategories.map((s) => s.slug === editSub.sub.slug ? { slug: newSlug, name: formSubName.trim() } : s) }
      : c
    ))
    setEditSub(null)
  }
  function confirmDeleteSub() {
    if (!deleteSub) return
    setCategories((prev) => prev.map((c) => c.slug === deleteSub.cat.slug
      ? { ...c, subcategories: c.subcategories.filter((s) => s.slug !== deleteSub.sub.slug) }
      : c
    ))
    setDeleteSub(null)
  }

  const totalSubs = categories.reduce((s, c) => s + c.subcategories.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {categories.length} categories · {totalSubs} subcategories
          </p>
        </div>
        <button
          onClick={openAddCat}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories…" className="pl-9" />
      </div>

      {/* Category list */}
      <div className="space-y-3">
        {filtered.map((cat) => {
          const isExpanded = expanded === cat.slug
          return (
            <div key={cat.slug} className="border rounded-xl overflow-hidden">
              {/* Category row */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                <button
                  onClick={() => setExpanded(isExpanded ? null : cat.slug)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">/{cat.slug} · {cat.subcategories.length} subcategories</p>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditCat(cat)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Edit category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteCat(cat)}
                    className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors text-muted-foreground"
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <div className="px-4 py-3 bg-background">
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mb-3 italic">{cat.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.slug}
                        className="group flex items-center gap-1 pl-2.5 pr-1 py-1 bg-muted rounded-full text-xs font-medium"
                      >
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        {sub.name}
                        <button
                          onClick={() => openEditSub(cat, sub)}
                          className="ml-1 p-0.5 rounded-full hover:bg-background transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                          title="Edit"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                        </button>
                        <button
                          onClick={() => setDeleteSub({ cat, sub })}
                          className="p-0.5 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors text-muted-foreground opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add subcategory button */}
                    <button
                      onClick={() => openAddSub(cat)}
                      className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-muted-foreground/30 rounded-full text-xs text-muted-foreground hover:border-brand-500 hover:text-brand-600 transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No categories found.</p>
        </div>
      )}

      {/* ── Add Category Modal ── */}
      {addCatOpen && (
        <Modal title="Add Category" onClose={() => setAddCatOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Icon (emoji)</label>
              <Input value={formIcon} onChange={(e) => setFormIcon(e.target.value)} placeholder="📁" className="w-20 text-center text-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Category Name *</label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Motion Graphics" autoFocus />
              {formName && <p className="text-xs text-muted-foreground mt-1">Slug: /{toSlug(formName)}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Description</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2}
                placeholder="Brief description…"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAddCatOpen(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={saveAddCat} disabled={!formName.trim()} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">Add Category</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Category Modal ── */}
      {editCat && (
        <Modal title="Edit Category" onClose={() => setEditCat(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Icon (emoji)</label>
              <Input value={formIcon} onChange={(e) => setFormIcon(e.target.value)} placeholder="📁" className="w-20 text-center text-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Category Name *</label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">Description</label>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditCat(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={saveEditCat} disabled={!formName.trim()} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Category Confirm ── */}
      {deleteCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Delete "{deleteCat.name}"?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">This will remove the category and all {deleteCat.subcategories.length} subcategories. This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteCat(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={confirmDeleteCat} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Subcategory Modal ── */}
      {addSubFor && (
        <Modal title={`Add Subcategory to "${addSubFor.name}"`} onClose={() => setAddSubFor(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Subcategory Name *</label>
              <Input value={formSubName} onChange={(e) => setFormSubName(e.target.value)} placeholder="e.g. Logo Reveal" autoFocus />
              {formSubName && <p className="text-xs text-muted-foreground mt-1">Slug: /{toSlug(formSubName)}</p>}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setAddSubFor(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={saveAddSub} disabled={!formSubName.trim()} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">Add Subcategory</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Subcategory Modal ── */}
      {editSub && (
        <Modal title="Edit Subcategory" onClose={() => setEditSub(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Subcategory Name *</label>
              <Input value={formSubName} onChange={(e) => setFormSubName(e.target.value)} autoFocus />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditSub(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={saveEditSub} disabled={!formSubName.trim()} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Subcategory Confirm ── */}
      {deleteSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Delete "{deleteSub.sub.name}"?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">This subcategory will be permanently removed.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteSub(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
              <button onClick={confirmDeleteSub} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
