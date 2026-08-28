import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

function FieldWrap({ label, required, hint, children }: { label?: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  )
}

const fieldBase =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  hint?: string
  icon?: ReactNode
}

export function Input({ label, required, hint, icon, className, ...props }: InputProps) {
  return (
    <FieldWrap label={label} required={required} hint={hint}>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input className={cn(fieldBase, icon && 'pl-9', className)} {...props} />
      </div>
    </FieldWrap>
  )
}

/** Masked credential input with a reveal eye — for API secrets, tokens, and auth keys. */
export function SecretInput({ label, required, hint, className, ...props }: InputProps) {
  const [revealed, setRevealed] = useState(false)
  return (
    <FieldWrap label={label} required={required} hint={hint}>
      <div className="relative">
        <input
          type={revealed ? 'text' : 'password'}
          className={cn(fieldBase, 'pr-9 font-mono', className)}
          autoComplete="off"
          {...props}
        />
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={revealed ? 'Hide value' : 'Reveal value'}
          tabIndex={-1}
        >
          {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </FieldWrap>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  hint?: string
}

export function Select({ label, required, hint, className, children, ...props }: SelectProps) {
  return (
    <FieldWrap label={label} required={required} hint={hint}>
      <select className={cn(fieldBase, 'bg-white', className)} {...props}>
        {children}
      </select>
    </FieldWrap>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  hint?: string
}

export function Textarea({ label, required, hint, className, ...props }: TextareaProps) {
  return (
    <FieldWrap label={label} required={required} hint={hint}>
      <textarea className={cn(fieldBase, 'min-h-24 resize-y', className)} {...props} />
    </FieldWrap>
  )
}
