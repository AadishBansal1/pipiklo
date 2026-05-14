import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Pipiklo — Unlimited Creative Assets',
    template: '%s | Pipiklo',
  },
  description:
    'Download unlimited creative assets — templates, videos, audio, graphics, fonts, 3D models, and more. Free to start. AI-powered tools included.',
  keywords: ['templates', 'creative assets', 'stock video', 'graphics', 'fonts', 'audio', 'AI tools', 'design'],
  authors: [{ name: 'Pipiklo' }],
  creator: 'Pipiklo',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pipiklo.com',
    siteName: 'Pipiklo',
    title: 'Pipiklo — Unlimited Creative Assets',
    description: 'Download unlimited creative assets with lifetime commercial license.',
    images: [{ url: 'https://picsum.photos/1200/630', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pipiklo — Unlimited Creative Assets',
    description: 'Download unlimited creative assets with lifetime commercial license.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SupabaseProvider>
              {children}
              <Toaster />
            </SupabaseProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
