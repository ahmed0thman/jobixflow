import { useMemo, useState } from 'react'
import { Card } from '../ui/Card'
import { DataTable, type Column } from '../ui/DataTable'
import { AdvancedFilter } from '../ui/AdvancedFilter'
import { NameLinks } from '../ui/NameLinks'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { jobFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatCurrency } from '../../lib/utils'
import type { Job } from '../../types'

interface DispatcherReportRow {
  name: string
  companies: string[]
  technicians: string[]
  totalJobs: number
  completed: number
  cancelled: number
  revenue: number
  avgJobValue: number
}

interface DispatcherReportTableProps {
  jobs: Job[]
  /** Platform sees dispatchers across every company; a company admin sees only its own. */
  showCompanyColumn?: boolean
  jobsHref: (dispatcherName: string) => string
  technicianHref: (technicianName: string) => string
  companyHref?: (companyName: string) => string
}

/**
 * The Reports → Dispatchers grain: one row per dispatcher, aggregated from the
 * jobs they took in. Consumed by both the platform and company Reports screens.
 */
export function DispatcherReportTable({
  jobs,
  showCompanyColumn = false,
  jobsHref,
  technicianHref,
  companyHref,
}: DispatcherReportTableProps) {
  const [datePreset, setDatePreset] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [sortKey, setSortKey] = useState('revenue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fields = useMemo(() => inferFilterFields(jobs, jobFilterSchema), [jobs])

  const rows = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    const scoped = jobs.filter((j) => {
      if (from && j.createdAt < from) return false
      if (to && j.createdAt > to) return false
      return matchesAutoFilters(j, fields, filterValues)
    })

    const byDispatcher = new Map<string, Job[]>()
    for (const job of scoped) {
      if (!job.dispatcherName) continue
      const bucket = byDispatcher.get(job.dispatcherName)
      if (bucket) bucket.push(job)
      else byDispatcher.set(job.dispatcherName, [job])
    }

    return [...byDispatcher.entries()].map(([name, dispatched]) => {
      const completed = dispatched.filter((j) => j.status === 'completed')
      const revenue = completed.reduce((s, j) => s + (j.finalPrice ?? 0), 0)
      return {
        name,
        companies: unique(dispatched.map((j) => j.companyName)),
        technicians: unique(dispatched.map((j) => j.technicianName)),
        totalJobs: dispatched.length,
        completed: completed.length,
        cancelled: dispatched.filter((j) => j.status === 'cancelled').length,
        revenue,
        avgJobValue: completed.length > 0 ? revenue / completed.length : 0,
      } satisfies DispatcherReportRow
    })
  }, [jobs, fields, filterValues, datePreset, customFrom, customTo])

  const sortedRows = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      if (sortKey === 'name') {
        return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      const av = (a as unknown as Record<string, number>)[sortKey]
      const bv = (b as unknown as Record<string, number>)[sortKey]
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return copy
  }, [rows, sortKey, sortDir])

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          totalJobs: acc.totalJobs + r.totalJobs,
          completed: acc.completed + r.completed,
          cancelled: acc.cancelled + r.cancelled,
          revenue: acc.revenue + r.revenue,
        }),
        { totalJobs: 0, completed: 0, cancelled: 0, revenue: 0 },
      ),
    [rows],
  )

  function onSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function clearAll() {
    setFilterValues({})
    setDatePreset('all')
    setCustomFrom('')
    setCustomTo('')
  }

  const columns: Column<DispatcherReportRow>[] = [
    {
      key: 'name',
      header: 'Dispatcher',
      sortable: true,
      render: (r) => <NameLinks names={[r.name]} href={jobsHref} noun="dispatchers" />,
    },
    ...(showCompanyColumn
      ? [{
          key: 'companies',
          header: 'Company',
          render: (r: DispatcherReportRow) => (
            <NameLinks names={r.companies} href={companyHref ?? (() => '#')} noun="companies" />
          ),
        } satisfies Column<DispatcherReportRow>]
      : []),
    {
      key: 'technicians',
      header: 'Technicians',
      render: (r) => <NameLinks names={r.technicians} href={technicianHref} noun="technicians" />,
    },
    { key: 'totalJobs', header: 'Jobs Taken', sortable: true, render: (r) => <span className="tabular-nums">{r.totalJobs}</span> },
    { key: 'completed', header: 'Completed', sortable: true, render: (r) => <span className="tabular-nums text-green-700">{r.completed}</span> },
    { key: 'cancelled', header: 'Cancelled', sortable: true, render: (r) => <span className="tabular-nums text-red-600">{r.cancelled}</span> },
    { key: 'revenue', header: 'Revenue', sortable: true, render: (r) => <span className="tabular-nums">{formatCurrency(r.revenue)}</span> },
    { key: 'avgJobValue', header: 'Avg Job Value', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.avgJobValue)}</span> },
  ]

  return (
    <Card>
      <AdvancedFilter
        fields={datePreset === 'custom' ? [{ key: 'customRange', label: 'Date Range', type: 'dateRange' }] : []}
        advancedFields={fields}
        values={{ ...filterValues, customRange: { from: customFrom, to: customTo } }}
        onFieldChange={(key, value) => {
          if (key === 'customRange') {
            const range = (value as { from?: string; to?: string } | undefined) ?? {}
            setCustomFrom(range.from ?? '')
            setCustomTo(range.to ?? '')
          } else {
            setFilterValues((v) => ({ ...v, [key]: value }))
          }
        }}
        quickFilters={DATE_RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label }))}
        activeQuickFilter={datePreset}
        onQuickFilterChange={setDatePreset}
        onClearAll={clearAll}
      />
      <DataTable
        columns={columns}
        rows={sortedRows}
        keyField={(r) => r.name}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        status={sortedRows.length === 0 ? 'no-results' : 'ready'}
        onClearFilters={clearAll}
        footerRow={
          sortedRows.length > 0 ? (
            <>
              <td className="px-4 py-3 text-sm">Total</td>
              {showCompanyColumn && <td className="px-4 py-3" />}
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-sm tabular-nums">{totals.totalJobs}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-green-700">{totals.completed}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-red-600">{totals.cancelled}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.revenue)}</td>
              <td className="px-4 py-3" />
            </>
          ) : undefined
        }
      />
    </Card>
  )
}

function unique(values: (string | undefined)[]): string[] {
  return [...new Set(values.filter((v): v is string => !!v))].sort()
}
