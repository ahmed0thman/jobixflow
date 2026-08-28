import { useNavigate } from 'react-router-dom'
import { Eye, MessageSquare } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { JobsTable } from '../../components/domain/JobsTable'
import { jobs as seedJobs, companyAdminUser } from '../../data/mock'

const MY_COMPANY_ID = companyAdminUser.companyId

export function Jobs() {
  const navigate = useNavigate()
  const myJobs = seedJobs.filter((j) => j.companyId === MY_COMPANY_ID)

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Company-wide job monitoring — read-only" />

      <JobsTable
        jobs={myJobs}
        showCompanyColumn={false}
        searchPlaceholder="Search by job ID, customer, or phone..."
        getActions={(j) => [
          { key: 'show', label: 'Show', icon: <Eye className="w-4 h-4" />, onClick: () => navigate(`/company-admin/jobs/${j.id}`) },
          { key: 'chat', label: 'Chat (read-only)', icon: <MessageSquare className="w-4 h-4" />, onClick: () => navigate(`/company-admin/jobs/${j.id}/chat`) },
        ]}
      />
    </div>
  )
}
