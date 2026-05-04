import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"
import {
  aiCompetitors,
  aiEngineStats,
  aiPrompts,
  projectById,
  type AiEngineKey,
} from "@/lib/mock-data"
import { EngineLogo } from "@/components/engine-logos"
import {
  DeltaPill,
  EngineBreakdownGrid,
} from "@/components/engine-breakdown-grid"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const engineOrder: AiEngineKey[] = [
  "chatgpt",
  "claude",
  "perplexity",
  "gemini",
  "copilot",
]

function intentBadge(
  intent: "comparison" | "how-to" | "definition" | "recommendation",
) {
  const map = {
    comparison: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    "how-to": "bg-sky-500/10 text-sky-300 border-sky-500/30",
    definition: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    recommendation: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  } as const
  return (
    <Badge
      variant="outline"
      className={cn("border text-[10px] font-medium capitalize", map[intent])}
    >
      {intent.replace("-", " ")}
    </Badge>
  )
}

export default async function AiVisibilityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projectById(id)
  if (!project) notFound()

  const overall =
    aiEngineStats.reduce((sum, s) => sum + s.citationRate, 0) /
    aiEngineStats.length
  const overallDelta =
    aiEngineStats.reduce((sum, s) => sum + s.delta, 0) / aiEngineStats.length
  const totalCitations = aiEngineStats.reduce(
    (sum, s) => sum + s.citationsThisWeek,
    0,
  )

  const sortedCompetitors = [...aiCompetitors].sort((a, b) => b.share - a.share)
  const yourShare = sortedCompetitors.find((c) => c.domain === "awesomeseo.app")?.share ?? 0

  return (
    // Widened to max-w-7xl so the five engine cards have proper
    // breathing room when laid out 5-up at the top of the page.
    <div className="mx-auto max-w-7xl py-10 space-y-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between max-w-4xl">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            AI Visibility · GEO
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
            How often do AI engines cite you?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed text-pretty">
            We replay {aiPrompts.length * engineOrder.length}+ prompts a week
            against the five engines that matter, then track whether your
            domain is cited and at what rank.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Add prompt
        </Button>
      </header>

      {/* Lifted to the top so the per-engine breakdown is the first
          thing the user sees on this page — answers "where am I weakest
          right now?" before the cross-engine summary frames it. */}
      <EngineBreakdownGrid projectId={project.id} />

      {/* Hero — cross-engine + share of voice */}
      <section
        aria-label="Overall AI citation rate"
        className="relative overflow-hidden rounded-2xl border border-primary/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/15 to-transparent" />
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative grid gap-6 p-6 lg:grid-cols-3 lg:p-8">
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-wider text-foreground/70">
              Cross-engine citation rate
            </div>
            <div className="mt-3 flex items-end gap-4">
              <div className="font-mono text-6xl font-semibold leading-none tabular-nums">
                {(overall * 100).toFixed(0)}%
              </div>
              <DeltaPill value={overallDelta} />
            </div>
            <p className="mt-3 max-w-md text-sm text-foreground/80 leading-relaxed">
              Of every prompt we tested across all five engines, your domain
              was cited in roughly {(overall * 100).toFixed(0)}% of answers —{" "}
              <span className="font-medium">
                {totalCitations.toLocaleString()} citations
              </span>{" "}
              this week.
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/60 p-4 backdrop-blur">
            <div className="text-xs text-muted-foreground">
              Share of voice (vs competitors)
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold tabular-nums">
              {(yourShare * 100).toFixed(0)}%
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
              {sortedCompetitors.map((c) => (
                <div
                  key={c.domain}
                  className={cn(
                    c.domain === "awesomeseo.app"
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                  style={{ width: `${c.share * 100}%` }}
                  title={`${c.domain} ${(c.share * 100).toFixed(0)}%`}
                />
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs">
              {sortedCompetitors.slice(0, 4).map((c) => (
                <div key={c.domain} className="flex justify-between gap-2">
                  <span
                    className={cn(
                      "truncate",
                      c.domain === "awesomeseo.app"
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {c.domain === "awesomeseo.app" ? "You" : c.domain}
                  </span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {(c.share * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prompt × Engine matrix */}
      <section>
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-medium">Monitored prompts</h2>
            <p className="text-xs text-muted-foreground">
              Each cell shows whether you were cited and at what rank.
            </p>
          </div>
          <Button variant="ghost" size="sm">
            See all {aiPrompts.length} prompts
          </Button>
        </div>

        <Card className="mt-3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="sticky left-0 z-10 w-[44%] bg-muted/40 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Prompt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Intent
                  </th>
                  {engineOrder.map((e) => (
                    <th
                      key={e}
                      className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      <Link
                        href={`/projects/${project.id}/ai-visibility/${e}`}
                        className="inline-flex items-center justify-center gap-1.5 hover:text-foreground"
                      >
                        <EngineLogo engine={e} size={16} />
                        <span className="capitalize">{e}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {aiPrompts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="sticky left-0 z-10 bg-card px-4 py-3 align-top">
                      <div className="font-medium">{p.prompt}</div>
                      {p.topCompetitor ? (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Top competitor:{" "}
                          <span className="text-foreground/80">
                            {p.topCompetitor}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {intentBadge(p.intent)}
                    </td>
                    {engineOrder.map((e) => {
                      const cell = p.engines[e]
                      const cited = cell?.cited ?? false
                      return (
                        <td
                          key={e}
                          className="px-3 py-3 text-center align-top"
                        >
                          {cited ? (
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                                <Check className="size-4" />
                              </span>
                              {cell?.rank ? (
                                <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                                  #{cell.rank}
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <X className="size-4" />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  )
}
