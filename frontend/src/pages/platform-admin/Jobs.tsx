import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, Eye, MessageSquare } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { JobsTable } from '../../components/domain/JobsTable'
import { jobs as seedJobs } from '../../data/mock'
import { useToast } from '../../components/ui/Toast'
import { daysSince } from '../../lib/utils'
import type { Job } from '../../types'

export function Jobs() {
  const navigate = useNavigate()
  const { show } = useToast()
  const [jobs, setJobs] = useState<Job[]>(seedJobs)
  const [archiveTarget, setArchiveTarget] = useState<Job | null>(null)

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Cross-company job monitoring" />

      <JobsTable
        jobs={jobs}
        getActions={(j) => [
          { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/platform-admin/jobs/${j.id}`) },
          { key: 'chat', label: 'Chat (read-only)', icon: <MessageSquare className="w-4 h-4" />, onClick: () => navigate(`/platform-admin/jobs/${j.id}/chat`) },
          {
            key: 'archive',
            label: 'Archive',
            icon: <Archive className="w-4 h-4" />,
            danger: true,
            separatorBefore: true,
            disabled: !['completed', 'cancelled'].includes(j.status) || daysSince(j.createdAt) < 365,
            disabledReason: !['completed', 'cancelled'].includes(j.status)
              ? 'Only completed or cancelled jobs can be archived'
              : 'This record is too recent to archive yet',
            onClick: () => setArchiveTarget(j),
          },
        ]}
      />

      <ConfirmDialog
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (!archiveTarget) return
          setJobs((js) => js.map((j) => (j.id === archiveTarget.id ? { ...j, status: 'archived' } : j)))
          show(`${archiveTarget.displayId} archived. Still retrievable in the Archived filter — nothing was deleted.`)
        }}
        title="Archive this job?"
        description="The job moves to Archived and stays fully retrievable, included in the next periodic export."
        confirmLabel="Archive"
        tone="danger"
      />
    </div>
  )
}
