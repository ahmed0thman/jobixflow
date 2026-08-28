import { cn } from '../../lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  hint?: string
  disabled?: boolean
}

/** Labeled on/off switch — used wherever a setting is enabled rather than filled in. */
export function Toggle({ checked, onChange, label, hint, disabled }: ToggleProps) {
  return (
    <label className={cn('flex items-center justify-between gap-3', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}>
      {(label || hint) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-slate-700">{label}</span>}
          {hint && <span className="block text-xs text-slate-400 mt-0.5">{hint}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-slate-200',
          disabled && 'cursor-not-allowed',
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4.5' : 'translate-x-1',
          )}
        />
      </button>
    </label>
  )
}
