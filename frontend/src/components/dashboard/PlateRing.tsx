interface PlateRingProps { current: number; target: number; label: string; color?: string; size?: number }

export function PlateRing({ current, target, label, color = '#10B981', size = 180 }: PlateRingProps) {
  const pct = Math.min((current / target) * 100, 100)
  const sw = 10, r = (size - sw) / 2, c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#18181B" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[28px] font-bold tabular-nums" style={{ color }}>{Math.round(current)}</span>
        <span className="text-[11px] text-text-muted">of {target}g {label}</span>
      </div>
    </div>
  )
}
