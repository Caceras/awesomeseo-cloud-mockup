import Link from "next/link"
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react"
import { aiEngineStats } from "@/lib/mock-data"
import { engineMeta } from "@/lib/engine-meta"
import { EngineLogo } from "@/components/engine-logos"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * The signed-points pill used by the engine cards and by other surfaces
 * that report a delta in citation-rate points. Exported so the AI
 * Visibility hero (overall cross-engine delta) can keep using the same
 * pill without duplicating styling logic.
 */
export function DeltaPill({ value }: { value: number }) {
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

/**
 * Five-engine "Drill into an engine" grid. Sorted by citation rate so
 * the strongest engine reads first. Used at the top of:
 *   - the project dashboard (`/projects/[id]`)
 *   - the AI Visibility page (`/projects/[id]/ai-visibility`)
 *
 * The grid is wide-first: `lg:grid-cols-5` from 1024px up so all five
 * brands sit on a single row, falling back to 2-up on tablet and 1-up
 * on phone. Cards minimum width is comfortable at the 5-up breakpoint
 * because we widen the surrounding page to `max-w-7xl`.
 */
export function EngineBreakdownGrid({
  projectId,
  variant = "default",
}: {
  projectId: string
  /**
   * `compact` shrinks the section padding for the project-dashboard
   * placement where it sits stacked above the existing hero. `default`
   * keeps the airy layout used on the AI Visibility page itself.
   */
  variant?: "default" | "compact"
}) {
  const sortedEngines = [...aiEngineStats].sort(
    (a, b) => b.citationRate - a.citationRate,
  )

  return (
    <section
      className={cn("space-y-4", variant === "compact" && "space-y-3")}
      aria-label="AI engine breakdown"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">Drill into an engine</h2>
          <p className="text-xs text-muted-foreground text-pretty">
            Each engine has different ranking signals. Open a card to see
            what to do for that one specifically.
          </p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          Sorted by citation rate
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sortedEngines.map((s) => {
          const meta = engineMeta[s.engine]
          return (
            <Link
              key={s.engine}
              href={`/projects/${projectId}/ai-visibility/${s.engine}`}
              className="group relative block focus:outline-none"
            >
              <Card className="relative h-full overflow-hidden p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-ring">
                {/* Brand glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: meta.glow }}
                />
                <div className="relative">
                  {/* Big logo + delta */}
                  <div className="flex items-start justify-between gap-2">
                    <EngineLogo
                      engine={s.engine}
                      size={56}
                      className="rounded-xl shadow-lg shadow-black/30"
                    />
                    <DeltaPill value={s.delta} />
                  </div>

                  {/* Name + parent */}
                  <div className="mt-4">
                    <div className="text-base font-semibold leading-none">
                      {meta.name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      by {meta.parent}
                    </div>
                  </div>

                  {/* Citation rate */}
                  <div className="mt-5">
                    <div className="font-mono text-4xl font-semibold tabular-nums leading-none">
                      {(s.citationRate * 100).toFixed(0)}%
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      citation rate
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${s.citationRate * 100}%`,
                          background: meta.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground">Share of voice</dt>
                      <dd className="mt-0.5 font-mono font-medium tabular-nums">
                        {(s.shareOfVoice * 100).toFixed(0)}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Citations / wk</dt>
                      <dd className="mt-0.5 font-mono font-medium tabular-nums">
                        {s.citationsThisWeek}
                      </dd>
                    </div>
                  </dl>

                  {/* Open link */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="text-muted-foreground line-clamp-1">
                      {meta.audience}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      Open
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
