import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ban, Eye, MessageSquare, Repeat } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { JobsTable } from '../../components/domain/JobsTable'
import { AssignTechnicianModal } from '../../components/domain/AssignTechnicianModal'
import { CancelJobModal } from '../../components/domain/CancelJobModal'
import { useToast } from '../../components/ui/Toast'
import { jobs as seedJobs, technicians, companyDispatcherUser } from '../../data/mock'
import { CANCELLATION_REASON_LABELS, type CancellationReason, type Job, type Technician } from '../../types'
import { formatCurrency } from '../../lib/utils'

const MY_COMPANY_ID = companyDispatcherUser.companyId
const EXCLUDED = new Set(['new_job', 'assigned_to_company'])
const TERMINAL_STATUSES = ['completed', 'cancelled', 'archived']

export function ActiveJobs() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [version, setVersion] = useState(0)
  const [transferTarget, setTransferTarget] = useState<Job | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Job | null>(null)

  const jobs = seedJobs.filter((j) => j.companyId === MY_COMPANY_ID && !EXCLUDED.has(j.status))
  void version // force re-render after mutating seedJobs in place

  function updateJob(id: string, updater: (j: Job) => Job) {
    const idx = seedJobs.findIndex((j) => j.id === id)
    if (idx !== -1) seedJobs[idx] = updater(seedJobs[idx])
    setVersion((v) => v + 1)
  }

  function transferTechnician(job: Job, technician: Technician, reason?: string) {
    const fromName = job.technicianName ?? 'Unassigned'
    const wasRefused = job.status === 'technician_refused'
    updateJob(job.id, (j) => ({
      ...j,
      technicianName: technician.name,
      status: wasRefused ? 'assigned_to_technician' : j.status,
      reassignment: { fromTechnicianName: fromName, toTechnicianName: technician.name, reason: reason || 'Reassigned by dispatcher', at: new Date().toISOString() },
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: `Reassigned from ${fromName} to ${technician.name} — ${reason || 'Reassigned by dispatcher'}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job.displayId} transferred to ${technician.name}.`)
    setTransferTarget(null)
  }

  function cancelJob(job: Job, reason: CancellationReason, notes: string, feeAmount?: number) {
    const now = new Date().toISOString()
    updateJob(job.id, (j) => {
      const timeline = [...j.timeline, {
        at: now,
        label: `Job cancelled — ${CANCELLATION_REASON_LABELS[reason]}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }]
      let serviceCallFee = j.serviceCallFee
      if (feeAmount) {
        serviceCallFee = {
          amount: feeAmount,
          link: {
            url: `https://pay.jobixflow.com/link/${j.displayId.toLowerCase()}`,
            amount: feeAmount,
            purpose: 'Service Call Fee',
            status: 'sent',
            sentAt: now,
            sentBy: companyDispatcherUser.name,
          },
        }
        timeline.push({
          at: now,
          label: `Service Call Fee of ${formatCurrency(feeAmount)} assessed — payment link sent to the customer by SMS`,
          actor: companyDispatcherUser.name,
          role: 'Company Dispatcher',
        })
      }
      return { ...j, status: 'cancelled', cancellationReason: reason, cancellationNotes: notes || undefined, serviceCallFee, timeline }
    })
    show(feeAmount ? `${job.displayId} cancelled. Payment link for ${formatCurrency(feeAmount)} sent to the customer.` : `${job.displayId} cancelled.`)
    setCancelTarget(null)
  }

  return (
    <div>
      <PageHeader title="Active Jobs" subtitle="Every job past intake for your company, from technician assignment to completion" />

      <JobsTable
        jobs={jobs}
        showCompanyColumn={false}
        searchPlaceholder="Search by job ID, customer name, or phone..."
        getActions={(j) => {
          const canTransfer = !!j.technicianName && !TERMINAL_STATUSES.includes(j.status)
          const canCancel = !TERMINAL_STATUSES.includes(j.status)
          return [
            { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/company-dispatcher/jobs/${j.id}`) },
            {
              key: 'transfer',
              label: 'Transfer to Another Technician',
              icon: <Repeat className="w-4 h-4" />,
              disabled: !canTransfer,
              disabledReason: 'This job has no assigned technician to transfer from',
              onClick: () => setTransferTarget(j),
            },
            {
              key: 'cancel',
              label: 'Cancel Job',
              icon: <Ban className="w-4 h-4" />,
              danger: true,
              disabled: !canCancel,
              disabledReason: 'This job has already closed',
              onClick: () => setCancelTarget(j),
            },
            { key: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" />, separatorBefore: true, onClick: () => navigate(`/company-dispatcher/jobs/${j.id}/chat`) },
          ]
        }}
      />

      <AssignTechnicianModal
        open={!!transferTarget}
        onClose={() => setTransferTarget(null)}
        companyId={MY_COMPANY_ID}
        title="Transfer to Another Technician"
        subtitle={transferTarget ? `${transferTarget.displayId} · currently ${transferTarget.technicianName ?? 'unassigned'}` : undefined}
        confirmLabel="Transfer"
        excludeTechnicianId={transferTarget ? technicians.find((t) => t.companyId === MY_COMPANY_ID && t.name === transferTarget.technicianName)?.id : undefined}
        requireReason
        onConfirm={(technician, reason) => { if (transferTarget) transferTechnician(transferTarget, technician, reason) }}
      />

      <CancelJobModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={(reason, notes, feeAmount) => { if (cancelTarget) cancelJob(cancelTarget, reason, notes, feeAmount) }}
      />
    </div>
  )
}
