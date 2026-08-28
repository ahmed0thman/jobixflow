import { cn } from '../../lib/utils'
import type { CompanyStatus, Job, JobOrigin, JobStatus, JobUrgency, PaymentMethod, TechnicianStatus } from '../../types'
import { JOB_STATUS_LABELS, TECHNICIAN_STATUS_LABELS } from '../../types'

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  )
}

const statusTone: Partial<Record<JobStatus, string>> = {
  new_job: 'bg-slate-100 text-slate-700',
  assigned_to_company: 'bg-purple-100 text-purple-700',
  assigned_to_technician: 'bg-purple-100 text-purple-700',
  company_refused: 'bg-red-100 text-red-700',
  technician_refused: 'bg-red-100 text-red-700',
  confirmed_by_call: 'bg-blue-100 text-blue-700',
  technician_on_the_way: 'bg-blue-100 text-blue-700',
  technician_arrived: 'bg-blue-100 text-blue-700',
  work_in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  archived: 'bg-slate-200 text-slate-600',
}

export function StatusPill({ status }: { status: JobStatus }) {
  return <Pill className={statusTone[status]}>{JOB_STATUS_LABELS[status]}</Pill>
}

export function UrgencyPill({ urgency }: { urgency: JobUrgency }) {
  return urgency === 'now' ? (
    <Pill className="bg-red-100 text-red-700">Now</Pill>
  ) : (
    <Pill className="bg-amber-100 text-amber-700">Scheduled</Pill>
  )
}

export function OriginBadge({ origin }: { origin: JobOrigin }) {
  return origin === 'platform' ? (
    <Pill className="bg-blue-50 text-blue-700 border border-blue-200">Platform-sourced</Pill>
  ) : (
    <Pill className="bg-violet-50 text-violet-700 border border-violet-200">Company-sourced</Pill>
  )
}

const companyStatusTone: Record<CompanyStatus, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
  archived: 'bg-slate-200 text-slate-600',
}

export function CompanyStatusPill({ status }: { status: CompanyStatus }) {
  const label = status[0].toUpperCase() + status.slice(1)
  return <Pill className={companyStatusTone[status]}>{label}</Pill>
}

/** Reflects the job's fine-grained refund/dispute sub-status, not just the coarse flag. */
export function FinancialFlagPill({ job }: { job: Pick<Job, 'financialFlag' | 'refundDetail' | 'disputeDetail'> }) {
  const { financialFlag: flag, refundDetail, disputeDetail } = job
  if (flag === 'none') return <span className="text-xs text-slate-400">—</span>

  if (flag === 'refund' && refundDetail) {
    const map = {
      requested: { label: 'Refund Requested', tone: 'bg-amber-100 text-amber-700' },
      refunded: { label: 'Refunded', tone: 'bg-green-100 text-green-700' },
      rejected: { label: 'Refund Rejected', tone: 'bg-red-100 text-red-700' },
    } as const
    const { label, tone } = map[refundDetail.status]
    return <Pill className={tone}>{label}</Pill>
  }
  if (flag === 'dispute' && disputeDetail) {
    const map = {
      opened: { label: 'Dispute Opened', tone: 'bg-amber-100 text-amber-700' },
      settled: { label: 'Dispute Settled', tone: 'bg-green-100 text-green-700' },
      lost: { label: 'Dispute Lost', tone: 'bg-red-100 text-red-700' },
    } as const
    const { label, tone } = map[disputeDetail.status]
    return <Pill className={tone}>{label}</Pill>
  }
  if (flag === 'backcharge') {
    return <Pill className="bg-red-100 text-red-700">Backcharge</Pill>
  }
  return <span className="text-xs text-slate-400">—</span>
}

const technicianStatusTone: Record<TechnicianStatus, string> = {
  available: 'bg-green-100 text-green-700',
  busy: 'bg-amber-100 text-amber-700',
  off_duty: 'bg-slate-200 text-slate-600',
  offline: 'bg-slate-100 text-slate-400',
}

export function TechnicianStatusPill({ status }: { status: TechnicianStatus }) {
  return <Pill className={technicianStatusTone[status]}>{TECHNICIAN_STATUS_LABELS[status]}</Pill>
}

export type IntegrationConnectionStatus = 'connected' | 'not_connected' | 'failed'

const connectionStatusMap: Record<IntegrationConnectionStatus, { label: string; tone: string }> = {
  connected: { label: 'Connected', tone: 'bg-green-100 text-green-700' },
  not_connected: { label: 'Not Connected', tone: 'bg-slate-100 text-slate-500' },
  failed: { label: 'Connection Failed', tone: 'bg-red-100 text-red-700' },
}

/** Twilio / payment-gateway credential state — distinct from job or company status pills. */
export function ConnectionStatusPill({ status }: { status: IntegrationConnectionStatus }) {
  const { label, tone } = connectionStatusMap[status]
  return <Pill className={tone}>{label}</Pill>
}

export function PaymentMethodPill({ method }: { method: PaymentMethod }) {
  const map: Record<PaymentMethod, { label: string; tone: string }> = {
    card: { label: 'Card', tone: 'bg-blue-50 text-blue-700 border border-blue-200' },
    payment_link: { label: 'Payment Link', tone: 'bg-violet-50 text-violet-700 border border-violet-200' },
    unpaid: { label: 'Unpaid', tone: 'bg-slate-100 text-slate-500' },
  }
  const { label, tone } = map[method]
  return <Pill className={tone}>{label}</Pill>
}
