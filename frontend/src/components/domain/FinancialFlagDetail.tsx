import { AlertOctagon, CheckCircle2, Clock, RotateCcw, ShieldAlert, XCircle } from 'lucide-react'
import type { Job } from '../../types'
import { REFUND_REASON_LABELS, REFUND_REJECTION_REASON_LABELS } from '../../types'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { Card, CardHeader } from '../ui/Card'

const refundStatusTone: Record<'requested' | 'refunded' | 'rejected', string> = {
  requested: 'bg-amber-100 text-amber-700',
  refunded: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}
const refundStatusLabel: Record<'requested' | 'refunded' | 'rejected', string> = {
  requested: 'Requested',
  refunded: 'Refunded',
  rejected: 'Rejected',
}

const disputeStatusTone: Record<'opened' | 'settled' | 'lost', string> = {
  opened: 'bg-amber-100 text-amber-700',
  settled: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
}
const disputeStatusLabel: Record<'opened' | 'settled' | 'lost', string> = {
  opened: 'Opened',
  settled: 'Settled',
  lost: 'Lost',
}

/**
 * Pure read-only display. Refund/dispute *action* buttons (Request, Approve,
 * Reject, Mark Settled, Mark Lost) live on Company Dispatcher's Job Detail
 * page only — per the 2026-08-28 model, the dispatcher holds sole decision
 * authority here and every other role is an observer.
 */
export function FinancialFlagDetail({ job }: { job: Job }) {
  if (job.financialFlag === 'none') return null

  if (job.financialFlag === 'refund' && job.refundDetail) {
    const r = job.refundDetail
    return (
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" /> Refund
            </span>
          }
          subtitle="Company-dispatcher-initiated refund"
          action={<span className={`text-xs font-medium px-2.5 py-1 rounded-full ${refundStatusTone[r.status]}`}>{refundStatusLabel[r.status]}</span>}
        />
        <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <FieldRow label="Requested by" value={r.requestedBy} />
          <FieldRow label="Requested at" value={formatDateTime(r.requestedAt)} />
          <div className="col-span-2">
            <p className="text-xs text-slate-400">Reason</p>
            <p className="text-slate-800 mt-0.5">{REFUND_REASON_LABELS[r.reasonCode]}</p>
          </div>
          {r.description && (
            <div className="col-span-2">
              <p className="text-xs text-slate-400">Description</p>
              <p className="text-slate-800 mt-0.5">{r.description}</p>
            </div>
          )}
          {r.decision?.outcome === 'refunded' && (
            <>
              <FieldRow label="Refund type" value={r.decision.type === 'full' ? 'Full refund' : 'Partial refund'} />
              <FieldRow label="Amount refunded" value={formatCurrency(r.decision.amount ?? 0)} />
              <FieldRow label="Decided by" value={r.decision.decidedBy} />
              <FieldRow label="Decided at" value={formatDateTime(r.decision.decidedAt)} />
            </>
          )}
          {r.decision?.outcome === 'rejected' && (
            <>
              <div className="col-span-2">
                <p className="text-xs text-slate-400">Rejection reason</p>
                <p className="text-slate-800 mt-0.5">{r.decision.rejectionReasonCode ? REFUND_REJECTION_REASON_LABELS[r.decision.rejectionReasonCode] : '—'}</p>
              </div>
              <FieldRow label="Decided by" value={r.decision.decidedBy} />
              <FieldRow label="Decided at" value={formatDateTime(r.decision.decidedAt)} />
            </>
          )}
          {r.status === 'requested' && (
            <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Awaiting a decision — approve (full or partial) or reject from the Status card above.
            </div>
          )}
        </div>
      </Card>
    )
  }

  if (job.financialFlag === 'dispute' && job.disputeDetail) {
    const d = job.disputeDetail
    return (
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" /> Dispute / Chargeback
            </span>
          }
          subtitle="Bank-initiated — opened automatically by the payment gateway"
          action={<span className={`text-xs font-medium px-2.5 py-1 rounded-full ${disputeStatusTone[d.status]}`}>{disputeStatusLabel[d.status]}</span>}
        />
        <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <FieldRow label="Disputed amount" value={`${formatCurrency(d.disputedAmount)}${d.isPartial ? ' (partial)' : ' (full)'}`} />
          <FieldRow label="Gateway reference" value={d.gatewayTransactionRef} />
          <FieldRow label="Opened at" value={formatDateTime(d.openedAt)} />
          <FieldRow label="Evidence window" value={`${d.evidenceDeadlineDays} days`} />
          <FieldRow label="Technician already paid?" value={d.technicianAlreadyPaid ? 'Yes — commission share frozen or backcharged' : 'No — unpaid share frozen'} />
          {d.status === 'settled' && (
            <>
              <FieldRow label="Amount recovered" value={formatCurrency(d.settledAmount ?? 0)} />
              <FieldRow label="Settled by" value={d.settledBy ?? '—'} />
              <FieldRow label="Settled at" value={d.settledAt ? formatDateTime(d.settledAt) : '—'} />
            </>
          )}
          {d.status === 'lost' && (
            <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-start gap-2">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              The technician bears only their commission share — dispatch and gateway fees are already consumed and aren't
              returned.
            </div>
          )}
          {d.status === 'settled' && (
            <div className="col-span-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Settled in the company's favor — any frozen technician funds are released and deductions/backcharges tied to
              this dispute are reversed.
            </div>
          )}
          {d.status === 'opened' && (
            <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Evidence submission happens directly with the payment gateway. Once resolved, mark this Settled or Lost from
              the Status card above.
            </div>
          )}
        </div>
      </Card>
    )
  }

  if (job.financialFlag === 'backcharge' && job.backchargeDetail) {
    const b = job.backchargeDetail
    const fromDispute = !!b.linkedDisputeId
    return (
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" /> Backcharge
            </span>
          }
          subtitle={fromDispute ? 'Created when a technician was already paid before a dispute landed against the job' : "Dispatcher-initiated — recovering a company-fronted cost from the technician's balance"}
        />
        <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <FieldRow label="Backcharge amount" value={formatCurrency(b.amount)} />
          <FieldRow label="Created at" value={formatDateTime(b.createdAt)} />
          <div className="col-span-2">
            <p className="text-xs text-slate-400">Reason</p>
            <p className="text-slate-800 mt-0.5">{b.reason}</p>
          </div>
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
            {fromDispute
              ? 'Limited to the technician\'s commission share — never the full job amount.'
              : "Deducted from the technician's next payout as its own transaction."}
          </div>
        </div>
      </Card>
    )
  }

  return null
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}
