import Link from 'next/link'
import {
  Camera,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  ScanLine,
  Table2,
  Download,
  ShieldCheck,
  Users,
  Receipt,
  ClipboardList,
  PenLine,
  Zap,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { Badge, Button, Logo } from '@/components/ui'

const steps = [
  {
    icon: Camera,
    title: 'Snap or upload',
    body: 'Point your camera at a form, sign-up sheet, business card or lead list — or drop in photos you already have.',
  },
  {
    icon: Sparkles,
    title: 'AI reads & sorts',
    body: 'Advanced vision reads printed and handwritten text, understands the layout, and sorts every entry into clean columns.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Export anywhere',
    body: 'Review the table, fix anything in a tap, then export to Excel, CSV or open straight in Google Sheets.',
  },
]

const features = [
  {
    icon: PenLine,
    title: 'Reads handwriting',
    body: 'Not just OCR — it understands messy handwriting, multi-column forms and crossed-out edits.',
  },
  {
    icon: Table2,
    title: 'Structured, not just text',
    body: 'Every record becomes a real row with named columns, so your data is usable the moment it lands.',
  },
  {
    icon: ScanLine,
    title: 'Batch scanning',
    body: 'Capture a whole stack of pages in one session. Rows merge into a single, deduplicated sheet.',
  },
  {
    icon: Table2,
    title: 'Your columns, your way',
    body: 'Define the exact columns you want (Name, Phone, Company…) and the AI maps every form to them.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'Images are processed for extraction and never stored on our servers. Your data stays yours.',
  },
  {
    icon: Zap,
    title: 'Seconds, not hours',
    body: 'Replace an afternoon of manual typing with a few taps — with fewer mistakes.',
  },
]

const useCases = [
  { icon: Users, label: 'Event & expo leads' },
  { icon: ClipboardList, label: 'Sign-up & attendance sheets' },
  { icon: Receipt, label: 'Invoices & receipts' },
  { icon: PenLine, label: 'Survey & feedback forms' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-radial-fade opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="animate-fade-in">
              <Sparkles size={13} className="text-primary" />
              AI form &amp; sheet scanner
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Turn any paper form into a{' '}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                perfect spreadsheet
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              Snap a photo of any form, register or lead list. Snap2Sheet reads every entry,
              sorts the data into clean columns, and hands you an Excel file or Google Sheet —
              in seconds.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/scan">
                <Button size="lg" className="w-full sm:w-auto">
                  <Camera size={18} />
                  Scan a form now
                </Button>
              </Link>
              <Link href="#how">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See how it works
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No sign-up to try · Works on mobile &amp; desktop · Export free
            </p>
          </div>

          {/* Mock preview */}
          <div className="mx-auto mt-16 max-w-4xl animate-scale-in">
            <div className="rounded-2xl border border-border bg-card/80 p-2 shadow-2xl shadow-primary/5 backdrop-blur">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-muted-foreground">Snap2Sheet — extracted data</span>
              </div>
              <PreviewTable />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Three taps from photo to data"
          subtitle="No training, no templates to set up. Point, scan, export."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="absolute right-5 top-5 text-5xl font-extrabold text-secondary">
                {i + 1}
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <s.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Why it's better"
            title="An advanced scanner, not a photocopier"
            subtitle="Most scanner apps give you a flat image or a wall of text. Snap2Sheet gives you organised, editable data."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use cases + exports ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Built for the real world"
              title="Perfect for capturing leads on the spot"
              subtitle="Anywhere people fill things in on paper, Snap2Sheet turns it into a database."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {useCases.map((u) => (
                <li
                  key={u.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <u.icon size={17} />
                  </span>
                  {u.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Export to what you already use</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              One tap, universally compatible. No lock-in.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: FileSpreadsheet, title: 'Microsoft Excel (.xlsx)', body: 'A real, formatted workbook — not just a rename.' },
                { icon: Table2, title: 'Google Sheets', body: 'Opens a fresh sheet with your data ready to paste.' },
                { icon: Download, title: 'CSV', body: 'Import into any CRM, database or tool you like.' },
              ].map((e) => (
                <div key={e.title} className="flex items-start gap-4 rounded-xl bg-card/70 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <e.icon size={20} />
                  </span>
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary px-6 py-16 text-center text-primary-foreground shadow-xl">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">
              Stop typing. Start scanning.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-primary-foreground/90">
              Turn your next stack of forms into a clean spreadsheet in under a minute.
            </p>
            <Link href="/scan" className="mt-8 inline-block">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Camera size={18} />
                Open the scanner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo className="text-base" />
          <p>Snap a photo. Get a spreadsheet. © {new Date().getFullYear()} Snap2Sheet.</p>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function PreviewTable() {
  const cols = ['Name', 'Phone', 'Email', 'Company']
  const rows = [
    ['Priya Sharma', '+91 98765 43210', 'priya.sharma@gmail.com', 'Lotus Realty'],
    ['David Chen', '+1 415 555 0142', 'dchen@brightworks.io', 'Brightworks'],
    ['Aisha Khan', '+971 50 123 4567', 'aisha.k@outlook.com', 'Dune Media'],
    ['Marco Rossi', '+39 333 112 4455', 'marco@rossi-design.it', 'Rossi Design'],
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-foreground/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
