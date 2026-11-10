interface PlateRingProps {
  current: number
  target: number
  label: string
  color?: string
  size?: number
}

export function PlateRing({
  current,
  target,
  label,
  color = 'var(--color-protein)',
  size = 180,
}: PlateRingProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="font-heading text-4xl font-bold tabular-nums" style={{ color }}>
          {current}
        </span>
        <span className="text-sm text-text-secondary">
          of {target} g {label}
        </span>
      </div>
    </div>
  )
}
