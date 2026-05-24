import type { Metadata } from 'next'

// Never index this page in search engines
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Access Denied',
}

export default function AdminCtrlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
