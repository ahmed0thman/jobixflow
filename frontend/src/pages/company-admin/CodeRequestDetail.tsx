import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PermissionDeniedState } from '../../components/ui/States'
import { AddCodeModal } from '../../components/domain/AddCodeModal'
import { codeRequests as seedCodeRequests, companyAdminUser } from '../../data/mock'
import { CODE_REQUEST_STATUS_LABELS, type CodeRequest } from '../../types'
import { formatDateTime, formatCurrency } from '../../lib/utils'

export function CodeRequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [codeRequests, setCodeRequests] = useState<CodeRequest[]>(seedCodeRequests)
  const [addCodeOpen, setAddCodeOpen] = useState(false)
  const request = codeRequests.find((cr) => cr.id === id)

  if (!request || request.companyId !== companyAdminUser.companyId) {
    return <PermissionDeniedState reason="This code request doesn't exist or isn't visible to your company." />
  }

  return (
    <div>
      <button onClick={() => navigate('/company-admin/code-requests')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Code Requests
      </button>

      <PageHeader
        title={request.displayId}
        subtitle={`Job ${request.jobDisplayId}`}
        action={
          <Button
            variant="primary"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setAddCodeOpen(true)}
            disabled={request.status === 'rejected'}
            disabledReason="This request was rejected"
          >
            {request.fulfillment ? 'Edit Code' : 'Add Code'}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Request Information" />
          <div className="p-5 space-y-3 text-sm">
            <Row label="Status" value={CODE_REQUEST_STATUS_LABELS[request.status]} />
            <Row label="Requested By" value={`${request.requestedByName} (${request.requestedByRole})`} />
            <Row label="Created" value={formatDateTime(request.createdAt)} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Item Asset Details" />
          <div className="p-5 space-y-3 text-sm">
            {request.asset.kind === 'door' ? (
              <>
                <Row label="Door Type" value={request.asset.doorType} />
                <Row label="Lock Type" value={request.asset.lockType} />
                {request.asset.description && <Row label="Description" value={request.asset.description} />}
              </>
            ) : (
              <>
                <Row label="VIN" value={request.asset.vin} mono />
                <Row label="Brand" value={request.asset.make} />
                <Row label="Model" value={request.asset.model} />
                <Row label="Year" value={request.asset.year} />
                <Row label="Plate Number" value={request.asset.plate} />
                <Row label="Color" value={request.asset.color} />
                <Row label="Engine Number" value={request.asset.engineNumber} mono />
              </>
            )}
          </div>
        </Card>

        {request.fulfillment && (
          <Card className="col-span-2">
            <CardHeader title="Recorded Code" subtitle="Sourced and logged by Company Admin" />
            <div className="p-5 grid grid-cols-4 gap-4 text-sm">
              <Row label="Code Value" value={request.fulfillment.codeValue} mono />
              <Row label="Provider" value={request.fulfillment.provider} />
              <Row label="Cost" value={formatCurrency(request.fulfillment.cost)} />
              <Row label="Fulfilled" value={formatDateTime(request.fulfillment.fulfilledAt)} />
              {request.fulfillment.notes && <Row label="Notes" value={request.fulfillment.notes} />}
            </div>
          </Card>
        )}
      </div>

      <AddCodeModal
        request={addCodeOpen ? request : null}
        onClose={() => setAddCodeOpen(false)}
        onSave={(fulfillment) => {
          setCodeRequests((crs) => crs.map((cr) => (cr.id === request.id ? { ...cr, status: 'approved', fulfillment } : cr)))
          setAddCodeOpen(false)
        }}
      />
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={mono ? 'font-mono text-slate-800 mt-0.5' : 'text-slate-800 mt-0.5'}>{value}</p>
    </div>
  )
}
