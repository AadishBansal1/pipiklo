'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="customer" redirectTo="/login">
      <div className="flex flex-1">
        <DashboardSidebar variant="customer" />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
