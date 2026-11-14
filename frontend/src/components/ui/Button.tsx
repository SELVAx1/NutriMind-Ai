import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0',
        {
          'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-[0_1px_2px_rgba(0,0,0,0.3)]': variant === 'primary',
          'bg-surface-2 border border-border text-text hover:bg-surface-3 hover:border-text-dim/50': variant === 'secondary',
          'text-text-muted hover:text-text hover:bg-surface-2': variant === 'ghost',
          'bg-danger text-white hover:bg-red-500': variant === 'danger',
          'bg-accent text-black hover:bg-accent-light font-semibold': variant === 'accent',
        },
        {
          'h-7 px-2.5 text-xs gap-1': size === 'xs',
          'h-8 px-3 text-xs gap-1.5': size === 'sm',
          'h-9 px-4 text-sm gap-2': size === 'md',
          'h-10 px-5 text-sm gap-2': size === 'lg',
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
