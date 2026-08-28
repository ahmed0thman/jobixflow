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
import { jobs as allJobs, transactions, technicians, companyAdminUser } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters, type AutoFilterField } from '../../lib/autoFilter'
import { jobFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatCurrency } from '../../lib/utils'
import type { Job, Technician } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId

const dispatcherHref = (name: string) => `/company-admin/jobs?dispatcherName=${encodeURIComponent(name)}`
const technicianHref = (name: string) => `/company-admin/jobs?technicianName=${encodeURIComponent(name)}`
const jobHref = (job: Job) => `/company-admin/jobs/${job.id}`

export function Reports() {
  const { show } = useToast()
  const [tab, setTab] = useState('technicians')

  // TEN-002 — every grain on this page reads from the company's own jobs only.
  const myJobs = useMemo(() => allJobs.filter((j) => j.companyId === MY_COMPANY_ID), [])
  const roster = useMemo(() => technicians.filter((t) => t.companyId === MY_COMPANY_ID), [])

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle={`Revenue and performance for ${companyAdminUser.companyName}, by technician, dispatcher, and job`}
        action={
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={() => show('Report exported to CSV.', 'info')}>
            Export
          </Button>
        }
      />

      <Tabs
        tabs={[
          { key: 'technicians', label: 'Technicians', count: roster.length },
          { key: 'dispatchers', label: 'Dispatchers' },
          { key: 'jobs', label: 'Jobs', count: myJobs.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'technicians' && <TechniciansTab roster={roster} myJobs={myJobs} />}

      {tab === 'dispatchers' && (
        <DispatcherReportTable
          jobs={myJobs}
          jobsHref={dispatcherHref}
          technicianHref={technicianHref}
        />
      )}

      {tab === 'jobs' && (
        <JobsReportTable
          jobs={myJobs}
          dispatcherHref={dispatcherHref}
          technicianHref={technicianHref}
          jobHref={jobHref}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Technicians grain — one row per technician on the company's roster.
// ---------------------------------------------------------------------------

interface TechnicianReportRow {
  technician: Technician
  dispatchers: string[]
  completedJobs: number
  totalRevenue: number
  gatewayFees: number
  dispatchFees: number
  technicianCommission: number
  technicianPayouts: number
  refunds: number
  disputes: number
  backcharges: number
  netBalance: number
}

const METRIC_FIELDS: AutoFilterField[] = [
  { key: 'totalRevenue', path: 'totalRevenue', kind: 'number', label: 'Revenue', type: 'numberRange', prefix: '$' },
  { key: 'gatewayFees', path: 'gatewayFees', kind: 'number', label: 'Gateway Fees', type: 'numberRange', prefix: '$' },
  { key: 'dispatchFees', path: 'dispatchFees', kind: 'number', label: 'Dispatch Fees', type: 'numberRange', prefix: '$' },
  { key: 'technicianCommission', path: 'technicianCommission', kind: 'number', label: 'Commission', type: 'numberRange', prefix: '$' },
  { key: 'technicianPayouts', path: 'technicianPayouts', kind: 'number', label: 'Payouts', type: 'numberRange', prefix: '$' },
  { key: 'refunds', path: 'refunds', kind: 'number', label: 'Refunds', type: 'numberRange', prefix: '$' },
  { key: 'disputes', path: 'disputes', kind: 'number', label: 'Disputes', type: 'numberRange', prefix: '$' },
  { key: 'netBalance', path: 'netBalance', kind: 'number', label: 'Net Balance', type: 'numberRange', prefix: '$' },
]

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { name: 'Platform-sourced only', values: { origin: 'platform' } },
  { name: 'Company-sourced only', values: { origin: 'company' } },
]

function TechniciansTab({ roster, myJobs }: { roster: Technician[]; myJobs: Job[] }) {
  const { show } = useToast()
  const [datePreset, setDatePreset] = useState('week')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [technicianFilter, setTechnicianFilter] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [sortKey, setSortKey] = useState('totalRevenue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const { views: savedViews, saveView, removeView, deletableNames } = usePersistentSavedViews('company-admin-reports-technicians', DEFAULT_SAVED_VIEWS)

  const jobFields = useMemo(() => inferFilterFields(myJobs, jobFilterSchema), [myJobs])

  const rows = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    const scoped = roster.filter((t) => !technicianFilter || t.id === technicianFilter)

    return scoped.map((technician) => {
      const techJobs = myJobs.filter((j) => {
        if (j.technicianName !== technician.name || !j.finalPrice) return false
        if (from && j.createdAt < from) return false
        if (to && j.createdAt > to) return false
        return matchesAutoFilters(j, jobFields, filterValues)
      })
      const completed = techJobs.filter((j) => j.status === 'completed')
      const totalRevenue = completed.reduce((s, j) => s + (j.finalPrice ?? 0), 0)
      const refunds = completed.reduce((s, j) => s + (j.refundDetail?.decision?.outcome === 'refunded' ? (j.refundDetail.decision.amount ?? 0) : 0), 0)
      const disputes = completed.reduce((s, j) => s + (j.disputeDetail ? j.disputeDetail.disputedAmount : 0), 0)

      const techTxns = transactions.filter((t) => {
        if (t.companyId !== MY_COMPANY_ID || t.technicianName !== technician.name) return false
        if (from && t.createdAt < from) return false
        if (to && t.createdAt > to) return false
        return true
      })
      const sumAbs = (type: string) => Math.abs(techTxns.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0))

      const dispatchFees = sumAbs('dispatch_fee')
      const technicianCommission = sumAbs('technician_commission')
      const technicianPayouts = sumAbs('technician_payout')
      const backcharges = sumAbs('backcharge')

      return {
        technician,
        dispatchers: unique(techJobs.map((j) => j.dispatcherName)),
        completedJobs: completed.length,
        totalRevenue,
        gatewayFees: sumAbs('gateway_fee'),
        dispatchFees,
        technicianCommission,
        technicianPayouts,
        refunds,
        disputes,
        backcharges,
        netBalance: technicianCommission - dispatchFees - backcharges - technicianPayouts,
      } satisfies TechnicianReportRow
    })
  }, [roster, myJobs, jobFields, filterValues, technicianFilter, datePreset, customFrom, customTo])

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
          completedJobs: acc.completedJobs + r.completedJobs,
          totalRevenue: acc.totalRevenue + r.totalRevenue,
          gatewayFees: acc.gatewayFees + r.gatewayFees,
          dispatchFees: acc.dispatchFees + r.dispatchFees,
          technicianCommission: acc.technicianCommission + r.technicianCommission,
          technicianPayouts: acc.technicianPayouts + r.technicianPayouts,
          refunds: acc.refunds + r.refunds,
          disputes: acc.disputes + r.disputes,
          netBalance: acc.netBalance + r.netBalance,
        }),
        { completedJobs: 0, totalRevenue: 0, gatewayFees: 0, dispatchFees: 0, technicianCommission: 0, technicianPayouts: 0, refunds: 0, disputes: 0, netBalance: 0 },
      ),
    [filteredRows],
  )

  function onSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function clearAll() {
    setTechnicianFilter('')
    setFilterValues({})
    setCustomFrom('')
    setCustomTo('')
  }

  const columns: Column<TechnicianReportRow>[] = [
    {
      key: 'technician',
      header: 'Technician',
      render: (r) => <NameLinks names={[r.technician.name]} href={technicianHref} noun="technicians" />,
    },
    { key: 'dispatchers', header: 'Dispatcher', render: (r) => <NameLinks names={r.dispatchers} href={dispatcherHref} noun="dispatchers" /> },
    { key: 'completedJobs', header: 'Completed Jobs', sortable: true, render: (r) => <span className="tabular-nums">{r.completedJobs}</span> },
    { key: 'totalRevenue', header: 'Revenue', sortable: true, render: (r) => <span className="tabular-nums">{formatCurrency(r.totalRevenue)}</span> },
    { key: 'gatewayFees', header: 'Gateway Fees', sortable: true, render: (r) => <span className="tabular-nums text-red-600">-{formatCurrency(r.gatewayFees)}</span> },
    { key: 'dispatchFees', header: 'Dispatch Fees', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.dispatchFees)}</span> },
    { key: 'technicianCommission', header: 'Commission', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.technicianCommission)}</span> },
    { key: 'technicianPayouts', header: 'Payouts', sortable: true, render: (r) => <span className="tabular-nums text-slate-600">{formatCurrency(r.technicianPayouts)}</span> },
    { key: 'refunds', header: 'Refunds', sortable: true, render: (r) => <span className="tabular-nums text-amber-600">-{formatCurrency(r.refunds)}</span> },
    { key: 'disputes', header: 'Disputes', sortable: true, render: (r) => <span className="tabular-nums text-red-600">-{formatCurrency(r.disputes)}</span> },
    { key: 'netBalance', header: 'Net Balance', sortable: true, render: (r) => <span className={`tabular-nums font-semibold ${r.netBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}>{formatCurrency(r.netBalance, { signed: true })}</span> },
  ]

  return (
    <Card>
      <AdvancedFilter
        fields={[
          { key: 'technician', label: 'Technician', type: 'select', options: roster.map((t) => ({ value: t.id, label: t.name })) },
          ...(datePreset === 'custom' ? [{ key: 'customRange', label: 'Date Range', type: 'dateRange' as const }] : []),
        ]}
        advancedFields={[...METRIC_FIELDS, ...jobFields]}
        values={{ ...filterValues, technician: technicianFilter, customRange: { from: customFrom, to: customTo } }}
        onFieldChange={(key, value) => {
          if (key === 'technician') setTechnicianFilter((value as string) ?? '')
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
          setTechnicianFilter((v.values.technician as string) ?? '')
          setFilterValues(v.values)
        }}
        deletableViewNames={deletableNames}
        onDeleteView={(name) => { removeView(name); show(`View "${name}" removed.`) }}
        onSaveView={(name) => {
          saveView({ name, values: { ...filterValues, technician: technicianFilter } })
          show(`View "${name}" saved — it'll still be here next time you open Reports.`)
        }}
      />
      <DataTable
        columns={columns}
        rows={sortedRows}
        keyField={(r) => r.technician.id}
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
              <td className="px-4 py-3 text-sm tabular-nums">{totals.completedJobs}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.totalRevenue)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-red-600">-{formatCurrency(totals.gatewayFees)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.dispatchFees)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.technicianCommission)}</td>
              <td className="px-4 py-3 text-sm tabular-nums">{formatCurrency(totals.technicianPayouts)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-amber-600">-{formatCurrency(totals.refunds)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-red-600">-{formatCurrency(totals.disputes)}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-green-700">{formatCurrency(totals.netBalance)}</td>
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
