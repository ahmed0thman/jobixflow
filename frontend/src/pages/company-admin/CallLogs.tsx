import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CirclePlay, Download } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { useToast } from '../../components/ui/Toast'
import { callLogs as seedCallLogs, companyAdminUser } from '../../data/mock'
import { CALL_STATUS_LABELS, type CallLog } from '../../types'
import { formatDateTime } from '../../lib/utils'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 11

const statusTone: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  initiated: 'bg-slate-100 text-slate-600',
  failed: 'bg-red-100 text-red-700',
  busy: 'bg-amber-100 text-amber-700',
  no_answer: 'bg-amber-100 text-amber-700',
}

function formatDuration(sec: number) {
  if (sec === 0) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function CallLogs() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [durationFilter, setDurationFilter] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)

  const myCalls = seedCallLogs.filter((c) => c.companyId === MY_COMPANY_ID)

  const filtered = useMemo(() => {
    return myCalls.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (durationFilter === 'lt30' && c.durationSec >= 30 * 60) return false
      if (durationFilter === 'gt30' && c.durationSec < 30 * 60) return false
      if (from && c.startedAt < from) return false
      if (to && c.startedAt > `${to}T23:59:59`) return false
      if (search) {
        const q = search.toLowerCase()
        if (!c.callSid.toLowerCase().includes(q) && !c.jobDisplayId.toLowerCase().includes(q) && !c.technicianName.toLowerCase().includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCalls, statusFilter, durationFilter, from, to, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: Object.entries(CALL_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { key: 'duration', label: 'Duration', type: 'select', options: [{ value: 'lt30', label: 'Less than 30 mins' }, { value: 'gt30', label: 'Greater than 30 mins' }] },
    { key: 'dateRange', label: 'Date Range', type: 'dateRange' },
  ]

  const columns: Column<CallLog>[] = [
    { key: 'callSid', header: 'Call ID', render: (c) => <span className="font-mono text-[11px] text-slate-600">{c.callSid}</span> },
    {
      key: 'job',
      header: 'Job',
      render: (c) => (
        <button onClick={() => navigate(`/company-admin/jobs/${c.jobId}`)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {c.jobDisplayId}
        </button>
      ),
    },
    { key: 'status', header: 'Status', render: (c) => <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusTone[c.status]}`}>{CALL_STATUS_LABELS[c.status]}</span> },
    { key: 'started', header: 'Started At', render: (c) => <span className="text-xs text-slate-500">{formatDateTime(c.startedAt)}</span> },
    { key: 'ended', header: 'Ended At', render: (c) => <span className="text-xs text-slate-500">{c.endedAt ? formatDateTime(c.endedAt) : '—'}</span> },
    {
      key: 'technician',
      header: 'Technician',
      render: (c) => (
        <div>
          <p className="text-slate-700">{c.technicianName}</p>
          <p className="text-[11px] text-slate-400 font-mono">{c.technicianId}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (c) => (
        <div>
          <p className="text-slate-700">{c.customerName}</p>
          <p className="text-[11px] text-slate-400">{c.customerPhone}</p>
        </div>
      ),
    },
    { key: 'duration', header: 'Duration', render: (c) => <span className="tabular-nums text-slate-600">{formatDuration(c.durationSec)}</span> },
    { key: 'type', header: 'Call Type', render: (c) => <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{c.callType}</span> },
    {
      key: 'recording',
      header: 'Recording',
      render: (c) =>
        c.recordingUrl ? (
          <div className="flex items-center gap-1.5">
            <button onClick={() => show('Playback isn\'t wired up in this prototype.', 'info')} className="p-1 text-slate-400 hover:text-blue-600" aria-label="Play recording">
              <CirclePlay className="w-4 h-4" />
            </button>
            <button onClick={() => show('Download isn\'t wired up in this prototype.', 'info')} className="p-1 text-slate-400 hover:text-blue-600" aria-label="Download recording">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-300">No recording</span>
        ),
    },
  ]

  return (
    <div>
      <PageHeader title="Call Logs" subtitle="Per-call history for your company" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by Call ID, job, or technician..."
          fields={fields}
          values={{ status: statusFilter, duration: durationFilter, dateRange: { from, to } }}
          onFieldChange={(key, value) => {
            if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) }
            else if (key === 'duration') { setDurationFilter((value as string) ?? ''); setPage(1) }
            else if (key === 'dateRange') {
              const range = (value as { from?: string; to?: string } | undefined) ?? {}
              setFrom(range.from ?? ''); setTo(range.to ?? ''); setPage(1)
            }
          }}
          onClearAll={() => { setStatusFilter(''); setDurationFilter(''); setFrom(''); setTo('') }}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(c) => c.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setDurationFilter(''); setFrom(''); setTo(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
