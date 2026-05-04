import { cn } from "@/lib/utils"

type Props = {
  score: number // 0–100
  size?: number
  thickness?: number
  label?: string
  className?: string
}

/**
 * Circular SVG gauge for the headline health score. Pure SVG (no client JS),
 * stroke-dasharray drives the arc length.
 */
export function HealthScore({
  score,
  size = 160,
  thickness = 12,
  label = "Health",
  className,
}: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  const color =
    clamped >= 80
      ? "var(--color-success)"
      : clamped >= 60
        ? "var(--color-warning)"
        : "var(--color-destructive)"

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label} ${clamped}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular tracking-tight">{clamped}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
          {label}
        </span>
      </div>
    </div>
  )
}
