import { clsx } from 'clsx'

interface BadgeProps {
  children: string
  variant?: 'default' | 'vegan' | 'protein' | 'budget' | 'quick' | 'warning'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        {
          'bg-border-light text-text-secondary': variant === 'default',
          'bg-green-100 text-green-800': variant === 'vegan',
          'bg-blue-100 text-protein': variant === 'protein',
          'bg-amber-100 text-amber-800': variant === 'budget',
          'bg-teal-100 text-fibre': variant === 'quick',
          'bg-red-100 text-danger': variant === 'warning',
        }
      )}
    >
      {children}
    </span>
  )
}
