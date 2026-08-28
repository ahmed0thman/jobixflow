import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ToastItem {
  id: number
  message: string
  tone: 'success' | 'info'
}

interface ToastContextValue {
  show: (message: string, tone?: 'success' | 'info') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, tone: 'success' | 'info' = 'success') => {
    const id = ++toastId
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-2 rounded-lg shadow-lg border px-4 py-3 text-sm font-medium min-w-72 bg-white animate-in',
              t.tone === 'success' ? 'border-green-200 text-green-800' : 'border-blue-200 text-blue-800',
            )}
          >
            {t.tone === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
