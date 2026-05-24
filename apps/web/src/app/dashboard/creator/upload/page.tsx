'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { Upload, Image as ImageIcon, FileText, CheckCircle, X, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/store/app-store'

const STEPS = ['Basic Info', 'Files & Preview', 'Tags & Tools', 'Review']

export default function CreatorUploadPage() {
  const { user, submitItem } = useAppStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    tagInput: '',
    compatibleTools: [] as string[],
    licenseType: 'standard',
  })
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addTag() {
    const tag = form.tagInput.trim().toLowerCase()
    if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
      update('tags', [...form.tags, tag])
      update('tagInput', '')
    }
  }

  function removeTag(tag: string) {
    update('tags', form.tags.filter((t) => t !== tag))
  }

  async function handleSubmit() {
    if (!user?.id) return
    setUploading(true)
    try {
      await new Promise((r) => setTimeout(r, 800))

      const thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/400/300`

      // Write to Supabase first
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.from('items').insert({
        title: form.title || 'Untitled Asset',
        description: form.description || 'No description provided.',
        category: form.category || 'graphics',
        subcategory: form.subcategory || null,
        tags: form.tags,
        thumbnail_url: thumbnailUrl,
        preview_urls: [thumbnailUrl],
        is_free: false,
        creator_id: user.id,
        status: 'pending',
        downloads: 0,
        views: 0,
        rating: 0,
        compatible_tools: form.compatibleTools,
      })

      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }

      // Also update local store for immediate feedback
      submitItem({
        title: form.title || 'Untitled Asset',
        description: form.description || 'No description provided.',
        category: form.category || 'graphics',
        subcategory: form.subcategory || 'General',
        tags: form.tags,
        thumbnailUrl,
        isFree: false,
        tokenCost: 1,
        creatorId: user.id,
        creatorName: user.name ?? 'Creator',
      })

      setSubmitted(true)
      toast({ title: '🎉 Submitted for review!', description: 'Our team will review your submission within 24–48 hours.' })
    } catch (err) {
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const selectedGroup = CATEGORY_GROUPS.find((g) => g.slug === form.category)

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Submitted for Review!</h2>
            <p className="text-muted-foreground mb-6">Your item has been submitted. Our team will review it within 24–48 hours. You'll receive a notification once it's approved.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="brand" onClick={() => { setSubmitted(false); setStep(0); setForm({ title: '', description: '', category: '', subcategory: '', tags: [], tagInput: '', compatibleTools: [], licenseType: 'standard' }) }}>
                Upload Another
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/creator/items'}>
                View My Items
              </Button>
            </div>
          </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Upload New Item</h1>
            <p className="text-muted-foreground text-sm">Submit your creative asset for review and earn from downloads</p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-100 text-brand-700 border-2 border-brand-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-brand-700' : 'text-muted-foreground'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-brand-500' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="border rounded-2xl p-6">
            {/* Step 1: Basic Info */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-4">Basic Information</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Modern Business Card Template" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description *</label>
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="Describe your item — what it includes, who it's for, and what makes it great..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category *</label>
                    <select
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={form.category}
                      onChange={(e) => { update('category', e.target.value); update('subcategory', '') }}
                    >
                      <option value="">Select category</option>
                      {CATEGORY_GROUPS.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
                    </select>
                  </div>
                  {selectedGroup && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Subcategory *</label>
                      <select
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={form.subcategory}
                        onChange={(e) => update('subcategory', e.target.value)}
                      >
                        <option value="">Select subcategory</option>
                        {selectedGroup.subcategories.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Files */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-4">Files & Preview</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Source File (ZIP) *</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                      dragOver ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-muted-foreground/30 hover:border-brand-400'
                    }`}
                  >
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">Drag & drop your files here</p>
                    <p className="text-sm text-muted-foreground mb-3">ZIP, PSD, AEP, AI, TTF, MP3, WAV, etc.</p>
                    <Button variant="outline" size="sm">Browse Files</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Preview Images (up to 5) *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="border-2 border-dashed rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-colors">
                        <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">{i === 0 ? 'Main preview' : `Preview ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tags */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-4">Tags & Compatible Tools</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags (up to 10)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={form.tagInput}
                      onChange={(e) => update('tagInput', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Type a tag and press Enter"
                    />
                    <Button variant="outline" onClick={addTag} size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                        {tag}
                        <button onClick={() => removeTag(tag)}><X className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Compatible Tools</label>
                  <div className="flex flex-wrap gap-2">
                    {['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'After Effects', 'Premiere Pro', 'Blender', 'Canva', 'Final Cut Pro', 'DaVinci Resolve', 'Sketch'].map((tool) => (
                      <button
                        key={tool}
                        onClick={() => {
                          const tools = form.compatibleTools.includes(tool)
                            ? form.compatibleTools.filter((t) => t !== tool)
                            : [...form.compatibleTools, tool]
                          update('compatibleTools', tools)
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                          form.compatibleTools.includes(tool) ? 'bg-brand-500 text-white border-brand-500' : 'hover:border-brand-400'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">License Type</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { value: 'standard', label: 'Standard License', desc: 'For single end-use projects' },
                      { value: 'extended', label: 'Extended License', desc: 'For multiple or unlimited use' },
                    ].map((lt) => (
                      <button
                        key={lt.value}
                        onClick={() => update('licenseType', lt.value)}
                        className={`text-left p-4 rounded-xl border-2 transition-colors ${
                          form.licenseType === lt.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'hover:border-brand-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{lt.label}</p>
                        <p className="text-xs text-muted-foreground">{lt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg mb-4">Review & Submit</h2>
                <div className="bg-muted/30 rounded-xl p-5 space-y-3">
                  {[
                    { label: 'Title', value: form.title || '—' },
                    { label: 'Category', value: form.category || '—' },
                    { label: 'Subcategory', value: form.subcategory || '—' },
                    { label: 'Tags', value: form.tags.length > 0 ? form.tags.join(', ') : '—' },
                    { label: 'Compatible Tools', value: form.compatibleTools.length > 0 ? form.compatibleTools.join(', ') : '—' },
                    { label: 'License', value: form.licenseType === 'standard' ? 'Standard License' : 'Extended License' },
                  ].map((f) => (
                    <div key={f.label} className="flex gap-4 text-sm">
                      <span className="font-medium w-32 shrink-0 text-muted-foreground">{f.label}</span>
                      <span className="flex-1">{f.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-brand-700 dark:text-brand-400 mb-1">Submission Guidelines</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Items will be reviewed within 24–48 hours</li>
                    <li>• Ensure all preview images clearly show the item</li>
                    <li>• Source files must be complete and properly organized</li>
                    <li>• By submitting, you agree to the Pipiklo Creator Terms</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                ← Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button variant="brand" onClick={() => setStep((s) => s + 1)}>
                  Next →
                </Button>
              ) : (
                <Button variant="brand" onClick={handleSubmit} disabled={uploading}>
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Submit for Review
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
  )
}

