import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export function StatCard({ title, value, change, changePositive, icon: Icon, iconColor = 'text-brand-500', className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className={cn('p-2 rounded-lg bg-muted', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {change && (
        <p className={cn('text-xs font-medium', changePositive ? 'text-green-600' : 'text-red-500')}>
          {changePositive ? '↑' : '↓'} {change} from last month
        </p>
      )}
    </div>
  )
}
