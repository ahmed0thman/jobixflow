import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { ActionsMenu } from '../../components/ui/ActionsMenu'
import { keyCodes as seedKeyCodes, companyAdminUser } from '../../data/mock'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { KeyCode } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 10

export function KeyCodes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const myKeyCodes = seedKeyCodes.filter((k) => k.companyId === MY_COMPANY_ID)

  const filtered = useMemo(() => {
    return myKeyCodes.filter((k) => {
      if (statusFilter && k.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!k.code.toLowerCase().includes(q) && !k.obtainedByName.toLowerCase().includes(q) && !(k.vin?.toLowerCase().includes(q)) && String(k.cost).includes(q) === false) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myKeyCodes, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'valid', label: 'Valid' }, { value: 'invalid', label: 'Invalid' }] },
  ]

  const columns: Column<KeyCode>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (k) => (
        <div>
          <span className="font-mono text-sm text-slate-800">{k.code}</span>
          {k.vin && <p className="text-[11px] text-slate-400 font-mono mt-0.5">VIN: {k.vin}</p>}
        </div>
      ),
    },
    { key: 'cost', header: 'Cost', render: (k) => <span className="tabular-nums text-slate-700">{formatCurrency(k.cost)}</span> },
    { key: 'obtainedBy', header: 'User Obtained', render: (k) => <span className="text-slate-700">{k.obtainedByName}</span> },
    { key: 'userJob', header: 'User Job', render: (k) => <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{k.obtainedByRole}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (k) => (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${k.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {k.status === 'valid' ? 'Valid' : 'Invalid'}
        </span>
      ),
    },
    { key: 'obtainedAt', header: 'Obtained Date', render: (k) => <span className="text-xs text-slate-500">{formatDate(k.obtainedAt)}</span> },
    { key: 'notes', header: 'Notes', render: (k) => <span className="text-xs text-slate-500 truncate block max-w-48">{k.notes ?? '—'}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (k) => (
        <ActionsMenu
          items={[
            {
              key: 'job',
              label: 'View Job',
              icon: <Eye className="w-4 h-4" />,
              disabled: !k.jobId,
              onClick: () => k.jobId && navigate(`/company-admin/jobs/${k.jobId}`),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Key Codes" subtitle="Searchable history of every key code obtained" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by code, VIN, cost, or user..."
          fields={fields}
          values={{ status: statusFilter }}
          onFieldChange={(key, value) => { if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) } }}
          onClearAll={() => setStatusFilter('')}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(k) => k.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
