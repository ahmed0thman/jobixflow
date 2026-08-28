import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select } from '../ui/Form'
import { companies } from '../../data/mock'
import type { Company } from '../../types'

export function AssignCompanyModal({
  open,
  onClose,
  onConfirm,
  title = 'Assign to Company',
  subtitle,
  excludeCompanyId,
  confirmLabel = 'Assign',
}: {
  open: boolean
  onClose: () => void
  onConfirm: (company: Company) => void
  title?: string
  subtitle?: string
  excludeCompanyId?: string
  confirmLabel?: string
}) {
  const [companyId, setCompanyId] = useState('')
  const options = companies.filter((c) => c.status === 'active' && c.id !== excludeCompanyId)

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setCompanyId('') }}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <Button variant="secondary" onClick={() => { onClose(); setCompanyId('') }}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!companyId}
            onClick={() => {
              const company = companies.find((c) => c.id === companyId)
              if (!company) return
              onConfirm(company)
              setCompanyId('')
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Select label="Company" required value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
        <option value="">Select a company...</option>
        {options.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </Select>
    </Modal>
  )
}
