import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter } from '../../components/ui/AdvancedFilter'
import { ActionsMenu } from '../../components/ui/ActionsMenu'
import { Modal } from '../../components/ui/Modal'
import { auditLog as seedAuditLog } from '../../data/mock'
import { inferFilterFields, matchesAutoFilters } from '../../lib/autoFilter'
import { auditLogFilterSchema } from '../../lib/filterSchemas'
import { DATE_RANGE_PRESETS, rangeToDates } from '../../lib/dateRanges'
import { formatDateTime } from '../../lib/utils'
import type { AuditLogEntry } from '../../types'

const PAGE_SIZE = 12
const PRIMARY_KEYS = ['companyName', 'actorRole', 'model']

export function AuditLog() {
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<AuditLogEntry | null>(null)

  const autoFields = useMemo(() => inferFilterFields(seedAuditLog, auditLogFilterSchema), [])
  const primaryFields = autoFields.filter((f) => PRIMARY_KEYS.includes(f.key))
  const advancedFields = autoFields.filter((f) => !PRIMARY_KEYS.includes(f.key))

  const filtered = useMemo(() => {
    const { from, to } = rangeToDates(datePreset, customFrom, customTo)
    return seedAuditLog.filter((e) => {
      if (from && e.createdAt < from) return false
      if (to && e.createdAt > to) return false
      if (search) {
        const q = search.toLowerCase()
        if (!e.actorName.toLowerCase().includes(q) && !e.model.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false
      }
      return matchesAutoFilters(e, autoFields, filterValues)
    })
  }, [autoFields, filterValues, datePreset, customFrom, customTo, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function clearAll() {
    setFilterValues({})
    setDatePreset('all')
    setCustomFrom('')
    setCustomTo('')
    setPage(1)
  }

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'user',
      header: 'User',
      render: (e) => (
        <div>
          <p className="font-medium text-slate-900">{e.actorName}</p>
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{e.actorRole}</span>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (e) => (
        <span className="text-sm text-slate-700">{e.companyName ?? <span className="text-slate-400 italic">Platform-level</span>}</span>
      ),
    },
    { key: 'model', header: 'Model', render: (e) => <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{e.model}</span> },
    {
      key: 'action',
      header: 'Action',
      render: (e) => (
        <span
          className={
            e.action === 'Create'
              ? 'text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full'
              : e.action === 'Delete'
                ? 'text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full'
                : 'text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full'
          }
        >
          {e.action}
        </span>
      ),
    },
    { key: 'changes', header: 'Changes', render: (e) => <span className="text-xs text-slate-500 font-mono truncate block max-w-56">{e.changes}</span> },
    { key: 'createdAt', header: 'Created At', sortable: true, render: (e) => <span className="text-xs text-slate-500">{formatDateTime(e.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (e) => (
        <ActionsMenu items={[{ key: 'view', label: 'View full record', icon: <Eye className="w-4 h-4" />, onClick: () => setDetail(e) }]} />
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Platform-wide activity" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by user, model, or description..."
          fields={[
            ...primaryFields,
            ...(datePreset === 'custom' ? [{ key: 'customRange', label: 'Date Range', type: 'dateRange' as const }] : []),
          ]}
          advancedFields={advancedFields}
          values={{ ...filterValues, customRange: { from: customFrom, to: customTo } }}
          onFieldChange={(key, value) => {
            if (key === 'customRange') {
              const range = (value as { from?: string; to?: string } | undefined) ?? {}
              setCustomFrom(range.from ?? ''); setCustomTo(range.to ?? '')
            } else setFilterValues((v) => ({ ...v, [key]: value }))
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
          keyField={(e) => e.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { clearAll(); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Audit Record" size="sm">
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Actor" value={`${detail.actorName} (${detail.actorRole})`} />
            <Row label="Company" value={detail.companyName ?? 'Platform-level'} />
            <Row label="Model" value={detail.model} />
            <Row label="Action" value={detail.action} />
            <Row label="Changes" value={detail.changes} mono />
            <Row label="Timestamp" value={formatDateTime(detail.createdAt)} />
          </div>
        )}
      </Modal>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-xs text-slate-700 text-right' : 'text-slate-800 text-right'}>{value}</span>
    </div>
  )
}
