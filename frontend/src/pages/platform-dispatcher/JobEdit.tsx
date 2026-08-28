import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, X } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Form'
import { useToast } from '../../components/ui/Toast'
import { PermissionDeniedState } from '../../components/ui/States'
import { jobs, serviceTypes } from '../../data/mock'
import { COUNTRY_OPTIONS } from '../../lib/utils'
import type { JobUrgency } from '../../types'

export function JobEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const job = jobs.find((j) => j.id === id)

  const [itemType, setItemType] = useState<'Vehicle' | 'Door'>(job?.itemType ?? 'Vehicle')
  const [country, setCountry] = useState('USA')
  const [serviceType, setServiceType] = useState(() => serviceTypes.find((s) => s.name === job?.serviceCategory)?.id ?? '')
  const [urgency, setUrgency] = useState<JobUrgency>(job?.urgency ?? 'now')
  const [estimatePrice, setEstimatePrice] = useState(String(job?.estimatePrice ?? ''))
  const [address, setAddress] = useState(job?.address ?? '')
  const [description, setDescription] = useState(job?.description ?? '')
  const [errors, setErrors] = useState<string[]>([])

  if (!job) {
    return <PermissionDeniedState reason="This job doesn't exist." />
  }
  if (job.status !== 'new_job') {
    return <PermissionDeniedState reason="This job has already moved past New Job status and can no longer be edited — its core fields are locked once dispatch begins." />
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: string[] = []
    if (!serviceType) newErrors.push('The service type field is required.')
    if (!estimatePrice || Number(estimatePrice) <= 0) newErrors.push('The estimated price field is required.')
    if (!address.trim()) newErrors.push('The location address field is required.')
    if (newErrors.length > 0) { setErrors(newErrors); return }

    const st = serviceTypes.find((s) => s.id === serviceType)!
    const idx = jobs.findIndex((j) => j.id === job!.id)
    jobs[idx] = { ...jobs[idx], itemType, serviceCategory: st.name, urgency, estimatePrice: Number(estimatePrice), address, description: description || undefined }

    show('Job updated.')
    navigate('/platform-dispatcher/jobs')
  }

  return (
    <div>
      <button onClick={() => navigate('/platform-dispatcher/jobs')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Job History
      </button>

      <PageHeader title={`Edit ${job.displayId}`} subtitle={`${job.customerName} · ${job.customerPhone}`} />

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
          <CardHeader title="Job Details" />
          <div className="p-5 grid grid-cols-2 gap-4">
            <Select label="Item Type" required value={itemType} onChange={(e) => setItemType(e.target.value as 'Vehicle' | 'Door')}>
              <option value="Vehicle">Vehicle</option>
              <option value="Door">Door</option>
            </Select>
            <Select label="Country" required value={country} onChange={(e) => setCountry(e.target.value)}>
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
              value={estimatePrice}
              onChange={(e) => setEstimatePrice(e.target.value)}
            />

            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">Urgency<span className="text-red-500 ml-0.5">*</span></span>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
                <button type="button" onClick={() => setUrgency('now')} className={`text-sm font-medium px-4 py-1.5 rounded-md ${urgency === 'now' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Now</button>
                <button type="button" onClick={() => setUrgency('scheduled')} className={`text-sm font-medium px-4 py-1.5 rounded-md ${urgency === 'scheduled' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Scheduled</button>
              </div>
            </div>

            <div className="col-span-2">
              <Input label="Location Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="col-span-2">
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-5">
          <Button type="button" variant="secondary" onClick={() => navigate('/platform-dispatcher/jobs')}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
