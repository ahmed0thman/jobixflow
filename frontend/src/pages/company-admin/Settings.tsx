import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Form'
import { useToast } from '../../components/ui/Toast'
import { TwilioConfigCard, type TwilioConfigState } from '../../components/domain/TwilioConfigCard'
import { PaymentGatewayList, useGatewayState, GATEWAY_PROVIDER_LABELS, type GatewayProvider } from '../../components/domain/PaymentGatewaySettings'
import { companies, companyAdminUser } from '../../data/mock'
import { COUNTRY_OPTIONS } from '../../lib/utils'
import type { CompanyStatus } from '../../types'

const MY_COMPANY_ID = companyAdminUser.companyId

export function Settings() {
  const { show } = useToast()
  const company = companies.find((c) => c.id === MY_COMPANY_ID)!

  const [name, setName] = useState(company.name)
  const [email, setEmail] = useState(company.email)
  const [phone, setPhone] = useState(company.phone)
  const [country, setCountry] = useState(company.country)
  const [status, setStatus] = useState<CompanyStatus>(company.status)
  const [street, setStreet] = useState('4821 Hackettfurt Rd')
  const [city, setCity] = useState('Dallas')
  const [state, setState] = useState('TX')
  const [zip, setZip] = useState('75201')

  const [commissionPct, setCommissionPct] = useState(String(company.commissionPct))
  const [dispatchFee, setDispatchFee] = useState('15.00')
  const [gatewayFeePct, setGatewayFeePct] = useState('3')
  const [gatewayMode, setGatewayMode] = useState<'platform' | 'own'>(company.gatewayMode)
  const [activeGateway, setActiveGateway] = useState<GatewayProvider | null>('stripe')
  const { state: gatewayState, patch: patchGateway, testConnection } = useGatewayState({
    stripe: { enabled: true, key: 'pk_live_51NxQ2p8f...', secret: '', status: 'not_connected' },
    square: { enabled: false, key: '', secret: '', status: 'not_connected' },
    authorize_net: { enabled: false, key: '', secret: '', status: 'not_connected' },
  })

  const [twilio, setTwilio] = useState<TwilioConfigState>({
    accountSid: '',
    authToken: '',
    phoneNumber: '+1-214-555-0142',
    recordCalls: true,
    status: 'connected',
    lastVerifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  })

  return (
    <div>
      <PageHeader title="Settings" subtitle="Company profile, financial defaults, and integrations" />

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Company Information" />
          <div className="p-5 space-y-4">
            <Input label="Company Name" required value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Business Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Business Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Select label="Country" required value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Company Status" required value={status} onChange={(e) => setStatus(e.target.value as CompanyStatus)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
        </Card>

        <Card>
          <CardHeader title="Business Address" />
          <div className="p-5 space-y-4">
            <Input label="Street" required value={street} onChange={(e) => setStreet(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} />
              <Input label="State" required value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <Input label="ZIP" required value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="primary" onClick={() => show('Company profile saved.')}>Save Changes</Button>
      </div>

      <Card className="mt-6">
        <CardHeader title="Financial Defaults" subtitle="Applies to jobs at this company unless overridden per technician" />
        <div className="p-5 grid grid-cols-3 gap-4">
          <Input label="Default Commission %" type="number" step="0.01" value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} hint="Per-technician override lives on the Technicians page" />
          <Input label="Dispatch Fee" type="number" step="0.01" value={dispatchFee} onChange={(e) => setDispatchFee(e.target.value)} hint="Flat amount, per job" />
          <Input label="Gateway Fee %" type="number" step="0.01" value={gatewayFeePct} onChange={(e) => setGatewayFeePct(e.target.value)} hint="Default 3%, editable" />
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="Payment Gateway" subtitle="Up to three gateways — bring your own credentials, not a platform marketplace" />
        <div className="px-5 pt-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={gatewayMode === 'platform'} onChange={() => setGatewayMode('platform')} /> Use platform's gateway
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="radio" checked={gatewayMode === 'own'} onChange={() => setGatewayMode('own')} /> Use your own gateway
            </label>
          </div>
          {gatewayMode === 'platform' ? (
            <p className="py-4 text-sm text-slate-500">
              Card payments route through the platform's gateway. No credentials to manage here — see the Platform Wallet for settlement.
            </p>
          ) : (
            <PaymentGatewayList
              state={gatewayState}
              onChange={patchGateway}
              onTestConnection={(p) => testConnection(p, () => show(`${GATEWAY_PROVIDER_LABELS[p]} connection verified.`))}
              activeProvider={activeGateway}
              onSetActive={setActiveGateway}
            />
          )}
        </div>
      </Card>

      <div className="mt-5">
        <TwilioConfigCard
          title="Twilio Number"
          subtitle="Each company supplies its own number and subscription — the platform never re-sells one"
          state={twilio}
          onChange={(patch) => setTwilio((t) => ({ ...t, ...patch }))}
          onTestConnection={() => { setTwilio((t) => ({ ...t, status: 'connected', lastVerifiedAt: new Date().toISOString() })); show('Twilio connection verified.') }}
        />
      </div>

      <div className="flex justify-end mt-4 mb-2">
        <Button variant="primary" onClick={() => show('Financial and integration settings saved.')}>Save Financial Settings</Button>
      </div>
    </div>
  )
}
