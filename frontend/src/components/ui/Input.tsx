import { clsx } from 'clsx'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="block text-[13px] font-medium text-text-secondary">{label}</label>}
      <input
        id={inputId}
        className={clsx(
          'w-full h-9 px-3 rounded-lg bg-surface-2 text-sm text-text border',
          'placeholder:text-text-dim',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50',
          'transition-all duration-150',
          error ? 'border-danger/60' : 'border-border',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-text-dim">{hint}</p>}
    </div>
  )
}
