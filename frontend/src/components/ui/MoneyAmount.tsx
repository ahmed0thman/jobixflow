import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { formatCurrency } from '../../lib/utils'

export function MoneyAmount({
  amount,
  positiveLabel,
  negativeLabel,
  size = 'md',
}: {
  amount: number
  positiveLabel?: string
  negativeLabel?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const isPositive = amount >= 0
  const label = isPositive ? positiveLabel : negativeLabel
  const sizeClass = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0',
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        )}
      >
        {isPositive ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
      </span>
      <span className={cn('font-semibold tabular-nums', sizeClass, isPositive ? 'text-green-700' : 'text-red-700')}>
        {formatCurrency(amount)}
      </span>
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </div>
  )
}

export function FeeAmount({ amount, kind }: { amount: number; kind: 'percent' | 'flat' }) {
  return (
    <span className="tabular-nums text-slate-700">
      {kind === 'percent' ? `${amount}%` : formatCurrency(amount)}
      <span className="text-slate-400 text-xs ml-1">({kind === 'percent' ? 'of gross' : 'flat'})</span>
    </span>
  )
}
