import type { ReactNode, HTMLAttributes } from 'react'
import clsx from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'flat' | 'outline' | 'interactive'
  hover?: boolean
}

export function Card({
  children,
  className,
  padding = 'md',
  variant = 'default',
  hover = false,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 md:p-6',
    lg: 'p-5 sm:p-6 md:p-8',
    xl: 'p-6 sm:p-8 md:p-10',
  }

  const variantStyles = {
    default: 'bg-white border border-[#D1B89A]/60 rounded-3xl shadow-[0_4px_20px_rgba(59,42,32,0.04)]',
    flat: 'bg-[#FAF7F0] border border-[#D1B89A]/50 rounded-3xl',
    outline: 'bg-transparent border border-[#D1B89A] rounded-3xl',
    interactive: 'bg-white border border-[#D1B89A]/60 rounded-3xl shadow-sm hover:border-[#7B5E4A] hover:shadow-[0_10px_24px_rgba(59,42,32,0.08)] transition-all cursor-pointer',
  }

  return (
    <div
      className={clsx(
        variantStyles[variant],
        paddingStyles[padding],
        hover && 'hover-lift',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
