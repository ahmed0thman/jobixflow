import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter } from '../../components/ui/AdvancedFilter'
import { customers as seedCustomers, jobs, companyAdminUser } from '../../data/mock'
import type { Customer } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 10

export function Customers() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // A company sees every customer with at least one job tied to their company —
  // the platform's shared customer book (no companyId) plus their own company-sourced ones.
  const myCustomers = useMemo(() => {
    const idsWithJobsHere = new Set(jobs.filter((j) => j.companyId === MY_COMPANY_ID).map((j) => j.customerId))
    return seedCustomers.filter((c) => (c.companyId === undefined || c.companyId === MY_COMPANY_ID) && idsWithJobsHere.has(c.id))
  }, [])

  const jobCountFor = (customerId: string) => jobs.filter((j) => j.customerId === customerId && j.companyId === MY_COMPANY_ID).length

  const filtered = useMemo(() => {
    if (!search) return myCustomers
    const q = search.toLowerCase()
    return myCustomers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q))
  }, [myCustomers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Customer Name', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
    { key: 'email', header: 'Email', render: (c) => <span className="text-slate-600">{c.email}</span> },
    { key: 'phone', header: 'Phone', render: (c) => <span className="text-slate-600">{c.phone}</span> },
    { key: 'address', header: 'Address', render: (c) => <span className="text-slate-600 text-sm">{c.address}</span> },
    { key: 'jobs', header: 'Jobs', render: (c) => <span className="tabular-nums text-slate-700">{jobCountFor(c.id)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Customers" subtitle="Company-scoped customer directory — read-only" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search customers..."
          fields={[]}
          values={{}}
          onFieldChange={() => {}}
          onClearAll={() => {}}
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
    </div>
  )
}
