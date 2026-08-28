import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Form'
import { cn } from '../../lib/utils'

type Outcome = 'settled' | 'lost'

export function DisputeResolutionModal({
  open,
  onClose,
  disputedAmount,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  disputedAmount: number
  onConfirm: (decision: { outcome: 'settled'; settledAmount: number } | { outcome: 'lost' }) => void
}) {
  const [outcome, setOutcome] = useState<Outcome>('settled')
  const [settledAmount, setSettledAmount] = useState(disputedAmount.toFixed(2))

  const parsedAmount = Number(settledAmount)
  const canConfirm = outcome === 'lost' || parsedAmount > 0

  function reset() {
    setOutcome('settled')
    setSettledAmount(disputedAmount.toFixed(2))
  }

  return (
    <Modal open={open} onClose={onClose} title="Resolve Dispute" subtitle="Record the outcome after resolving this chargeback with the payment gateway." size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Back</Button>
        <Button
          variant={outcome === 'settled' ? 'primary' : 'danger'}
          disabled={!canConfirm}
          disabledReason="Enter a valid recovered amount"
          onClick={() => {
            if (!canConfirm) return
            if (outcome === 'settled') onConfirm({ outcome: 'settled', settledAmount: parsedAmount })
            else onConfirm({ outcome: 'lost' })
            onClose()
            reset()
          }}
        >
          {outcome === 'settled' ? 'Mark Settled' : 'Mark Lost'}
        </Button>
      </>
    }>
      <div className="space-y-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          <button
            className={cn('text-sm font-medium px-3 py-1.5 rounded-md', outcome === 'settled' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            onClick={() => setOutcome('settled')}
          >
            Settled
          </button>
          <button
            className={cn('text-sm font-medium px-3 py-1.5 rounded-md', outcome === 'lost' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            onClick={() => setOutcome('lost')}
          >
            Lost
          </button>
        </div>

        {outcome === 'settled' ? (
          <Input
            label="Amount recovered"
            type="number"
            min={0}
            step="0.01"
            required
            value={settledAmount}
            onChange={(e) => setSettledAmount(e.target.value)}
            hint={`Disputed amount was $${disputedAmount.toFixed(2)}.`}
          />
        ) : (
          <p className="text-sm text-slate-500">
            Funds stay deducted. If the technician was already paid, the backcharge for their commission share stands.
          </p>
        )}
      </div>
    </Modal>
  )
}
