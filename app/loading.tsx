/**
 * Streaming skeleton for the dashboard root. Next.js renders this
 * instantly on first navigation while the server resolves the actual
 * page, which gives mobile users a fast paint even on cold caches.
 *
 * The skeleton mirrors the real layout's *shape* — engines rail,
 * portfolio health card with a circle on the left and trend rectangle
 * on the right, essentials grid, then a list — so the layout doesn't
 * jump when the real content swaps in. We deliberately avoid the
 * `<AppShell>` wrapper here: the shell is already cached in the
 * client bundle from any prior navigation, and re-rendering it would
 * just add hydration noise during the swap.
 */
export default function Loading() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-10 lg:py-14">
        {/* Engines rail */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="h-3 w-20 rounded bg-muted/60" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-24 rounded-full bg-card/60 ring-1 ring-border"
            />
          ))}
        </div>

        {/* Portfolio Health card */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-3 w-32 rounded bg-muted/60" />
          <div className="flex gap-2">
            <div className="h-8 w-32 rounded-md bg-card/60" />
            <div className="h-8 w-28 rounded-md bg-primary/40" />
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-border">
              {/* Circular health gauge placeholder. Sized to match
                  HealthScore (~120px) so the layout doesn't shift when
                  the real component takes over. */}
              <div className="size-[120px] rounded-full border-[10px] border-muted/40" />
              <div className="flex-1 space-y-3">
                <div className="h-12 w-24 rounded bg-muted/40" />
                <div className="h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-4/5 rounded bg-muted/30" />
              </div>
            </div>
            <div className="p-6 lg:p-8 space-y-3">
              <div className="h-3 w-20 rounded bg-muted/60" />
              {/* Trend chart shimmer — same height as the lazy chart's
                  skeleton (160px) so the swap is visually quiet. */}
              <div className="h-[160px] rounded-md bg-muted/20" />
            </div>
          </div>
        </section>

        {/* Essentials grid skeleton */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-border bg-card/60"
            />
          ))}
        </div>

        {/* Sites list skeleton */}
        <div className="mt-10 rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="size-9 rounded-md bg-muted/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 rounded bg-muted/40" />
                <div className="h-2.5 w-1/3 rounded bg-muted/30" />
              </div>
              <div className="hidden sm:block h-2 w-48 rounded-full bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
