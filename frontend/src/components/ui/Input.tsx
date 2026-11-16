import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] font-bold uppercase tracking-wider text-[#7B5E4A]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#7B5E4A]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full bg-[#FAF7F0] border border-[#D1B89A] rounded-2xl px-4 py-2.5 text-[14px] text-[#3B2A20] placeholder:text-[#A67C52]/50 transition-colors',
            'focus:outline-none focus:border-[#7B5E4A] focus:ring-2 focus:ring-[#7B5E4A]/20 focus:bg-white',
            icon && 'pl-11',
            error && 'border-rose-400 focus:border-rose-600 focus:ring-rose-200',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-[11.5px] text-[#8F3325] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11.5px] text-[#7B5E4A]">{helperText}</p>
      ) : null}
    </div>
  )
}
