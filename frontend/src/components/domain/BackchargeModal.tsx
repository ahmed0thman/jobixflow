import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Form'
import { formatCurrency } from '../../lib/utils'
import type { PricingLineItem } from '../../types'

interface BackchargeModalProps {
  open: boolean
  onClose: () => void
  /** Pricing lines the company paid on this job — offered as one-click amounts, since a fronted key-code or physical-key cost is the common trigger for this action. */
  companyPaidLines: PricingLineItem[]
  onConfirm: (amount: number, reason: string) => void
}

/**
 * A standalone backcharge — distinct from the commission-share backcharge a
 * lost dispute can produce (FIN-F-006/007). This one has no dispute behind
 * it: the company covered a cost (typically a key-code purchase) that was
 * actually the technician's responsibility, and the dispatcher is recovering
 * it directly from the technician's balance.
 */
export function BackchargeModal({ open, onClose, companyPaidLines, onConfirm }: BackchargeModalProps) {
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  function reset() {
    setAmount('')
    setReason('')
  }

  const amountNum = Number(amount)
  const canConfirm = amountNum > 0 && reason.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); reset() }}
      title="Backcharge Technician"
      subtitle="Recover a cost the company fronted that was actually the technician's responsibility."
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => { onClose(); reset() }}>Back</Button>
          <Button
            variant="danger"
            disabled={!canConfirm}
            disabledReason="Enter an amount and a reason first"
            onClick={() => { onConfirm(amountNum, reason.trim()); reset() }}
          >
            Create Backcharge
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {companyPaidLines.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">Company-paid costs on this job</p>
            <div className="space-y-1.5">
              {companyPaidLines.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  onClick={() => { setAmount(String(line.cost)); setReason(`${line.costType} — paid by the company, technician's responsibility`) }}
                  className="w-full flex items-center justify-between text-left text-sm rounded-lg border border-slate-200 px-3 py-2 hover:border-blue-300 hover:bg-blue-50/50"
                >
                  <span className="text-slate-700">{line.costType}</span>
                  <span className="font-medium text-slate-900 tabular-nums">{formatCurrency(line.cost)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Backcharge Amount"
          required
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        <Textarea
          label="Reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why the technician bears this cost..."
        />
        <p className="text-xs text-slate-400">
          Deducted from the technician's next payout as its own transaction — balances are never edited directly.
        </p>
      </div>
    </Modal>
  )
}
