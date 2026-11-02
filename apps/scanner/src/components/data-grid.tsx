'use client'

import { useRef, useState } from 'react'
import { Plus, Trash2, X, Check } from 'lucide-react'
import type { Row } from '@/lib/types'
import { Button } from './ui'
import { cn } from '@/lib/utils'

export interface GridData {
  columns: string[]
  rows: Row[]
}

interface DataGridProps {
  data: GridData
  onChange: (next: GridData) => void
}

export function DataGrid({ data, onChange }: DataGridProps) {
  const { columns, rows } = data
  const [editingCol, setEditingCol] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const renameRef = useRef<HTMLInputElement>(null)

  function setCell(rowIdx: number, col: string, value: string) {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [col]: value } : r))
    onChange({ columns, rows: next })
  }

  function addRow() {
    const blank: Row = {}
    for (const c of columns) blank[c] = ''
    onChange({ columns, rows: [...rows, blank] })
  }

  function deleteRow(idx: number) {
    onChange({ columns, rows: rows.filter((_, i) => i !== idx) })
  }

  function addColumn() {
    let base = 'Column'
    let name = base
    let n = 1
    while (columns.includes(name)) name = `${base} ${++n}`
    onChange({
      columns: [...columns, name],
      rows: rows.map((r) => ({ ...r, [name]: '' })),
    })
    setEditingCol(columns.length)
    setDraft(name)
    requestAnimationFrame(() => renameRef.current?.select())
  }

  function deleteColumn(idx: number) {
    const col = columns[idx]
    onChange({
      columns: columns.filter((_, i) => i !== idx),
      rows: rows.map((r) => {
        const { [col]: _drop, ...rest } = r
        return rest
      }),
    })
  }

  function commitRename(idx: number) {
    const name = draft.trim()
    setEditingCol(null)
    const old = columns[idx]
    if (!name || name === old) return
    let unique = name
    let n = 1
    while (columns.some((c, i) => i !== idx && c === unique)) unique = `${name} ${++n}`
    onChange({
      columns: columns.map((c, i) => (i === idx ? unique : c)),
      rows: rows.map((r) => {
        const { [old]: val, ...rest } = r
        return { ...rest, [unique]: val ?? '' }
      }),
    })
  }

  return (
    <div className="flex flex-col">
      <div className="scroll-thin overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-secondary/80 backdrop-blur">
            <tr>
              <th className="w-10 border-b border-r border-border px-2 py-2 text-xs font-medium text-muted-foreground">
                #
              </th>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="group min-w-[9rem] border-b border-r border-border px-2 py-2 text-left"
                >
                  {editingCol === i ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={renameRef}
                        value={draft}
                        autoFocus
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commitRename(i)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename(i)
                          if (e.key === 'Escape') setEditingCol(null)
                        }}
                        className="w-full rounded border border-input bg-background px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
                      />
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => commitRename(i)}
                        aria-label="Confirm name"
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <button
                        className="truncate font-semibold hover:text-primary"
                        title="Click to rename"
                        onClick={() => {
                          setEditingCol(i)
                          setDraft(col)
                          requestAnimationFrame(() => renameRef.current?.select())
                        }}
                      >
                        {col}
                      </button>
                      <button
                        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        onClick={() => deleteColumn(i)}
                        aria-label={`Delete column ${col}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </th>
              ))}
              <th className="w-10 border-b border-border px-1 py-2">
                <button
                  className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-background hover:text-primary"
                  onClick={addColumn}
                  aria-label="Add column"
                  title="Add column"
                >
                  <Plus size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="group/row odd:bg-background even:bg-secondary/20">
                <td className="border-b border-r border-border px-2 py-1 text-center align-middle text-xs text-muted-foreground">
                  <span className="group-hover/row:hidden">{r + 1}</span>
                  <button
                    className="mx-auto hidden text-muted-foreground hover:text-destructive group-hover/row:block"
                    onClick={() => deleteRow(r)}
                    aria-label={`Delete row ${r + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
                {columns.map((col, c) => (
                  <td key={c} className="border-b border-r border-border p-0">
                    <input
                      value={row[col] ?? ''}
                      onChange={(e) => setCell(r, col, e.target.value)}
                      className={cn(
                        'w-full bg-transparent px-2.5 py-2 outline-none transition-colors',
                        'focus:bg-primary/5 focus:ring-2 focus:ring-inset focus:ring-ring',
                      )}
                    />
                  </td>
                ))}
                <td className="border-b border-border" />
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No rows yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus size={15} />
          Add row
        </Button>
        <p className="text-xs text-muted-foreground">
          {rows.length} {rows.length === 1 ? 'row' : 'rows'} · {columns.length}{' '}
          {columns.length === 1 ? 'column' : 'columns'} · click a header to rename
        </p>
      </div>
    </div>
  )
}
