import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { DataTable, type Column } from '../ui/DataTable'
import { AdvancedFilter } from '../ui/AdvancedFilter'
import { NameLinks } from '../ui/NameLinks'
import { StatusPill, OriginBadge, FinancialFlagPill } from '../ui/Pill'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { jobFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Job } from '../../types'

const PAGE_SIZE = 15

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  payment_link: 'Payment Link',
  unpaid: 'Unpaid',
}

interface JobsReportTableProps {
  jobs: Job[]
  showCompanyColumn?: boolean
  dispatcherHref: (dispatcherName: string) => string
  technicianHref: (technicianName: string) => string
  jobHref: (job: Job) => string
}

/**
 * The Reports → Jobs grain: one row per job, the most detailed view, carrying
 * the Dispatcher and Technician columns so a report can be read down to the
 * individual job that produced a number.
 */
export function JobsReportTable({
  jobs,
  showCompanyColumn = false,
  dispatcherHref,
  technicianHref,
  jobHref,
}: JobsReportTableProps) {
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const fields = useMemo(() => inferFilterFields(jobs, jobFilterSchema), [jobs])

  const filtered = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    return jobs.filter((j) => {
      if (from && j.createdAt < from) return false
      if (to && j.createdAt > to) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !j.displayId.toLowerCase().includes(q) &&
          !j.customerName.toLowerCase().includes(q) &&
          !(j.dispatcherName ?? '').toLowerCase().includes(q) &&
          !(j.technicianName ?? '').toLowerCase().includes(q)
        ) return false
      }
      return matchesAutoFilters(j, fields, filterValues)
    })
  }, [jobs, fields, filterValues, datePreset, customFrom, customTo, search])

  const sortedRows = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      if (sortKey === 'amount') {
        const av = a.finalPrice ?? a.estimatePrice
        const bv = b.finalPrice ?? b.estimatePrice
        return sortDir === 'asc' ? av - bv : bv - av
      }
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? '')
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? '')
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return copy
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE))
  const pageRows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalRevenue = useMemo(
    () => filtered.reduce((sum, j) => sum + (j.status === 'completed' ? (j.finalPrice ?? 0) : 0), 0),
    [filtered],
  )

  function onSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  function clearAll() {
    setFilterValues({})
    setDatePreset('all')
    setCustomFrom('')
    setCustomTo('')
    setPage(1)
  }

  const columns: Column<Job>[] = [
    {
      key: 'displayId',
      header: 'Job',
      sortable: true,
      render: (j) => (
        <div>
          <Link to={jobHref(j)} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">{j.displayId}</Link>
          <p className="text-xs text-slate-500 mb-1">{formatDate(j.createdAt)}</p>
          <OriginBadge origin={j.origin} />
        </div>
      ),
    },
    ...(showCompanyColumn
      ? [{ key: 'companyName', header: 'Company', render: (j: Job) => <span className="text-slate-700">{j.companyName}</span> } satisfies Column<Job>]
      : []),
    { key: 'customerName', header: 'Customer', render: (j) => <span className="text-slate-700">{j.customerName}</span> },
    {
      key: 'dispatcherName',
      header: 'Dispatcher',
      render: (j) => <NameLinks names={j.dispatcherName ? [j.dispatcherName] : []} href={dispatcherHref} noun="dispatchers" />,
    },
    {
      key: 'technicianName',
      header: 'Technician',
      render: (j) => <NameLinks names={j.technicianName ? [j.technicianName] : []} href={technicianHref} noun="technicians" emptyLabel="Unassigned" />,
    },
    { key: 'serviceCategory', header: 'Service', render: (j) => <span className="text-slate-600">{j.serviceCategory}</span> },
    { key: 'status', header: 'Status', render: (j) => <StatusPill status={j.status} /> },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (j) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">{PAYMENT_METHOD_LABELS[j.paymentMethod]}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (j) => (
        <span className="tabular-nums text-slate-800">
          {formatCurrency(j.finalPrice ?? j.estimatePrice)}
          {j.finalPrice === undefined && <span className="text-slate-400 text-xs ml-1">est.</span>}
        </span>
      ),
    },
    { key: 'flag', header: 'Financial Flag', render: (j) => <FinancialFlagPill job={j} /> },
  ]

  return (
    <Card>
      <AdvancedFilter
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Search by job ID, customer, dispatcher, or technician..."
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
          setPage(1)
        }}
        quickFilters={DATE_RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label }))}
        activeQuickFilter={datePreset}
        onQuickFilterChange={(k) => { setDatePreset(k); setPage(1) }}
        onClearAll={clearAll}
      />
      <DataTable
        columns={columns}
        rows={pageRows}
        keyField={(j) => j.id}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        status={sortedRows.length === 0 ? 'no-results' : 'ready'}
        onClearFilters={() => { clearAll(); setSearch('') }}
        pagination={{ page, totalPages, totalItems: sortedRows.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        footerRow={
          sortedRows.length > 0 ? (
            <>
              <td className="px-4 py-3 text-sm">Total · {filtered.length} jobs</td>
              {showCompanyColumn && <td className="px-4 py-3" />}
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-xs text-slate-500">completed revenue</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totalRevenue)}</td>
              <td className="px-4 py-3" />
            </>
          ) : undefined
        }
      />
    </Card>
  )
}
