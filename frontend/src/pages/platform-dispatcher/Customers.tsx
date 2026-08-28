import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2, UserPlus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { FilterBar } from '../../components/ui/FilterBar'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { AddCustomerModal } from '../../components/domain/AddCustomerModal'
import { useToast } from '../../components/ui/Toast'
import { customers as seedCustomers, jobs } from '../../data/mock'
import type { Customer } from '../../types'

const PAGE_SIZE = 10

export function Customers() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q))
  }, [customers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Name', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
    { key: 'email', header: 'Email', render: (c) => <span className="text-slate-600">{c.email}</span> },
    { key: 'phone', header: 'Phone', render: (c) => <span className="text-slate-600">{c.phone}</span> },
    { key: 'address', header: 'Address', render: (c) => <span className="text-slate-500 text-xs">{c.address}</span> },
    { key: 'jobs', header: 'Jobs', render: (c) => <span className="tabular-nums">{jobs.filter((j) => j.customerId === c.id).length}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => navigate(`/platform-dispatcher/customers/${c.id}`)} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
            <Eye className="w-3.5 h-3.5" /> Show
          </button>
          <button onClick={() => setDeleteTarget(c)} className="text-slate-400 hover:text-red-600" aria-label={`Delete ${c.name}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Full customer directory"
        action={<Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>Add New</Button>}
      />

      <Card>
        <FilterBar
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by name, address, phone..."
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(c) => c.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => setSearch('')}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <AddCustomerModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={() => { setCustomers([...seedCustomers]); setShowAdd(false) }} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          setCustomers((cs) => cs.filter((c) => c.id !== deleteTarget.id))
          show(`${deleteTarget.name} deleted.`)
        }}
        title="Delete this customer?"
        description="This removes the customer record from the directory."
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  )
}
