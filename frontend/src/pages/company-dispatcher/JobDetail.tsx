import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Ban, MessageSquare, Phone, Repeat, RotateCcw, ShieldCheck, UserCheck, XCircle } from 'lucide-react'
import { BackchargeModal } from '../../components/domain/BackchargeModal'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { OriginBadge, UrgencyPill, FinancialFlagPill } from '../../components/ui/Pill'
import { Button } from '../../components/ui/Button'
import { jobs as seedJobs, companies, technicians, companyDispatcherUser } from '../../data/mock'
import { formatDateTime, formatCurrency } from '../../lib/utils'
import { PermissionDeniedState } from '../../components/ui/States'
import { StatusStepper } from '../../components/domain/StatusStepper'
import { PricingBreakdown } from '../../components/domain/PricingBreakdown'
import { FinancialFlagDetail } from '../../components/domain/FinancialFlagDetail'
import { AssignTechnicianModal } from '../../components/domain/AssignTechnicianModal'
import { RefuseJobModal } from '../../components/domain/RefuseJobModal'
import { CancelJobModal } from '../../components/domain/CancelJobModal'
import { RefundRequestModal } from '../../components/domain/RefundRequestModal'
import { RefundDecisionModal } from '../../components/domain/RefundDecisionModal'
import { DisputeResolutionModal } from '../../components/domain/DisputeResolutionModal'
import { useToast } from '../../components/ui/Toast'
import {
  CANCELLATION_REASON_LABELS,
  REFUND_REASON_LABELS,
  REFUND_REJECTION_REASON_LABELS,
  type CancellationReason,
  type Job,
  type RefundReasonCode,
  type RefundRejectionReasonCode,
  type Technician,
} from '../../types'

const MY_COMPANY_ID = companyDispatcherUser.companyId
const TERMINAL_STATUSES = ['completed', 'cancelled', 'archived']

export function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const [job, setJob] = useState<Job | undefined>(() => seedJobs.find((j) => j.id === id))
  const [showAssign, setShowAssign] = useState(false)
  const [showRefuse, setShowRefuse] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showRefundRequest, setShowRefundRequest] = useState(false)
  const [showRefundDecision, setShowRefundDecision] = useState(false)
  const [showDisputeResolution, setShowDisputeResolution] = useState(false)
  const [showBackcharge, setShowBackcharge] = useState(false)

  if (!job) {
    return <PermissionDeniedState reason="This job doesn't exist or isn't visible to your role." />
  }
  if (job.companyId !== MY_COMPANY_ID) {
    return <PermissionDeniedState reason="This job belongs to a different company." />
  }

  const company = companies.find((c) => c.id === job.companyId)

  function updateJob(updater: (j: Job) => Job) {
    setJob((prev) => {
      if (!prev) return prev
      const updated = updater(prev)
      const idx = seedJobs.findIndex((j) => j.id === updated.id)
      if (idx !== -1) seedJobs[idx] = updated
      return updated
    })
  }

  function handleAssign(technician: Technician) {
    const wasPlatformIntake = job!.origin === 'platform' && job!.status === 'assigned_to_company'
    updateJob((j) => ({
      ...j,
      technicianName: technician.name,
      status: 'assigned_to_technician',
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: wasPlatformIntake ? `Accepted and assigned to ${technician.name}` : `Assigned to ${technician.name}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job!.displayId} assigned to ${technician.name}.`)
    setShowAssign(false)
  }

  function handleTransfer(technician: Technician, reason?: string) {
    const fromName = job!.technicianName ?? 'Unassigned'
    const wasRefused = job!.status === 'technician_refused'
    updateJob((j) => ({
      ...j,
      technicianName: technician.name,
      status: wasRefused ? 'assigned_to_technician' : j.status,
      reassignment: { fromTechnicianName: fromName, toTechnicianName: technician.name, reason: reason || 'Reassigned by dispatcher', at: new Date().toISOString() },
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: `Reassigned from ${fromName} to ${technician.name} — ${reason || 'Reassigned by dispatcher'}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job!.displayId} transferred to ${technician.name}.`)
    setShowTransfer(false)
  }

  function handleRefuse(reason: string) {
    updateJob((j) => ({
      ...j,
      status: 'company_refused',
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: `Refused by company — ${reason}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job!.displayId} refused. The platform dispatcher can reassign it.`)
    setShowRefuse(false)
  }

  function handleCancel(reason: CancellationReason, notes: string, feeAmount?: number) {
    const now = new Date().toISOString()
    updateJob((j) => {
      const timeline = [...j.timeline, {
        at: now,
        label: `Job cancelled — ${CANCELLATION_REASON_LABELS[reason]}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }]
      let serviceCallFee = j.serviceCallFee
      if (feeAmount) {
        serviceCallFee = {
          amount: feeAmount,
          link: {
            url: `https://pay.jobixflow.com/link/${j.displayId.toLowerCase()}`,
            amount: feeAmount,
            purpose: 'Service Call Fee',
            status: 'sent',
            sentAt: now,
            sentBy: companyDispatcherUser.name,
          },
        }
        timeline.push({
          at: now,
          label: `Service Call Fee of ${formatCurrency(feeAmount)} assessed — payment link sent to the customer by SMS`,
          actor: companyDispatcherUser.name,
          role: 'Company Dispatcher',
        })
      }
      return { ...j, status: 'cancelled', cancellationReason: reason, cancellationNotes: notes || undefined, serviceCallFee, timeline }
    })
    show(feeAmount ? `${job!.displayId} cancelled. Payment link for ${formatCurrency(feeAmount)} sent to the customer.` : `${job!.displayId} cancelled.`)
    setShowCancel(false)
  }

  function handleRequestRefund(reasonCode: RefundReasonCode, description: string) {
    const now = new Date().toISOString()
    updateJob((j) => ({
      ...j,
      financialFlag: 'refund',
      refundDetail: { status: 'requested', reasonCode, description: description || undefined, requestedAt: now, requestedBy: companyDispatcherUser.name },
      timeline: [...j.timeline, { at: now, label: `Refund requested — ${REFUND_REASON_LABELS[reasonCode]}`, actor: companyDispatcherUser.name, role: 'Company Dispatcher' }],
    }))
    show(`Refund request logged for ${job!.displayId}.`)
    setShowRefundRequest(false)
  }

  function handleRefundDecision(
    decision: { outcome: 'refunded'; type: 'full' | 'partial'; amount: number } | { outcome: 'rejected'; rejectionReasonCode: RefundRejectionReasonCode },
  ) {
    const now = new Date().toISOString()
    updateJob((j) => {
      if (!j.refundDetail) return j
      const label = decision.outcome === 'refunded'
        ? `Refund approved — ${decision.type} ${formatCurrency(decision.amount)}`
        : `Refund rejected — ${REFUND_REJECTION_REASON_LABELS[decision.rejectionReasonCode]}`
      return {
        ...j,
        refundDetail: {
          ...j.refundDetail,
          status: decision.outcome === 'refunded' ? 'refunded' : 'rejected',
          decision: decision.outcome === 'refunded'
            ? { outcome: 'refunded', type: decision.type, amount: decision.amount, decidedAt: now, decidedBy: companyDispatcherUser.name }
            : { outcome: 'rejected', rejectionReasonCode: decision.rejectionReasonCode, decidedAt: now, decidedBy: companyDispatcherUser.name },
        },
        timeline: [...j.timeline, { at: now, label, actor: companyDispatcherUser.name, role: 'Company Dispatcher' }],
      }
    })
    show(decision.outcome === 'refunded' ? `Refund approved for ${job!.displayId}.` : `Refund rejected for ${job!.displayId}.`)
    setShowRefundDecision(false)
  }

  function handleDisputeResolution(decision: { outcome: 'settled'; settledAmount: number } | { outcome: 'lost' }) {
    const now = new Date().toISOString()
    updateJob((j) => {
      if (!j.disputeDetail) return j
      const label = decision.outcome === 'settled'
        ? `Dispute settled — ${formatCurrency(decision.settledAmount)} recovered`
        : "Dispute lost — technician's share handled per policy"
      return {
        ...j,
        disputeDetail: decision.outcome === 'settled'
          ? { ...j.disputeDetail, status: 'settled', settledAmount: decision.settledAmount, settledAt: now, settledBy: companyDispatcherUser.name }
          : { ...j.disputeDetail, status: 'lost' },
        timeline: [...j.timeline, { at: now, label, actor: companyDispatcherUser.name, role: 'Company Dispatcher' }],
      }
    })
    show(decision.outcome === 'settled' ? `Dispute marked settled for ${job!.displayId}.` : `Dispute marked lost for ${job!.displayId}.`)
    setShowDisputeResolution(false)
  }

  function handleCreateBackcharge(amount: number, reason: string) {
    const now = new Date().toISOString()
    updateJob((j) => ({
      ...j,
      financialFlag: 'backcharge',
      backchargeDetail: { amount, reason, createdAt: now },
      timeline: [...j.timeline, { at: now, label: `Backcharge created — ${formatCurrency(amount)} (${reason})`, actor: companyDispatcherUser.name, role: 'Company Dispatcher' }],
    }))
    show(`Backcharge of ${formatCurrency(amount)} created for ${job!.displayId}.`)
    setShowBackcharge(false)
  }

  const canAcceptOrRefuse = job.status === 'assigned_to_company' && job.origin === 'platform'
  const canAssignOnly = job.status === 'assigned_to_company' && job.origin === 'company'
  const canTransfer = !!job.technicianName && !TERMINAL_STATUSES.includes(job.status)
  // A platform-sourced job still awaiting accept/refuse isn't under the company's control yet —
  // the only choices are Accept or Refuse. Cancel becomes available once accepted (or immediately
  // for a company-sourced job, which was always theirs).
  const canCancel = !TERMINAL_STATUSES.includes(job.status) && !canAcceptOrRefuse
  const canRequestRefund = job.status === 'completed' && !job.refundDetail
  const canDecideRefund = job.refundDetail?.status === 'requested'
  const canResolveDispute = job.disputeDetail?.status === 'opened'
  const canCreateBackcharge = job.status === 'completed' && job.financialFlag === 'none'
  const companyPaidLines = job.pricingLines.filter((l) => l.paidBy === 'company')
  const currentTechnician = technicians.find((t) => t.companyId === MY_COMPANY_ID && t.name === job.technicianName)

  return (
    <div>
      <button onClick={() => navigate('/company-dispatcher/jobs')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
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
                  <p className="font-medium text-red-800">Cancelled — {CANCELLATION_REASON_LABELS[job.cancellationReason]}</p>
                  {job.cancellationNotes && <p className="text-red-700 text-xs mt-1">{job.cancellationNotes}</p>}
                </div>
              )}
              {canAcceptOrRefuse && (
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="primary" icon={<UserCheck className="w-4 h-4" />} onClick={() => setShowAssign(true)}>
                    Accept &amp; Assign to Technician
                  </Button>
                  <Button variant="danger" icon={<XCircle className="w-4 h-4" />} onClick={() => setShowRefuse(true)}>
                    Refuse
                  </Button>
                </div>
              )}
              {canAssignOnly && (
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="primary" icon={<UserCheck className="w-4 h-4" />} onClick={() => setShowAssign(true)}>
                    Assign to Technician
                  </Button>
                </div>
              )}
              {(canTransfer || canCancel) && (
                <div className="flex items-center gap-2 mt-4">
                  {canTransfer && (
                    <Button variant="secondary" icon={<Repeat className="w-4 h-4" />} onClick={() => setShowTransfer(true)}>
                      Transfer to Another Technician
                    </Button>
                  )}
                  {canCancel && (
                    <Button variant="danger" icon={<Ban className="w-4 h-4" />} onClick={() => setShowCancel(true)}>
                      Cancel Job
                    </Button>
                  )}
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

          {job.status === 'completed' && (
            <Card>
              <CardHeader title="Financial Resolution" subtitle="Refund and dispute decisions for this completed job" />
              <div className="p-5 space-y-4">
                <FinancialFlagDetail job={job} />
                {(canRequestRefund || canDecideRefund || canResolveDispute || canCreateBackcharge) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {canRequestRefund && (
                      <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={() => setShowRefundRequest(true)}>
                        Request Refund
                      </Button>
                    )}
                    {canDecideRefund && (
                      <Button variant="primary" icon={<RotateCcw className="w-4 h-4" />} onClick={() => setShowRefundDecision(true)}>
                        Decide on Refund Request
                      </Button>
                    )}
                    {canResolveDispute && (
                      <Button variant="primary" icon={<ShieldCheck className="w-4 h-4" />} onClick={() => setShowDisputeResolution(true)}>
                        Resolve Dispute
                      </Button>
                    )}
                    {canCreateBackcharge && (
                      <Button variant="secondary" icon={<XCircle className="w-4 h-4" />} onClick={() => setShowBackcharge(true)}>
                        Backcharge Technician
                      </Button>
                    )}
                  </div>
                )}
                {!canRequestRefund && !canDecideRefund && !canResolveDispute && !canCreateBackcharge && job.financialFlag === 'none' && (
                  <p className="text-sm text-slate-400">No refund or dispute activity on this job.</p>
                )}
              </div>
            </Card>
          )}

          {job.status !== 'completed' && <FinancialFlagDetail job={job} />}

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
            <CardHeader title="Chat" />
            <div className="p-5">
              <Button variant="secondary" className="w-full justify-center" icon={<MessageSquare className="w-4 h-4" />} onClick={() => navigate(`/company-dispatcher/jobs/${job.id}/chat`)}>
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

      <AssignTechnicianModal
        open={showAssign}
        onClose={() => setShowAssign(false)}
        companyId={MY_COMPANY_ID}
        title={canAssignOnly ? 'Assign to Technician' : 'Accept & Assign to Technician'}
        subtitle={`${job.displayId} · ${job.customerName}`}
        confirmLabel={canAssignOnly ? 'Assign' : 'Accept & Assign'}
        onConfirm={handleAssign}
      />

      <RefuseJobModal open={showRefuse} onClose={() => setShowRefuse(false)} onConfirm={handleRefuse} />

      <AssignTechnicianModal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        companyId={MY_COMPANY_ID}
        title="Transfer to Another Technician"
        subtitle={`${job.displayId} · currently ${job.technicianName ?? 'unassigned'}`}
        confirmLabel="Transfer"
        excludeTechnicianId={currentTechnician?.id}
        requireReason
        onConfirm={handleTransfer}
      />

      <CancelJobModal open={showCancel} onClose={() => setShowCancel(false)} onConfirm={handleCancel} />

      <RefundRequestModal open={showRefundRequest} onClose={() => setShowRefundRequest(false)} onConfirm={handleRequestRefund} />

      {job.finalPrice && (
        <RefundDecisionModal
          open={showRefundDecision}
          onClose={() => setShowRefundDecision(false)}
          finalPrice={job.finalPrice}
          onConfirm={handleRefundDecision}
        />
      )}

      {job.disputeDetail && (
        <DisputeResolutionModal
          open={showDisputeResolution}
          onClose={() => setShowDisputeResolution(false)}
          disputedAmount={job.disputeDetail.disputedAmount}
          onConfirm={handleDisputeResolution}
        />
      )}

      <BackchargeModal
        open={showBackcharge}
        onClose={() => setShowBackcharge(false)}
        companyPaidLines={companyPaidLines}
        onConfirm={handleCreateBackcharge}
      />
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
