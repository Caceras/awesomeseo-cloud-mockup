import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Lightbulb,
  Minus,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react"
import {
  aiCompetitors,
  aiEngineStats,
  aiPrompts,
  projectById,
  type AiEngineKey,
} from "@/lib/mock-data"
import { allEngineKeys, engineMeta } from "@/lib/engine-meta"
import { EngineLogo } from "@/components/engine-logos"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const validEngines: AiEngineKey[] = allEngineKeys

function DeltaPill({ value }: { value: number }) {
  const neutral = value === 0
  const good = value > 0
  const Icon = neutral ? Minus : good ? ArrowUpRight : ArrowDownRight
  const label = `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)} pts`
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
        neutral
          ? "bg-muted text-muted-foreground"
          : good
            ? "bg-emerald-500/10 text-emerald-300"
            : "bg-rose-500/10 text-rose-300",
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function WeightPill({ weight }: { weight: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    low: "bg-muted text-muted-foreground border-border",
  } as const
  return (
    <Badge
      variant="outline"
      className={cn(
        "border text-[10px] font-medium uppercase tracking-wider",
        map[weight],
      )}
    >
      {weight}
    </Badge>
  )
}

export default async function EnginePage({
  params,
}: {
  params: Promise<{ id: string; engine: string }>
}) {
  const { id, engine } = await params

  if (!validEngines.includes(engine as AiEngineKey)) notFound()
  const engineKey = engine as AiEngineKey

  const project = projectById(id)
  if (!project) notFound()

  const meta = engineMeta[engineKey]
  const stat = aiEngineStats.find((s) => s.engine === engineKey)
  if (!stat) notFound()

  // Filter prompts for this engine
  const cited = aiPrompts.filter((p) => p.engines[engineKey]?.cited)
  const missing = aiPrompts.filter((p) => p.engines[engineKey]?.cited === false)
  const allRanks = cited
    .map((p) => p.engines[engineKey]?.rank)
    .filter((r): r is number => typeof r === "number")
  const avgRank =
    allRanks.length > 0
      ? allRanks.reduce((sum, r) => sum + r, 0) / allRanks.length
      : null

  // This engine's leaderboard (use shared share-of-voice as a proxy and shuffle)
  const leaderboard = [...aiCompetitors]
    .map((c) => ({
      ...c,
      // Adjust each competitor's slice slightly so engines feel different.
      share: Math.max(
        0,
        c.share +
          (engineKey.charCodeAt(0) % 7) * 0.005 *
            (c.domain === "awesomeseo.app" ? 1 : -0.5),
      ),
    }))
    .sort((a, b) => b.share - a.share)

  return (
    <div className="mx-auto max-w-6xl py-10 space-y-12">
      {/* Breadcrumb + inline engine switcher.
          Splits the row into [breadcrumb · left] [all-engines · right] so
          users can jump between the five engines without leaving the
          page. Current engine is highlighted with the engine's accent
          and rendered as a non-link, the other four are interactive. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link
            href={`/projects/${project.id}/ai-visibility`}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            AI Visibility
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{meta.name}</span>
        </nav>

        <ul
          aria-label="Switch AI engine"
          className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur"
        >
          {validEngines.map((e) => {
            const m = engineMeta[e]
            const isCurrent = e === engineKey
            const content = (
              <>
                <EngineLogo engine={e} size={16} className="rounded-[5px]" />
                <span className="hidden sm:inline">{m.name}</span>
              </>
            )
            return (
              <li key={e}>
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    style={{
                      // Subtle engine-tinted highlight using the same
                      // accent the hero uses, kept low-opacity so it
                      // reads as "selected" not "alert".
                      background: m.glow,
                      color: m.accent,
                      boxShadow: `inset 0 0 0 1px ${m.accent}33`,
                    }}
                  >
                    {content}
                  </span>
                ) : (
                  <Link
                    href={`/projects/${project.id}/ai-visibility/${e}`}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Switch to ${m.name}`}
                  >
                    {content}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Hero — engine-branded */}
      <section
        aria-label={`${meta.name} overview`}
        className="relative overflow-hidden rounded-2xl border border-border"
      >
        {/* Engine-color glows */}
        <div
          aria-hidden
          className="absolute -right-32 -top-32 size-[28rem] rounded-full blur-3xl"
          style={{ background: meta.glow }}
        />
        <div
          aria-hidden
          className="absolute -left-20 bottom-0 size-72 rounded-full blur-3xl opacity-50"
          style={{ background: meta.glow }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: meta.accent }}
        />

        <div className="relative grid gap-8 p-6 lg:grid-cols-12 lg:p-10">
          {/* Logo + identity */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <EngineLogo
                engine={engineKey}
                size={88}
                className="rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/5"
              />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  AI engine · by {meta.parent}
                </div>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight">
                  {meta.name}
                </h1>
              </div>
            </div>
            <p className="text-base leading-relaxed text-pretty text-foreground/85">
              {meta.tagline}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge
                variant="outline"
                className="border-border bg-background/50"
              >
                Audience · {meta.audience}
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-background/50"
              >
                Source · {meta.dataSource}
              </Badge>
            </div>
          </div>

          {/* Stat block */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 rounded-xl border border-border bg-background/40 p-5 backdrop-blur sm:col-span-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Citation rate
              </div>
              <div className="mt-3 flex items-end gap-3">
                <div
                  className="font-mono text-6xl font-semibold leading-none tabular-nums"
                  style={{ color: meta.accent }}
                >
                  {(stat.citationRate * 100).toFixed(0)}%
                </div>
                <DeltaPill value={stat.delta} />
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${stat.citationRate * 100}%`,
                    background: meta.accent,
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                You appear in {Math.round(stat.citationRate * stat.monitoredPrompts)} of {stat.monitoredPrompts} monitored prompts.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-4 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Target className="size-3.5" />
                Avg rank
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                {avgRank ? `#${avgRank.toFixed(1)}` : "—"}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                When cited
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background/40 p-4 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="size-3.5" />
                Citations / wk
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                {stat.citationsThisWeek}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Last 7 days
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-border bg-background/40 p-4 backdrop-blur sm:col-span-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="size-3.5" />
                Share of voice on {meta.name}
              </div>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div className="font-mono text-3xl font-semibold tabular-nums">
                  {(stat.shareOfVoice * 100).toFixed(0)}%
                </div>
                <div className="flex-1">
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    {leaderboard.map((c) => (
                      <div
                        key={c.domain}
                        title={`${c.domain} ${(c.share * 100).toFixed(0)}%`}
                        style={{
                          width: `${c.share * 100}%`,
                          background:
                            c.domain === "awesomeseo.app"
                              ? meta.accent
                              : "hsl(var(--muted-foreground) / 0.3)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>Your slice vs. {leaderboard.length - 1} competitors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it differs */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              How {meta.name} differs
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85 text-pretty">
            {meta.positioning}
          </p>
          <ul className="mt-5 space-y-3">
            {meta.differentiators.map((d, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full"
                  style={{ background: meta.accent }}
                />
                <span className="text-sm leading-relaxed text-foreground/90">
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Ranking signals
            </h2>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            What this specific engine rewards, ranked by impact.
          </p>
          <ul className="mt-5 space-y-3">
            {meta.rankingSignals.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm leading-snug text-foreground/90">
                  {s.label}
                </span>
                <WeightPill weight={s.weight} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* What you can do */}
      <section>
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-medium">
              What you can do for {meta.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Three plays specific to this engine. Open one to generate an AI brief.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {meta.actions.map((a, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden p-5 transition-colors hover:border-primary/40"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] opacity-50 transition-opacity group-hover:opacity-100"
                style={{ background: meta.accent }}
              />
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  PLAY {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="inline-flex size-6 items-center justify-center rounded-full text-xs font-medium"
                  style={{
                    background: meta.glow,
                    color: meta.accent,
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-3 text-base font-medium leading-tight text-balance">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {a.body}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-4 -ml-2 text-xs"
              >
                Generate brief
                <ArrowUpRight className="size-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Prompt performance */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Prompts where you&apos;re cited
            </h2>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            >
              {cited.length}
            </Badge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {cited.map((p) => {
              const cell = p.engines[engineKey]
              return (
                <li key={p.id} className="flex gap-3 py-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Check className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-snug">
                      {p.prompt}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono tabular-nums">
                        Rank #{cell?.rank ?? "—"}
                      </span>
                      {cell?.citedUrl ? (
                        <span className="truncate">via {cell.citedUrl}</span>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
            {cited.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No prompts cited yet.
              </li>
            ) : null}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Prompts where you&apos;re missing
            </h2>
            <Badge
              variant="outline"
              className="border-rose-500/30 bg-rose-500/10 text-rose-300"
            >
              {missing.length}
            </Badge>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {missing.map((p) => (
              <li key={p.id} className="flex gap-3 py-3">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
                  <X className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-snug">
                    {p.prompt}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {p.topCompetitor ? (
                      <span>Cited instead: {p.topCompetitor}</span>
                    ) : null}
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs">
                  Brief
                </Button>
              </li>
            ))}
            {missing.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                You appear in every monitored prompt.
              </li>
            ) : null}
          </ul>
        </Card>
      </section>

    </div>
  )
}
