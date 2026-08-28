import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select, Textarea } from '../ui/Form'
import { REFUND_REASON_LABELS, type RefundReasonCode } from '../../types'

export function RefundRequestModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (reasonCode: RefundReasonCode, description: string) => void
}) {
  const [reasonCode, setReasonCode] = useState<RefundReasonCode | ''>('')
  const [description, setDescription] = useState('')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Refund"
      subtitle="Log the customer's refund request before deciding on it."
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Back
          </Button>
          <Button
            variant="primary"
            disabled={!reasonCode}
            disabledReason="Select a reason first"
            onClick={() => {
              if (!reasonCode) return
              onConfirm(reasonCode, description)
              onClose()
              setReasonCode('')
              setDescription('')
            }}
          >
            Log Refund Request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select label="Reason" required value={reasonCode} onChange={(e) => setReasonCode(e.target.value as RefundReasonCode)}>
          <option value="">Select a reason...</option>
          {Object.entries(REFUND_REASON_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Textarea label="Description (optional)" placeholder="Any extra context from the customer..." value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </Modal>
  )
}
