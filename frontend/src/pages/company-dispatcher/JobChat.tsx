import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquarePlus, Send } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { jobs, companyDispatcherUser } from '../../data/mock'
import { PermissionDeniedState } from '../../components/ui/States'
import { cn } from '../../lib/utils'

type ThreadMessage = { from: string; text: string; mine?: boolean; system?: boolean }

export function JobChat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const [thread, setThread] = useState<'main' | 'internal'>('main')
  const job = jobs.find((j) => j.id === id)

  const [mainMessages, setMainMessages] = useState<ThreadMessage[]>(
    job?.reassignment
      ? [
          { from: job.reassignment.fromTechnicianName, text: 'On my way now, ETA 15 minutes.' },
          { from: companyDispatcherUser.name, text: 'Got it — customer confirmed they\'ll be at the vehicle.', mine: true },
          { from: '', text: `Reassigned from ${job.reassignment.fromTechnicianName} to ${job.reassignment.toTechnicianName} — ${job.reassignment.reason}`, system: true },
          { from: job.reassignment.toTechnicianName, text: 'Picking this up now, heading over.' },
          { from: companyDispatcherUser.name, text: 'Thanks, keep me posted.', mine: true },
        ]
      : [
          { from: job?.technicianName ?? 'Technician', text: 'On my way now, ETA 15 minutes.' },
          { from: companyDispatcherUser.name, text: 'Got it — customer confirmed they\'ll be at the vehicle.', mine: true },
        ],
  )
  const [internalMessages, setInternalMessages] = useState<ThreadMessage[]>([
    { from: 'Kailee Reichel (Platform Dispatcher)', text: 'Heads up — customer called back once already about ETA.' },
  ])
  const [draft, setDraft] = useState('')

  if (!job) {
    return <PermissionDeniedState reason="This job doesn't exist or isn't visible to your role." />
  }

  function send() {
    if (!draft.trim()) return
    const msg: ThreadMessage = { from: companyDispatcherUser.name, text: draft.trim(), mine: true }
    if (thread === 'main') setMainMessages((m) => [...m, msg])
    else setInternalMessages((m) => [...m, msg])
    setDraft('')
  }

  const messages = thread === 'main' ? mainMessages : internalMessages

  return (
    <div>
      <button onClick={() => navigate(`/company-dispatcher/jobs/${job.id}`)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to {job.displayId}
      </button>

      <PageHeader
        title={`Chat — ${job.displayId}`}
        subtitle={`${job.customerName} · ${job.technicianName ?? 'Unassigned'}`}
        action={
          <Button variant="secondary" icon={<MessageSquarePlus className="w-4 h-4" />} onClick={() => show('New thread started.')}>
            Start New Chat
          </Button>
        }
      />

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
          {messages.map((m, i) =>
            m.system ? (
              <div key={i} className="flex justify-center">
                <span className="text-xs text-slate-500 bg-slate-100 rounded-full px-3 py-1 text-center">{m.text}</span>
              </div>
            ) : (
              <div key={i} className={cn('max-w-sm rounded-lg px-3 py-2', m.mine ? 'bg-blue-600 text-white ml-auto' : 'bg-white border border-slate-200')}>
                {!m.mine && <p className="text-xs font-medium text-slate-500 mb-0.5">{m.from}</p>}
                <p className={cn('text-sm', m.mine ? 'text-white' : 'text-slate-800')}>{m.text}</p>
              </div>
            ),
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder="Type a message..."
              className="flex-1 text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
            <button onClick={send} className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
