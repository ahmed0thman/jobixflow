import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, UserCheck, XCircle } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { JobsTable } from '../../components/domain/JobsTable'
import { AssignTechnicianModal } from '../../components/domain/AssignTechnicianModal'
import { RefuseJobModal } from '../../components/domain/RefuseJobModal'
import { useToast } from '../../components/ui/Toast'
import { jobs as seedJobs, companyDispatcherUser } from '../../data/mock'
import type { Job, Technician } from '../../types'

const MY_COMPANY_ID = companyDispatcherUser.companyId

export function IncomingJobs() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [version, setVersion] = useState(0)
  const [assignTarget, setAssignTarget] = useState<Job | null>(null)
  const [refuseTarget, setRefuseTarget] = useState<Job | null>(null)

  const jobs = seedJobs.filter((j) => j.companyId === MY_COMPANY_ID && j.status === 'assigned_to_company')
  void version // force re-render after mutating seedJobs in place

  function updateJob(id: string, updater: (j: Job) => Job) {
    const idx = seedJobs.findIndex((j) => j.id === id)
    if (idx !== -1) seedJobs[idx] = updater(seedJobs[idx])
    setVersion((v) => v + 1)
  }

  function assignTechnician(job: Job, technician: Technician) {
    const wasPlatformIntake = job.origin === 'platform'
    updateJob(job.id, (j) => ({
      ...j,
      technicianName: technician.name,
      status: 'assigned_to_technician',
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: wasPlatformIntake ? `Accepted and assigned to ${technician.name}` : `Assigned to ${technician.name}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job.displayId} assigned to ${technician.name}.`)
    setAssignTarget(null)
  }

  function refuseJob(job: Job, reason: string) {
    updateJob(job.id, (j) => ({
      ...j,
      status: 'company_refused',
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: `Refused by company — ${reason}`,
        actor: companyDispatcherUser.name,
        role: 'Company Dispatcher',
      }],
    }))
    show(`${job.displayId} refused. The platform dispatcher can reassign it.`)
    setRefuseTarget(null)
  }

  return (
    <div>
      <PageHeader title="Incoming Jobs" subtitle="Jobs assigned to your company, waiting to be accepted and handed to a technician" />

      <JobsTable
        jobs={jobs}
        showCompanyColumn={false}
        searchPlaceholder="Search by job ID, customer name, or phone..."
        getActions={(j) => [
          { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/company-dispatcher/jobs/${j.id}`) },
          {
            key: 'assign',
            label: j.origin === 'platform' ? 'Accept & Assign to Technician' : 'Assign to Technician',
            icon: <UserCheck className="w-4 h-4" />,
            onClick: () => setAssignTarget(j),
          },
          ...(j.origin === 'platform'
            ? [{ key: 'refuse', label: 'Refuse', icon: <XCircle className="w-4 h-4" />, danger: true, separatorBefore: true, onClick: () => setRefuseTarget(j) }]
            : []),
        ]}
      />

      <AssignTechnicianModal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        companyId={MY_COMPANY_ID}
        title={assignTarget?.origin === 'platform' ? 'Accept & Assign to Technician' : 'Assign to Technician'}
        subtitle={assignTarget ? `${assignTarget.displayId} · ${assignTarget.customerName}` : undefined}
        confirmLabel={assignTarget?.origin === 'platform' ? 'Accept & Assign' : 'Assign'}
        onConfirm={(technician) => { if (assignTarget) assignTechnician(assignTarget, technician) }}
      />

      <RefuseJobModal
        open={!!refuseTarget}
        onClose={() => setRefuseTarget(null)}
        onConfirm={(reason) => { if (refuseTarget) refuseJob(refuseTarget, reason) }}
      />
    </div>
  )
}
