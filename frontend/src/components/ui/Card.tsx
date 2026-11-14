import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  glow?: string
}

export function Card({ children, padding = 'md', hover, glow, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-surface-1',
        'shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0px_1px_rgba(0,0,0,0.3)]',
        hover && 'hover:border-text-dim/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-200',
        {
          '': padding === 'none',
          'p-4': padding === 'sm',
          'p-5': padding === 'md',
          'p-6 lg:p-7': padding === 'lg',
          'p-7 lg:p-8': padding === 'xl',
        },
        className
      )}
      style={glow ? { boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px ${glow}20, 0 0 24px ${glow}10` } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mb-5', className)} {...props}>{children}</div>
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className)} {...props}>{children}</div>
}
