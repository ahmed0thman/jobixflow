import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Briefcase, TrendingUp, CreditCard } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { KPITile } from '../../components/ui/KPITile'
import { CompanyStatusPill } from '../../components/ui/Pill'
import { companies, jobs } from '../../data/mock'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { PermissionDeniedState } from '../../components/ui/States'

export function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companies.find((c) => c.id === id)

  if (!company) {
    return <PermissionDeniedState reason="This company record doesn't exist or you don't have access to it." />
  }

  const companyJobs = jobs.filter((j) => j.companyId === company.id)
  const totalRevenue = company.revenuePlatformSourced + company.revenueCompanySourced
  const platformShare = totalRevenue ? Math.round((company.revenuePlatformSourced / totalRevenue) * 100) : 0

  return (
    <div>
      <button onClick={() => navigate('/platform-admin/companies')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      <PageHeader
        title={company.name}
        subtitle={`${company.email} · ${company.phone}`}
        action={<CompanyStatusPill status={company.status} />}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPITile icon={<Users className="w-4.5 h-4.5" />} tone="blue" label="Technicians" value={company.technicians} />
        <KPITile icon={<Briefcase className="w-4.5 h-4.5" />} tone="violet" label="Active Jobs" value={company.activeJobs} />
        <KPITile icon={<TrendingUp className="w-4.5 h-4.5" />} tone="green" label="Completed Jobs" value={company.completedJobs} />
        <KPITile icon={<CreditCard className="w-4.5 h-4.5" />} tone="amber" label="Commission Rate" value={`${company.commissionPct}%`} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-2">
          <CardHeader title="Revenue Split by Origin" subtitle="Platform-sourced vs. company-sourced jobs" />
          <div className="p-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Platform-sourced</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(company.revenuePlatformSourced)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-slate-600">Company-sourced</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(company.revenueCompanySourced)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-violet-100 overflow-hidden flex">
              <div className="bg-blue-500 h-full" style={{ width: `${platformShare}%` }} />
              <div className="bg-violet-500 h-full flex-1" />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>{platformShare}% platform</span>
              <span>{100 - platformShare}% company</span>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-3">Recent jobs for this company</p>
              <div className="space-y-2">
                {companyJobs.slice(0, 5).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigate(`/platform-admin/jobs/${j.id}`)}
                    className="w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-slate-50 text-left"
                  >
                    <span className="text-slate-700">{j.displayId} · {j.customerName}</span>
                    <span className="text-slate-400">{formatDate(j.createdAt)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Payments &amp; Integrations" subtitle="Read-only summary — configured by the company itself" />
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment gateway</span>
                <span className="font-medium text-slate-900">{company.gatewayMode === 'own' ? 'Own gateway (Stripe-class)' : 'Platform fallback gateway'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Twilio number</span>
                <span className="font-medium text-slate-900">Configured by company</span>
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Configured by the company's own admin — not editable from here.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Company Information" />
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Country</span>
                <span className="font-medium text-slate-900">{company.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Onboarded</span>
                <span className="font-medium text-slate-900">{formatDate(company.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dispatchers</span>
                <span className="font-medium text-slate-900">{company.dispatchers}</span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <Button variant="secondary" className="w-full justify-center">Edit Company</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
