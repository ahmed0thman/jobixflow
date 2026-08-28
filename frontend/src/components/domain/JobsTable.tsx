import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../ui/Card'
import { DataTable, type Column } from '../ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../ui/AdvancedFilter'
import { StatusPill, UrgencyPill, OriginBadge, FinancialFlagPill } from '../ui/Pill'
import { ActionsMenu, type ActionItem } from '../ui/ActionsMenu'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { jobFilterSchema } from '../../lib/filterSchemas'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { Job } from '../../types'
import { JOB_STATUS_LABELS } from '../../types'

const PAGE_SIZE = 10

interface JobsTableProps {
  jobs: Job[]
  getActions: (job: Job) => ActionItem[]
  searchPlaceholder?: string
  /** Hide the Company column for a role already scoped to a single company — every row is that company's job. */
  showCompanyColumn?: boolean
}

/**
 * The single shared job table used across every role's Jobs / Job History screen.
 * Columns, search, quick filters and pagination are identical everywhere — only the
 * row-action set (passed in via `getActions`) and, for company-scoped roles, the
 * Company column change per role's permissions.
 */
export function JobsTable({ jobs, getActions, searchPlaceholder = 'Search by job ID, company, customer, or phone...', showCompanyColumn = true }: JobsTableProps) {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [originFilter, setOriginFilter] = useState('')
  const [quickFilter, setQuickFilter] = useState('all')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [page, setPage] = useState(1)

  // Status and origin stay as their own inline controls, so they are excluded here
  // rather than appearing a second time inside the all-fields panel.
  const autoFields = useMemo(
    () => inferFilterFields(jobs, { ...jobFilterSchema, exclude: [...(jobFilterSchema.exclude ?? []), 'status', 'origin'] }),
    [jobs],
  )

  // Arriving from a "Dispatcher: X" / "Technician: X" link elsewhere in the app
  // pre-applies that filter, and it shows up as a removable token like any other.
  useEffect(() => {
    const seed: Record<string, unknown> = {}
    searchParams.forEach((value, key) => { seed[key] = value })
    if (Object.keys(seed).length === 0) return
    setFilterValues((prev) => ({ ...prev, ...seed }))
    setPage(1)
  }, [searchParams])

  const quickFiltered = useMemo(() => {
    switch (quickFilter) {
      case 'now':
        return jobs.filter((j) => j.urgency === 'now' && !['completed', 'cancelled', 'archived'].includes(j.status))
      case 'attention':
        return jobs.filter((j) => ['company_refused', 'technician_refused'].includes(j.status))
      case 'cancelled':
        return jobs.filter((j) => j.status === 'cancelled')
      case 'flagged':
        return jobs.filter((j) => j.financialFlag !== 'none')
      default:
        return jobs
    }
  }, [jobs, quickFilter])

  const filtered = useMemo(() => {
    return quickFiltered.filter((j) => {
      if (statusFilter && j.status !== statusFilter) return false
      if (originFilter && j.origin !== originFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !j.displayId.toLowerCase().includes(q) &&
          !j.customerName.toLowerCase().includes(q) &&
          !j.customerPhone.includes(q) &&
          !j.companyName?.toLowerCase().includes(q)
        ) return false
      }
      return matchesAutoFilters(j, autoFields, filterValues)
    })
  }, [quickFiltered, statusFilter, originFilter, search, autoFields, filterValues])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: Object.entries(JOB_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { key: 'origin', label: 'Origin', type: 'select', options: [{ value: 'platform', label: 'Platform-sourced' }, { value: 'company', label: 'Company-sourced' }] },
  ]

  const columns: Column<Job>[] = [
    {
      key: 'id',
      header: 'Job',
      sortable: true,
      render: (j) => (
        <div>
          <p className="font-medium text-slate-900">{j.displayId}</p>
          <p className="text-xs text-slate-500 mb-1">{formatDate(j.createdAt)}</p>
          <OriginBadge origin={j.origin} />
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (j) => (
        <div>
          <p className="text-slate-700">{j.customerName}</p>
          <p className="text-xs text-slate-400">{j.customerPhone}</p>
        </div>
      ),
    },
    ...(showCompanyColumn
      ? [{ key: 'company', header: 'Company', render: (j: Job) => j.companyName ? <span className="text-slate-700">{j.companyName}</span> : <span className="text-slate-300 text-xs">Unassigned</span> } satisfies Column<Job>]
      : []),
    { key: 'type', header: 'Type', render: (j) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{j.itemType}</span> },
    { key: 'technician', header: 'Technician', render: (j) => <span className="text-slate-600">{j.technicianName ?? <span className="text-slate-300">Unassigned</span>}</span> },
    { key: 'urgency', header: 'Urgency', render: (j) => <UrgencyPill urgency={j.urgency} /> },
    { key: 'status', header: 'Status', render: (j) => <StatusPill status={j.status} /> },
    { key: 'amount', header: 'Amount', render: (j) => <span className="tabular-nums text-slate-800">{formatCurrency(j.finalPrice ?? j.estimatePrice)}</span> },
    { key: 'flag', header: 'Financial Flag', render: (j) => <FinancialFlagPill job={j} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (j) => {
        const items = getActions(j)
        return items.length > 0 ? <ActionsMenu items={items} /> : null
      },
    },
  ]

  function clearAll() {
    setStatusFilter('')
    setOriginFilter('')
    setFilterValues({})
  }

  return (
    <Card>
      <AdvancedFilter
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder={searchPlaceholder}
        fields={fields}
        advancedFields={autoFields}
        values={{ ...filterValues, status: statusFilter, origin: originFilter }}
        onFieldChange={(key, value) => {
          if (key === 'status') setStatusFilter((value as string) ?? '')
          else if (key === 'origin') setOriginFilter((value as string) ?? '')
          else setFilterValues((v) => ({ ...v, [key]: value }))
          setPage(1)
        }}
        quickFilters={[
          { key: 'all', label: 'All Jobs', count: jobs.length },
          { key: 'now', label: 'Urgent (Now)', count: jobs.filter((j) => j.urgency === 'now' && !['completed', 'cancelled', 'archived'].includes(j.status)).length },
          { key: 'attention', label: 'Needs Attention', count: jobs.filter((j) => ['company_refused', 'technician_refused'].includes(j.status)).length },
          { key: 'cancelled', label: 'Cancelled', count: jobs.filter((j) => j.status === 'cancelled').length },
          { key: 'flagged', label: 'Refund / Dispute', count: jobs.filter((j) => j.financialFlag !== 'none').length },
        ]}
        activeQuickFilter={quickFilter}
        onQuickFilterChange={(k) => { setQuickFilter(k); setPage(1) }}
        onClearAll={clearAll}
      />
      <DataTable
        columns={columns}
        rows={pageRows}
        keyField={(j) => j.id}
        status={filtered.length === 0 ? 'no-results' : 'ready'}
        onClearFilters={() => { clearAll(); setSearch(''); setQuickFilter('all') }}
        pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
      />
    </Card>
  )
}
