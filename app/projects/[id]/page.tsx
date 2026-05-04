import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react"
import { HealthTrendChartLazy as HealthTrendChart } from "@/components/charts-lazy"
import { EngineRow, projectEngines } from "@/components/engine-logos"
import { EngineBreakdownGrid } from "@/components/engine-breakdown-grid"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { projectById, projectIssues } from "@/lib/mock-data"

// One page = one insight: where does THIS site stand right now and what
// has changed since the last crawl. The hero uses the signature pink
// gradient so the brand DNA carries through from the extension.

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const issues = projectIssues(id)
  const trendUp = project.trend >= 0
  const TrendIcon = trendUp ? ArrowUpRight : ArrowDownRight
  const topThree = [...issues]
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, notice: 2 } as const
      return order[a.severity] - order[b.severity]
    })
    .slice(0, 3)

  return (
    // Widened to max-w-7xl so the five engine cards lay out 5-up at the
    // top of the page; the existing hero and CTA still center cleanly
    // because they're full-bleed inside the wrapper.
    <div className="mx-auto max-w-7xl py-10 lg:py-12 space-y-10">
      {/* AI engine breakdown — pinned to the top of every project so
          users see "where am I weakest right now?" before anything else. */}
      <EngineBreakdownGrid projectId={id} variant="compact" />

      {/* Hero — single insight, brand-aligned signature gradient */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* The signature pink-to-light-pink banner */}
        <div className="relative h-44 lg:h-52 bg-gradient-to-r from-primary via-primary/85 to-primary/40 overflow-hidden">
          <div
            className="absolute inset-0 opacity-25 mix-blend-soft-light"
            style={{
              backgroundImage:
                "radial-gradient(900px 200px at 0% 100%, oklch(1 0 0 / 0.25), transparent), radial-gradient(600px 160px at 100% 0%, oklch(1 0 0 / 0.2), transparent)",
            }}
            aria-hidden
          />

          {/* Health number, mono, anchored bottom-left */}
          <div className="absolute inset-0 flex items-end justify-between p-6 lg:p-8">
            <div className="flex items-end gap-4">
              <div className="text-7xl lg:text-8xl font-semibold tabular leading-none text-primary-foreground tracking-tight">
                {project.health}
              </div>
              <div className="pb-2 lg:pb-3">
                <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
                  Health
                </div>
                <div
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 text-sm font-medium rounded-full px-2.5 py-1",
                    trendUp
                      ? "bg-success/20 text-success-foreground ring-1 ring-success/40"
                      : "bg-destructive/20 text-destructive-foreground ring-1 ring-destructive/40",
                  )}
                >
                  <TrendIcon className="size-3.5" />
                  {trendUp ? "+" : ""}
                  {project.trend} pts
                </div>
              </div>
            </div>

            <div className="hidden md:block text-right text-xs text-primary-foreground/80 max-w-[14rem]">
              <div className="uppercase tracking-wider opacity-80 text-[11px]">
                Last crawl
              </div>
              <div className="mt-1 tabular">{project.lastCrawl}</div>
              <div className="mt-0.5 capitalize">{project.schedule} schedule</div>
            </div>
          </div>
        </div>

        {/* Inline trend below the banner — keeps "1 insight" by staying on
            the same axis (health score over time). */}
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="p-6 lg:p-8 lg:col-span-1 flex flex-col gap-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Snapshot
              </div>
              <p className="mt-3 text-sm leading-relaxed text-pretty">
                <span className="text-foreground font-medium">
                  {project.pages.toLocaleString()}
                </span>{" "}
                pages crawled.{" "}
                <span className="text-destructive">
                  {project.issues.critical} critical
                </span>
                ,{" "}
                <span className="text-warning">{project.issues.warning} warnings</span>,{" "}
                <span className="text-info">{project.issues.notice} notices</span>.
              </p>
            </div>
            <Link
              href={`/projects/${id}/ai-visibility`}
              className="group inline-flex items-center gap-3 self-start rounded-full border border-border bg-card hover:bg-muted/40 hover:border-primary/40 transition-colors py-1.5 pl-1.5 pr-3"
            >
              <EngineRow
                engines={projectEngines(id)}
                size={20}
                max={5}
                ringClassName="ring-card"
                label="AI engines tracked for this project"
              />
              <span className="text-xs text-foreground/80 group-hover:text-foreground">
                Tracked across {projectEngines(id).length} AI engines
              </span>
              <ArrowRight className="size-3 text-muted-foreground -ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="p-6 lg:p-8 lg:col-span-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Health — last 14 days
            </div>
            <HealthTrendChart />
          </div>
        </div>
      </section>

      {/* Single CTA: what to fix next */}
      <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 lg:p-8">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center shrink-0">
            <Sparkles className="size-5 text-primary" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium">The 3 fixes that move the score most</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ranked by traffic-at-risk, our AI says shipping these will lift health
              by an estimated +6 points.
            </p>
            <ul className="mt-4 space-y-2">
              {topThree.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 rounded-lg bg-card border border-border px-3 py-2.5"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      i.severity === "critical"
                        ? "bg-destructive"
                        : i.severity === "warning"
                          ? "bg-warning"
                          : "bg-info",
                    )}
                    aria-hidden
                  />
                  <span className="text-sm flex-1 min-w-0 truncate">{i.title}</span>
                  <span className="text-xs text-muted-foreground tabular shrink-0">
                    {i.pagesAffected} pages
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href={`/projects/${id}/ai`}>
                  Open AI insights
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/projects/${id}/issues`}>See all issues</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
