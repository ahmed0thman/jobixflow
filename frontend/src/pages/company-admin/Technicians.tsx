import { useMemo, useState } from 'react'
import { Mail, Phone, Edit2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { AdvancedFilter, type FilterFieldConfig } from '../../components/ui/AdvancedFilter'
import { TechnicianStatusPill } from '../../components/ui/Pill'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Form'
import { Pagination } from '../../components/ui/Pagination'
import { NoResultsState } from '../../components/ui/States'
import { useToast } from '../../components/ui/Toast'
import { technicians as seedTechnicians, companyAdminUser } from '../../data/mock'
import { TECHNICIAN_STATUS_LABELS, type Technician } from '../../types'
import { relativeTime } from '../../lib/utils'

const MY_COMPANY_ID = companyAdminUser.companyId
const PAGE_SIZE = 8
const ALL_SKILLS = ['Vehicle Lockout', 'House Lockout', 'Key Duplication', 'Ignition Repair', 'Lock Rekey', 'Trunk Lockout', 'Broken Key Extraction', 'Safe Unlock']

export function Technicians() {
  const { show } = useToast()
  const [technicians, setTechnicians] = useState<Technician[]>(seedTechnicians)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Technician | null>(null)
  const [commissionPct, setCommissionPct] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [skills, setSkills] = useState<string[]>([])

  const roster = technicians.filter((t) => t.companyId === MY_COMPANY_ID)

  const filtered = useMemo(() => {
    return roster.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.name.toLowerCase().includes(q) && !t.phone.includes(q) && !t.email?.toLowerCase().includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fields: FilterFieldConfig[] = [
    { key: 'status', label: 'Status', type: 'select', options: Object.entries(TECHNICIAN_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
  ]

  function openEdit(t: Technician) {
    setEditTarget(t)
    setCommissionPct(String(t.commissionPct ?? ''))
    setLicenseNumber(t.licenseNumber ?? '')
    setSkills(t.skills)
  }

  function toggleSkill(s: string) {
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
  }

  function saveEdit() {
    if (!editTarget) return
    setTechnicians((ts) => ts.map((t) => (t.id === editTarget.id ? { ...t, commissionPct: Number(commissionPct) || 0, licenseNumber, skills } : t)))
    show(`${editTarget.name} updated.`)
    setEditTarget(null)
  }

  return (
    <div>
      <PageHeader title="Technicians" subtitle="Manage your company's technician roster" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KPITile tone="green" label="Available" value={roster.filter((t) => t.status === 'available').length} icon={<span className="text-sm font-bold">✓</span>} />
        <KPITile tone="amber" label="On Job" value={roster.filter((t) => t.status === 'busy').length} icon={<span className="text-sm font-bold">⚙</span>} />
        <KPITile tone="red" label="Offline" value={roster.filter((t) => t.status === 'offline' || t.status === 'off_duty').length} icon={<span className="text-sm font-bold">✕</span>} />
      </div>

      <Card>
        <AdvancedFilter
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Search technicians..."
          fields={fields}
          values={{ status: statusFilter }}
          onFieldChange={(key, value) => { if (key === 'status') { setStatusFilter((value as string) ?? ''); setPage(1) } }}
          onClearAll={() => setStatusFilter('')}
        />

        {pageRows.length === 0 ? (
          <NoResultsState onClear={() => { setStatusFilter(''); setSearch('') }} />
        ) : (
          <div className="grid grid-cols-2 gap-4 p-5">
            {pageRows.map((t) => (
              <div key={t.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                      {t.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <TechnicianStatusPill status={t.status} />
                    </div>
                  </div>
                  <button onClick={() => openEdit(t)} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {t.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{t.email}</p>}
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{t.phone}</p>
                  <p>{t.status === 'available' || t.status === 'busy' ? `Last seen ${relativeTime(new Date().toISOString())}` : 'N/A'}</p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg py-2">
                    <p className="text-sm font-semibold text-slate-900">{t.activeJobsCount}</p>
                    <p className="text-[10px] text-slate-400">Active</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg py-2">
                    <p className="text-sm font-semibold text-slate-900">{t.completedTodayCount ?? 0}</p>
                    <p className="text-[10px] text-slate-400">Today</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg py-2">
                    <p className="text-sm font-semibold text-slate-900">{t.totalJobsCount ?? 0}</p>
                    <p className="text-[10px] text-slate-400">Total</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {filtered.length > 0 && (
          <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </Card>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit ${editTarget?.name ?? ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Commission Percentage %" required type="number" step="0.01" value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} />
          <Input label="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={
                    skills.includes(s)
                      ? 'text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600 text-white'
                      : 'text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
