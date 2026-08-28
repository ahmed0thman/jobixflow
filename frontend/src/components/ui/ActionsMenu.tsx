import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ActionItem {
  key: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  disabledReason?: string
  separatorBefore?: boolean
}

export function ActionsMenu({ items }: { items: ActionItem[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        aria-label="Row actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
          {items.map((item) => (
            <div key={item.key}>
              {item.separatorBefore && <div className="my-1 border-t border-slate-100" />}
              <button
                onClick={() => {
                  if (item.disabled) return
                  item.onClick?.()
                  setOpen(false)
                }}
                disabled={item.disabled}
                title={item.disabled ? item.disabledReason : undefined}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                  item.disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : item.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
