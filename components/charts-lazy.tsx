"use client"

import dynamic from "next/dynamic"

/**
 * Lazy wrappers around the recharts-based charts.
 *
 * Recharts is ~80KB gzipped and pulls in d3 sub-packages. The dashboard
 * and project pages embed these charts above the fold, but they don't
 * need to *block* the first paint — we render a CSS-only skeleton at
 * the chart's exact final height so there's no layout shift, then swap
 * in the real chart on the next tick.
 *
 * `ssr: false` is intentional: ResponsiveContainer needs a measured
 * client size to render correctly anyway, and skipping SSR gets the
 * recharts vendor chunk out of the server payload.
 */

function ChartSkeleton() {
  return (
    <div
      className="h-56 w-full animate-pulse rounded-md bg-muted/40"
      role="status"
      aria-label="Loading chart"
    />
  )
}

export const HealthTrendChartLazy = dynamic(
  () =>
    import("./health-trend-chart").then((m) => ({
      default: m.HealthTrendChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> },
)

export const IssueMixChartLazy = dynamic(
  () =>
    import("./issue-mix-chart").then((m) => ({ default: m.IssueMixChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
)

/**
 * Compact horizontal bar chart used inside the AI chat bar's flourishes.
 * Sized for a chat bubble (≈140px tall) so it gets its own slim skeleton
 * instead of the dashboard-sized one — preserves the visual rhythm of
 * the surrounding rail while the recharts chunk streams in.
 */
function ChatChartSkeleton() {
  return (
    <div
      className="h-[180px] w-full animate-pulse rounded-xl bg-muted/30"
      role="status"
      aria-label="Loading chart"
    />
  )
}

export const CitationShareChartLazy = dynamic(
  () =>
    import("./chat-citation-share-chart").then((m) => ({
      default: m.CitationShareChart,
    })),
  { ssr: false, loading: () => <ChatChartSkeleton /> },
)
