import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { AssignCompanyModal } from '../../components/domain/AssignCompanyModal'
import { JobsTable } from '../../components/domain/JobsTable'
import { useToast } from '../../components/ui/Toast'
import { jobs as seedJobs } from '../../data/mock'
import type { Company, Job } from '../../types'

export function JobHistory() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [jobs, setJobs] = useState<Job[]>(seedJobs)
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null)
  const [assignTarget, setAssignTarget] = useState<Job | null>(null)

  function assignCompany(job: Job, company: Company) {
    const wasRefused = job.status === 'company_refused'
    setJobs((js) => js.map((j) => (j.id === job.id ? {
      ...j,
      companyId: company.id,
      companyName: company.name,
      status: 'assigned_to_company',
      timeline: [...j.timeline, {
        at: new Date().toISOString(),
        label: wasRefused ? `Transferred to ${company.name} after company refusal` : `Assigned to ${company.name}`,
        actor: 'Kailee Reichel',
        role: 'Platform Dispatcher',
      }],
    } : j)))
    show(`${job.displayId} ${wasRefused ? 'transferred to' : 'assigned to'} ${company.name}.`)
    setAssignTarget(null)
  }

  return (
    <div>
      <PageHeader title="Job History" subtitle="Every job created through the platform" />

      <JobsTable
        jobs={jobs}
        searchPlaceholder="Search by job ID, customer name, or phone..."
        getActions={(j) => {
          const editable = j.status === 'new_job'
          const canAssign = j.status === 'new_job' || j.status === 'company_refused'
          return [
            { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/platform-dispatcher/jobs/${j.id}`) },
            {
              key: 'assign',
              label: j.status === 'company_refused' ? 'Transfer to Another Company' : 'Assign to Company',
              icon: <Building2 className="w-4 h-4" />,
              disabled: !canAssign,
              disabledReason: 'Only unassigned or company-refused jobs can be (re)assigned here',
              onClick: () => setAssignTarget(j),
            },
            {
              key: 'edit',
              label: 'Edit',
              icon: <Pencil className="w-4 h-4" />,
              disabled: !editable,
              disabledReason: 'Only New Job records can still be edited',
              onClick: () => navigate(`/platform-dispatcher/jobs/${j.id}/edit`),
            },
            { key: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" />, onClick: () => navigate(`/platform-dispatcher/jobs/${j.id}/chat`) },
            {
              key: 'delete',
              label: 'Delete',
              icon: <Trash2 className="w-4 h-4" />,
              danger: true,
              separatorBefore: true,
              disabled: !editable,
              disabledReason: 'Only New Job records can be deleted',
              onClick: () => setDeleteTarget(j),
            },
          ]
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          setJobs((js) => js.filter((j) => j.id !== deleteTarget.id))
          show(`${deleteTarget.displayId} deleted.`)
        }}
        title="Delete this job?"
        description="This removes the job record. Only New Job records — never dispatched — can be deleted."
        confirmLabel="Delete"
        tone="danger"
      />

      <AssignCompanyModal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={assignTarget?.status === 'company_refused' ? 'Transfer to Another Company' : 'Assign to Company'}
        subtitle={assignTarget ? `${assignTarget.displayId} · ${assignTarget.customerName}` : undefined}
        excludeCompanyId={assignTarget?.companyId}
        confirmLabel={assignTarget?.status === 'company_refused' ? 'Transfer' : 'Assign'}
        onConfirm={(company) => { if (assignTarget) assignCompany(assignTarget, company) }}
      />
    </div>
  )
}
