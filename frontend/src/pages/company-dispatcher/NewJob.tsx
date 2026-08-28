import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Search, UserCog, UserPlus, X } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Form'
import { TechnicianStatusPill } from '../../components/ui/Pill'
import { AddCustomerModal } from '../../components/domain/AddCustomerModal'
import { AssignTechnicianModal } from '../../components/domain/AssignTechnicianModal'
import { useToast } from '../../components/ui/Toast'
import { customers, jobs, serviceTypes, companyDispatcherUser } from '../../data/mock'
import { COUNTRY_OPTIONS, nextId } from '../../lib/utils'
import type { Customer, JobUrgency, Technician } from '../../types'

const MY_COMPANY_ID = companyDispatcherUser.companyId

export function NewJob() {
  const navigate = useNavigate()
  const { show } = useToast()

  const [customerId, setCustomerId] = useState('')
  const [customerQuery, setCustomerQuery] = useState('')
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  const [itemType, setItemType] = useState<'' | 'Vehicle' | 'Door'>('')
  const [country, setCountry] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [urgency, setUrgency] = useState<JobUrgency>('now')
  const [estimatePrice, setEstimatePrice] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [showTechPicker, setShowTechPicker] = useState(false)

  const [errors, setErrors] = useState<string[]>([])

  const myCustomers = customers.filter((c) => c.companyId === MY_COMPANY_ID)
  const selectedCustomer = customers.find((c) => c.id === customerId)

  const matches = useMemo(() => {
    if (!customerQuery.trim()) return []
    const q = customerQuery.toLowerCase()
    return myCustomers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerQuery])

  function selectCustomer(c: Customer) {
    setCustomerId(c.id)
    setCustomerQuery('')
    setShowCustomerList(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: string[] = []
    if (!customerId) newErrors.push('The customer field is required.')
    if (!itemType) newErrors.push('The item type field is required.')
    if (!country) newErrors.push('The country field is required.')
    if (!serviceType) newErrors.push('The service type field is required.')
    if (!estimatePrice || Number(estimatePrice) <= 0) newErrors.push('The estimated price field is required.')
    if (!address.trim()) newErrors.push('The location address field is required.')
    if (urgency === 'scheduled' && !scheduledAt) newErrors.push('The scheduled at field is required.')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const customer = customers.find((c) => c.id === customerId)!
    const st = serviceTypes.find((s) => s.id === serviceType)!
    const id = nextId('job')
    const now = new Date().toISOString()
    const timeline = [{ at: now, label: 'Job created (company intake)', actor: companyDispatcherUser.name, role: 'Company Dispatcher' }]
    if (technician) {
      timeline.push({ at: now, label: `Assigned to ${technician.name}`, actor: companyDispatcherUser.name, role: 'Company Dispatcher' })
    }

    jobs.unshift({
      id,
      displayId: `JOB-${20000 + jobs.length * 37}`,
      origin: 'company',
      companyId: MY_COMPANY_ID,
      companyName: companyDispatcherUser.companyName,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      address,
      itemType: itemType as 'Vehicle' | 'Door',
      serviceCategory: st.name,
      urgency,
      status: technician ? 'assigned_to_technician' : 'assigned_to_company',
      createdAt: now,
      technicianName: technician?.name,
      estimatePrice: Number(estimatePrice),
      paymentMethod: 'unpaid',
      pricingLines: [],
      financialFlag: 'none',
      description: description || undefined,
      timeline,
    })
    st.jobsCount += 1

    show(technician ? `Job created and assigned to ${technician.name}.` : 'Job created. Assign it to a technician from Incoming Jobs.')
    navigate('/company-dispatcher/jobs')
  }

  return (
    <div>
      <PageHeader title="New Job" subtitle="Create a job sourced directly by your company" />

      {errors.length > 0 && (
        <div className="mb-5 space-y-2">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /> {err}</span>
              <button onClick={() => setErrors((e) => e.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Customer" subtitle="Pick an existing customer of your company, or add a new one" />
          <div className="p-5 space-y-4">
            {selectedCustomer ? (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{selectedCustomer.name}</p>
                  <p className="text-xs text-slate-500">{selectedCustomer.phone} · {selectedCustomer.email}</p>
                </div>
                <button type="button" onClick={() => setCustomerId('')} className="text-xs font-medium text-slate-500 hover:text-slate-700">
                  Change
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.25" />
                  <input
                    value={customerQuery}
                    onChange={(e) => { setCustomerQuery(e.target.value); setShowCustomerList(true) }}
                    onFocus={() => setShowCustomerList(true)}
                    placeholder="Search your customers by name or phone..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                  {showCustomerList && matches.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-1 max-h-64 overflow-y-auto">
                      {matches.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectCustomer(c)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50"
                        >
                          <p className="text-sm text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {showCustomerList && customerQuery.trim() && matches.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-slate-200 py-3 px-3">
                      <p className="text-xs text-slate-400">No matching customer in your company's book — add them as new.</p>
                    </div>
                  )}
                </div>
                <Button type="button" variant="secondary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddCustomer(true)}>
                  Add New
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="mt-5">
          <CardHeader title="Job Details" />
          <div className="p-5 grid grid-cols-2 gap-4">
            <Select label="Item Type" required value={itemType} onChange={(e) => setItemType(e.target.value as 'Vehicle' | 'Door')}>
              <option value="">Select type...</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Door">Door</option>
            </Select>
            <Select label="Country" required value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Select country...</option>
              {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Service Type" required value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option value="">Select service...</option>
              {serviceTypes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <Input
              label="Estimated Service Price"
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 150"
              value={estimatePrice}
              onChange={(e) => setEstimatePrice(e.target.value)}
            />

            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">Urgency<span className="text-red-500 ml-0.5">*</span></span>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setUrgency('now')}
                  className={`text-sm font-medium px-4 py-1.5 rounded-md ${urgency === 'now' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  Now
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('scheduled')}
                  className={`text-sm font-medium px-4 py-1.5 rounded-md ${urgency === 'scheduled' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  Scheduled
                </button>
              </div>
            </div>

            {urgency === 'scheduled' && (
              <Input
                label="Scheduled At"
                required
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            )}

            <div className="col-span-2">
              <Input
                label="Location Address"
                required
                placeholder="Street, city, state — as given by the customer"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                hint="Free text — never a map pin, per the standard intake flow."
              />
            </div>
            <div className="col-span-2">
              <Textarea
                label="Description"
                placeholder="What the customer described..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="mt-5">
          <CardHeader title="Technician" subtitle="Optional — assign now by search or map, or leave for Incoming Jobs later" />
          <div className="p-5">
            {technician ? (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{technician.name}</p>
                  <p className="text-xs text-slate-500">{technician.activeJobsCount} active job{technician.activeJobsCount === 1 ? '' : 's'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <TechnicianStatusPill status={technician.status} />
                  <button type="button" onClick={() => setTechnician(null)} className="text-xs font-medium text-slate-500 hover:text-slate-700">
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="secondary" icon={<UserCog className="w-4 h-4" />} onClick={() => setShowTechPicker(true)}>
                Search or Select Technician on Map
              </Button>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-5">
          <Button type="button" variant="secondary" onClick={() => navigate('/company-dispatcher')}>Cancel</Button>
          <Button type="submit" variant="primary">Create Job</Button>
        </div>
      </form>

      <AddCustomerModal
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        companyId={MY_COMPANY_ID}
        onCreated={(c) => { selectCustomer(c); setShowAddCustomer(false) }}
      />

      <AssignTechnicianModal
        open={showTechPicker}
        onClose={() => setShowTechPicker(false)}
        companyId={MY_COMPANY_ID}
        title="Select Technician"
        confirmLabel="Select"
        onConfirm={(t) => { setTechnician(t); setShowTechPicker(false) }}
      />
    </div>
  )
}
