/**
 * Streaming skeleton for /projects/[id]. The project workspace is one
 * of the heaviest routes (recharts trend, EngineRow, full project tabs,
 * deep mock-data lookups) so a paint-while-server-resolves skeleton
 * meaningfully improves the perceived speed on first visit, especially
 * on mobile where the JS payload takes longer to parse.
 *
 * Mirrors the real project page's vertical rhythm: header, KPI strip,
 * trend chart band, and a tab-bar placeholder. We keep heights close
 * to the real components so swapping in the page doesn't visibly shift
 * anything.
 */
export default function Loading() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8 lg:py-10">
        {/* Project header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="size-14 rounded-xl bg-muted/40" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 rounded bg-muted/40" />
            <div className="h-3 w-32 rounded bg-muted/30" />
          </div>
          <div className="h-9 w-32 rounded-md bg-card/60" />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-border bg-card/60"
            />
          ))}
        </div>

        {/* Trend band */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="h-3 w-24 rounded bg-muted/60 mb-3" />
          <div className="h-[180px] rounded-md bg-muted/20" />
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-md bg-card/60 border border-border"
            />
          ))}
        </div>

        {/* Body */}
        <div className="rounded-2xl border border-border bg-card h-[420px]" />
      </div>
    </div>
  )
}
