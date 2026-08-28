import type { Job } from '../../types'
import { formatCurrency } from '../../lib/utils'
import { MoneyAmount } from '../ui/MoneyAmount'
import { PaymentMethodPill } from '../ui/Pill'

const DISPATCH_FEE = 8
const GATEWAY_FEE_PCT = 3

export function PricingBreakdown({ job, commissionPct }: { job: Job; commissionPct: number }) {
  if (!job.finalPrice) {
    return <p className="text-sm text-slate-500">No final price recorded yet — this job hasn't reached a billable state.</p>
  }

  const gross = job.finalPrice
  const expenseTotal = job.pricingLines.reduce((sum, l) => sum + l.cost, 0)
  const afterExpense = gross - expenseTotal

  const gatewayFee = Math.round(afterExpense * (GATEWAY_FEE_PCT / 100) * 100) / 100
  const afterGateway = afterExpense - gatewayFee
  const commission = Math.round(afterGateway * (commissionPct / 100) * 100) / 100
  const afterCommission = afterGateway - commission
  const net = Math.round((afterCommission - DISPATCH_FEE) * 100) / 100

  const Row = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className={muted ? 'text-slate-400' : 'text-slate-600'}>{label}</span>
      <span className={muted ? 'text-slate-400' : 'font-medium text-slate-900 tabular-nums'}>{value}</span>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-slate-400 font-medium">Payment method</span>
        <PaymentMethodPill method={job.paymentMethod} />
      </div>

      <div className="divide-y divide-slate-100 border-t border-slate-100">
        <Row label="Gross (final price)" value={formatCurrency(gross)} />
        {job.pricingLines.map((line) => (
          <Row
            key={line.id}
            label={`− ${line.costType} (paid by ${line.paidBy})`}
            value={`-${formatCurrency(line.cost)}`}
            muted
          />
        ))}
        <Row label={`− Gateway fee (${GATEWAY_FEE_PCT}% of gross, editable)`} value={`-${formatCurrency(gatewayFee)}`} muted />
        <Row label={`− Technician commission (${commissionPct}%)`} value={`-${formatCurrency(commission)}`} muted />
        <Row label="− Dispatch fee (flat)" value={`-${formatCurrency(DISPATCH_FEE)}`} muted />
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">Net settlement</span>
        <MoneyAmount amount={net} positiveLabel="owed to technician" negativeLabel="owed by company" />
      </div>

      {job.serviceCallFee && (
        <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
          Service Call Fee assessed — {formatCurrency(job.serviceCallFee.amount)}, payment link{' '}
          {job.serviceCallFee.link.status === 'paid' ? 'paid.' : job.serviceCallFee.link.status === 'expired' ? 'expired, unpaid.' : 'sent, awaiting payment.'}
        </div>
      )}
    </div>
  )
}
