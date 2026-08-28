import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Info, MapPin, UserRound } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Form'
import { useToast } from '../../components/ui/Toast'
import { COUNTRY_OPTIONS } from '../../lib/utils'

export function CompanyCreate() {
  const navigate = useNavigate()
  const { show } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    show('Company created.')
    navigate('/platform-admin/companies')
  }

  return (
    <div>
      <button onClick={() => navigate('/platform-admin/companies')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <PageHeader title="Add New Company" subtitle="Register a new locksmith company on the platform" />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
            <Building2 className="w-4 h-4 text-slate-500" /> Company Information
          </h2>
          <div className="space-y-4">
            <Input label="Company Name" required placeholder="e.g., ABC Locksmith Services" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Business Email" required type="email" placeholder="contact@company.com" />
              <Input label="Business Phone" required placeholder="+123456789" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Business License Number" placeholder="Enter business license number" />
              <Select label="Country" required defaultValue="Arab Emirates">
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Commission" required type="number" placeholder="15" />
              <Input label="Tax ID / EIN" placeholder="XX-XXXXXXX" />
            </div>
            <Select label="Company Status" required defaultValue="">
              <option value="" disabled>
                Select status...
              </option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-4">
            <MapPin className="w-4 h-4 text-slate-500" /> Business Address
          </h2>
          <div className="space-y-4">
            <Input label="Street Address" required placeholder="123 Main Street" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" required placeholder="New York" />
              <Input label="State" required placeholder="" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="ZIP Code" required placeholder="10001" />
              <Select label="Country" required defaultValue="">
                <option value="" disabled>
                  Select country...
                </option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
            <UserRound className="w-4 h-4 text-slate-500" /> Company Administrator
          </h2>
          <div className="flex items-start gap-2 bg-blue-50 text-blue-700 text-xs rounded-lg px-3 py-2 mb-4">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            This person will be the primary admin for this company.
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Admin Username" required placeholder="John Smith" />
              <Input label="Admin Email" required type="email" placeholder="admin@company.com" />
            </div>
            <Input label="Admin Phone" required placeholder="+123456789" />
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="primary" icon={<Building2 className="w-4 h-4" />}>
            Create Company
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/platform-admin/companies')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
