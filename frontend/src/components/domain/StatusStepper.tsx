import { Check, Eye } from 'lucide-react'
import { cn } from '../../lib/utils'
import { JOB_STATUS_FLOW, JOB_STATUS_LABELS, type JobStatus } from '../../types'
import { Button } from '../ui/Button'
import { StatusPill } from '../ui/Pill'

interface StatusStepperProps {
  status: JobStatus
  /** Omit onAdvance/onCancel for a role that can only view the pipeline. */
  onAdvance?: () => void
  onCancel?: () => void
  canAdvance?: boolean
}

export function StatusStepper({ status, onAdvance, onCancel, canAdvance = true }: StatusStepperProps) {
  const interactive = !!(onAdvance || onCancel)
  const isTerminal = status === 'completed' || status === 'cancelled' || status === 'archived'
  const isRefused = status === 'company_refused' || status === 'technician_refused'

  if (isRefused) {
    return (
      <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        <div>
          <StatusPill status={status} />
          <p className="text-xs text-red-700 mt-1">This branch requires dispatcher intervention — reassign to continue.</p>
        </div>
      </div>
    )
  }

  const idx = JOB_STATUS_FLOW.indexOf(status)
  const nextStatus = idx >= 0 && idx < JOB_STATUS_FLOW.length - 1 ? JOB_STATUS_FLOW[idx + 1] : null

  return (
    <div>
      {!interactive && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <Eye className="w-3.5 h-3.5" />
          Status is updated by the assigned technician and dispatcher
        </div>
      )}
      <div className="flex items-center overflow-x-auto pb-1">
        {JOB_STATUS_FLOW.map((s, i) => {
          const stepIdx = JOB_STATUS_FLOW.indexOf(status)
          const done = i < stepIdx || status === 'completed'
          const current = i === stepIdx && status !== 'completed'
          const isLast = i === JOB_STATUS_FLOW.length - 1
          return (
            <div key={s} className="flex items-center shrink-0">
              <div className="flex flex-col items-center gap-1.5 w-19">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 shrink-0',
                    done && 'bg-green-500 border-green-500 text-white',
                    current && 'bg-blue-600 border-blue-600 text-white',
                    !done && !current && 'bg-white border-slate-300 text-slate-400',
                  )}
                >
                  {done ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight',
                    current ? 'text-blue-700 font-medium' : done ? 'text-slate-600' : 'text-slate-400',
                  )}
                >
                  {JOB_STATUS_LABELS[s]}
                </span>
              </div>
              {!isLast && <div className={cn('h-0.5 w-3 shrink-0 -mt-4', done ? 'bg-green-500' : 'bg-slate-200')} />}
            </div>
          )
        })}
      </div>

      {interactive && !isTerminal && (
        <div className="flex items-center gap-2 mt-4">
          {nextStatus && onAdvance && (
            <Button
              variant="primary"
              onClick={onAdvance}
              disabled={!canAdvance}
              disabledReason="Waiting on a prerequisite action before this job can advance."
            >
              Advance to "{JOB_STATUS_LABELS[nextStatus]}"
            </Button>
          )}
          {onCancel && (
            <Button variant="danger" onClick={onCancel}>
              Cancel Job
            </Button>
          )}
        </div>
      )}
      {interactive && isTerminal && status === 'completed' && (
        <p className="text-xs text-green-700 mt-3 font-medium">This job is closed. No further status changes are possible.</p>
      )}
    </div>
  )
}
