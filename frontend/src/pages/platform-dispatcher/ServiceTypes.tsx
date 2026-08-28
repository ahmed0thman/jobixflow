import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { FilterBar } from '../../components/ui/FilterBar'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Form'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useToast } from '../../components/ui/Toast'
import { serviceTypes as seedServiceTypes } from '../../data/mock'
import { nextId } from '../../lib/utils'
import type { ServiceType } from '../../types'

const PAGE_SIZE = 10

export function ServiceTypes() {
  const { show } = useToast()
  const [items, setItems] = useState<ServiceType[]>(seedServiceTypes)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<ServiceType | null>(null)
  const [editName, setEditName] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ServiceType | null>(null)

  const filtered = useMemo(() => {
    if (!search) return items
    return items.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<ServiceType>[] = [
    { key: 'name', header: 'Service Name', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
    { key: 'jobs', header: 'Jobs', render: (s) => <span className="tabular-nums">{s.jobsCount}</span> },
    { key: 'technicians', header: 'Technicians', render: (s) => <span className="tabular-nums">{s.techniciansCount}</span> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-3 text-xs font-medium">
          <button onClick={() => { setEditTarget(s); setEditName(s.name) }} className="text-blue-600 hover:text-blue-700">Edit</button>
          <button onClick={() => setDeleteTarget(s)} className="text-red-600 hover:text-red-700">Delete</button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Service Types"
        subtitle="The service category lookup used on every job intake"
        action={<Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setAddName(''); setShowAdd(true) }}>Add Service</Button>}
      />

      <Card>
        <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder="Search by name..." />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(s) => s.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => setSearch('')}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Service"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!editTarget || !editName.trim()) return
                setItems((its) => its.map((s) => (s.id === editTarget.id ? { ...s, name: editName.trim() } : s)))
                show('Service type updated.')
                setEditTarget(null)
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Input label="Name" required value={editName} onChange={(e) => setEditName(e.target.value)} />
      </Modal>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Service"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!addName.trim()) return
                setItems((its) => [...its, { id: nextId('svc'), name: addName.trim(), jobsCount: 0, techniciansCount: 0 }])
                show('Service type added.')
                setShowAdd(false)
              }}
            >
              Add
            </Button>
          </>
        }
      >
        <Input label="Name" required value={addName} onChange={(e) => setAddName(e.target.value)} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          setItems((its) => its.filter((s) => s.id !== deleteTarget.id))
          show(`${deleteTarget.name} deleted.`)
        }}
        title="Delete this service type?"
        description="Jobs that already used this service type keep their existing category."
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  )
}
