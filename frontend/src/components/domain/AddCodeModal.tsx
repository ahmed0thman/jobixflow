import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Form'
import { useToast } from '../ui/Toast'
import { companyAdminUser } from '../../data/mock'
import type { CodeRequest, CodeRequestFulfillment } from '../../types'

export function AddCodeModal({ request, onClose, onSave }: { request: CodeRequest | null; onClose: () => void; onSave: (fulfillment: CodeRequestFulfillment) => void }) {
  const { show } = useToast()
  const [codeValue, setCodeValue] = useState('')
  const [provider, setProvider] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (request) {
      setCodeValue(request.fulfillment?.codeValue ?? '')
      setProvider(request.fulfillment?.provider ?? '')
      setCost(request.fulfillment ? String(request.fulfillment.cost) : '')
      setNotes(request.fulfillment?.notes ?? '')
    }
  }, [request])

  function handleSave() {
    if (!request || !codeValue.trim() || !provider.trim() || !cost) return
    onSave({
      codeValue: codeValue.trim(),
      provider: provider.trim(),
      cost: Number(cost),
      notes: notes.trim() || undefined,
      fulfilledAt: new Date().toISOString(),
      fulfilledBy: companyAdminUser.name,
    })
    show(`Code recorded and sent to ${request.requestedByName}.`)
  }

  return (
    <Modal
      open={!!request}
      onClose={onClose}
      title="Adding Code"
      subtitle={request ? `Request ${request.displayId} · Job ${request.jobDisplayId}` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!codeValue.trim() || !provider.trim() || !cost}>Save Code</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Code Value" required placeholder="e.g., 8472-AB" value={codeValue} onChange={(e) => setCodeValue(e.target.value)} />
        <Input label="Provider" required value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g., UHS Hardware" />
        <Input label="Cost" required type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
        <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
      </div>
    </Modal>
  )
}
