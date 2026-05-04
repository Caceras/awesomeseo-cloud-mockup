import { notFound } from "next/navigation"
import { ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { projectById, webVitals, pagePerf } from "@/lib/mock-data"

// One question: are my Core Web Vitals passing, and which pages drag them down?

function classify(v: { value: number; good: number; poor: number; metric: string }) {
  if (v.value <= v.good) return "good"
  if (v.value >= v.poor) return "poor"
  return "needs-improvement"
}

const statusStyles = {
  good: "bg-success/15 text-success ring-success/30",
  "needs-improvement": "bg-warning/15 text-warning ring-warning/30",
  poor: "bg-destructive/15 text-destructive ring-destructive/30",
} as const

export default async function PerformancePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  return (
    <div className="mx-auto max-w-6xl py-10 space-y-10">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Core Web Vitals
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Are my pages fast enough?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Field-data thresholds from Google. A page passes Core Web Vitals when LCP,
          INP and CLS are all in the green band at the 75th percentile.
        </p>
      </header>

      {/* Vitals: one card per metric, hero treatment */}
      <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {webVitals.map((v) => {
          const s = classify(v)
          const ratio = Math.min(1, v.value / v.poor)
          return (
            <div
              key={v.metric}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide">{v.metric}</span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md ring-1",
                    statusStyles[s],
                  )}
                >
                  {s === "good" ? "Good" : s === "poor" ? "Poor" : "Needs work"}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tabular leading-none">
                  {v.unit === "ms" ? v.value : v.value.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">{v.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground">{v.label}</div>
              {/* Threshold bar */}
              <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0",
                    s === "good"
                      ? "bg-success"
                      : s === "poor"
                        ? "bg-destructive"
                        : "bg-warning",
                  )}
                  style={{ width: `${Math.max(6, ratio * 100)}%` }}
                />
                {/* good/poor markers */}
                <div
                  className="absolute inset-y-0 w-px bg-foreground/30"
                  style={{ left: `${(v.good / v.poor) * 100}%` }}
                  aria-hidden
                />
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-success">
                <ArrowDownRight className="size-3" />
                {v.unit === "ms" ? Math.abs(v.delta) : Math.abs(v.delta).toFixed(2)}
                {v.unit} <span className="text-muted-foreground">vs last crawl</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Worst offenders */}
      <section>
        <header className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-medium">Slowest pages first</h2>
            <p className="text-xs text-muted-foreground">
              Sorted by LCP. Fix these and the 75th percentile follows.
            </p>
          </div>
        </header>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Page</th>
                <th className="text-right font-medium px-4 py-2.5">LCP</th>
                <th className="text-right font-medium px-4 py-2.5">INP</th>
                <th className="text-right font-medium px-4 py-2.5">CLS</th>
                <th className="text-right font-medium px-4 py-2.5">TTFB</th>
                <th className="text-right font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...pagePerf]
                .sort((a, b) => b.lcp - a.lcp)
                .map((p) => (
                  <tr key={p.url} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs truncate max-w-[280px]">
                      {project.domain}
                      {p.url}
                    </td>
                    <td className="px-4 py-3 text-right tabular">
                      {p.lcp.toFixed(1)}s
                    </td>
                    <td className="px-4 py-3 text-right tabular">{p.inp}ms</td>
                    <td className="px-4 py-3 text-right tabular">
                      {p.cls.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular">
                      {p.ttfb.toFixed(1)}s
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md ring-1",
                          statusStyles[p.status],
                        )}
                      >
                        {p.status === "needs-improvement" ? "Needs work" : p.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
