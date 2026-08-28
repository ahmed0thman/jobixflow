import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input, SecretInput } from '../ui/Form'
import { Toggle } from '../ui/Toggle'
import { ConnectionStatusPill, type IntegrationConnectionStatus } from '../ui/Pill'

/**
 * The three gateways named in the client's written requirements file — Stripe,
 * Square, Authorize.net. The client separately named Stripe/PayPal/Authorize.net
 * verbally in a follow-up meeting; per source precedence the written file wins,
 * so PayPal is not modeled here. The contradiction is tracked as an open
 * question (Q-03), not something a settings form should silently resolve.
 */
export const GATEWAY_PROVIDERS = ['stripe', 'square', 'authorize_net'] as const
export type GatewayProvider = (typeof GATEWAY_PROVIDERS)[number]

export const GATEWAY_PROVIDER_LABELS: Record<GatewayProvider, string> = {
  stripe: 'Stripe',
  square: 'Square',
  authorize_net: 'Authorize.net',
}

const GATEWAY_FIELD_CONFIG: Record<GatewayProvider, { keyLabel: string; keyPlaceholder: string; secretLabel: string; secretPlaceholder: string }> = {
  stripe: { keyLabel: 'Publishable Key', keyPlaceholder: 'pk_live_...', secretLabel: 'Secret Key', secretPlaceholder: 'sk_live_...' },
  square: { keyLabel: 'Application ID', keyPlaceholder: 'sq0idp-...', secretLabel: 'Access Token', secretPlaceholder: 'EAAAE...' },
  authorize_net: { keyLabel: 'API Login ID', keyPlaceholder: '5KP3u95...', secretLabel: 'Transaction Key', secretPlaceholder: '4Ktq9nJ...' },
}

export interface GatewayCredentialState {
  enabled: boolean
  key: string
  secret: string
  status: IntegrationConnectionStatus
}

export type GatewayCredentialMap = Record<GatewayProvider, GatewayCredentialState>

export function makeEmptyGatewayState(): GatewayCredentialMap {
  return {
    stripe: { enabled: false, key: '', secret: '', status: 'not_connected' },
    square: { enabled: false, key: '', secret: '', status: 'not_connected' },
    authorize_net: { enabled: false, key: '', secret: '', status: 'not_connected' },
  }
}

interface PaymentGatewayListProps {
  state: GatewayCredentialMap
  onChange: (provider: GatewayProvider, patch: Partial<GatewayCredentialState>) => void
  onTestConnection: (provider: GatewayProvider) => void
  /** Which enabled gateway actually processes payments. Omit when only one gateway can ever exist (e.g. platform-level). */
  activeProvider?: GatewayProvider | null
  onSetActive?: (provider: GatewayProvider) => void
}

/** One credential card per provider, stacked vertically — reused by both Platform and Company Admin settings. */
export function PaymentGatewayList({ state, onChange, onTestConnection, activeProvider, onSetActive }: PaymentGatewayListProps) {
  return (
    <div className="divide-y divide-slate-100">
      {GATEWAY_PROVIDERS.map((provider) => {
        const cred = state[provider]
        const fields = GATEWAY_FIELD_CONFIG[provider]
        const canSetActive = onSetActive && cred.enabled

        return (
          <div key={provider} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <p className="text-sm font-semibold text-slate-800">{GATEWAY_PROVIDER_LABELS[provider]}</p>
                <ConnectionStatusPill status={cred.status} />
              </div>
              <Toggle checked={cred.enabled} onChange={(enabled) => onChange(provider, { enabled, status: 'not_connected' })} />
            </div>

            {cred.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={fields.keyLabel}
                  placeholder={fields.keyPlaceholder}
                  value={cred.key}
                  onChange={(e) => onChange(provider, { key: e.target.value, status: 'not_connected' })}
                />
                <SecretInput
                  label={fields.secretLabel}
                  placeholder={fields.secretPlaceholder}
                  value={cred.secret}
                  onChange={(e) => onChange(provider, { secret: e.target.value, status: 'not_connected' })}
                />
                <div className="col-span-2 flex items-center justify-between">
                  {canSetActive ? (
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        checked={activeProvider === provider}
                        onChange={() => onSetActive!(provider)}
                        className="accent-blue-600"
                      />
                      Active gateway — processes live payments
                    </label>
                  ) : <span />}
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!cred.key || !cred.secret}
                    disabledReason="Enter both credentials before testing the connection"
                    onClick={() => onTestConnection(provider)}
                  >
                    Test Connection
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Convenience hook so each Settings page doesn't re-derive the same mock verify behavior. */
export function useGatewayState(initial: GatewayCredentialMap = makeEmptyGatewayState()) {
  const [state, setState] = useState<GatewayCredentialMap>(initial)

  function patch(provider: GatewayProvider, p: Partial<GatewayCredentialState>) {
    setState((s) => ({ ...s, [provider]: { ...s[provider], ...p } }))
  }

  function testConnection(provider: GatewayProvider, onResult: (ok: boolean) => void) {
    // Prototype-only: any filled-in credential pair "verifies" successfully.
    patch(provider, { status: 'connected' })
    onResult(true)
  }

  return { state, patch, testConnection }
}
