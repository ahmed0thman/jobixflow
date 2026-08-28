import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { PermissionDeniedState } from '../../components/ui/States'
import { customers, jobs } from '../../data/mock'
import { formatDate } from '../../lib/utils'

export function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customer = customers.find((c) => c.id === id)

  if (!customer) {
    return <PermissionDeniedState reason="This customer record doesn't exist." />
  }

  const customerJobs = jobs.filter((j) => j.customerId === customer.id)
  const lastJob = [...customerJobs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]

  return (
    <div>
      <button onClick={() => navigate('/platform-dispatcher/customers')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </button>

      <PageHeader title={customer.name} subtitle="Read-only view of customer information" />

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-5">
          <Card>
            <CardHeader title="Basic Information" />
            <div className="p-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Full Name</span>
                <span className="font-medium text-slate-900">{customer.name}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Contact Information" />
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-900">{customer.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-900">{customer.email || '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-slate-900 text-right max-w-xs">{customer.address}</span></div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Job History" subtitle={`${customerJobs.length} job${customerJobs.length === 1 ? '' : 's'} on record`} />
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Jobs</span><span className="font-semibold text-slate-900 tabular-nums">{customerJobs.length}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Last Job Date</span><span className="font-medium text-slate-900">{lastJob ? formatDate(lastJob.createdAt) : '—'}</span></div>
          </div>
          {customerJobs.length > 0 && (
            <div className="border-t border-slate-100 divide-y divide-slate-100">
              {customerJobs.slice(0, 6).map((j) => (
                <div key={j.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="text-slate-700">{j.displayId}</span>
                  <span className="text-slate-400 text-xs">{formatDate(j.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
