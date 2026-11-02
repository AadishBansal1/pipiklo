'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Camera,
  Upload,
  Loader2,
  X,
  Sparkles,
  FileSpreadsheet,
  Download,
  Table2,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Wand2,
  Info,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui'
import { DataGrid, type GridData } from '@/components/data-grid'
import { compressImage, uid, cn } from '@/lib/utils'
import type { ExtractionResult, Row } from '@/lib/types'
import { exportXlsx, exportCsv, openInGoogleSheets, copyTsv } from '@/lib/export'

type ImgStatus = 'pending' | 'scanning' | 'done' | 'error'
interface ScanImage {
  id: string
  name: string
  dataUrl: string
  status: ImgStatus
  note?: string
  error?: string
  found?: number
}

const LEAD_PRESET = ['Name', 'Phone', 'Email', 'Company', 'Notes']

export default function ScanPage() {
  const [images, setImages] = useState<ScanImage[]>([])
  const [targetCols, setTargetCols] = useState<string[]>([])
  const [colDraft, setColDraft] = useState('')
  const [hint, setHint] = useState('')
  const [data, setData] = useState<GridData>({ columns: [], rows: [] })
  const [scanning, setScanning] = useState(false)
  const [demo, setDemo] = useState(false)
  const [banner, setBanner] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const cameraRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(async (files: FileList | null) => {
    if (!files || !files.length) return
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const prepared = await Promise.all(
      arr.map(async (f) => ({
        id: uid(),
        name: f.name || 'photo.jpg',
        dataUrl: await compressImage(f),
        status: 'pending' as ImgStatus,
      })),
    )
    setImages((prev) => [...prev, ...prepared])
  }, [])

  function removeImage(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id))
  }

  function addTargetCol() {
    const v = colDraft.trim()
    if (!v || targetCols.includes(v)) {
      setColDraft('')
      return
    }
    setTargetCols((prev) => [...prev, v])
    setColDraft('')
  }

  /** Merge a single extraction result into the running grid. */
  function mergeResult(res: ExtractionResult) {
    setData((prev) => {
      const columns = [...prev.columns]
      for (const c of res.columns) if (!columns.includes(c)) columns.push(c)
      const rows: Row[] = [
        ...prev.rows,
        ...res.rows.map((r) => {
          const full: Row = {}
          for (const c of columns) full[c] = r[c] ?? ''
          return full
        }),
      ]
      // Backfill any newly-added columns onto older rows.
      for (const row of rows) for (const c of columns) if (!(c in row)) row[c] = ''
      return { columns, rows }
    })
  }

  async function scanOne(img: ScanImage): Promise<void> {
    setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, status: 'scanning', error: undefined } : i)))
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          image: img.dataUrl,
          columns: targetCols.length ? targetCols : undefined,
          hint: hint.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)
      const result = json as ExtractionResult
      mergeResult(result)
      if (result.demo) {
        setDemo(true)
        setBanner(result.note ?? null)
      }
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id
            ? { ...i, status: 'done', found: result.rows.length, note: result.note }
            : i,
        ),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read image'
      setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, status: 'error', error: message } : i)))
    }
  }

  async function scanAll() {
    const pending = images.filter((i) => i.status === 'pending' || i.status === 'error')
    if (!pending.length || scanning) return
    setScanning(true)
    for (const img of pending) {
      // Re-read latest copy in case state changed.
      await scanOne(img)
    }
    setScanning(false)
  }

  const pendingCount = images.filter((i) => i.status === 'pending' || i.status === 'error').length
  const hasData = data.rows.length > 0 || data.columns.length > 0

  async function handleCopy() {
    const ok = await copyTsv(data.columns, data.rows)
    setCopied(ok)
    setTimeout(() => setCopied(false), 1800)
  }

  async function handleSheets() {
    const copiedOk = await openInGoogleSheets(data.columns, data.rows)
    setBanner(
      copiedOk
        ? 'Your data was copied — in the new Google Sheet tab, click a cell and press Ctrl/Cmd + V to paste.'
        : 'A new Google Sheet opened. Use "Copy for Sheets" then paste it in.',
    )
  }

  return (
    <div className="min-h-screen">
      <SiteHeader cta={false} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Scanner</h1>
          <p className="mt-1 text-muted-foreground">
            Add photos of your forms, scan them, review the data, then export.
          </p>
        </div>

        {demo && banner && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-foreground/90">{banner}</p>
          </div>
        )}
        {!demo && banner && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
            <Info size={18} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-foreground/90">{banner}</p>
            <button className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => setBanner(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* ─── Left: capture & controls ─────────────────────── */}
          <div className="space-y-5">
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                void addFiles(e.dataTransfer.files)
              }}
              className="rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary/50"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Camera size={24} />
              </div>
              <p className="mt-3 text-sm font-medium">Add your forms</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Snap a photo or drop images here
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button size="sm" onClick={() => cameraRef.current?.click()}>
                  <Camera size={16} />
                  Take photo
                </Button>
                <Button size="sm" variant="outline" onClick={() => uploadRef.current?.click()}>
                  <Upload size={16} />
                  Upload
                </Button>
              </div>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                hidden
                onChange={(e) => {
                  void addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  void addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>

            {/* Image queue */}
            {images.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </p>
                  <button
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => setImages([])}
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <button
                        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeImage(img.id)}
                        aria-label="Remove image"
                      >
                        <X size={13} />
                      </button>
                      <StatusPill img={img} />
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" onClick={scanAll} disabled={scanning || pendingCount === 0}>
                  {scanning ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Scanning…
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      {pendingCount > 0 ? `Scan ${pendingCount} ${pendingCount === 1 ? 'image' : 'images'}` : 'All scanned'}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Column targeting */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Wand2 size={16} className="text-primary" />
                <p className="text-sm font-semibold">Columns to capture</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Optional. Tell the AI exactly which fields you want — or leave empty to auto-detect.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {targetCols.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                  >
                    {c}
                    <button
                      onClick={() => setTargetCols((prev) => prev.filter((x) => x !== c))}
                      aria-label={`Remove ${c}`}
                      className="text-accent-foreground/60 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={colDraft}
                  onChange={(e) => setColDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetCol())}
                  placeholder="e.g. Name"
                  className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" variant="secondary" onClick={addTargetCol}>
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => setTargetCols(LEAD_PRESET)}
                >
                  Use lead preset
                </button>
                {targetCols.length > 0 && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setTargetCols([])}
                  >
                    Clear (auto-detect)
                  </button>
                )}
              </div>
            </div>

            {/* Hint */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <label htmlFor="hint" className="text-sm font-semibold">
                What is this document? <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                id="hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="e.g. Trade-show lead sheet"
                className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* ─── Right: results ───────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Extracted data</h2>
              {hasData && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => exportXlsx(data.columns, data.rows)}>
                    <FileSpreadsheet size={15} />
                    Excel
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportCsv(data.columns, data.rows)}>
                    <Download size={15} />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSheets}>
                    <Table2 size={15} />
                    Google Sheets
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCopy}>
                    {copied ? <Check size={15} className="text-primary" /> : <Copy size={15} />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              )}
            </div>

            {hasData ? (
              <>
                <DataGrid data={data} onChange={setData} />
                <div className="mt-4 flex justify-end">
                  <button
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => setData({ columns: [], rows: [] })}
                  >
                    <Trash2 size={13} />
                    Clear table
                  </button>
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatusPill({ img }: { img: ScanImage }) {
  const map: Record<ImgStatus, { label: string; cls: string; icon?: React.ReactNode }> = {
    pending: { label: 'Ready', cls: 'bg-black/60 text-white' },
    scanning: {
      label: 'Reading',
      cls: 'bg-primary text-primary-foreground',
      icon: <Loader2 size={11} className="animate-spin" />,
    },
    done: {
      label: img.found != null ? `+${img.found}` : 'Done',
      cls: 'bg-emerald-600 text-white',
      icon: <Check size={11} />,
    },
    error: {
      label: 'Failed',
      cls: 'bg-destructive text-destructive-foreground',
      icon: <AlertTriangle size={11} />,
    },
  }
  const s = map[img.status]
  return (
    <span
      className={cn(
        'absolute bottom-1 left-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
        s.cls,
      )}
      title={img.error || img.note || s.label}
    >
      {s.icon}
      {s.label}
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 p-8 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Table2 size={26} />
      </div>
      <h3 className="mt-4 font-semibold">Your spreadsheet will appear here</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Add one or more photos on the left and hit <span className="font-medium text-foreground">Scan</span>.
        Every entry we read becomes an editable row you can fix and export.
      </p>
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <RotateCcw size={13} />
        Tip: straight-on, well-lit photos read best
      </div>
    </div>
  )
}
