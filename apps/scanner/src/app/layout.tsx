import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Snap2Sheet — Turn any form into a spreadsheet',
  description:
    'Snap a photo of any form, sign-up sheet or lead list. Snap2Sheet reads it with AI, sorts the data into clean columns, and exports to Excel or Google Sheets in one tap.',
  applicationName: 'Snap2Sheet',
  keywords: [
    'form scanner',
    'OCR to excel',
    'photo to spreadsheet',
    'lead capture',
    'google sheets scanner',
  ],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Respect the OS theme without a flash of the wrong one */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=window.matchMedia('(prefers-color-scheme: dark)');if(m.matches)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
