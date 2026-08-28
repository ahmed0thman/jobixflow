import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select, Input } from '../ui/Form'
import { REFUND_REJECTION_REASON_LABELS, type RefundRejectionReasonCode } from '../../types'
import { cn } from '../../lib/utils'

type Outcome = 'refunded' | 'rejected'

export function RefundDecisionModal({
  open,
  onClose,
  finalPrice,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  finalPrice: number
  onConfirm: (
    decision:
      | { outcome: 'refunded'; type: 'full' | 'partial'; amount: number }
      | { outcome: 'rejected'; rejectionReasonCode: RefundRejectionReasonCode },
  ) => void
}) {
  const [outcome, setOutcome] = useState<Outcome>('refunded')
  const [type, setType] = useState<'full' | 'partial'>('full')
  const [amount, setAmount] = useState(finalPrice.toFixed(2))
  const [rejectionReasonCode, setRejectionReasonCode] = useState<RefundRejectionReasonCode | ''>('')

  const parsedAmount = Number(amount)
  const canConfirm = outcome === 'refunded' ? parsedAmount > 0 && parsedAmount <= finalPrice : !!rejectionReasonCode

  function reset() {
    setOutcome('refunded')
    setType('full')
    setAmount(finalPrice.toFixed(2))
    setRejectionReasonCode('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Decide on Refund Request" size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Back</Button>
        <Button
          variant={outcome === 'refunded' ? 'primary' : 'danger'}
          disabled={!canConfirm}
          disabledReason={outcome === 'refunded' ? 'Enter a valid amount, up to the final price' : 'Select a rejection reason'}
          onClick={() => {
            if (!canConfirm) return
            if (outcome === 'refunded') onConfirm({ outcome: 'refunded', type, amount: parsedAmount })
            else if (rejectionReasonCode) onConfirm({ outcome: 'rejected', rejectionReasonCode })
            onClose()
            reset()
          }}
        >
          {outcome === 'refunded' ? 'Approve Refund' : 'Reject Refund'}
        </Button>
      </>
    }>
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          <button
            className={cn('text-sm font-medium px-3 py-1.5 rounded-md', outcome === 'refunded' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            onClick={() => setOutcome('refunded')}
          >
            Approve
          </button>
          <button
            className={cn('text-sm font-medium px-3 py-1.5 rounded-md', outcome === 'rejected' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            onClick={() => setOutcome('rejected')}
          >
            Reject
          </button>
        </div>

        {outcome === 'refunded' ? (
          <>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
              <button
                className={cn('text-xs font-medium px-3 py-1.5 rounded-md', type === 'full' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
                onClick={() => { setType('full'); setAmount(finalPrice.toFixed(2)) }}
              >
                Full Refund
              </button>
              <button
                className={cn('text-xs font-medium px-3 py-1.5 rounded-md', type === 'partial' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
                onClick={() => setType('partial')}
              >
                Partial Refund
              </button>
            </div>
            <Input
              label="Refund amount"
              type="number"
              min={0}
              max={finalPrice}
              step="0.01"
              required
              disabled={type === 'full'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              hint={`Final price was $${finalPrice.toFixed(2)}.`}
            />
          </>
        ) : (
          <Select label="Rejection reason" required value={rejectionReasonCode} onChange={(e) => setRejectionReasonCode(e.target.value as RefundRejectionReasonCode)}>
            <option value="">Select a reason...</option>
            {Object.entries(REFUND_REJECTION_REASON_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        )}
      </div>
    </Modal>
  )
}
