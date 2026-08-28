import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Form'

export function RefuseJobModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}) {
  const [reason, setReason] = useState('')

  function close() {
    onClose()
    setReason('')
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Refuse Job"
      subtitle="A reason is required — the platform dispatcher will see this and can reassign the job to another company."
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={close}>Back</Button>
          <Button
            variant="danger"
            disabled={!reason.trim()}
            disabledReason="Enter a reason first"
            onClick={() => {
              if (!reason.trim()) return
              onConfirm(reason.trim())
              setReason('')
            }}
          >
            Confirm Refusal
          </Button>
        </>
      }
    >
      <Textarea
        label="Refusal Reason"
        required
        placeholder="Why can't this job be taken on right now?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  )
}
