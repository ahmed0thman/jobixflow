import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Form'
import { useToast } from '../../components/ui/Toast'
import { TwilioConfigCard, type TwilioConfigState } from '../../components/domain/TwilioConfigCard'
import { PaymentGatewayList, useGatewayState, GATEWAY_PROVIDER_LABELS, type GatewayProvider } from '../../components/domain/PaymentGatewaySettings'

export function Settings() {
  const { show } = useToast()
  const [archiveAge, setArchiveAge] = useState(365)

  const [activeGateway, setActiveGateway] = useState<GatewayProvider | null>('stripe')
  const { state: gatewayState, patch: patchGateway, testConnection } = useGatewayState({
    stripe: { enabled: true, key: 'pk_live_51PlatformAcct...', secret: '', status: 'connected' },
    square: { enabled: false, key: '', secret: '', status: 'not_connected' },
    authorize_net: { enabled: false, key: '', secret: '', status: 'not_connected' },
  })

  const [twilio, setTwilio] = useState<TwilioConfigState>({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    recordCalls: false,
    status: 'not_connected',
  })

  return (
    <div>
      <PageHeader title="Settings" subtitle="Platform-wide configuration" />

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Branding" />
          <div className="p-5">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center text-center text-slate-400">
              <UploadCloud className="w-6 h-6 mb-2" />
              <p className="text-sm">Drag &amp; Drop or Click to Upload</p>
            </div>
            <Button variant="primary" className="mt-4" onClick={() => show('Logo updated.')}>
              Update Logo
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Data Retention" />
          <div className="p-5 space-y-4">
            <Input
              label="Minimum record age before Archive is allowed"
              type="number"
              value={archiveAge}
              onChange={(e) => setArchiveAge(Number(e.target.value))}
              hint="Jobs and companies younger than this can't be archived yet."
            />
            <Button variant="primary" onClick={() => show(`Archive age threshold saved: ${archiveAge} days.`)}>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader
          title="Platform Gateway"
          subtitle="The fallback gateway for companies that haven't connected their own — see FIN-W-002"
        />
        <div className="px-5 py-4">
          <p className="text-xs text-slate-500 mb-4">
            Each company independently chooses "platform's gateway" or "own gateway" in its own Settings. Companies
            on their own gateway never route through this configuration or appear in the Platform Wallet.
          </p>
          <PaymentGatewayList
            state={gatewayState}
            onChange={patchGateway}
            onTestConnection={(p) => testConnection(p, () => show(`${GATEWAY_PROVIDER_LABELS[p]} connection verified.`))}
            activeProvider={activeGateway}
            onSetActive={setActiveGateway}
          />
        </div>
      </Card>

      <div className="mt-5">
        <TwilioConfigCard
          title="Platform Dispatch Line"
          subtitle="Not used for per-job masking — companies supply their own number for that. This line only receives calls routed back to the platform when no active job or company binding applies."
          state={twilio}
          onChange={(patch) => setTwilio((t) => ({ ...t, ...patch }))}
          onTestConnection={() => { setTwilio((t) => ({ ...t, status: 'connected', lastVerifiedAt: new Date().toISOString() })); show('Twilio connection verified.') }}
        />
      </div>
    </div>
  )
}
