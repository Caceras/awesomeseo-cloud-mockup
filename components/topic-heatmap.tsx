"use client"

import { useMemo, useState } from "react"
import { ExternalLink, Info, X, Globe, Building2 } from "lucide-react"
import { topicHeatmap, type HeatmapStatus } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/* ─────────────────────────── Status palette ───────────────────────────
 * Mapped 1:1 to the legend in the original Marketcore screenshots, but
 * re-themed for our dark UI. Solid Tailwind tokens (no arbitrary hex)
 * keep the heatmap on-brand if the user re-themes the workspace.
 *
 * - covered        → success (green)   — we already cover this topic well
 * - gap            → destructive (red) — we / the SERP miss it entirely
 * - high-priority  → warning (yellow)  — covered but contested, fix first
 * - quick-win      → primary (teal)    — easy to pick up, low competition
 */
const STATUS_STYLE: Record<
  HeatmapStatus,
  { bg: string; ring: string; label: string; dot: string }
> = {
  covered: {
    bg: "bg-success/65 hover:bg-success/85",
    ring: "ring-success/40",
    label: "Covered",
    dot: "bg-success",
  },
  gap: {
    bg: "bg-destructive/45 hover:bg-destructive/65",
    ring: "ring-destructive/30",
    label: "Content gap",
    dot: "bg-destructive",
  },
  "high-priority": {
    bg: "bg-warning/70 hover:bg-warning/90",
    ring: "ring-warning/40",
    label: "High priority",
    dot: "bg-warning",
  },
  "quick-win": {
    bg: "bg-primary/70 hover:bg-primary/90",
    ring: "ring-primary/40",
    label: "Quick win",
    dot: "bg-primary",
  },
}

/** Rank → dot color. Mirrors the green-to-red ladder in the original
 *  screenshot (1–4 great, 5–9 good, 10–14 ok, 15–20 poor, NR worst). */
function rankColor(rank: number | null): string {
  if (rank === null) return "bg-muted text-muted-foreground"
  if (rank <= 4) return "bg-success text-success-foreground"
  if (rank <= 9) return "bg-success/70 text-success-foreground"
  if (rank <= 14) return "bg-warning text-warning-foreground"
  return "bg-destructive/80 text-destructive-foreground"
}

/** Content score → text tint. */
function scoreColor(score: number): string {
  if (score >= 45) return "text-success"
  if (score >= 30) return "text-warning"
  return "text-destructive"
}

type SortMode = "relevance" | "gaps" | "must-haves"
type Scope = "serp" | "site"

export function TopicHeatmap() {
  const { niche, competitors, topics } = topicHeatmap

  const [sort, setSort] = useState<SortMode>("relevance")
  const [scope, setScope] = useState<Scope>("serp")
  // [rowIdx, colIdx] of the cell currently under the cursor — drives the
  // row/column spotlight and tooltip.
  const [hover, setHover] = useState<[number, number] | null>(null)
  // Latched on click. Survives mouse-leave so users can read the panel
  // without keeping their pointer steady on a 14×12px square.
  const [selected, setSelected] = useState<[number, number] | null>(null)

  // Pre-compute gap counts per topic — used for both the Gaps sort and the
  // status legend totals shown above the legend.
  const gapsPerTopic = useMemo(
    () => topics.map((t) => t.cells.filter((c) => c === "gap").length),
    [topics],
  )

  // Sorted row indices. We sort *indices* rather than the rows themselves
  // so the cell coords stored in `hover`/`selected` keep referring to a
  // stable underlying data row, not a moving target.
  const orderedRows = useMemo(() => {
    const idx = topics.map((_, i) => i)
    switch (sort) {
      case "gaps":
        return idx.sort((a, b) => gapsPerTopic[b] - gapsPerTopic[a])
      case "must-haves":
        return idx.sort((a, b) => {
          const m = Number(topics[b].mustHave) - Number(topics[a].mustHave)
          return m !== 0 ? m : topics[b].relevance - topics[a].relevance
        })
      case "relevance":
      default:
        return idx.sort((a, b) => topics[b].relevance - topics[a].relevance)
    }
  }, [sort, topics, gapsPerTopic])

  const totals = useMemo(() => {
    const out: Record<HeatmapStatus, number> = {
      covered: 0, gap: 0, "high-priority": 0, "quick-win": 0,
    }
    for (const t of topics) for (const c of t.cells) out[c] += 1
    return out
  }, [topics])

  // Unified hover/selection coords for spotlight logic. Hover wins while
  // active; selection persists otherwise.
  const focus = hover ?? selected
  const focusRow = focus?.[0] ?? null
  const focusCol = focus?.[1] ?? null

  const selectedTopic = selected ? topics[selected[0]] : null
  const selectedComp = selected ? competitors[selected[1]] : null
  const selectedStatus =
    selected ? topics[selected[0]].cells[selected[1]] : null

  return (
    <section
      aria-labelledby="heatmap-title"
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Competitor heatmap
          </div>
          <h2
            id="heatmap-title"
            className="mt-1 text-lg font-semibold tracking-tight text-balance"
          >
            Topics covered &amp; missed across the top 20 SERP results
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Niche:{" "}
            <span className="font-mono text-foreground">{niche}</span> ·{" "}
            <span className="tabular">{topics.length}</span> sub-topics ·{" "}
            <span className="tabular">{competitors.length}</span> competitors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scope toggle — SERP-wide vs. just our site */}
          <div
            role="tablist"
            aria-label="Heatmap scope"
            className="flex rounded-full border border-border bg-muted/40 p-0.5 text-xs"
          >
            {(
              [
                { id: "serp" as const, label: "The SERP", Icon: Globe },
                { id: "site" as const, label: "A website", Icon: Building2 },
              ]
            ).map(({ id, label, Icon }) => {
              const active = scope === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setScope(id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors",
                    active
                      ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/30"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Sort by — drives row order */}
          <div
            role="radiogroup"
            aria-label="Order topics by"
            className="flex rounded-full border border-border bg-muted/40 p-0.5 text-xs"
          >
            {(
              [
                { id: "relevance" as const, label: "Relevance" },
                { id: "gaps" as const, label: "Gaps" },
                { id: "must-haves" as const, label: "Must haves" },
              ]
            ).map(({ id, label }) => {
              const active = sort === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSort(id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 transition-colors",
                    active
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── Grid scroll container ──────────────────────────────────── */}
      {/*
        Horizontal scroll on narrow viewports; the topic-keyword column is
        position:sticky so it stays anchored while the user pans the
        grid. `overscroll-x-contain` stops mobile Safari from rubber-banding
        the parent page when you reach the grid edge.
      */}
      <div
        className="relative overflow-x-auto overscroll-x-contain"
        // Reset hover state when the cursor leaves the entire grid so the
        // spotlight doesn't get stuck on the last cell.
        onMouseLeave={() => setHover(null)}
      >
        <div
          className="min-w-max p-4 sm:p-5"
          // Stash widths in CSS vars so the rotated header column can stay
          // pixel-perfect aligned with the cells below it.
          style={{
            // @ts-expect-error - CSS custom property
            "--cell-w": "44px",
            "--cell-h": "32px",
            "--label-w": "210px",
            "--rot-h": "150px",
          }}
        >
          {/* ── Rotated competitor URL header ───────────────────── */}
          <div className="flex" style={{ height: "var(--rot-h)" }}>
            <div style={{ width: "var(--label-w)" }} aria-hidden />
            <div className="flex">
              {competitors.map((c, ci) => {
                const lit = focusCol === ci
                return (
                  <div
                    key={c.url}
                    style={{ width: "var(--cell-w)" }}
                    className="relative"
                  >
                    <div
                      className={cn(
                        "absolute bottom-1 left-1/2 origin-bottom-left -translate-x-1 -rotate-[55deg] whitespace-nowrap font-mono text-[10px] leading-none transition-colors",
                        lit
                          ? "text-foreground"
                          : "text-muted-foreground/80",
                      )}
                      title={c.url}
                    >
                      {/* Truncate long competitor URLs at 28 chars so the
                          rotated column stays a predictable width. */}
                      {c.url.length > 28 ? c.url.slice(0, 28) + "…" : c.url}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Rank row ────────────────────────────────────────── */}
          <RankRow
            competitors={competitors}
            focusCol={focusCol}
            scope={scope}
          />

          {/* ── Content score row ───────────────────────────────── */}
          <ScoreRow competitors={competitors} focusCol={focusCol} />

          {/* ── Topic rows ──────────────────────────────────────── */}
          <ul className="mt-1.5">
            {orderedRows.map((rowIdx) => {
              const t = topics[rowIdx]
              const lit = focusRow === rowIdx
              return (
                <li key={t.keyword} className="flex">
                  {/* Sticky topic label cell */}
                  <div
                    style={{ width: "var(--label-w)", height: "var(--cell-h)" }}
                    className={cn(
                      "sticky left-0 z-10 -mx-4 sm:-mx-5 pr-3 pl-4 sm:pl-5 flex items-center justify-end gap-2 bg-card text-xs transition-colors",
                      lit ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {t.mustHave && (
                      <span
                        className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-warning ring-1 ring-inset ring-warning/30"
                        title="Every top-10 competitor covers this topic"
                      >
                        Must
                      </span>
                    )}
                    <span className="truncate">{t.keyword}</span>
                  </div>

                  {/* Cells */}
                  <div className="flex">
                    {t.cells.map((status, colIdx) => {
                      const dim =
                        focus !== null &&
                        focusRow !== rowIdx &&
                        focusCol !== colIdx
                      const isHover = hover?.[0] === rowIdx && hover?.[1] === colIdx
                      const isSelected =
                        selected?.[0] === rowIdx && selected?.[1] === colIdx
                      return (
                        <button
                          key={colIdx}
                          type="button"
                          aria-label={`${t.keyword} on ${competitors[colIdx].url}: ${STATUS_STYLE[status].label}`}
                          onMouseEnter={() => setHover([rowIdx, colIdx])}
                          onFocus={() => setHover([rowIdx, colIdx])}
                          onClick={() =>
                            setSelected((prev) =>
                              prev?.[0] === rowIdx && prev?.[1] === colIdx
                                ? null
                                : [rowIdx, colIdx],
                            )
                          }
                          style={{ width: "var(--cell-w)", height: "var(--cell-h)" }}
                          className={cn(
                            "relative p-0.5 transition-opacity duration-150 focus:outline-none",
                            dim ? "opacity-35" : "opacity-100",
                          )}
                        >
                          <span
                            className={cn(
                              "block size-full rounded-[5px] ring-1 ring-inset transition-transform",
                              STATUS_STYLE[status].bg,
                              STATUS_STYLE[status].ring,
                              isHover && "scale-110 z-10",
                              isSelected &&
                                "ring-2 ring-foreground/80 scale-110 z-10",
                            )}
                          />
                          {/* Floating tooltip on hover. Positioned above
                              by default, flips below for the top row so
                              it's never clipped by the rotated header. */}
                          {isHover && (
                            <div
                              role="tooltip"
                              className={cn(
                                "pointer-events-none absolute left-1/2 z-30 w-[230px] -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-left text-[11px] shadow-2xl",
                                rowIdx <= 1 ? "top-full mt-2" : "bottom-full mb-2",
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "size-2 rounded-full",
                                    STATUS_STYLE[status].dot,
                                  )}
                                />
                                <span className="font-medium text-foreground">
                                  {STATUS_STYLE[status].label}
                                </span>
                                <span className="text-muted-foreground">
                                  · Rank{" "}
                                  {competitors[colIdx].rank
                                    ? `#${competitors[colIdx].rank}`
                                    : "NR"}
                                </span>
                              </div>
                              <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                                {competitors[colIdx].url}
                              </div>
                              <div className="mt-1 text-muted-foreground">
                                Topic:{" "}
                                <span className="text-foreground">{t.keyword}</span>
                              </div>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* ── Detail panel (only when a cell is latched) ──────────── */}
      {selected && selectedTopic && selectedComp && selectedStatus && (
        <div className="border-t border-border bg-muted/20 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ring-1 ring-inset",
                    STATUS_STYLE[selectedStatus].ring,
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      STATUS_STYLE[selectedStatus].dot,
                    )}
                  />
                  <span className="font-medium text-foreground">
                    {STATUS_STYLE[selectedStatus].label}
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-semibold tabular",
                    rankColor(selectedComp.rank),
                  )}
                >
                  {selectedComp.rank ?? "NR"}
                </span>
                <span className="text-muted-foreground">Content score</span>
                <span
                  className={cn("font-mono text-sm tabular", scoreColor(selectedComp.contentScore))}
                >
                  {selectedComp.contentScore}
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold tracking-tight">
                {selectedTopic.keyword}
              </h3>
              <a
                href={`https://${selectedComp.url}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                <span className="truncate">{selectedComp.url}</span>
                <ExternalLink className="size-3 shrink-0" aria-hidden />
              </a>
            </div>
            <button
              type="button"
              aria-label="Close detail"
              onClick={() => setSelected(null)}
              className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Legend + totals ───────────────────────────────────── */}
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border bg-muted/20 p-4 sm:p-5 text-xs">
        {(
          [
            ["high-priority", totals["high-priority"]],
            ["covered", totals.covered],
            ["gap", totals.gap],
            ["quick-win", totals["quick-win"]],
          ] as const
        ).map(([status, count]) => (
          <span
            key={status}
            className="inline-flex items-center gap-2 text-muted-foreground"
          >
            <span
              className={cn(
                "inline-block size-3 rounded-[3px] ring-1 ring-inset",
                STATUS_STYLE[status].bg,
                STATUS_STYLE[status].ring,
              )}
            />
            <span className="text-foreground">{STATUS_STYLE[status].label}</span>
            <span className="tabular">{count}</span>
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
          <Info className="size-3" aria-hidden />
          Hover a cell to spotlight · click to open
        </span>
      </footer>
    </section>
  )
}

/* ─────────────────── Sub-rows for the top header ──────────────────── */

function RankRow({
  competitors,
  focusCol,
  scope,
}: {
  competitors: typeof topicHeatmap.competitors
  focusCol: number | null
  scope: Scope
}) {
  return (
    <div className="flex items-center" style={{ height: "28px" }}>
      <div
        style={{ width: "var(--label-w)" }}
        className="pr-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        Rank {scope === "site" ? "(your URLs)" : "on niche"}
      </div>
      {competitors.map((c, ci) => (
        <div
          key={c.url}
          style={{ width: "var(--cell-w)" }}
          className="flex justify-center"
        >
          <span
            className={cn(
              "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-semibold tabular ring-1 ring-inset transition-transform",
              rankColor(c.rank),
              focusCol === ci ? "scale-110 ring-foreground/40" : "ring-transparent",
            )}
          >
            {c.rank ?? "NR"}
          </span>
        </div>
      ))}
    </div>
  )
}

function ScoreRow({
  competitors,
  focusCol,
}: {
  competitors: typeof topicHeatmap.competitors
  focusCol: number | null
}) {
  return (
    <div className="mt-0.5 flex items-center" style={{ height: "22px" }}>
      <div
        style={{ width: "var(--label-w)" }}
        className="pr-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        Content score
      </div>
      {competitors.map((c, ci) => (
        <div
          key={c.url}
          style={{ width: "var(--cell-w)" }}
          className="flex justify-center"
        >
          <span
            className={cn(
              "font-mono text-[11px] tabular transition-colors",
              scoreColor(c.contentScore),
              focusCol === ci ? "font-semibold" : "opacity-70",
            )}
          >
            {c.contentScore}
          </span>
        </div>
      ))}
    </div>
  )
}
