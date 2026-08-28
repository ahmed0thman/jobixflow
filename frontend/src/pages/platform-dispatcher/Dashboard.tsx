import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Briefcase, CheckCircle2, ListTodo, PlusCircle } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { KPITile } from '../../components/ui/KPITile'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusPill, UrgencyPill } from '../../components/ui/Pill'
import { DateRangeFilter, getDateRangeBounds, type DateRangeKey } from '../../components/ui/DateRangeFilter'
import { jobs } from '../../data/mock'
import { formatCurrency, relativeTime } from '../../lib/utils'

export function Dashboard() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const scopedJobs = useMemo(() => {
    const { from, to } = getDateRangeBounds(dateRange, customFrom, customTo)
    return jobs.filter((j) => {
      if (from && j.createdAt < from) return false
      if (to && j.createdAt > to) return false
      return true
    })
  }, [dateRange, customFrom, customTo])

  const uncompleted = scopedJobs.filter((j) => !['completed', 'cancelled', 'archived'].includes(j.status))
  const completed = scopedJobs.filter((j) => j.status === 'completed')
  const urgent = scopedJobs.filter((j) => j.urgency === 'now' && !['completed', 'cancelled', 'archived'].includes(j.status))
  const recent = [...scopedJobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Job intake volume and status at a glance"
        action={
          <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={() => navigate('/platform-dispatcher/jobs/create')}>
            New Job
          </Button>
        }
      />

      <DateRangeFilter
        value={dateRange}
        onChange={setDateRange}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="blue" label="Total Jobs" value={scopedJobs.length} />
        <KPITile icon={<ListTodo className="w-4.5 h-4.5" />} tone="amber" label="Uncompleted" value={uncompleted.length} />
        <KPITile icon={<CheckCircle2 className="w-4.5 h-4.5" />} tone="green" label="Completed" value={completed.length} />
        <KPITile icon={<AlertTriangle className="w-4.5 h-4.5" />} tone="red" label="Urgent" value={urgent.length} />
      </div>

      <Card>
        <CardHeader title="Recent Jobs" subtitle="Latest job intake across the platform" />
        {recent.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No jobs created in this date range.</p>
        )}
        <div className="divide-y divide-slate-100">
          {recent.map((j) => (
            <button
              key={j.id}
              onClick={() => navigate(`/platform-dispatcher/jobs/${j.id}`)}
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
    </div>
  )
}
