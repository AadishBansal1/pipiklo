import { NextRequest, NextResponse } from 'next/server'
import type { ExtractRequest, ExtractionResult, Row } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

function parseDataUrl(dataUrl: string): { mediaType: string; data: string } | null {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl)
  if (!m) return null
  return { mediaType: m[1], data: m[2] }
}

function buildPrompt(columns?: string[], hint?: string): string {
  const parts: string[] = [
    'You are a meticulous data-entry engine. You are given a photo of a document — it may be a printed form, a handwritten sign-up or attendance sheet, a lead-capture list, a business card, an invoice, or a table.',
    'Extract EVERY distinct record you can read into structured rows. One physical row / one person / one entry = one record. Do not merge separate entries.',
    'Read handwriting as carefully as possible. If a value is unreadable or absent, use an empty string — never invent data.',
    'Normalise obvious formatting: trim whitespace, keep phone numbers and emails as written, capitalise names sensibly.',
  ]
  if (columns && columns.length) {
    parts.push(
      `Map every record onto EXACTLY these columns (keep this order, keep these exact names): ${JSON.stringify(
        columns,
      )}. If the document has extra useful fields not in this list, you may add them as additional columns at the end.`,
    )
  } else {
    parts.push(
      'Infer the most useful set of columns from the document (for a lead/contact sheet that is typically: Name, Phone, Email, Company, Notes). Use clear, short, Title Case column names.',
    )
  }
  if (hint) parts.push(`Context about this document from the user: "${hint}".`)
  parts.push(
    'Respond with ONLY a single JSON object, no prose, no markdown fences, of the shape: {"columns": string[], "rows": Array<Record<string,string>>}. Every row object must use only keys that appear in "columns". Every value must be a string.',
  )
  return parts.join('\n\n')
}

function coerceResult(raw: unknown, requested?: string[]): ExtractionResult {
  const obj = (raw ?? {}) as { columns?: unknown; rows?: unknown }
  let columns = Array.isArray(obj.columns)
    ? obj.columns.map((c) => String(c)).filter(Boolean)
    : []
  let rows: Row[] = Array.isArray(obj.rows)
    ? (obj.rows as unknown[])
        .filter((r) => r && typeof r === 'object')
        .map((r) => {
          const out: Row = {}
          for (const [k, v] of Object.entries(r as Record<string, unknown>)) {
            out[String(k)] = v == null ? '' : String(v)
          }
          return out
        })
    : []

  // If the model ignored the schema, union keys actually present in rows.
  if (!columns.length) {
    const seen = new Set<string>()
    for (const r of rows) for (const k of Object.keys(r)) seen.add(k)
    columns = requested && requested.length ? [...requested] : [...seen]
    // Append any extra keys the model produced but weren't requested.
    for (const k of seen) if (!columns.includes(k)) columns.push(k)
  }

  // Drop entirely empty rows.
  rows = rows.filter((r) => columns.some((c) => (r[c] ?? '').trim() !== ''))
  return { columns, rows }
}

function extractJson(text: string): unknown {
  // Prefer a fenced block if present, else the first {...} span.
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) throw new Error('No JSON found')
  return JSON.parse(candidate.slice(start, end + 1))
}

function demoResult(columns?: string[]): ExtractionResult {
  const cols = columns && columns.length ? columns : ['Name', 'Phone', 'Email', 'Company', 'Notes']
  const sample = [
    { name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya.sharma@gmail.com', company: 'Lotus Realty', notes: 'Wants a callback Monday' },
    { name: 'David Chen', phone: '+1 415 555 0142', email: 'dchen@brightworks.io', company: 'Brightworks', notes: 'Interested in annual plan' },
    { name: 'Aisha Khan', phone: '+971 50 123 4567', email: 'aisha.k@outlook.com', company: 'Dune Media', notes: 'Follow up after Expo' },
    { name: 'Marco Rossi', phone: '+39 333 112 4455', email: 'marco@rossi-design.it', company: 'Rossi Design', notes: 'Met at booth 12' },
  ]
  // Map each requested column to the closest sample field by keyword, so a
  // custom column set still shows believable demo values instead of blanks.
  function pick(col: string, s: (typeof sample)[number], idx: number): string {
    const k = col.toLowerCase()
    if (/(name|contact|person|full)/.test(k)) return s.name
    if (/(phone|mobile|cell|tel|number|whatsapp)/.test(k)) return s.phone
    if (/(email|e-mail|mail)/.test(k)) return s.email
    if (/(company|org|business|firm|employer)/.test(k)) return s.company
    if (/(note|comment|remark|message|detail)/.test(k)) return s.notes
    const pool = [s.name, s.company, s.email, s.phone, s.notes]
    return pool[idx % pool.length]
  }
  const rows: Row[] = sample.map((s) => {
    const r: Row = {}
    cols.forEach((c, i) => (r[c] = pick(c, s, i)))
    return r
  })
  return {
    columns: cols,
    rows,
    demo: true,
    note: 'Demo mode — no ANTHROPIC_API_KEY is set, so this is sample data. Add a key to extract from your real photos.',
  }
}

export async function POST(req: NextRequest) {
  let body: ExtractRequest
  try {
    body = (await req.json()) as ExtractRequest
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { image, columns, hint } = body
  if (!image || typeof image !== 'string') {
    return NextResponse.json({ error: 'Missing image' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(demoResult(columns))
  }

  const parsed = parseDataUrl(image)
  if (!parsed) {
    return NextResponse.json(
      { error: 'Image must be a base64 data URL (image/*).' },
      { status: 400 },
    )
  }

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest'

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: parsed.mediaType,
                  data: parsed.data,
                },
              },
              { type: 'text', text: buildPrompt(columns, hint) },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return NextResponse.json(
        { error: `AI provider error (${res.status}).`, detail: detail.slice(0, 500) },
        { status: 502 },
      )
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = (data.content ?? [])
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text as string)
      .join('\n')
      .trim()

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI.' }, { status: 502 })
    }

    const result = coerceResult(extractJson(text), columns)
    if (!result.rows.length) {
      result.note = 'No readable records were found in this image. Try a sharper, well-lit photo taken straight-on.'
    }
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Could not read the document.', detail: message },
      { status: 500 },
    )
  }
}
