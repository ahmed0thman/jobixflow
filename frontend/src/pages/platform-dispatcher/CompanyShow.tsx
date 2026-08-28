import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { CompanyStatusPill } from '../../components/ui/Pill'
import { companies } from '../../data/mock'
import { formatDate } from '../../lib/utils'
import { PermissionDeniedState } from '../../components/ui/States'

export function CompanyShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companies.find((c) => c.id === id)

  if (!company) {
    return <PermissionDeniedState reason="This company record doesn't exist." />
  }

  return (
    <div>
      <button onClick={() => navigate('/platform-dispatcher/companies')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      <PageHeader title={company.name} subtitle={`${company.email} · ${company.phone}`} action={<CompanyStatusPill status={company.status} />} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KPITile icon={<Users className="w-4.5 h-4.5" />} tone="blue" label="Active Technicians" value={company.technicians} />
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="violet" label="Active Jobs" value={company.activeJobs} />
        <KPITile icon={<TrendingUp className="w-4.5 h-4.5" />} tone="green" label="Completed Jobs" value={company.completedJobs} />
      </div>

      <Card>
        <CardHeader title="Company Information" />
        <div className="p-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Company ID</span><span className="font-mono text-xs text-slate-700">{company.id.toUpperCase()}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Country</span><span className="font-medium text-slate-900">{company.country}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Onboarded</span><span className="font-medium text-slate-900">{formatDate(company.createdAt)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Dispatchers</span><span className="font-medium text-slate-900">{company.dispatchers}</span></div>
        </div>
      </Card>
    </div>
  )
}
