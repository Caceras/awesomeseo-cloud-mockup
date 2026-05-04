import { cn } from "@/lib/utils"

// AwesomeSEO mark — mirrors the extension's 128px icon: a deep navy
// rounded square with a pink-to-white mountain peak silhouette.
// SVG so it stays crisp at every size and inherits theme tokens.

export function AwesomeLogo({
  className,
  size = 32,
  withBackground = true,
}: {
  className?: string
  size?: number
  withBackground?: boolean
}) {
  const radius = size * 0.22

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="AwesomeSEO"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="awl-peak" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.78 0.14 350)" />
          <stop offset="55%" stopColor="oklch(0.88 0.09 350)" />
          <stop offset="100%" stopColor="oklch(0.98 0.02 350)" />
        </linearGradient>
        <linearGradient id="awl-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.19 0.04 260)" />
          <stop offset="100%" stopColor="oklch(0.14 0.04 260)" />
        </linearGradient>
      </defs>

      {withBackground && (
        <rect
          x="0"
          y="0"
          width="64"
          height="64"
          rx={radius * (64 / size)}
          fill="url(#awl-bg)"
        />
      )}

      {/* Mountain peak — clipped so it sits flush to the bottom edge */}
      <g
        clipPath={
          withBackground ? "inset(0 round 14px)" : undefined
        }
      >
        <path
          d="M8 56 L28 18 L36 32 L40 26 L56 56 Z"
          fill="url(#awl-peak)"
        />
        {/* Inner highlight stripe to add dimension */}
        <path
          d="M28 18 L34 28 L30 30 Z"
          fill="oklch(1 0 0 / 0.35)"
        />
      </g>
    </svg>
  )
}
