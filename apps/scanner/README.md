# Snap2Sheet

**Snap a photo of any form, sign-up sheet, or lead list — get clean, structured
data in Excel or Google Sheets.**

An "advanced Google scanner": instead of a flat image or a wall of OCR text,
Snap2Sheet uses Claude vision to _understand_ the document, extract every
record, sort it into named columns, and let you export in one tap.

## Features

- 📸 **Snap or upload** — camera capture on mobile, drag-and-drop on desktop,
  batch multiple pages at once.
- 🧠 **AI extraction** — reads printed **and handwritten** text, understands
  multi-column layouts, turns each entry into a row.
- 🧩 **Your columns** — define exactly which fields to capture (Name, Phone,
  Email, Company…) or let it auto-detect.
- ✏️ **Editable grid** — fix any cell, rename/add/remove columns, add/delete
  rows before exporting.
- 📤 **Export anywhere** — real `.xlsx` (via SheetJS), `.csv`, or open straight
  in **Google Sheets** (copies your data so you just paste).
- 🔒 **Private** — images are sent for extraction only and never stored
  server-side.

## Tech

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- SheetJS (`xlsx`) for Excel export — loaded lazily on the client
- Claude vision via the Anthropic Messages API (server route `/api/extract`)

## Running locally

From the monorepo root:

```bash
pnpm install
pnpm --filter @pipiklo/scanner dev
# → http://localhost:3100
```

### Configuration

Copy `.env.example` to `.env.local` and set your key:

```bash
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-latest   # any vision-capable model you have
```

**Demo mode:** with no `ANTHROPIC_API_KEY`, the `/api/extract` route returns
sample rows so the entire UI (scanning flow, editing, all exports) is usable
end-to-end. Add a key to extract from your real photos.

## How extraction works

1. The client downsizes each image (longest edge ≤ 1600px, JPEG) for a fast,
   small upload.
2. `POST /api/extract` sends the image to Claude with a strict instruction to
   return `{ "columns": string[], "rows": Record<string,string>[] }`.
3. The server tolerantly parses the JSON, drops empty rows, and unions columns.
4. The client merges every image's result into one deduplicated-by-append grid.

## Project layout

```
src/
  app/
    layout.tsx           Root layout, fonts, theme bootstrap
    page.tsx             Marketing landing page
    scan/page.tsx        The scanner app (capture → scan → edit → export)
    api/extract/route.ts Vision extraction endpoint (Node runtime)
  components/
    ui.tsx               Button, Logo, Badge
    site-header.tsx      Sticky header + theme toggle
    data-grid.tsx        Editable spreadsheet grid
  lib/
    types.ts             Shared types
    utils.ts             cn(), image compression helpers
    export.ts            Excel / CSV / Google Sheets / clipboard export
```
