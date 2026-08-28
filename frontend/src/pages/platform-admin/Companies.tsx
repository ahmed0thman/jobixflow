import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, Edit2, Eye, Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { FilterBar, FilterSelect } from '../../components/ui/FilterBar'
import { ActionsMenu } from '../../components/ui/ActionsMenu'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Select } from '../../components/ui/Form'
import { CompanyStatusPill } from '../../components/ui/Pill'
import { companies as seedCompanies } from '../../data/mock'
import { useToast } from '../../components/ui/Toast'
import { formatCurrency, daysSince } from '../../lib/utils'
import type { Company, CompanyStatus } from '../../types'

const PAGE_SIZE = 8

export function Companies() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [companies, setCompanies] = useState<Company[]>(seedCompanies)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Company | null>(null)
  const [editStatus, setEditStatus] = useState<CompanyStatus>('active')
  const [generatePassword, setGeneratePassword] = useState(true)
  const [archiveTarget, setArchiveTarget] = useState<Company | null>(null)

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [companies, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company',
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-medium text-slate-900">{c.name}</p>
          <p className="text-xs text-slate-500">{c.email}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (c) => <CompanyStatusPill status={c.status} /> },
    {
      key: 'gateway',
      header: 'Gateway',
      render: (c) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {c.gatewayMode === 'own' ? 'Own gateway' : 'Platform gateway'}
        </span>
      ),
    },
    { key: 'technicians', header: 'Technicians', render: (c) => c.technicians },
    { key: 'activeJobs', header: 'Active Jobs', render: (c) => c.activeJobs },
    {
      key: 'revenue',
      header: 'Revenue Split (Platform / Company)',
      render: (c) => (
        <span className="text-xs text-slate-600 tabular-nums">
          {formatCurrency(c.revenuePlatformSourced)} <span className="text-slate-300">/</span>{' '}
          {formatCurrency(c.revenueCompanySourced)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <ActionsMenu
          items={[
            { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/platform-admin/companies/${c.id}`) },
            {
              key: 'edit',
              label: 'Edit',
              icon: <Edit2 className="w-4 h-4" />,
              onClick: () => {
                setEditTarget(c)
                setEditStatus(c.status)
                setGeneratePassword(true)
              },
            },
            {
              key: 'archive',
              label: 'Archive',
              icon: <Archive className="w-4 h-4" />,
              danger: true,
              separatorBefore: true,
              disabled: daysSince(c.createdAt) < 365,
              disabledReason: 'This record is too recent to archive yet',
              onClick: () => setArchiveTarget(c),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Platform-wide tenant roster — commission, gateway mode, and revenue split by origin"
        action={
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/platform-admin/companies/create')}>
            Add New
          </Button>
        }
      />
      <Card>
        <FilterBar
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search companies..."
          filters={
            <FilterSelect
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1) }}
              placeholder="All statuses"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          }
          appliedTokens={[
            ...(statusFilter ? [{ key: 'status', label: `Status: ${statusFilter}`, onRemove: () => setStatusFilter('') }] : []),
          ]}
          onClearAll={() => { setStatusFilter(''); setSearch('') }}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(c) => c.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit ${editTarget?.name ?? ''}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!editTarget) return
                setCompanies((cs) => cs.map((c) => (c.id === editTarget.id ? { ...c, status: editStatus } : c)))
                show(`${editTarget.name} updated.${generatePassword ? ' New admin password generated.' : ''}`)
                setEditTarget(null)
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Company Status" required value={editStatus} onChange={(e) => setEditStatus(e.target.value as CompanyStatus)}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </Select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={generatePassword} onChange={(e) => setGeneratePassword(e.target.checked)} className="rounded border-slate-300" />
            Generate new password for company admin
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (!archiveTarget) return
          setCompanies((cs) => cs.map((c) => (c.id === archiveTarget.id ? { ...c, status: 'archived' as CompanyStatus } : c)))
          show(`${archiveTarget.name} archived. It moves to the Archived filter — no data was deleted.`)
        }}
        title="Archive this company?"
        description="This company's record moves to Archived. It stays fully retrievable and included in the next periodic export — nothing is permanently deleted."
        confirmLabel="Archive"
        tone="danger"
      />
    </div>
  )
}
