import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Send } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { jobs } from '../../data/mock'
import { PermissionDeniedState } from '../../components/ui/States'
import { cn } from '../../lib/utils'

export function JobChat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [thread, setThread] = useState<'main' | 'internal'>('main')
  const job = jobs.find((j) => j.id === id)

  if (!job) {
    return <PermissionDeniedState reason="This job doesn't exist or isn't visible to your role." />
  }

  type ThreadMessage = { from: string; text: string; system?: boolean }

  const mainThread: ThreadMessage[] = job.reassignment
    ? [
        { from: job.reassignment.fromTechnicianName, text: 'On my way, ETA 15 minutes.' },
        { from: 'Company Dispatcher', text: 'Got it, customer notified.' },
        { from: '', text: `Job reassigned from ${job.reassignment.fromTechnicianName} to ${job.reassignment.toTechnicianName} — ${job.reassignment.reason}`, system: true },
        { from: job.reassignment.toTechnicianName, text: 'Picking this up now, heading over.' },
        { from: 'Company Dispatcher', text: 'Thanks, keep me posted.' },
      ]
    : [
        { from: job.technicianName ?? 'Technician', text: 'On my way, ETA 15 minutes.' },
        { from: 'Company Dispatcher', text: 'Got it, customer notified.' },
      ]

  const messages: Record<'main' | 'internal', ThreadMessage[]> = {
    main: mainThread,
    internal: [
      { from: 'Platform Dispatcher', text: 'Customer called back, confirmed address is correct.' },
      { from: 'Company Dispatcher', text: 'Thanks, passing that to the technician.' },
    ],
  }

  return (
    <div>
      <button onClick={() => navigate(`/platform-admin/jobs/${job.id}`)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to {job.displayId}
      </button>

      <PageHeader title={`Chat — ${job.displayId}`} subtitle={`${job.customerName} · ${job.companyName}`} />

      <Card className="max-w-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setThread('main')}
              className={cn('text-xs font-medium px-3 py-1.5 rounded-md', thread === 'main' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            >
              Job Thread
            </button>
            <button
              onClick={() => setThread('internal')}
              className={cn('text-xs font-medium px-3 py-1.5 rounded-md', thread === 'internal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
            >
              Internal
            </button>
          </div>
          <span className="text-xs text-slate-400">2 active chats</span>
        </div>

        <div className="p-5 h-80 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages[thread].map((m, i) =>
            m.system ? (
              <div key={i} className="flex justify-center">
                <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1 text-center">{m.text}</span>
              </div>
            ) : (
              <div key={i} className="max-w-sm bg-white border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-slate-500 mb-0.5">{m.from}</p>
                <p className="text-sm text-slate-800">{m.text}</p>
              </div>
            ),
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              disabled
              placeholder="You don't have permission to send messages"
              className="flex-1 text-sm rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400 cursor-not-allowed"
            />
            <button disabled className="p-2 rounded-lg bg-slate-100 text-slate-300 cursor-not-allowed" title="You don't have permission to send messages">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> You can view this conversation but can't send messages.
          </p>
        </div>
      </Card>
    </div>
  )
}
