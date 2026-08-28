import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Phone } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { OriginBadge, UrgencyPill, FinancialFlagPill } from '../../components/ui/Pill'
import { Button } from '../../components/ui/Button'
import { jobs, companies } from '../../data/mock'
import { formatDateTime, formatCurrency } from '../../lib/utils'
import { PermissionDeniedState } from '../../components/ui/States'
import { StatusStepper } from '../../components/domain/StatusStepper'
import { PricingBreakdown } from '../../components/domain/PricingBreakdown'
import { FinancialFlagDetail } from '../../components/domain/FinancialFlagDetail'

export function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobs.find((j) => j.id === id)

  if (!job) {
    return <PermissionDeniedState reason="This job doesn't exist or isn't visible to your role." />
  }

  const company = companies.find((c) => c.id === job.companyId)

  return (
    <div>
      <button onClick={() => navigate('/platform-admin/jobs')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <PageHeader
        title={job.displayId}
        subtitle={`${job.companyName} · Created ${formatDateTime(job.createdAt)}`}
        action={
          <div className="flex items-center gap-2">
            <OriginBadge origin={job.origin} />
            <UrgencyPill urgency={job.urgency} />
            <FinancialFlagPill job={job} />
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card>
            <CardHeader title="Status" />
            <div className="p-5">
              <StatusStepper status={job.status} />
              {job.status === 'cancelled' && job.cancellationReason && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                  <p className="font-medium text-red-800">Cancelled — {job.cancellationReason.replace(/_/g, ' ')}</p>
                  {job.cancellationNotes && <p className="text-red-700 text-xs mt-1">{job.cancellationNotes}</p>}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Job Information" />
            <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="Item Type" value={job.itemType} />
              <Field label="Service Category" value={job.serviceCategory} />
              <Field label="Address" value={job.address} />
              <Field label="Assigned Technician" value={job.technicianName ?? 'Not yet assigned'} />
              <Field label="Description" value={job.description ?? '—'} full />
            </div>
          </Card>

          {job.vehicle && (
            <Card>
              <CardHeader title="Vehicle Details" />
              <div className="p-5 grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                <Field label="VIN" value={job.vehicle.vin} />
                <Field label="Make / Model" value={`${job.vehicle.make} ${job.vehicle.model}`} />
                <Field label="Year" value={job.vehicle.year} />
                <Field label="Plate" value={job.vehicle.plate} />
                <Field label="Color" value={job.vehicle.color} />
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Pricing &amp; Payment Details" subtitle="Itemized cost breakdown" />
            <div className="p-5">
              <PricingBreakdown job={job} commissionPct={company?.commissionPct ?? 15} />
            </div>
          </Card>

          <FinancialFlagDetail job={job} />

          <Card>
            <CardHeader title="Status Timeline" />
            <div className="p-5">
              <ol className="space-y-4">
                {job.timeline.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5" />
                      {i < job.timeline.length - 1 && <div className="w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm text-slate-800">{t.label}</p>
                      <p className="text-xs text-slate-400">
                        {t.actor} ({t.role}) · {formatDateTime(t.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Customer" />
            <div className="p-5 space-y-2 text-sm">
              <Field label="Name" value={job.customerName} />
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {job.customerPhone}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Chat" subtitle="Observation only" />
            <div className="p-5">
              <Button variant="secondary" className="w-full justify-center" icon={<MessageSquare className="w-4 h-4" />} onClick={() => navigate(`/platform-admin/jobs/${job.id}/chat`)}>
                Open Chat
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Estimate vs. Final" />
            <div className="p-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimate price</span>
                <span className="tabular-nums font-medium">{formatCurrency(job.estimatePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final price</span>
                <span className="tabular-nums font-medium">{job.finalPrice ? formatCurrency(job.finalPrice) : '—'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : undefined}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}
