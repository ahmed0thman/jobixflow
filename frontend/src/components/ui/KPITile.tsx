import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Card } from './Card'

interface KPITileProps {
  icon: ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'violet'
  label: string
  value: string | number
  delta?: string
  deltaTone?: 'up' | 'down' | 'neutral'
}

const toneClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
}

export function KPITile({ icon, tone = 'blue', label, value, delta, deltaTone = 'up' }: KPITileProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', toneClasses[tone])}>
          {icon}
        </div>
        {delta && (
          <span
            className={cn(
              'text-xs font-medium',
              deltaTone === 'up' && 'text-green-600',
              deltaTone === 'down' && 'text-red-600',
              deltaTone === 'neutral' && 'text-slate-400',
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </Card>
  )
}
