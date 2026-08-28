import { useNavigate } from 'react-router-dom'
import { Briefcase, Building2, CheckCircle2, Clock } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { KPITile } from '../../components/ui/KPITile'
import { Card, CardHeader } from '../../components/ui/Card'
import { StatusPill, OriginBadge } from '../../components/ui/Pill'
import { jobs, companies } from '../../data/mock'
import { formatCurrency, relativeTime } from '../../lib/utils'

export function Dashboard() {
  const navigate = useNavigate()
  const activeJobs = jobs.filter((j) => !['completed', 'cancelled', 'archived'].includes(j.status))
  const completedToday = jobs.filter((j) => j.status === 'completed').length
  const totalRevenue = companies.reduce((s, c) => s + c.revenuePlatformSourced + c.revenueCompanySourced, 0)
  const recent = [...jobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8)

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Platform-wide overview across every company" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="blue" label="Active Jobs" value={activeJobs.length} delta="+4% today" />
        <KPITile icon={<Building2 className="w-4.5 h-4.5" />} tone="violet" label="Companies" value={companies.length} delta="steady" deltaTone="neutral" />
        <KPITile icon={<CheckCircle2 className="w-4.5 h-4.5" />} tone="green" label="Completed (7d)" value={completedToday} delta="+12%" />
        <KPITile icon={<Clock className="w-4.5 h-4.5" />} tone="amber" label="Platform-wide Revenue" value={formatCurrency(totalRevenue)} delta="+8% WoW" />
      </div>

      <Card>
        <CardHeader title="Recent Jobs" subtitle="Latest activity across all companies" />
        <div className="divide-y divide-slate-100">
          {recent.map((j) => (
            <button
              key={j.id}
              onClick={() => navigate(`/platform-admin/jobs/${j.id}`)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{j.displayId}</span>
                  <OriginBadge origin={j.origin} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {j.customerName} · {j.companyName} · {relativeTime(j.createdAt)}
                </p>
              </div>
              <StatusPill status={j.status} />
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
