import { cn } from '../../lib/utils'

export const DATE_RANGE_OPTIONS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'custom', label: 'Custom' },
] as const

export type DateRangeKey = (typeof DATE_RANGE_OPTIONS)[number]['key']

/** Returns ISO bounds for filtering any array of records by a `createdAt`-style field. */
export function getDateRangeBounds(range: DateRangeKey, customFrom: string, customTo: string): { from?: string; to?: string } {
  if (range === 'custom') {
    return { from: customFrom || undefined, to: customTo ? `${customTo}T23:59:59` : undefined }
  }
  const days = range === 'today' ? 1 : range === '7d' ? 7 : 30
  return { from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() }
}

interface DateRangeFilterProps {
  value: DateRangeKey
  onChange: (key: DateRangeKey) => void
  customFrom: string
  customTo: string
  onCustomFromChange: (v: string) => void
  onCustomToChange: (v: string) => void
}

export function DateRangeFilter({ value, onChange, customFrom, customTo, onCustomFromChange, onCustomToChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {DATE_RANGE_OPTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => onChange(r.key)}
            className={cn(
              'text-xs font-medium px-3 py-1.5 rounded-md',
              value === r.key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      {value === 'custom' && (
        <div className="flex items-center gap-2">
          <input type="date" value={customFrom} onChange={(e) => onCustomFromChange(e.target.value)} className="text-sm rounded-lg border border-slate-300 px-2.5 py-1.5" />
          <span className="text-slate-400 text-xs">to</span>
          <input type="date" value={customTo} onChange={(e) => onCustomToChange(e.target.value)} className="text-sm rounded-lg border border-slate-300 px-2.5 py-1.5" />
        </div>
      )}
    </div>
  )
}
