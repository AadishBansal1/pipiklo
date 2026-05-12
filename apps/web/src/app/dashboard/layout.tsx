import { Header } from '@/components/layout/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">{children}</div>
    </>
  )
}
