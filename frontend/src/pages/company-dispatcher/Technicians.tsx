import { useMemo, useState } from 'react'
import { Phone } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { TechnicianStatusPill } from '../../components/ui/Pill'
import { technicians as seedTechnicians, companyDispatcherUser } from '../../data/mock'
import { TECHNICIAN_STATUS_LABELS, type Technician } from '../../types'

const MY_COMPANY_ID = companyDispatcherUser.companyId
const PAGE_SIZE = 10

export function Technicians() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [page, setPage] = useState(1)

  const roster = seedTechnicians.filter((t) => t.companyId === MY_COMPANY_ID)
  const skillOptions = Array.from(new Set(roster.flatMap((t) => t.skills))).sort()

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: Object.entries(TECHNICIAN_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { key: 'skill', label: 'Skill', type: 'select', options: skillOptions.map((s) => ({ value: s, label: s })) },
  ]

  const filtered = useMemo(() => {
    return roster.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false
      if (skillFilter && !t.skills.includes(skillFilter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.phone.includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, statusFilter, skillFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns: Column<Technician>[] = [
    { key: 'name', header: 'Name', render: (t) => <span className="font-medium text-slate-900">{t.name}</span> },
    { key: 'phone', header: 'Phone', render: (t) => <span className="text-slate-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{t.phone}</span> },
    { key: 'status', header: 'Status', render: (t) => <TechnicianStatusPill status={t.status} /> },
    { key: 'jobs', header: 'Active Jobs', render: (t) => <span className="tabular-nums text-slate-700">{t.activeJobsCount}</span> },
    {
      key: 'skills',
      header: 'Skills',
      render: (t) => (
        <div className="flex flex-wrap gap-1">
          {t.skills.map((s) => (
            <span key={s} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>
          ))}
        </div>
      ),
    },
    { key: 'location', header: 'Location', render: (t) => <span className="text-xs text-slate-400 font-mono">{t.lat.toFixed(4)}, {t.lng.toFixed(4)}</span> },
  ]

  return (
    <div>
      <PageHeader title="Technicians" subtitle="Read-only roster for your company" />

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search by name or phone..."
          fields={fields}
          values={{ status: statusFilter, skill: skillFilter }}
          onFieldChange={(key, value) => {
            if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) }
            else if (key === 'skill') { setSkillFilter((value as string) ?? ''); setPage(1) }
          }}
          onClearAll={() => { setStatusFilter(''); setSkillFilter('') }}
        />
        <DataTable
          columns={columns}
          rows={pageRows}
          keyField={(t) => t.id}
          status={filtered.length === 0 ? 'no-results' : 'ready'}
          onClearFilters={() => { setStatusFilter(''); setSkillFilter(''); setSearch('') }}
          pagination={{ page, totalPages, totalItems: filtered.length, pageSize: PAGE_SIZE, onPageChange: setPage }}
        />
      </Card>
    </div>
  )
}
