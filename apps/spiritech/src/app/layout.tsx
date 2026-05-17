import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'SpiriTech — NCERT in 3D',
    template: '%s | SpiriTech',
  },
  description:
    'Explore NCERT textbook diagrams as interactive 3D models. Watch video explanations, practice previous year questions, and learn visually.',
  keywords: ['NCERT', '3D models', 'education', 'science', 'class 6', 'class 7', 'class 8', 'interactive learning'],
  authors: [{ name: 'SpiriTech' }],
  creator: 'SpiriTech',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
