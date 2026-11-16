import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'pill'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#7B5E4A]/30 active:scale-[0.98]'

  const variantStyles = {
    primary: 'bg-[#7B5E4A] hover:bg-[#3B2A20] text-white shadow-sm shadow-[#7B5E4A]/25 font-semibold',
    secondary: 'bg-[#F2E7D5] hover:bg-[#E7D9C3] text-[#3B2A20] font-semibold border border-[#D1B89A]/50',
    outline: 'border border-[#D1B89A] bg-white hover:bg-[#FAF7F0] text-[#3B2A20] font-semibold',
    ghost: 'bg-transparent hover:bg-[#F2E7D5]/70 text-[#7B5E4A] font-medium',
    danger: 'bg-[#8F3325] hover:bg-[#72271C] text-white shadow-sm shadow-[#8F3325]/25 font-semibold',
    pill: 'bg-[#7B5E4A] hover:bg-[#3B2A20] text-white rounded-full p-2 shadow-sm shadow-[#7B5E4A]/25',
  }

  const sizeStyles = {
    xs: 'text-[11px] px-2.5 py-1 gap-1 rounded-xl',
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-3xl',
    icon: 'p-2.5 aspect-square',
  }

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        variant !== 'pill' && sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
