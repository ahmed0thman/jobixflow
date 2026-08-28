import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, Lock, RotateCw, SearchX } from 'lucide-react'
import { Button } from './Button'

function StateShell({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <StateShell icon={<Inbox className="w-6 h-6" />} title={title} description={description} action={action} />
}

export function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <StateShell
      icon={<SearchX className="w-6 h-6" />}
      title="No results match your filters"
      description="Try widening your date range or removing a filter to see more results."
      action={
        onClear && (
          <Button variant="secondary" onClick={onClear}>
            Clear all filters
          </Button>
        )
      }
    />
  )
}

export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-5 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateShell
      icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
      title="Something went wrong loading this data"
      description="Try again, or come back later."
      action={
        onRetry && (
          <Button variant="secondary" icon={<RotateCw className="w-3.5 h-3.5" />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  )
}

export function PermissionDeniedState({ reason }: { reason?: string }) {
  return (
    <StateShell
      icon={<Lock className="w-6 h-6" />}
      title="You don't have access to this data"
      description={reason ?? 'Your role can reach this screen, but not the underlying records.'}
    />
  )
}
