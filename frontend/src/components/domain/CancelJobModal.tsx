import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select, Textarea, Input } from '../ui/Form'
import { CANCELLATION_REASON_LABELS, type CancellationReason } from '../../types'

export function CancelJobModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (reason: CancellationReason, notes: string, feeAmount?: number) => void
}) {
  const [reason, setReason] = useState<CancellationReason | ''>('')
  const [notes, setNotes] = useState('')
  const [chargeFee, setChargeFee] = useState(false)
  const [feeAmount, setFeeAmount] = useState('')

  const parsedFee = Number(feeAmount)
  const canConfirm = !!reason && (!chargeFee || (feeAmount.trim() !== '' && parsedFee > 0))

  function reset() {
    setReason('')
    setNotes('')
    setChargeFee(false)
    setFeeAmount('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cancel Job"
      subtitle="A reason is required before this job can be cancelled."
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Back
          </Button>
          <Button
            variant="danger"
            disabled={!canConfirm}
            disabledReason={!reason ? 'Select a cancellation reason first' : 'Enter a valid fee amount'}
            onClick={() => {
              if (!canConfirm || !reason) return
              onConfirm(reason, notes, chargeFee ? parsedFee : undefined)
              onClose()
              reset()
            }}
          >
            Confirm Cancellation
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select label="Cancellation Reason" required value={reason} onChange={(e) => setReason(e.target.value as CancellationReason)}>
          <option value="">Select a reason...</option>
          {Object.entries(CANCELLATION_REASON_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Textarea label="Notes (optional)" placeholder="Any extra context for this cancellation..." value={notes} onChange={(e) => setNotes(e.target.value)} />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="rounded border-slate-300" checked={chargeFee} onChange={(e) => setChargeFee(e.target.checked)} />
          Assess a Service Call Fee
        </label>
        {chargeFee && (
          <Input
            label="Fee amount"
            type="number"
            min={0}
            step="0.01"
            required
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            hint="A payment link for this amount is generated and sent to the customer by SMS."
          />
        )}
      </div>
    </Modal>
  )
}
