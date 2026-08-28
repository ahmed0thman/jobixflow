import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { Tabs } from '../../components/ui/Tabs'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type SavedView } from '../../components/ui/AdvancedFilter'
import { usePersistentSavedViews } from '../../lib/useSavedViews'
import { NameLinks } from '../../components/ui/NameLinks'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { DispatcherReportTable } from '../../components/domain/DispatcherReportTable'
import { JobsReportTable } from '../../components/domain/JobsReportTable'
import { companies, jobs, transactions } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters, type AutoFilterField } from '../../lib/autoFilter'
import { jobFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatCurrency } from '../../lib/utils'
import type { Company, Job } from '../../types'

const dispatcherHref = (name: string) => `/platform-admin/jobs?dispatcherName=${encodeURIComponent(name)}`
const technicianHref = (name: string) => `/platform-admin/jobs?technicianName=${encodeURIComponent(name)}`
const companyHref = (name: string) => `/platform-admin/jobs?companyName=${encodeURIComponent(name)}`
const jobHref = (job: Job) => `/platform-admin/jobs/${job.id}`

export function Reports() {
  const { show } = useToast()
  const [tab, setTab] = useState('companies')

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Revenue and performance across every company, dispatcher, and job"
        action={
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={() => show('Report exported to CSV.', 'info')}>
            Export
          </Button>
        }
      />

      <Tabs
        tabs={[
          { key: 'companies', label: 'Companies', count: companies.length },
          { key: 'dispatchers', label: 'Dispatchers' },
          { key: 'jobs', label: 'Jobs', count: jobs.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'companies' && <CompaniesTab />}

      {tab === 'dispatchers' && (
        <DispatcherReportTable
          jobs={jobs}
          showCompanyColumn
          jobsHref={dispatcherHref}
          technicianHref={technicianHref}
          companyHref={companyHref}
        />
      )}

      {tab === 'jobs' && (
        <JobsReportTable
          jobs={jobs}
          showCompanyColumn
          dispatcherHref={dispatcherHref}
          technicianHref={technicianHref}
          jobHref={jobHref}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Companies grain — one row per company, the platform's revenue overview.
// ---------------------------------------------------------------------------

interface CompanyReportRow {
  company: Company
  dispatchers: string[]
  technicians: string[]
  totalRevenue: number
  gatewayFees: number
  dispatchFees: number
  technicianCommission: number
  technicianPayouts: number
  refunds: number
  disputes: number
  transferredToCompany: number
  netProfit: number
}

/** Range filters over the computed columns, expressed in the same shape the auto-filter engine matches on. */
const METRIC_FIELDS: AutoFilterField[] = [
  { key: 'totalRevenue', path: 'totalRevenue', kind: 'number', label: 'Revenue', type: 'numberRange', prefix: '$' },
  { key: 'gatewayFees', path: 'gatewayFees', kind: 'number', label: 'Gateway Fees', type: 'numberRange', prefix: '$' },
  { key: 'dispatchFees', path: 'dispatchFees', kind: 'number', label: 'Dispatch Fees', type: 'numberRange', prefix: '$' },
  { key: 'technicianCommission', path: 'technicianCommission', kind: 'number', label: 'Tech. Commission', type: 'numberRange', prefix: '$' },
  { key: 'technicianPayouts', path: 'technicianPayouts', kind: 'number', label: 'Tech. Payouts', type: 'numberRange', prefix: '$' },
  { key: 'refunds', path: 'refunds', kind: 'number', label: 'Refunds', type: 'numberRange', prefix: '$' },
  { key: 'disputes', path: 'disputes', kind: 'number', label: 'Disputes', type: 'numberRange', prefix: '$' },
  { key: 'netProfit', path: 'netProfit', kind: 'number', label: 'Net Profit', type: 'numberRange', prefix: '$' },
]

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { name: 'Platform-sourced only', values: { origin: 'platform' } },
  { name: 'Own-gateway companies', values: { gatewayMode: 'own' } },
]

function CompaniesTab() {
  const { show } = useToast()
  const [datePreset, setDatePreset] = useState('week')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [gatewayFilter, setGatewayFilter] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [sortKey, setSortKey] = useState('totalRevenue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const { views: savedViews, saveView, removeView, deletableNames } = usePersistentSavedViews('platform-admin-reports-companies', DEFAULT_SAVED_VIEWS)

  const jobFields = useMemo(() => inferFilterFields(jobs, jobFilterSchema), [])

  const rows = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    const scoped = companies.filter((c) => {
      if (companyFilter && c.id !== companyFilter) return false
      if (gatewayFilter && c.gatewayMode !== gatewayFilter) return false
      return true
    })

    return scoped.map((company) => {
      const companyJobs = jobs.filter((j) => {
        if (j.companyId !== company.id || !j.finalPrice) return false
        if (from && j.createdAt < from) return false
        if (to && j.createdAt > to) return false
        return matchesAutoFilters(j, jobFields, filterValues)
      })
      const totalRevenue = companyJobs.reduce((s, j) => s + (j.finalPrice ?? 0), 0)

      const companyTxns = transactions.filter((t) => {
        if (t.companyId !== company.id) return false
        if (from && t.createdAt < from) return false
        if (to && t.createdAt > to) return false
        return true
      })
      const sumAbs = (type: string) => Math.abs(companyTxns.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0))

      const gatewayFees = sumAbs('gateway_fee')
      const refunds = sumAbs('refund')
      const disputes = sumAbs('dispute')

      return {
        company,
        dispatchers: unique(companyJobs.map((j) => j.dispatcherName)),
        technicians: unique(companyJobs.map((j) => j.technicianName)),
        totalRevenue,
        gatewayFees,
        dispatchFees: sumAbs('dispatch_fee'),
        technicianCommission: sumAbs('technician_commission'),
        technicianPayouts: sumAbs('technician_payout'),
        refunds,
        disputes,
        transferredToCompany: sumAbs('transfer_to_company'),
        netProfit: totalRevenue - gatewayFees - refunds - disputes,
      } satisfies CompanyReportRow
    })
  }, [jobFields, filterValues, companyFilter, gatewayFilter, datePreset, customFrom, customTo])

  const filteredRows = useMemo(
    () => rows.filter((r) => matchesAutoFilters(r, METRIC_FIELDS, filterValues)),
    [rows, filterValues],
  )

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows]
    copy.sort((a, b) => {
      const av = (a as unknown as Record<string, number>)[sortKey]
      const bv = (b as unknown as Record<string, number>)[sortKey]
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return copy
  }, [filteredRows, sortKey, sortDir])

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, r) => ({
          totalRevenue: acc.totalRevenue + r.totalRevenue,
          gatewayFees: acc.gatewayFees + r.gatewayFees,
          dispatchFees: acc.dispatchFees + r.dispatchFees,
          technicianCommission: acc.technicianCommission + r.technicianCommission,
          technicianPayouts: acc.technicianPayouts + r.technicianPayouts,
          refunds: acc.refunds + r.refunds,
          disputes: acc.disputes + r.disputes,
          netProfit: acc.netProfit + r.netProfit,
        }),
        { totalRevenue: 0, gatewayFees: 0, dispatchFees: 0, technicianCommission: 0, technicianPayouts: 0, refunds: 0, disputes: 0, netProfit: 0 },
      ),
    [filteredRows],
  )

  function onSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function clearAll() {
    setCompanyFilter('')
    setGatewayFilter('')
    setFilterValues({})
    setCustomFrom('')
    setCustomTo('')
  }

  const columns: Column<CompanyReportRow>[] = [
    { key: 'company', header: 'Company', render: (r) => <span className="font-medium text-slate-900">{r.company.name}</span> },
    {
      key: 'gateway',
      header: 'Gateway',
      render: (r) => (
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
          {r.company.gatewayMode === 'own' ? 'Own gateway' : 'Platform gateway'}
        </span>
      ),
    },
    { key: 'dispatchers', header: 'Dispatcher', render: (r) => <NameLinks names={r.dispatchers} href={dispatcherHref} noun="dispatchers" /> },
    { key: 'technicians', header: 'Technicians', render: (r) => <NameLinks names={r.technicians} href={technicianHref} noun="technicians" /> },
    { key: 'totalRevenue', header: 'Revenue', sortable: true, render: (r) => <span className="tabular-nums">{formatCurrency(r.totalRevenue)}</span> },
    { key: 'gatewayFees', header: 'Gateway Fees', sortable: true, render: (r) => <span className="tabular-nums text-red-600">-{formatCurrency(r.gatewayFees)}</span> },
    { key: 'dispatchFees', header: 'Dispatch Fees', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.dispatchFees)}</span> },
    { key: 'technicianCommission', header: 'Tech. Commission', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.technicianCommission)}</span> },
    { key: 'technicianPayouts', header: 'Tech. Payouts', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.technicianPayouts)}</span> },
    { key: 'refunds', header: 'Refunds', sortable: true, render: (r) => <span className="tabular-nums text-amber-600">-{formatCurrency(r.refunds)}</span> },
    { key: 'disputes', header: 'Disputes', sortable: true, render: (r) => <span className="tabular-nums text-red-600">-{formatCurrency(r.disputes)}</span> },
    { key: 'netProfit', header: 'Net Profit', sortable: true, render: (r) => <span className="tabular-nums font-semibold text-green-700">{formatCurrency(r.netProfit)}</span> },
  ]

  return (
    <Card>
      <AdvancedFilter
        fields={[
          { key: 'company', label: 'Company', type: 'select', options: companies.map((c) => ({ value: c.id, label: c.name })) },
          { key: 'gatewayMode', label: 'Gateway', type: 'select', options: [{ value: 'platform', label: 'Platform gateway' }, { value: 'own', label: 'Own gateway' }] },
          ...(datePreset === 'custom' ? [{ key: 'customRange', label: 'Date Range', type: 'dateRange' as const }] : []),
        ]}
        advancedFields={[...METRIC_FIELDS, ...jobFields]}
        values={{ ...filterValues, company: companyFilter, gatewayMode: gatewayFilter, customRange: { from: customFrom, to: customTo } }}
        onFieldChange={(key, value) => {
          if (key === 'company') setCompanyFilter((value as string) ?? '')
          else if (key === 'gatewayMode') setGatewayFilter((value as string) ?? '')
          else if (key === 'customRange') {
            const range = (value as { from?: string; to?: string } | undefined) ?? {}
            setCustomFrom(range.from ?? '')
            setCustomTo(range.to ?? '')
          } else setFilterValues((v) => ({ ...v, [key]: value }))
        }}
        quickFilters={DATE_RANGE_PRESETS.map((p) => ({ key: p.key, label: p.label }))}
        activeQuickFilter={datePreset}
        onQuickFilterChange={setDatePreset}
        onClearAll={clearAll}
        savedViews={savedViews}
        onApplyView={(v) => {
          setCompanyFilter((v.values.company as string) ?? '')
          setGatewayFilter((v.values.gatewayMode as string) ?? '')
          setFilterValues(v.values)
        }}
        onSaveView={(name) => {
          saveView({ name, values: { ...filterValues, company: companyFilter, gatewayMode: gatewayFilter } })
          show(`View "${name}" saved — it'll still be here next time you open Reports.`)
        }}
        deletableViewNames={deletableNames}
        onDeleteView={(name) => { removeView(name); show(`View "${name}" removed.`) }}
      />
      <DataTable
        columns={columns}
        rows={sortedRows}
        keyField={(r) => r.company.id}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        status={sortedRows.length === 0 ? 'no-results' : 'ready'}
        onClearFilters={clearAll}
        footerRow={
          sortedRows.length > 0 ? (
            <>
              <td className="px-4 py-3 text-sm">Total</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.totalRevenue)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-red-600">-{formatCurrency(totals.gatewayFees)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.dispatchFees)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.technicianCommission)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.technicianPayouts)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-amber-600">-{formatCurrency(totals.refunds)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-red-600">-{formatCurrency(totals.disputes)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-green-700">{formatCurrency(totals.netProfit)}</td>
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
