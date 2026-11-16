import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-[#F2E7D5] text-[#7B5E4A] border border-[#D1B89A]',
    secondary: 'bg-[#FAF7F0] text-[#3B2A20] border border-[#D1B89A]/70',
    success: 'bg-[#EBF2EA] text-[#365A3B] border border-[#BDD6BD]',
    warning: 'bg-[#FAF0DE] text-[#A67C52] border border-[#E8D4BE]',
    danger: 'bg-[#FDF0EE] text-[#8F3325] border border-[#F3C3BC]',
    outline: 'bg-transparent text-[#7B5E4A] border border-[#D1B89A]',
  }

  const sizeStyles = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide',
    md: 'text-[10.5px] font-semibold px-2.5 py-1 rounded-full tracking-wide',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
