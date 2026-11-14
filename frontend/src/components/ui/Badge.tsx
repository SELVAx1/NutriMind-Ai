import { clsx } from 'clsx'

interface BadgeProps {
  children: string
  variant?: 'default' | 'vegan' | 'protein' | 'budget' | 'quick' | 'warning' | 'success' | 'calories' | 'carbs' | 'fat'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center font-medium rounded-md',
      { 'h-5 px-1.5 text-[10px]': size === 'sm', 'h-6 px-2 text-xs': size === 'md' },
      {
        'bg-surface-3 text-text-muted': variant === 'default',
        'bg-emerald-500/15 text-emerald-400': variant === 'vegan' || variant === 'success',
        'bg-violet-500/15 text-violet-400': variant === 'protein',
        'bg-amber-500/15 text-amber-400': variant === 'budget' || variant === 'calories',
        'bg-teal-500/15 text-teal-400': variant === 'quick',
        'bg-red-500/15 text-red-400': variant === 'warning' || variant === 'fat',
        'bg-blue-500/15 text-blue-400': variant === 'carbs',
      }
    )}>{children}</span>
  )
}
