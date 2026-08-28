import type { ReactNode } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface QuickFilter {
  key: string
  label: string
  count?: number
}

export interface AppliedToken {
  key: string
  label: string
  onRemove: () => void
}

interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  quickFilters?: QuickFilter[]
  activeQuickFilter?: string
  onQuickFilterChange?: (key: string) => void
  /** Per-column filter controls (selects, date range) */
  filters?: ReactNode
  appliedTokens?: AppliedToken[]
  onClearAll?: () => void
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  quickFilters,
  activeQuickFilter,
  onQuickFilterChange,
  filters,
  appliedTokens,
  onClearAll,
}: FilterBarProps) {
  return (
    <div className="border-b border-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3">
        {onSearchChange && (
          <div className="relative flex-1 min-w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>
        )}
        {filters && (
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            {filters}
          </div>
        )}
        {onClearAll && appliedTokens && appliedTokens.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-blue-600 hover:text-blue-700 font-medium ml-auto">
            Clear all
          </button>
        )}
      </div>

      {quickFilters && quickFilters.length > 0 && (
        <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
          {quickFilters.map((qf) => (
            <button
              key={qf.key}
              onClick={() => onQuickFilterChange?.(qf.key)}
              className={cn(
                'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
                activeQuickFilter === qf.key
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
              )}
            >
              {qf.label}
              {qf.count !== undefined && <span className="opacity-70"> ({qf.count})</span>}
            </button>
          ))}
        </div>
      )}

      {appliedTokens && appliedTokens.length > 0 && (
        <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
          {appliedTokens.map((t) => (
            <span
              key={t.key}
              className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 rounded-full pl-2.5 pr-1.5 py-1"
            >
              {t.label}
              <button onClick={t.onRemove} className="hover:text-slate-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm rounded-lg border border-slate-300 pl-2.5 pr-7 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
