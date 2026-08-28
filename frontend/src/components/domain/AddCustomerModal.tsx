import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Form'
import { useToast } from '../ui/Toast'
import { customers } from '../../data/mock'
import { nextId } from '../../lib/utils'
import type { Customer } from '../../types'

export function AddCustomerModal({ open, onClose, onCreated, companyId }: { open: boolean; onClose: () => void; onCreated: (c: Customer) => void; companyId?: string }) {
  const { show } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  function handleSave() {
    const newErrors: string[] = []
    if (!name.trim()) newErrors.push('name')
    if (!phone.trim()) newErrors.push('phone')
    if (!address.trim()) newErrors.push('address')
    if (newErrors.length > 0) { setErrors(newErrors); return }

    const customer: Customer = {
      id: nextId('cust'),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      createdAt: new Date().toISOString(),
      companyId,
    }
    customers.unshift(customer)
    show('Customer added.')
    setName(''); setPhone(''); setEmail(''); setAddress(''); setErrors([])
    onCreated(customer)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Customer"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Add Customer</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} hint={errors.includes('name') ? 'Required' : undefined} />
        <Input label="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} hint={errors.includes('phone') ? 'Required' : undefined} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Address" required value={address} onChange={(e) => setAddress(e.target.value)} hint={errors.includes('address') ? 'Required' : undefined} />
      </div>
    </Modal>
  )
}
