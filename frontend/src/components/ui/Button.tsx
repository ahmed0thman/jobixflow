import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  disabledReason?: string
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:text-slate-300 disabled:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:text-red-200 disabled:border-red-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-md',
  md: 'text-sm px-4 py-2 gap-2 rounded-lg',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  disabledReason,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const button = (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors whitespace-nowrap disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      title={disabled ? disabledReason : undefined}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
  return button
}
