import { useState } from 'react'
import { List, Map as MapIcon, Search } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Form'
import { TechnicianStatusPill } from '../ui/Pill'
import { cn } from '../../lib/utils'
import { toMapPercent } from '../../lib/mapUtils'
import { technicians, companyCenters } from '../../data/mock'
import { TECHNICIAN_STATUS_LABELS, type Technician } from '../../types'

export function AssignTechnicianModal({
  open,
  onClose,
  onConfirm,
  companyId,
  subtitle,
  title = 'Assign to Technician',
  confirmLabel = 'Assign',
  excludeTechnicianId,
  requireReason = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: (technician: Technician, reason?: string) => void
  companyId: string
  subtitle?: string
  title?: string
  confirmLabel?: string
  excludeTechnicianId?: string
  requireReason?: boolean
}) {
  const [techId, setTechId] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [reason, setReason] = useState('')

  const roster = technicians.filter((t) => t.companyId === companyId && t.id !== excludeTechnicianId)
  const filtered = search.trim()
    ? roster.filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase()) || t.skills.some((s) => s.toLowerCase().includes(search.trim().toLowerCase())))
    : roster
  const selected = roster.find((t) => t.id === techId)
  const canConfirm = !!techId && (!requireReason || reason.trim().length > 0)

  function close() {
    onClose()
    setTechId('')
    setSearch('')
    setReason('')
    setView('list')
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      subtitle={subtitle}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!canConfirm}
            disabledReason={!techId ? 'Select an available technician first' : 'Enter a reason first'}
            onClick={() => {
              if (!selected) return
              onConfirm(selected, requireReason ? reason.trim() : undefined)
              setTechId('')
              setReason('')
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {roster.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">No other technicians on this company's roster.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0">
              <button
                type="button"
                onClick={() => setView('list')}
                className={cn('flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md', view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                type="button"
                onClick={() => setView('map')}
                className={cn('flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md', view === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
              >
                <MapIcon className="w-3.5 h-3.5" /> Map
              </button>
            </div>
          </div>

          {view === 'list' ? (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {filtered.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No technicians match this search.</p>}
              {filtered.map((t) => {
                const eligible = t.status === 'available'
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!eligible}
                    title={!eligible ? `${t.name} is currently ${TECHNICIAN_STATUS_LABELS[t.status].toLowerCase()} — only available technicians can be assigned` : undefined}
                    onClick={() => setTechId(t.id)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors',
                      !eligible && 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200',
                      eligible && techId === t.id && 'border-blue-500 bg-blue-50',
                      eligible && techId !== t.id && 'border-slate-200 hover:bg-slate-50',
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.activeJobsCount} active job{t.activeJobsCount === 1 ? '' : 's'}</p>
                    </div>
                    <TechnicianStatusPill status={t.status} />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="relative h-72 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />
              {filtered.map((t) => {
                const eligible = t.status === 'available'
                const pos = toMapPercent(t.lat, t.lng, companyCenters[companyId])
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!eligible}
                    onClick={() => setTechId(t.id)}
                    style={pos}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    title={eligible ? t.name : `${t.name} — ${TECHNICIAN_STATUS_LABELS[t.status]}`}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 shadow',
                        eligible ? 'bg-green-500 border-green-600' : 'bg-slate-300 border-slate-400',
                        techId === t.id && 'ring-2 ring-offset-2 ring-blue-500',
                      )}
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[10px] font-medium text-slate-600 bg-white px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                      {t.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {requireReason && (
            <Textarea
              label="Reason for transfer"
              required
              placeholder="Why is this job moving to a different technician?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
        </div>
      )}
    </Modal>
  )
}
