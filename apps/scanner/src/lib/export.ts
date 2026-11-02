'use client'

import type { Row } from './types'

/** Order each row's values to match the column list, filling blanks. */
function toMatrix(columns: string[], rows: Row[]): string[][] {
  const header = [...columns]
  const body = rows.map((r) => columns.map((c) => (r[c] ?? '').toString()))
  return [header, ...body]
}

function timestamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/** Export a real .xlsx workbook using SheetJS (loaded lazily). */
export async function exportXlsx(columns: string[], rows: Row[], name = 'snap2sheet') {
  const XLSX = await import('xlsx')
  const matrix = toMatrix(columns, rows)
  const ws = XLSX.utils.aoa_to_sheet(matrix)

  // Auto-size columns to the longest cell (nice-to-have polish).
  ws['!cols'] = columns.map((c) => {
    const longest = Math.max(
      c.length,
      ...rows.map((r) => (r[c] ?? '').toString().length),
    )
    return { wch: Math.min(Math.max(longest + 2, 10), 48) }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  triggerDownload(
    new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    `${name}_${timestamp()}.xlsx`,
  )
}

function toCsv(columns: string[], rows: Row[]): string {
  const esc = (v: string) => {
    const s = (v ?? '').toString()
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [columns.map(esc).join(',')]
  for (const r of rows) lines.push(columns.map((c) => esc(r[c] ?? '')).join(','))
  return lines.join('\r\n')
}

export function exportCsv(columns: string[], rows: Row[], name = 'snap2sheet') {
  // Prepend a UTF-8 BOM so Excel opens accented characters correctly.
  const blob = new Blob(['﻿' + toCsv(columns, rows)], {
    type: 'text/csv;charset=utf-8',
  })
  triggerDownload(blob, `${name}_${timestamp()}.csv`)
}

function toTsv(columns: string[], rows: Row[]): string {
  const clean = (v: string) => (v ?? '').toString().replace(/[\t\n\r]+/g, ' ')
  const lines = [columns.map(clean).join('\t')]
  for (const r of rows) lines.push(columns.map((c) => clean(r[c] ?? '')).join('\t'))
  return lines.join('\n')
}

/**
 * "Open in Google Sheets": copy the data as TSV to the clipboard and open a new
 * blank sheet, so the user just presses Ctrl/Cmd+V. This needs no Google API,
 * OAuth or server — it works for everyone immediately.
 * Returns true if the clipboard copy succeeded.
 */
export async function openInGoogleSheets(columns: string[], rows: Row[]): Promise<boolean> {
  const tsv = toTsv(columns, rows)
  let copied = false
  try {
    await navigator.clipboard.writeText(tsv)
    copied = true
  } catch {
    copied = false
  }
  window.open('https://sheets.new', '_blank', 'noopener,noreferrer')
  return copied
}

export async function copyTsv(columns: string[], rows: Row[]): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(toTsv(columns, rows))
    return true
  } catch {
    return false
  }
}
