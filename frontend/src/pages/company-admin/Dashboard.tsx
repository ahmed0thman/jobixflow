import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Briefcase, CheckCircle2, Inbox, UserCheck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { KPITile } from '../../components/ui/KPITile'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusPill, UrgencyPill } from '../../components/ui/Pill'
import { DateRangeFilter, getDateRangeBounds, type DateRangeKey } from '../../components/ui/DateRangeFilter'
import { jobs, technicians, companyAdminUser } from '../../data/mock'
import { formatCurrency, relativeTime } from '../../lib/utils'

const MY_COMPANY_ID = companyAdminUser.companyId

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
  const newAwaitingAssignment = scopedJobs.filter((j) => j.status === 'assigned_to_company')
  const completed = scopedJobs.filter((j) => j.status === 'completed')
  const urgent = active.filter((j) => j.urgency === 'now')
  const availableTechs = roster.filter((t) => t.status === 'available')
  const recent = [...scopedJobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8)

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Company-scoped overview — ${companyAdminUser.companyName}`} />

      <DateRangeFilter
        value={dateRange}
        onChange={setDateRange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      {urgent.length > 0 && (
        <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{urgent.length} urgent job{urgent.length === 1 ? '' : 's'}</span> need immediate assignment.
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="blue" label="Active Jobs" value={active.length} />
        <KPITile icon={<Inbox className="w-4.5 h-4.5" />} tone="amber" label="New Jobs — Awaiting Assignment" value={newAwaitingAssignment.length} />
        <KPITile icon={<CheckCircle2 className="w-4.5 h-4.5" />} tone="green" label="Completed" value={completed.length} />
        <KPITile icon={<UserCheck className="w-4.5 h-4.5" />} tone="violet" label="Available Technicians" value={`${availableTechs.length} of ${roster.length}`} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card>
            <CardHeader title="Recent Jobs" subtitle="Latest activity for your company" action={<Button variant="ghost" size="sm" onClick={() => navigate('/company-admin/jobs')}>View All</Button>} />
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No jobs created in this date range.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigate(`/company-admin/jobs/${j.id}`)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{j.serviceCategory} ({j.itemType})</span>
                        <StatusPill status={j.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {j.customerName} · {relativeTime(j.createdAt)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-700 tabular-nums">{formatCurrency(j.finalPrice ?? j.estimatePrice)}</span>
                  </button>
                ))}
              </div>
            )}
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
                    onClick={() => navigate(`/company-admin/jobs/${j.id}`)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-900">{j.displayId}</span>
                      <span className="text-xs text-slate-500">{j.customerName}</span>
                    </div>
                    <UrgencyPill urgency={j.urgency} />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <CardHeader title="Technicians" action={<Button variant="ghost" size="sm" onClick={() => navigate('/company-admin/technicians')}>View All</Button>} />
          {roster.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No technicians yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {roster.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-slate-800">{t.name}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{t.activeJobsCount} active</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
