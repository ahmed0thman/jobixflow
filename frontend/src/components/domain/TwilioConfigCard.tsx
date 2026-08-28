import { Card, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input, SecretInput } from '../ui/Form'
import { Toggle } from '../ui/Toggle'
import { ConnectionStatusPill, type IntegrationConnectionStatus } from '../ui/Pill'
import { formatDateTime } from '../../lib/utils'

export interface TwilioConfigState {
  accountSid: string
  authToken: string
  phoneNumber: string
  recordCalls: boolean
  status: IntegrationConnectionStatus
  lastVerifiedAt?: string
}

interface TwilioConfigCardProps {
  title: string
  subtitle: string
  state: TwilioConfigState
  onChange: (patch: Partial<TwilioConfigState>) => void
  onTestConnection: () => void
}

/**
 * Shared Twilio credential form — used both for a company's per-job masking
 * number (COM-002/COM-003) and, on the platform side, the platform's own
 * dispatch line (the routing target in COM-005 when a call has no active
 * job). The two are separate accounts serving separate purposes; this
 * component only supplies the shape they share, not the meaning.
 */
export function TwilioConfigCard({ title, subtitle, state, onChange, onTestConnection }: TwilioConfigCardProps) {
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        action={<ConnectionStatusPill status={state.status} />}
      />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Twilio Account SID"
            placeholder="AC..."
            className="font-mono"
            value={state.accountSid}
            onChange={(e) => onChange({ accountSid: e.target.value, status: 'not_connected' })}
          />
          <SecretInput
            label="Twilio Auth Token"
            placeholder="Enter auth token"
            value={state.authToken}
            onChange={(e) => onChange({ authToken: e.target.value, status: 'not_connected' })}
          />
        </div>
        <Input
          label="Twilio Phone Number"
          placeholder="+1-214-555-0142"
          value={state.phoneNumber}
          onChange={(e) => onChange({ phoneNumber: e.target.value, status: 'not_connected' })}
          hint="Can change any time the underlying subscription changes"
        />
        <Toggle
          checked={state.recordCalls}
          onChange={(recordCalls) => onChange({ recordCalls })}
          label="Record Calls"
          hint="Recordings are stored against this number only"
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {state.status === 'connected' && state.lastVerifiedAt
              ? `Last verified ${formatDateTime(state.lastVerifiedAt)}`
              : 'Not yet verified'}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={!state.accountSid || !state.authToken || !state.phoneNumber}
            disabledReason="Fill in the Account SID, Auth Token, and phone number first"
            onClick={onTestConnection}
          >
            Test Connection
          </Button>
        </div>
      </div>
    </Card>
  )
}
