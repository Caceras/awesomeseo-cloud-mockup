import Link from "next/link"
import { ArrowRight, ArrowUpRight, Plus, Chrome } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { HealthScore } from "@/components/health-score"
import { HealthTrendChartLazy as HealthTrendChart } from "@/components/charts-lazy"
import { EngineLogo, EngineRow, projectEngines } from "@/components/engine-logos"
import { engineMeta } from "@/lib/engine-meta"
import type { AiEngineKey } from "@/lib/mock-data"
import { SeoEssentialsGrid } from "@/components/seo-essentials-grid"
import { ProjectAvatar } from "@/components/project-avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { projects } from "@/lib/mock-data"

// One page = one insight: how healthy is the whole portfolio, and what
// changed since last week? Everything else (AI queue, recent crawls,
// usage, schedules) lives on its own dedicated page reachable via the
// sidebar. Resist the urge to add charts here.

export default function DashboardPage() {
  const totalPages = projects.reduce((s, p) => s + p.pages, 0)
  const aggregateHealth = Math.round(
    projects.reduce((s, p) => s + p.health * p.pages, 0) / totalPages,
  )
  const trendPoints = projects.reduce((s, p) => s + p.trend, 0) / projects.length
  const trendLabel =
    trendPoints >= 0 ? `+${trendPoints.toFixed(1)} pts` : `${trendPoints.toFixed(1)} pts`

  // Sort projects by health-need so the user's eye lands on the riskiest first.
  const ranked = [...projects].sort((a, b) => a.health - b.health)

  // Union of every AI engine tracked across the portfolio. We render
  // the rail in `engineMeta` declaration order (ChatGPT → Claude →
  // Perplexity → Gemini → Copilot) which gives us a stable, branded
  // sequence regardless of the per-project hash mix from `projectEngines()`.
  // `EngineLogo` also supports the legacy `google` key, but `engineMeta`
  // is the source of truth for *named* AI engines, so we filter to it.
  const portfolioEngineSet = new Set<string>(
    projects.flatMap((p) => projectEngines(p.id)),
  )
  const portfolioEngines = (Object.keys(engineMeta) as AiEngineKey[]).filter(
    (k) => portfolioEngineSet.has(k),
  )

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-10 lg:py-14">
        {/* Tracked AI engines rail — sits above Portfolio Health to
            anchor the page in its core promise: visibility across these
            specific surfaces. Kept understated (small chips, muted
            border, no heavy fill) so it informs without competing with
            the health gauge below. Each chip deep-links to that engine's
            detail view on the riskiest project so a click lands on
            something actionable. */}
        {portfolioEngines.length > 0 && (
          <section
            aria-label="AI engines tracked across the portfolio"
            className="mb-6"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Tracked across
              </span>
              <ul className="flex flex-wrap items-center gap-1.5">
                {portfolioEngines.map((engine) => {
                  const meta = engineMeta[engine]
                  const targetId = ranked[0]?.id ?? projects[0].id
                  return (
                    <li key={engine}>
                      <Link
                        href={`/projects/${targetId}/ai-visibility/${engine}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <EngineLogo engine={engine} size={14} />
                        <span>{meta.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        )}

        {/* Eyebrow */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Portfolio health
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/onboarding">
                <Chrome className="size-4" />
                Sync extension
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/projects">
                <Plus className="size-4" />
                New crawl
              </Link>
            </Button>
          </div>
        </div>

        {/* The single insight */}
        <section className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center gap-6">
                <HealthScore score={aggregateHealth} />
                <div className="min-w-0">
                  <div className="text-5xl font-semibold tabular leading-none">
                    {aggregateHealth}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-success">
                    <ArrowUpRight className="size-4" />
                    {trendLabel} <span className="text-muted-foreground">vs 14d ago</span>
                  </div>
                </div>
              </div>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                Aggregate SEO health across {projects.length} sites and{" "}
                <span className="text-foreground tabular">
                  {totalPages.toLocaleString()}
                </span>{" "}
                pages. Weighted by page volume so noisy small sites can&apos;t skew the
                number.
              </p>
            </div>
            <div className="p-6 lg:p-8">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Last 14 days
              </div>
              <HealthTrendChart />
            </div>
          </div>
        </section>

        {/* On-page essentials — six fundamentals visualised as feature
            cards. Each one deep-links into the riskiest project's matching
            workspace page so the dashboard stays actionable, not decorative.
            `cv-auto` skips the off-screen layout/paint until the user
            scrolls near; on mobile this is a measurable LCP/INP win. */}
        <div className="cv-auto">
          <SeoEssentialsGrid
            riskiestProjectId={ranked[0]?.id ?? projects[0].id}
          />
        </div>

        {/* Drill-down: one project per row, riskiest first */}
        <section className="mt-10 cv-auto">
          <header className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-base font-medium">Sites that need attention</h2>
              <p className="text-xs text-muted-foreground">
                Sorted by lowest health. Click to open the workspace.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">
                All projects
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </header>

          <ul className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {ranked.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors"
                >
                  <ProjectAvatar project={p} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {p.domain}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground tabular">
                      {p.pages.toLocaleString()} pages ·{" "}
                      <span className="text-destructive">
                        {p.issues.critical} critical
                      </span>{" "}
                      · {p.issues.warning} warnings
                    </div>
                  </div>
                  <EngineRow
                    engines={projectEngines(p.id)}
                    size={14}
                    max={4}
                    ringClassName="ring-card"
                    className="hidden md:block shrink-0"
                    label={`AI engines tracked for ${p.name}`}
                  />
                  <div className="hidden sm:flex items-center gap-3 w-48">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          p.health >= 80
                            ? "bg-success"
                            : p.health >= 60
                              ? "bg-warning"
                              : "bg-destructive",
                        )}
                        style={{ width: `${p.health}%` }}
                      />
                    </div>
                    <div className="text-sm tabular w-8 text-right">{p.health}</div>
                  </div>
                  <ArrowRight
                    className="size-4 text-muted-foreground shrink-0"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  )
}
