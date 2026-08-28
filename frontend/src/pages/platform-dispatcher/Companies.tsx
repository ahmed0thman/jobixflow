import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { CompanyStatusPill } from '../../components/ui/Pill'
import { companies } from '../../data/mock'
import type { Company } from '../../types'

const PAGE_SIZE = 10

export function Companies() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [page, setPage] = useState(1)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'suspended', label: 'Suspended' }, { value: 'archived', label: 'Archived' }] },
    { key: 'country', label: 'Country', type: 'select', options: [...new Set(companies.map((c) => c.country))].map((c) => ({ value: c, label: c })) },
  ]

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (countryFilter && c.country !== countryFilter) return false
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [statusFilter, countryFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Company Name', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
    { key: 'id', header: 'Company ID', render: (c) => <span className="font-mono text-xs text-slate-500">{c.id.toUpperCase()}</span> },
    { key: 'email', header: 'Email', render: (c) => <span className="text-slate-600">{c.email}</span> },
    { key: 'country', header: 'Country', render: (c) => <span className="text-slate-600">{c.country}</span> },
    { key: 'status', header: 'Status', render: (c) => <CompanyStatusPill status={c.status} /> },
    { key: 'technicians', header: 'Active Technicians', render: (c) => <span className="tabular-nums">{c.technicians}</span> },
    { key: 'jobs', header: 'Active Jobs', render: (c) => <span className="tabular-nums">{c.activeJobs}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <button
          onClick={() => navigate(`/platform-dispatcher/companies/${c.id}`)}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-3.5 h-3.5" /> Show
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Companies" subtitle="Read-only directory — used to know which companies exist when assigning a job" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search companies..."
          fields={fields}
          values={{ status: statusFilter, country: countryFilter }}
          onFieldChange={(key, value) => {
            if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) }
            else if (key === 'country') { setCountryFilter((value as string) ?? ''); setPage(1) }
          }}
          onClearAll={() => { setStatusFilter(''); setCountryFilter('') }}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(c) => c.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setCountryFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
