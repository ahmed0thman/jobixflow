import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Briefcase, CheckCircle2, Inbox, UserCheck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { KPITile } from '../../components/ui/KPITile'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusPill, TechnicianStatusPill, UrgencyPill } from '../../components/ui/Pill'
import { DateRangeFilter, getDateRangeBounds, type DateRangeKey } from '../../components/ui/DateRangeFilter'
import { jobs, technicians, companyDispatcherUser } from '../../data/mock'
import { daysSince, formatCurrency, relativeTime } from '../../lib/utils'

const MY_COMPANY_ID = companyDispatcherUser.companyId

export function Dashboard() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const myJobs = jobs.filter((j) => j.companyId === MY_COMPANY_ID)
  const roster = technicians.filter((t) => t.companyId === MY_COMPANY_ID)

  const scopedJobs = useMemo(() => {
    const { from, to } = getDateRangeBounds(dateRange, customFrom, customTo)
    return myJobs.filter((j) => {
      if (from && j.createdAt < from) return false
      if (to && j.createdAt > to) return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, customFrom, customTo])

  const active = scopedJobs.filter((j) => !['new_job', 'completed', 'cancelled', 'archived'].includes(j.status))
  const incoming = scopedJobs.filter((j) => j.status === 'assigned_to_company')
  const completedToday = scopedJobs.filter((j) => j.status === 'completed' && daysSince(j.createdAt) === 0)
  const urgent = active.filter((j) => j.urgency === 'now')
  const recent = [...scopedJobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8)
  const availableTechs = roster.filter((t) => t.status === 'available')

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="What needs your attention right now" />

      <DateRangeFilter
        value={dateRange}
        onChange={setDateRange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="blue" label="Active" value={active.length} />
        <KPITile icon={<Inbox className="w-4.5 h-4.5" />} tone="amber" label="Incoming — Awaiting Assignment" value={incoming.length} />
        <KPITile icon={<CheckCircle2 className="w-4.5 h-4.5" />} tone="green" label="Completed" value={completedToday.length} />
        <KPITile icon={<UserCheck className="w-4.5 h-4.5" />} tone="violet" label="Available Technicians" value={availableTechs.length} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card>
            <CardHeader title="Active Jobs" subtitle="Latest activity for your company" action={<Button variant="ghost" size="sm" onClick={() => navigate('/company-dispatcher/jobs')}>View All</Button>} />
            {recent.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No jobs created in this date range.</p>
            )}
            <div className="divide-y divide-slate-100">
              {recent.map((j) => (
                <button
                  key={j.id}
                  onClick={() => navigate(`/company-dispatcher/jobs/${j.id}`)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{j.customerName}</span>
                      <UrgencyPill urgency={j.urgency} />
                      <StatusPill status={j.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {j.itemType} · {j.address} · {j.technicianName ?? 'Unassigned'} · {relativeTime(j.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-slate-700 tabular-nums">{formatCurrency(j.finalPrice ?? j.estimatePrice)}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Urgent Attention Required" subtitle="Now-priority jobs still in progress" />
            {urgent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">Nothing urgent right now.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {urgent.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigate(`/company-dispatcher/jobs/${j.id}`)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-900">{j.displayId}</span>
                      <span className="text-xs text-slate-500">{j.customerName}</span>
                    </div>
                    <StatusPill status={j.status} />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader title="Available Technicians" action={<Button variant="ghost" size="sm" onClick={() => navigate('/company-dispatcher/technicians')}>View All</Button>} />
          {availableTechs.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No technicians are currently available.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {availableTechs.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-slate-800">{t.name}</span>
                  <TechnicianStatusPill status={t.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
