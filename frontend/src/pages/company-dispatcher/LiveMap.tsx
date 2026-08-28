import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navigation, Users, Wrench } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card'
import { TechnicianStatusPill } from '../../components/ui/Pill'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { toMapPercent } from '../../lib/mapUtils'
import { jobs, technicians as seedTechnicians, companyCenters, companyDispatcherUser } from '../../data/mock'
import { TECHNICIAN_STATUS_LABELS, type TechnicianStatus } from '../../types'

const MY_COMPANY_ID = companyDispatcherUser.companyId

function toPercent(lat: number, lng: number) {
  return toMapPercent(lat, lng, companyCenters[MY_COMPANY_ID])
}

const statusDotTone: Record<TechnicianStatus, string> = {
  available: 'bg-green-500 border-green-600',
  busy: 'bg-amber-500 border-amber-600',
  off_duty: 'bg-slate-400 border-slate-500',
  offline: 'bg-slate-300 border-slate-400',
}

export function LiveMap() {
  const navigate = useNavigate()
  const [showTechnicians, setShowTechnicians] = useState(true)
  const [showJobs, setShowJobs] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const roster = seedTechnicians.filter((t) => t.companyId === MY_COMPANY_ID)
  const pinnedJobs = jobs.filter((j) => j.companyId === MY_COMPANY_ID && j.location && !['completed', 'cancelled', 'archived'].includes(j.status))

  const selected = roster.find((t) => t.id === selectedId) ?? null

  const linkedJob = useMemo(() => {
    if (!selected) return null
    return jobs.find((j) => j.companyId === MY_COMPANY_ID && j.technicianName === selected.name && !['completed', 'cancelled', 'archived'].includes(j.status)) ?? null
  }, [selected])

  const counts = {
    available: roster.filter((t) => t.status === 'available').length,
    busy: roster.filter((t) => t.status === 'busy').length,
    off_duty: roster.filter((t) => t.status === 'off_duty').length,
    offline: roster.filter((t) => t.status === 'offline').length,
  }

  return (
    <div>
      <PageHeader title="Live Map" subtitle="Two layers — live technician locations and jobs pinned on arrival" />

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input type="checkbox" checked={showTechnicians} onChange={(e) => setShowTechnicians(e.target.checked)} className="rounded border-slate-300" />
                  Technicians
                </label>
                <label className="flex items-center gap-1.5 text-sm text-slate-700">
                  <input type="checkbox" checked={showJobs} onChange={(e) => setShowJobs(e.target.checked)} className="rounded border-slate-300" />
                  Job Locations
                </label>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Available ({counts.available})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Busy ({counts.busy})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Off Duty ({counts.off_duty})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Offline ({counts.offline})</span>
              </div>
            </div>

            <div
              className="relative h-130 bg-slate-50"
              style={{
                backgroundImage:
                  'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            >
              {showJobs && pinnedJobs.map((j) => (
                <div
                  key={j.id}
                  title={`${j.displayId} · ${j.address}`}
                  style={toPercent(j.location!.lat, j.location!.lng)}
                  className="absolute -translate-x-1/2 -translate-y-full cursor-help"
                >
                  <div className="w-5 h-5 rounded-full bg-violet-600 border-2 border-white shadow flex items-center justify-center text-white text-[9px] font-bold">
                    J
                  </div>
                </div>
              ))}

              {showTechnicians && roster.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  style={toPercent(t.lat, t.lng)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  title={t.name}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 shadow',
                      statusDotTone[t.status],
                      selectedId === t.id && 'ring-2 ring-offset-2 ring-blue-500',
                    )}
                  />
                </button>
              ))}

              {roster.length === 0 && pinnedJobs.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">Nothing to plot yet</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Available Now" subtitle="Click a technician to see details" />
            <div className="p-4 flex flex-wrap gap-2">
              {roster.filter((t) => t.status === 'available').map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border',
                    selectedId === t.id ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {t.name}
                </button>
              ))}
              {roster.filter((t) => t.status === 'available').length === 0 && (
                <p className="text-sm text-slate-400">No technicians are currently available.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Technician Info" />
            <div className="p-5">
              {!selected ? (
                <p className="text-sm text-slate-400 flex items-center gap-2"><Users className="w-4 h-4" /> Select a technician on the map or the list.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{selected.name}</p>
                    <TechnicianStatusPill status={selected.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone</span>
                    <span className="text-slate-800">{selected.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinates</span>
                    <span className="text-slate-800 font-mono text-xs">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active jobs</span>
                    <span className="text-slate-800">{selected.activeJobsCount}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selected.skills.map((s) => (
                      <span key={s} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                  {linkedJob ? (
                    <Button
                      variant="secondary"
                      className="w-full justify-center mt-2"
                      icon={<Navigation className="w-4 h-4" />}
                      onClick={() => navigate(`/company-dispatcher/jobs/${linkedJob.id}`)}
                    >
                      View Job — {linkedJob.displayId}
                    </Button>
                  ) : (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2"><Wrench className="w-3.5 h-3.5" /> No active job assigned right now.</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Legend" />
            <div className="p-5 space-y-2 text-sm">
              {(Object.entries(TECHNICIAN_STATUS_LABELS) as [TechnicianStatus, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full', statusDotTone[key].split(' ')[0])} />
                  <span className="text-slate-600">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                <span className="text-slate-600">Job location (pinned on arrival)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
