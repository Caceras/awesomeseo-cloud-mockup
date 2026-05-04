import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: React.ReactNode
  hint?: string
  trend?: number // signed delta (e.g. +4 / -8)
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, hint, trend, trendLabel, icon, className }: Props) {
  const trendDir =
    typeof trend === "number" ? (trend > 0 ? "up" : trend < 0 ? "down" : "flat") : null
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 flex flex-col gap-2",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
      </div>
      <div className="text-3xl font-semibold tabular tracking-tight">{value}</div>
      <div className="flex items-center gap-2 text-xs">
        {trendDir ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
              trendDir === "up" && "bg-success/15 text-success",
              trendDir === "down" && "bg-destructive/15 text-destructive",
              trendDir === "flat" && "bg-muted text-muted-foreground",
            )}
          >
            {trendDir === "up" ? (
              <ArrowUp className="size-3" />
            ) : trendDir === "down" ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowRight className="size-3" />
            )}
            {trend! > 0 ? "+" : ""}
            {trend}
            {trendLabel ? ` ${trendLabel}` : "%"}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  )
}
