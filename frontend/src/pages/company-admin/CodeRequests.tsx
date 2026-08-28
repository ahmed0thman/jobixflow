import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, PlusCircle } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { ActionsMenu } from '../../components/ui/ActionsMenu'
import { AddCodeModal } from '../../components/domain/AddCodeModal'
import { codeRequests as seedCodeRequests, companyAdminUser } from '../../data/mock'
import { CODE_REQUEST_STATUS_LABELS, type CodeRequest, type CodeRequestStatus } from '../../types'
import { formatDate } from '../../lib/utils'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 10

const statusTone: Record<CodeRequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-blue-100 text-blue-700',
  available: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export function CodeRequests() {
  const navigate = useNavigate()
  const [codeRequests, setCodeRequests] = useState<CodeRequest[]>(seedCodeRequests)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [addCodeTarget, setAddCodeTarget] = useState<CodeRequest | null>(null)

  const myRequests = codeRequests.filter((cr) => cr.companyId === MY_COMPANY_ID)

  const filtered = useMemo(() => {
    return myRequests.filter((cr) => {
      if (statusFilter && cr.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!cr.requestedByName.toLowerCase().includes(q) && !cr.jobDisplayId.toLowerCase().includes(q) && !(cr.fulfillment?.codeValue.toLowerCase().includes(q))) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRequests, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: Object.entries(CODE_REQUEST_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
  ]

  const columns: Column<CodeRequest>[] = [
    { key: 'code', header: 'Code', render: (cr) => <span className="font-mono text-sm text-slate-800">{cr.fulfillment?.codeValue ?? <span className="text-slate-300 italic">Not yet issued</span>}</span> },
    { key: 'requestedBy', header: 'Requested By', render: (cr) => <span className="text-slate-700">{cr.requestedByName}</span> },
    {
      key: 'job',
      header: 'Job ID',
      render: (cr) => (
        <button onClick={() => navigate(`/company-admin/jobs/${cr.jobId}`)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {cr.jobDisplayId}
        </button>
      ),
    },
    { key: 'status', header: 'Status', render: (cr) => <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusTone[cr.status]}`}>{CODE_REQUEST_STATUS_LABELS[cr.status]}</span> },
    { key: 'created', header: 'Created', render: (cr) => <span className="text-xs text-slate-500">{formatDate(cr.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (cr) => (
        <ActionsMenu
          items={[
            { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/company-admin/code-requests/${cr.id}`) },
            {
              key: 'add-code',
              label: cr.fulfillment ? 'Edit Code' : 'Add Code',
              icon: <PlusCircle className="w-4 h-4" />,
              disabled: cr.status === 'rejected',
              disabledReason: 'This request was rejected',
              onClick: () => setAddCodeTarget(cr),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Code Requests" subtitle="Technician-requested key codes — source, log, and send" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by customer, job ID, or technician..."
          fields={fields}
          values={{ status: statusFilter }}
          onFieldChange={(key, value) => { if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) } }}
          onClearAll={() => setStatusFilter('')}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(cr) => cr.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <AddCodeModal
        request={addCodeTarget}
        onClose={() => setAddCodeTarget(null)}
        onSave={(fulfillment) => {
          if (!addCodeTarget) return
          setCodeRequests((crs) => crs.map((cr) => (cr.id === addCodeTarget.id ? { ...cr, status: 'approved', fulfillment } : cr)))
          setAddCodeTarget(null)
        }}
      />
    </div>
  )
}
