import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usage } from "@/lib/mock-data"

const Bar = ({ used, total }: { used: number; total: number }) => {
  const pct = Math.min(100, Math.round((used / total) * 100))
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary/70"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

const Row = ({
  label,
  used,
  total,
  unit,
}: {
  label: string
  used: number
  total: number
  unit: string
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className="text-muted-foreground tabular">
        {used.toLocaleString()} / {total.toLocaleString()} {unit}
      </span>
    </div>
    <Bar used={used} total={total} />
  </div>
)

export function UsagePanel() {
  const resets = new Date(usage.resetsAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-medium">This month's usage</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Resets on {resets}</p>
        </div>
        <Button asChild size="sm" variant="outline" className="bg-transparent">
          <Link href="/billing">Manage</Link>
        </Button>
      </div>
      <div className="space-y-4">
        <Row label="Pages crawled" used={usage.pagesCrawled} total={usage.pagesQuota} unit="pages" />
        <Row label="AI credits" used={usage.aiCredits} total={usage.aiCreditsQuota} unit="credits" />
        <Row label="Team seats" used={usage.seats} total={usage.seatsQuota} unit="seats" />
      </div>
    </div>
  )
}
