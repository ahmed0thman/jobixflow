import { useEffect, useRef, useState } from 'react'
import { Bookmark, Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Modal } from './Modal'
import { Button } from './Button'

export type FilterFieldType = 'select' | 'dateRange' | 'text' | 'numberRange'

export interface FilterFieldConfig {
  key: string
  label: string
  type: FilterFieldType
  options?: { value: string; label: string }[]
  placeholder?: string
  /** For numberRange fields — prefixes each input, e.g. "$" */
  prefix?: string
}

export interface QuickFilterConfig {
  key: string
  label: string
  count?: number
}

export interface SavedView {
  name: string
  values: Record<string, unknown>
}

interface AdvancedFilterProps {
  search?: string
  onSearchChange?: (v: string) => void
  searchPlaceholder?: string
  fields: FilterFieldConfig[]
  /** Numeric/condition filters shown behind a "More Filters" toggle, for high-column-count tables */
  advancedFields?: FilterFieldConfig[]
  values: Record<string, unknown>
  onFieldChange: (key: string, value: unknown) => void
  quickFilters?: QuickFilterConfig[]
  activeQuickFilter?: string
  onQuickFilterChange?: (key: string) => void
  onClearAll: () => void
  savedViews?: SavedView[]
  onApplyView?: (view: SavedView) => void
  onSaveView?: (name: string) => void
  /** Names of saved views the user created themselves — only these get a delete affordance; shipped defaults are permanent. */
  deletableViewNames?: string[]
  onDeleteView?: (name: string) => void
}

function tokensFor(fields: FilterFieldConfig[], values: Record<string, unknown>, onFieldChange: (key: string, value: unknown) => void) {
  return fields.flatMap((f) => {
    const v = values[f.key]
    if (f.type === 'dateRange') {
      const range = v as { from?: string; to?: string } | undefined
      if (!range || (!range.from && !range.to)) return []
      return [{
        key: f.key,
        label: `${f.label}: ${range.from || '…'} → ${range.to || '…'}`,
        onRemove: () => onFieldChange(f.key, undefined),
      }]
    }
    if (f.type === 'numberRange') {
      const range = v as { min?: string; max?: string } | undefined
      if (!range || (!range.min && !range.max)) return []
      const prefix = f.prefix ?? ''
      return [{
        key: f.key,
        label: `${f.label}: ${range.min ? prefix + range.min : 'any'} – ${range.max ? prefix + range.max : 'any'}`,
        onRemove: () => onFieldChange(f.key, undefined),
      }]
    }
    if (!v) return []
    if (f.type === 'select') {
      const opt = f.options?.find((o) => o.value === v)
      return [{ key: f.key, label: `${f.label}: ${opt?.label ?? String(v)}`, onRemove: () => onFieldChange(f.key, '') }]
    }
    return [{ key: f.key, label: `${f.label}: ${String(v)}`, onRemove: () => onFieldChange(f.key, '') }]
  })
}

export function AdvancedFilter({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  fields,
  advancedFields = [],
  values,
  onFieldChange,
  quickFilters,
  activeQuickFilter,
  onQuickFilterChange,
  onClearAll,
  savedViews,
  onApplyView,
  onSaveView,
  deletableViewNames,
  onDeleteView,
}: AdvancedFilterProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const tokens = tokensFor(fields, values, onFieldChange)
  const advancedTokens = tokensFor(advancedFields, values, onFieldChange)
  const allTokens = [...tokens, ...advancedTokens]

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

        {fields.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            {fields.map((f) => (
              <FilterField key={f.key} field={f} value={values[f.key]} onChange={(v) => onFieldChange(f.key, v)} />
            ))}
          </div>
        )}

        {advancedFields.length > 0 && (
          <button
            onClick={() => setFiltersOpen(true)}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 border transition-colors',
              advancedTokens.length > 0
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50',
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            All Filters
            {advancedTokens.length > 0 && <span className="opacity-70">({advancedTokens.length})</span>}
          </button>
        )}

        {savedViews && onApplyView && onSaveView && (
          <SavedViewsMenu
            views={savedViews}
            onApply={onApplyView}
            onSave={onSaveView}
            deletableNames={deletableViewNames}
            onDelete={onDeleteView}
          />
        )}

        {allTokens.length > 0 && (
          <button onClick={onClearAll} className="text-xs text-blue-600 hover:text-blue-700 font-medium ml-auto">
            Clear all
          </button>
        )}
      </div>

      {advancedFields.length > 0 && (
        <AdvancedFilterModal
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          fields={advancedFields}
          values={values}
          onFieldChange={onFieldChange}
          onClearAll={onClearAll}
          activeCount={advancedTokens.length}
        />
      )}

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

      {allTokens.length > 0 && (
        <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
          {allTokens.map((t) => (
            <span key={t.key} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 rounded-full pl-2.5 pr-1.5 py-1">
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

const UNGROUPED_TITLE = 'General'

/**
 * Splits a field's label on the " · " joiner the inference engine uses for
 * nested paths (`vehicle.vin` → "Vehicle · VIN"), so the group carries the
 * parent segment ("Vehicle") and the field itself shows only its own name
 * ("VIN") once nested under that heading. A label with no separator — every
 * flat, top-level field, plus every hand-declared filter a page supplies
 * directly — falls into one shared "General" group.
 */
function groupFields(fields: FilterFieldConfig[]): { title: string; fields: FilterFieldConfig[] }[] {
  const groups = new Map<string, FilterFieldConfig[]>()
  for (const f of fields) {
    const idx = f.label.lastIndexOf(' · ')
    const title = idx === -1 ? UNGROUPED_TITLE : f.label.slice(0, idx)
    const bucket = groups.get(title)
    if (bucket) bucket.push(f)
    else groups.set(title, [f])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === UNGROUPED_TITLE ? -1 : b === UNGROUPED_TITLE ? 1 : a.localeCompare(b)))
    .map(([title, groupFields]) => ({ title, fields: groupFields }))
}

function fieldShortLabel(f: FilterFieldConfig): string {
  const idx = f.label.lastIndexOf(' · ')
  return idx === -1 ? f.label : f.label.slice(idx + 3)
}

/**
 * The full-model filter set, opened as its own modal rather than an inline
 * dropdown — a flat list long enough to need a "find a filter" box does not
 * belong inside a scrollable strip under the table. Fields are grouped by the
 * model section they belong to (Vehicle, Dispute Detail, ...), stacked
 * vertically with a divider between each group and a clear group heading, so
 * the structure of the data — not an arbitrary column grid — is what the
 * modal reads out.
 */
function AdvancedFilterModal({
  open,
  onClose,
  fields,
  values,
  onFieldChange,
  onClearAll,
  activeCount,
}: {
  open: boolean
  onClose: () => void
  fields: FilterFieldConfig[]
  values: Record<string, unknown>
  onFieldChange: (key: string, value: unknown) => void
  onClearAll: () => void
  activeCount: number
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const groups = groupFields(fields)
  const shownGroups = q
    ? groups
        .map((g) => ({ ...g, fields: g.fields.filter((f) => f.label.toLowerCase().includes(q)) }))
        .filter((g) => g.fields.length > 0)
    : groups

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="All Filters"
      subtitle={`${fields.length} filters across ${groups.length} ${groups.length === 1 ? 'category' : 'categories'}`}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClearAll} disabled={activeCount === 0}>
            Clear all{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
          <Button variant="primary" onClick={onClose}>Done</Button>
        </>
      }
    >
      {fields.length > 8 && (
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a filter..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
          />
        </div>
      )}

      {shownGroups.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">No filter matches “{query}”.</p>
      ) : (
        shownGroups.map((group, i) => (
          <div key={group.title} className={i > 0 ? 'pt-5 mt-5 border-t border-slate-200' : ''}>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">{group.title}</h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {group.fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1 truncate" title={f.label}>
                    {fieldShortLabel(f)}
                  </label>
                  <FilterField field={f} value={values[f.key]} onChange={(v) => onFieldChange(f.key, v)} block />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Modal>
  )
}

function FilterField({
  field,
  value,
  onChange,
  block = false,
}: {
  field: FilterFieldConfig
  value: unknown
  onChange: (v: unknown) => void
  /** Stretch to fill its container — the modal's grid cells want this; the inline bar does not. */
  block?: boolean
}) {
  if (field.type === 'select') {
    return (
      <select
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn('text-sm rounded-lg border border-slate-300 pl-2.5 pr-7 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40', block && 'w-full')}
      >
        <option value="">{field.placeholder ?? field.label}</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    )
  }
  if (field.type === 'dateRange') {
    const range = (value ?? {}) as { from?: string; to?: string }
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={range.from ?? ''}
          onChange={(e) => onChange({ ...range, from: e.target.value })}
          className="w-0 flex-1 min-w-0 text-sm rounded-lg border border-slate-300 px-2 py-1.5"
        />
        <span className="text-slate-400 text-xs shrink-0">to</span>
        <input
          type="date"
          value={range.to ?? ''}
          onChange={(e) => onChange({ ...range, to: e.target.value })}
          className="w-0 flex-1 min-w-0 text-sm rounded-lg border border-slate-300 px-2 py-1.5"
        />
      </div>
    )
  }
  if (field.type === 'numberRange') {
    const range = (value ?? {}) as { min?: string; max?: string }
    return (
      <div className="flex items-center gap-1.5">
        <div className="relative w-0 flex-1 min-w-0">
          {field.prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{field.prefix}</span>}
          <input
            type="number"
            value={range.min ?? ''}
            onChange={(e) => onChange({ ...range, min: e.target.value })}
            placeholder="Min"
            className={cn('w-full text-sm rounded-lg border border-slate-300 py-1.5 pr-2', field.prefix ? 'pl-5' : 'pl-2.5')}
          />
        </div>
        <span className="text-slate-400 text-xs shrink-0">–</span>
        <div className="relative w-0 flex-1 min-w-0">
          {field.prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{field.prefix}</span>}
          <input
            type="number"
            value={range.max ?? ''}
            onChange={(e) => onChange({ ...range, max: e.target.value })}
            placeholder="Max"
            className={cn('w-full text-sm rounded-lg border border-slate-300 py-1.5 pr-2', field.prefix ? 'pl-5' : 'pl-2.5')}
          />
        </div>
      </div>
    )
  }
  return (
    <input
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder ?? field.label}
      className={cn('text-sm rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-600', block && 'w-full')}
    />
  )
}

function SavedViewsMenu({
  views,
  onApply,
  onSave,
  deletableNames,
  onDelete,
}: {
  views: SavedView[]
  onApply: (v: SavedView) => void
  onSave: (name: string) => void
  deletableNames?: string[]
  onDelete?: (name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded-lg px-2.5 py-1.5 hover:bg-slate-50"
      >
        <Bookmark className="w-3.5 h-3.5" /> Saved Views
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
          {views.length === 0 && <p className="px-3 py-2 text-xs text-slate-400">No saved views yet</p>}
          {views.map((v) => {
            const deletable = deletableNames?.includes(v.name) && onDelete
            return (
              <div key={v.name} className="group flex items-center hover:bg-slate-50">
                <button
                  onClick={() => { onApply(v); setOpen(false) }}
                  className="flex-1 min-w-0 text-left px-3 py-2 text-sm text-slate-700 truncate"
                >
                  {v.name}
                </button>
                {deletable && (
                  <button
                    onClick={() => onDelete!(v.name)}
                    className="pr-2.5 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100"
                    aria-label={`Delete saved view "${v.name}"`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
          <div className="border-t border-slate-100 mt-1 pt-1 px-2 pb-2">
            <div className="flex items-center gap-1.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name this view..."
                className="flex-1 text-xs rounded-md border border-slate-200 px-2 py-1.5"
              />
              <button
                onClick={() => { if (name.trim()) { onSave(name.trim()); setName('') } }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-1.5"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
