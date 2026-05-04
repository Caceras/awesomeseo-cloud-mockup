import { notFound } from "next/navigation"
import { ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { projectById, topicClusters } from "@/lib/mock-data"
import { TopicHeatmap } from "@/components/topic-heatmap"

// One question: how does my content cluster around keywords, and where are the gaps?

const compStyles = {
  low: "bg-success/15 text-success ring-success/30",
  medium: "bg-warning/15 text-warning ring-warning/30",
  high: "bg-destructive/15 text-destructive ring-destructive/30",
} as const

export default async function TopicsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const sorted = [...topicClusters].sort((a, b) => a.coverage - b.coverage)
  const avgCoverage = Math.round(
    topicClusters.reduce((s, c) => s + c.coverage, 0) / topicClusters.length,
  )

  return (
    <div className="mx-auto max-w-5xl py-10 space-y-10">
      <header>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Topic clusters
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Where is my topical coverage thin?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Pages are grouped by semantic topic. A cluster is healthy when it has a
          pillar page, supporting articles, and tight internal linking.
        </p>
      </header>

      {/* Hero stat */}
      <section className="rounded-2xl border border-border bg-card p-6 lg:p-8 grid gap-6 sm:grid-cols-[auto_1fr] items-center">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-semibold tabular leading-none">
            {avgCoverage}
          </span>
          <span className="text-2xl text-muted-foreground">%</span>
        </div>
        <div>
          <div className="font-medium">average topical coverage</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Across {topicClusters.length} clusters covering{" "}
            {topicClusters.reduce((s, c) => s + c.pages, 0)} pages. Coverage of 100%
            means every supporting subtopic has at least one indexed page that links
            to the pillar.
          </p>
        </div>
      </section>

      {/* Competitor coverage heatmap — interactive, hover/click to inspect.
          Lives above the cluster grid because it's the highest-signal
          surface on this page: one glance tells you which sub-topics the
          SERP universally covers (must-haves) and which ones nobody owns
          (quick-wins) — both of which inform what we ship next. */}
      <TopicHeatmap />

      {/* Cluster grid */}
      <section>
        <header className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-base font-medium">Clusters, weakest first</h2>
            <p className="text-xs text-muted-foreground">
              Fix the bottom half before adding new topics.
            </p>
          </div>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{c.topic}</h3>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground truncate">
                    {c.keyword}
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md ring-1 shrink-0",
                    compStyles[c.competition],
                  )}
                >
                  {c.competition} comp.
                </span>
              </div>

              {/* Coverage bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Coverage</span>
                  <span className="tabular">{c.coverage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      c.coverage >= 75
                        ? "bg-success"
                        : c.coverage >= 50
                          ? "bg-warning"
                          : "bg-destructive",
                    )}
                    style={{ width: `${c.coverage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground tabular">
                  {c.pages} pages
                </span>
                {c.pillarPage ? (
                  <span className="font-mono text-[11px] text-muted-foreground truncate ml-2">
                    {c.pillarPage}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-warning">
                    <AlertCircle className="size-3" />
                    No pillar page
                  </span>
                )}
              </div>

              {c.gap && (
                <div className="text-xs text-muted-foreground pt-3 border-t border-border flex items-start gap-2">
                  <ArrowRight className="size-3 mt-0.5 text-primary shrink-0" />
                  <span>{c.gap}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
