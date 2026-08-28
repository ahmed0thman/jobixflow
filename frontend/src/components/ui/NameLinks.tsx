import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

interface NameLinksProps {
  names: string[]
  /** Where a given name navigates to — typically a pre-filtered list. */
  href: (name: string) => string
  /** Plural noun shown when the list collapses, e.g. "dispatchers". */
  noun: string
  emptyLabel?: string
}

/**
 * A person-name table cell. One name renders as a plain link; several collapse
 * to a count that opens a floating list on hover or focus, where each name is
 * its own link. The list is portalled to the body so the table's horizontal
 * scroll container cannot clip it.
 */
export function NameLinks({ names, href, noun, emptyLabel = '—' }: NameLinksProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  if (names.length === 0) return <span className="text-slate-300">{emptyLabel}</span>

  if (names.length === 1) {
    return (
      <Link to={href(names[0])} className="text-blue-600 hover:text-blue-700 hover:underline">
        {names[0]}
      </Link>
    )
  }

  function show() {
    clearTimeout(closeTimer.current)
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setPos({ top: rect.bottom + 6, left: Math.min(rect.left, window.innerWidth - 240) })
    }
    setOpen(true)
  }

  function hide() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <>
      <button
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={show}
        className="text-blue-600 hover:text-blue-700 hover:underline decoration-dotted underline-offset-2"
      >
        {names.length} {noun}
      </button>

      {open && pos && createPortal(
        <div
          onMouseEnter={() => clearTimeout(closeTimer.current)}
          onMouseLeave={hide}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1"
        >
          <p className="px-3 pt-1 pb-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            {names.length} {noun}
          </p>
          {names.map((name) => (
            <Link
              key={name}
              to={href(name)}
              onClick={() => setOpen(false)}
              className="block px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-700 truncate"
            >
              {name}
            </Link>
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}
